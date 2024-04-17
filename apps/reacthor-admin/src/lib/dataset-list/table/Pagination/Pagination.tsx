'use client'

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function Pagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const router = useRouter();
  const params = useSearchParams()
  const pathname = usePathname()

  // Read state from URL or use default
  const pageIndex = params.get('page');
  const pageSize = 10;

  useEffect(() => {
    // Update the table state when URL changes
    table.setPageIndex(pageIndex);
    table.setPageSize(pageSize);
  }, [pageIndex, pageSize, table]);

  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    router.push(`${pathname}?page=1&size=${newSize.toString()}`)
  };

  const setPageIndex = (newIndex: number) => {
    router.push(`${pathname}?page=${(newIndex).toString()}`)
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        {/* Page size selection */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map(size => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Pagination controls */}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {pageIndex} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPageIndex(table.getState().pagination.pageIndex - 1)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPageIndex(table.getState().pagination.pageIndex + 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
