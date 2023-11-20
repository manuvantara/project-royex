'use client';

import { CaretSortIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { useCountdown } from 'usehooks-ts';
import { formatEther } from 'viem';
import AcceptButton from './accept-button';
import { useOtcMarketsServiceFetchOffersKey } from '@/api/queries';
import { OtcMarketsService, type Offer } from '@/api/requests';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const columns: ColumnDef<Offer>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'seller',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Seller
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('seller')}</div>,
  },
  {
    accessorKey: 'royaltyTokenAmount',
    header: () => <div className="text-center">Royalty Token Amount</div>,
    cell: ({ row }) => {
      const amount = formatEther(row.getValue('royaltyTokenAmount'));

      return <div className="text-center font-medium">{amount}</div>;
    },
  },
  {
    accessorKey: 'stablecoinAmount',
    header: () => <div className="text-right">Stablecoin Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(formatEther(row.getValue('stablecoinAmount')));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];

export default function OffersTable({ royaltyTokenSymbol }: { royaltyTokenSymbol: string }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data, isFetching, isPending } = useQuery({
    queryKey: [useOtcMarketsServiceFetchOffersKey],
    queryFn: () => OtcMarketsService.fetchOffers(royaltyTokenSymbol),
    refetchInterval: 15_000,
  });

  const [count, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
    countStart: 1,
    isIncrement: true,
    intervalMs: 1000,
  });

  const table = useReactTable({
    data,
    columns,
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    if (!isFetching && !isPending) {
      startCountdown();
    } else {
      stopCountdown();
      resetCountdown();
    }
  });

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Market Offers</CardTitle>
        <CardDescription>This is the list of offers.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Input
            placeholder="Filter sellers..."
            value={(table.getColumn('seller')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('seller')?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <AcceptButton selectedRowIds={table.getSelectedRowModel().rows.map((row) => row.original.offerId)} />
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="[&:has([role=checkbox])]:pl-3">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="[&:has([role=checkbox])]:pl-3 ">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-auto flex items-center justify-end space-x-2 pt-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected | updated {count} seconds ago
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
