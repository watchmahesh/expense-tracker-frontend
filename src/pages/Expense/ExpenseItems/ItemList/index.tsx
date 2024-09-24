import React from 'react';
import { ITEM } from '../../../../types/item/item';
import { FaEdit, FaSearch, FaTrashAlt } from "react-icons/fa";
import DataListLoader from '../../../../components/Loader/DateLoader';
import Pagination from '../../../../components/Pagination/pagination';
interface ItemDataTableProps {
  items: ITEM[];
  onEditItem: (itemId: number) => void;
  loading: boolean;
  onDeleteItem: (itemId: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ItemList: React.FC<ItemDataTableProps> = ({
  items,
  onEditItem,
  loading,
  onDeleteItem,
  currentPage,
  totalPages,
  onPageChange,
}) => {

  return (
    <div className="flex flex-col gap-10">
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex justify-end items-center mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search items..."
              className="px-4 py-2 border rounded-md"
            />
            <button
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <FaSearch className="mr-2" /> Search
            </button>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          {/* {loading ? (
            // <DataListLoader />
          ) : ( */}
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Item Name
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Item Type
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items && items.length > 0 ? (
                  items.map((item, key) => (
                    <tr key={key}>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {item.name}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {item.type}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button className="text-primary"
                            onClick={() => onEditItem(item.id)}
                          >
                            <FaEdit />
                          </button>

                          <button className="text-danger"
                            onClick={() => onDeleteItem(item.id)}
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-5">
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          {/* )} */}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};



export default ItemList;
