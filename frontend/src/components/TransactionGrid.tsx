import React from 'react';

interface Tag {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface TransactionGridItem {
  id: number;
  description: string;
  amount: number;
  type: string;
  category: Category;
  user_id: number;
  date: string;
  tags: Tag[];
}

const dummyData: TransactionGridItem[] = [
  {
    id: 1,
    description: 'Salary deposit',
    amount: 3500.0,
    type: 'credit',
    category: { id: 1, name: 'Income' },
    user_id: 1,
    date: '2025-01-10',
    tags: [
      { id: 1, name: 'Monthly' },
      { id: 2, name: 'Recurring' },
    ],
  },
  {
    id: 2,
    description: 'Grocery shopping',
    amount: 150.25,
    type: 'debit',
    category: { id: 2, name: 'Food' },
    user_id: 1,
    date: '2025-01-09',
    tags: [{ id: 3, name: 'Essential' }],
  },
  {
    id: 3,
    description: 'Freelance payment',
    amount: 800.0,
    type: 'credit',
    category: { id: 1, name: 'Income' },
    user_id: 1,
    date: '2025-01-08',
    tags: [],
  },
];

const TransactionGrid: React.FC = () => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-8">
      <div className="px-4 py-5 sm:px-6 text-left">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Transaction Grid</h3>
      </div>
      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tags
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dummyData.map((transaction, index) => (
              <tr key={transaction.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium text-gray-900">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  ${transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  {transaction.category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center gap-1 flex-wrap">
                    {transaction.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(TransactionGrid);
