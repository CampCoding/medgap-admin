


import { SortAsc, SortDesc } from 'lucide-react';
import { useState } from 'react';


const Table = ({ columns, dataSource, rowKey, pagination, className = '', ...props }) => {
  const [sortedData, setSortedData] = useState(dataSource);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const handleSort = (field) => {
    let order = 'asc';
    if (sortField === field && sortOrder === 'asc') {
      order = 'desc';
    }
    
    const sorted = [...sortedData].sort((a, b) => {
      if (order === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
    
    setSortedData(sorted);
    setSortField(field);
    setSortOrder(order);
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-left text-sm font-semibold text-[#202938] ${column.sorter ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''}`}
                  onClick={() => column.sorter && handleSort(column.dataIndex)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.title}</span>
                    {column.sorter && (
                      <div className="flex flex-col">
                        <SortAsc className={`w-3 h-3 ${sortField === column.dataIndex && sortOrder === 'asc' ? 'text-[#0F7490]' : 'text-gray-400'}`} />
                        <SortDesc className={`w-3 h-3 -mt-1 ${sortField === column.dataIndex && sortOrder === 'desc' ? 'text-[#0F7490]' : 'text-gray-400'}`} />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedData.map((record, index) => (
              <tr key={record[rowKey] || index} className="hover:bg-gray-50 transition-colors">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-sm text-[#202938]">
                    {column.render ? column.render(record[column.dataIndex], record) : record[column.dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-[#202938]/60">
            Showing {dataSource.length} of {dataSource.length} subjects
          </span>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-[#0F7490] text-white rounded hover:bg-[#0F7490]/90 transition-colors">
              1
            </button>
            <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default Table;