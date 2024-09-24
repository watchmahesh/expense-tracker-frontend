import { Routes, Route, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import DailyFixedList from './FixedDaily';
import AddDailyFixed from './AddDailyFixed';
import { deleteItem } from '../../api/expenseItem/item';
import { getFixedDailyData } from '../../api/fixedDaily/fixedDaily';

const FixedDaily = () => {
  const navigate = useNavigate();
  const [addItem, setAddItem] = useState(false);
  const [editItem, setEditItem] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const handleAddTask = () => {
    console.log('Navigating to /add');
    navigate("add");
    setAddItem(true);
    setEditItem(false);
    // Navigate to /expense/expense-items/add
  };

  const fetchItems = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await getFixedDailyData(pageNumber);
      console.log(response)
       // Pass pageNumber and limit to the API call
      setItems(response.data.items);
      setTotalPages(response.data.totalPages)
      setCurrentPage(response.data.pageNumber);

    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(currentPage); // Fetch items when currentPage changes
  }, [currentPage]);;

  const handleBackToList = () => {
    setAddItem(false);
    setEditItem(false);
    fetchItems(); // Fetch items when navigating back to the list
    navigate("/expense/fixed-daily");
  };

  const handleEditItem = (Id: number) => {
    navigate(`edit/${Id}`);
    setAddItem(false);
    setEditItem(true);
  };


  const handleDeleteItem = (id: number) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteItem(id); // Call the API to delete the item
              fetchItems(); // Refresh the list
              toast.success('Item deleted successfully!');

            } catch (error) {
              toast.error('Error deleting item.');

            }
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };


  const handlePageChange = (page: number) => {
    if (page !== currentPage) { // Prevent unnecessary fetches if the page hasn't changed
      setCurrentPage(page);
      fetchItems(page);
    }
  };

  const headerText = addItem
    ? '  Fixed Daily Expense'
    : editItem
      ? 'Edit Daily Expense'
      : ' Fixed Daily Expenses';

  const buttonIcon = addItem || editItem ? (
    <FaArrowLeft className="mr-2" />
  ) : (
    <FaPlus className="mr-2" />
  );

  const buttonText = addItem || editItem
    ? 'Back to List'
    : 'Add '

  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{headerText}</h2>
          <button
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={addItem || editItem ? handleBackToList : handleAddTask}
          >
            {buttonIcon}
            {buttonText}
          </button>
        </div>


        <Routes>
          <Route path="/" element={
            <DailyFixedList
              items={items}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem} // Pass delete handler to ItemList
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />} />

          <Route path="add" element={<AddDailyFixed onSave={handleBackToList} />} />
          <Route path="edit/:id" element={<AddDailyFixed onSave={handleBackToList} isEdit />} />
        </Routes>

      </div>
    </>
  );
};

export default FixedDaily;
