import React, { useEffect, useState } from 'react';

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

interface TransactionGridResponse {
  items: TransactionGridItem[];
  total: number;
}

const TransactionGrid: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionGridItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  const totalPages = Math.ceil(total / pageSize);
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handlePreviousPage = () => {
    if (canGoPrevious) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (canGoNext) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(
          `${backendUrl}/api/v1/transactions/grid?page=${page}&size=${pageSize}&sort_by=${sortBy}&sort_order=${sortOrder}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: TransactionGridResponse = await response.json();
        setTransactions(data.items);
        setTotal(data.total);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [sortBy, sortOrder, page, pageSize]);

  if (loading) {
    return <div className="text-gray-700">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <section
      aria-labelledby="transaction-grid-title"
      className="bg-white shadow overflow-hidden sm:rounded-lg mt-8"
    >
      <header className="px-4 py-5 sm:px-6 text-left">
        <h2 id="transaction-grid-title" className="text-lg leading-6 font-medium text-gray-900">
          Transaction Grid
        </h2>
      </header>
      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <button onClick={() => handleSort('date')} className="w-full hover:text-gray-700">
                  Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
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
                <button onClick={() => handleSort('amount')} className="w-full hover:text-gray-700">
                  Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
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
            {transactions.map((transaction, index) => (
              <tr key={transaction.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium text-gray-900">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                  ${transaction.amount}
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
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <footer>
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-white">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total}{' '}
            results
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={!canGoPrevious}
              className={`px-3 py-1.5 text-xs font-medium rounded border ${
                canGoPrevious
                  ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={!canGoNext}
              className={`px-3 py-1.5 text-xs font-medium rounded border ${
                canGoNext
                  ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default React.memo(TransactionGrid);
