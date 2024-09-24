import { Routes, Route, useNavigate } from 'react-router-dom';
import AddItem from './AddItem/addItem';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { deleteItem, getItemData } from '../../../api/expenseItem/item';
import ItemList from './ItemList';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { deleteData } from '../../../api/fixedDaily/fixedDaily';

const Items = () => {
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
      const response = await getItemData(pageNumber); // Pass pageNumber and limit to the API call
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
    navigate("/expense/expense-items");
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
              await deleteData(id); // Call the API to delete the item
              fetchItems(); // Refresh the list
              toast.success('Item deleted successfully!');

            } catch (error) {
              console.log(error)
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
    ? 'Add Expense Item'
    : editItem
      ? 'Edit Expense Item'
      : 'Expense Items';

  const buttonIcon = addItem || editItem ? (
    <FaArrowLeft className="mr-2" />
  ) : (
    <FaPlus className="mr-2" />
  );

  const buttonText = addItem || editItem
    ? 'Back to List'
    : 'Add Expense Item';

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
            <ItemList
              items={items}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem} // Pass delete handler to ItemList
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />} />

          <Route path="add" element={<AddItem onSave={handleBackToList} />} />
          <Route path="edit/:id" element={<AddItem onSave={handleBackToList} isEdit />} />
        </Routes>

      </div>
    </>
  );
};

export default Items;
