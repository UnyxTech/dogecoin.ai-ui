import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
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
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Address } from "viem";
import { formatAddressNew } from "@/utils";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { getAgentsHolder } from "@/api/api";
import { useParams } from "react-router-dom";
import AdaptiveBalance from "@/components/adaptiveBalance";
import { LoadingComp } from "@/components/loading";

type Holder = {
  rank: string;
  address: Address;
  holding: number;
  amount: number;
};
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-48 text-dayT3">
    <img src="/images/noRrsult.svg" alt="" loading="eager" />
    <div className="text-base mb-2 text-dayT3">No search result</div>
  </div>
);
const fetchSize = 50;
const GRID_TEMPLATE = "1fr 3fr 3fr 3fr";
const HolderContent = () => {
  const { characterId } = useParams();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const columns: ColumnDef<Holder>[] = useMemo(
    () => [
      {
        accessorKey: "rank",
        header: "Rank",
        cell: ({ row }) => <div>{row.getValue("rank")}</div>,
      },
      {
        accessorKey: "address",
        header: () => {
          return <div className="text-left w-full pl-2.5">Address</div>;
        },
        cell: ({ row }) => (
          <div className="lowercase text-sm mdd:text-base text-left w-full  pl-2.5">
            {formatAddressNew(row.getValue("address"))}
          </div>
        ),
      },
      {
        accessorKey: "holding",
        header: () => {
          return <div className="text-end w-full">Holding %</div>;
        },
        cell: ({ row }) => {
          const value = row.getValue("holding") as string;
          return (
            <div className="text-end w-full text-sm mdd:text-base">
              <AdaptiveBalance balance={value.toString()} suffix="%" />
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: () => {
          return <div className="text-end w-full">Amount</div>;
        },
        cell: ({ row }) => {
          const value = row.getValue("amount") as string;
          return (
            <div className="text-end w-full text-sm mdd:text-base">
              <AdaptiveBalance balance={value.toString()} />
            </div>
          );
        },
      },
    ],
    []
  );
  const { data, isFetching, fetchNextPage, status } = useInfiniteQuery({
    queryKey: ["queryHolders"],
    queryFn: async ({ pageParam = 1 }) => {
      console.log("pageParam", pageParam);
      const fetchedData = await getAgentsHolder({
        characterId: characterId!,
        pageSize: fetchSize,
        currentPage: pageParam,
      });
      return fetchedData;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.currentRowSize === lastPage.pageSize;
      if (!hasMore) return undefined;
      return lastPage.current + 1;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const flatData = useMemo(
    () =>
      data?.pages?.flatMap((page) =>
        page.rows.map((holder) => ({
          rank: "1",
          address: holder.holderAddress as Address,
          holding: parseFloat(holder.holdingPercent),
          amount: parseFloat(holder.holdingAmount),
        }))
      ) ?? [],
    [data]
  );
  const table = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 48,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (
          scrollHeight - scrollTop - clientHeight < 200 &&
          !isFetching &&
          data?.pages[data.pages.length - 1].currentRowSize === fetchSize
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, data]
  );
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);
  if (status === "pending")
    return (
      <div className="flex justify-center items-center h-48 ">
        <LoadingComp className="" size={20} loading text="Loading..." />
      </div>
    );
  if (status === "success" && !data?.pages[0]?.rows?.length) {
    return <EmptyState />;
  }

  return (
    <div className="rounded-md">
      <div
        onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
        ref={tableContainerRef}
        className="relative h-[660px] overflow-y-auto customScrollbar_two font-Switzer"
      >
        <Table>
          <TableHeader className="bg-white sticky top-0 z-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="grid border-none"
                style={{
                  gridTemplateColumns: GRID_TEMPLATE,
                }}
              >
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={index}
                      className="text-dayT3 text-xs flex items-center px-0"
                    >
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
          <TableBody
            style={{
              display: "grid",
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
            className="text-dayT1"
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<Holder>;
              return (
                <TableRow
                  data-index={virtualRow.index}
                  ref={(node) => rowVirtualizer.measureElement(node)}
                  key={row.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: GRID_TEMPLATE,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-0">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default HolderContent;
