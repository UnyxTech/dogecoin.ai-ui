import * as React from "react";
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
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Address } from "viem";
import { formatAddressNew } from "@/utils";

const data: Holder[] = [
  {
    rank: "1",
    address: "0x54289cc826fA1A607dE152eC8CfA84F95eeAb8e1",
    holding: 131545,
    amount: 46685656,
  },
  {
    rank: "2",
    address: "0x54289cc826fA1A607dE152eC8CfA84F95eeAb8e1",
    holding: 131545,
    amount: 46685656,
  },
  {
    rank: "3",
    address: "0x54289cc826fA1A607dE152eC8CfA84F95eeAb8e1",
    holding: 131545,
    amount: 46685656,
  },
  {
    rank: "4",
    address: "0x54289cc826fA1A607dE152eC8CfA84F95eeAb8e1",
    holding: 131545,
    amount: 46685656,
  },
  {
    rank: "5",
    address: "0x54289cc826fA1A607dE152eC8CfA84F95eeAb8e1",
    holding: 131545,
    amount: 46685656,
  },
  {
    rank: "6",
    address: "0x54289cc826fA1A607dE152eC8CfA84F95eeAb8e1",
    holding: 131545,
    amount: 46685656,
  },
];

type Holder = {
  rank: string;
  address: Address;
  holding: number;
  amount: number;
};

const columns: ColumnDef<Holder>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
    cell: ({ row }) => <div className="capitalize">{row.getValue("rank")}</div>,
  },
  {
    accessorKey: "address",
    header: () => {
      return <div className="flex-1">Address</div>;
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {formatAddressNew(row.getValue("address"))}
      </div>
    ),
  },
  {
    accessorKey: "holding",
    header: () => {
      return <div className="text-end">Holding%</div>;
    },
    cell: ({ row }) => {
      return <div className="text-end">{row.getValue("holding")}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: () => {
      return <div className="text-end">Amount</div>;
    },
    cell: ({ row }) => {
      return <div className="text-end">{row.getValue("amount")}</div>;
    },
  },
];

const HolderContent = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
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

  return (
    <div className="w-full">
      <div className="rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead key={index}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default HolderContent;
