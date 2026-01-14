import { useState, useEffect, useCallback } from 'react';

/**
 * Configuration options for the useDataGrid hook
 */
interface UseDataGridConfig {
  /** API endpoint path to fetch grid data */
  path: string;
  /** Default column to sort by (default: 'date') */
  defaultSortBy?: string;
  /** Default sort order (default: 'desc') */
  defaultSortOrder?: 'asc' | 'desc';
  /** Number of items per page (default: 10) */
  defaultPageSize?: number;
}

/**
 * Return type for the useDataGrid hook
 */
interface UseDataGridResult<T> {
  // Data
  data: T[] | null;
  total: number;
  loading: boolean;
  error: string | null;

  // State
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';

  // Derived
  totalPages: number;
  canGoPrevious: boolean;
  canGoNext: boolean;

  // Methods
  setPage: (page: number) => void;
  setSort: (column: string) => void;
  refresh: () => void;
}

/**
 * Expected API response structure
 */
interface GridApiResponse<T> {
  items: T[];
  total: number;
}

/**
 * useDataGrid - A reusable hook for managing data grid state
 *
 * @description
 * Encapsulates all state and logic for data grids including:
 * - Server-side pagination
 * - Server-side sorting
 * - Loading and error states
 * - Data fetching with automatic refetch on state changes
 *
 * @example
 * // Basic usage
 * const {
 *   data,
 *   loading,
 *   error,
 *   page,
 *   setPage,
 *   setSort
 * } = useDataGrid<Transaction>({
 *   endpoint: '/api/v1/transactions/grid'
 * });
 *
 * @example
 * // With custom defaults
 * const gridState = useDataGrid<Transaction>({
 *   endpoint: '/api/v1/transactions/grid',
 *   defaultSortBy: 'amount',
 *   defaultSortOrder: 'asc',
 *   defaultPageSize: 20
 * });
 *
 * @param config - Configuration object for the hook
 * @returns Object containing grid state, derived values, and methods
 */
function useDataGrid<T>(config: UseDataGridConfig): UseDataGridResult<T> {
  const { path, defaultSortBy = 'date', defaultSortOrder = 'desc', defaultPageSize = 10 } = config;

  // State
  const [data, setData] = useState<T[] | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageState] = useState<number>(1);
  const [pageSize] = useState<number>(defaultPageSize);
  const [sortBy, setSortBy] = useState<string>(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder);

  // For triggering manual refresh
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Derived values
  const totalPages = Math.ceil(total / pageSize);
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  /**
   * Fetches data from the API with current pagination and sorting params
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setData(null);

      const url = `http://localhost:8000/${path}?page=${page}&size=${pageSize}&sort_by=${sortBy}&sort_order=${sortOrder}`;
      const response = await fetch(url, {});

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GridApiResponse<T> = await response.json();
      setData(result.items);
      setTotal(result.total);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      setData(null);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [path, page, pageSize, sortBy, sortOrder]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  /**
   * Sets the current page
   * @param newPage - Page number to navigate to
   */
  const setPage = useCallback((newPage: number) => {
    if (newPage >= 1) {
      setPageState(newPage);
    }
  }, []);

  /**
   * Handles sorting logic
   * - If same column: toggles sort order
   * - If different column: sets new column with desc order
   * - Resets to page 1 on sort change
   *
   * @param column - Column name to sort by
   */
  const setSort = useCallback(
    (column: string) => {
      if (sortBy === column) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(column);
        setSortOrder('desc');
      }
      setPageState(1); // Reset to first page on sort change
    },
    [sortBy]
  );

  /**
   * Forces a data refresh without changing any parameters
   */
  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return {
    // Data
    data,
    total,
    loading,
    error,

    // State
    page,
    pageSize,
    sortBy,
    sortOrder,

    // Derived
    totalPages,
    canGoPrevious,
    canGoNext,

    // Methods
    setPage,
    setSort,
    refresh,
  };
}

export default useDataGrid;
export type { UseDataGridConfig, UseDataGridResult, GridApiResponse };
