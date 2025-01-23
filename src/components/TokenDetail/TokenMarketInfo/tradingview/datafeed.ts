import { getIntervalByResolution, getKlineType } from "@/utils";
import { SUPPORTED_RESOLUTIONS } from ".";
import {
  ChartingLibraryWidgetOptions,
  LibrarySymbolInfo,
  ResolutionString,
} from "../../../../../public/charting_library/charting_library";
import { getKLineHistory, getKLineLast } from "@/api/api";
import { Address } from "viem";
import { GetAgentInfoResponse } from "@/api/types";
const getResolutionInSeconds = (resolution: string): number => {
  const resolutionMap: { [key: string]: number } = {
    "1": 60,
    "5": 300,
    "15": 900,
    "30": 1800,
    "60": 3600,
    "240": 14400,
    D: 86400,
    W: 604800,
  };
  return resolutionMap[resolution] || 60;
};
export const datafeed = (
  tokenInfo: GetAgentInfoResponse
): ChartingLibraryWidgetOptions["datafeed"] => {
  const subscriptions = new Map<string, NodeJS.Timeout>();
  return {
    onReady: (callback) => {
      setTimeout(() => {
        callback({
          supported_resolutions: SUPPORTED_RESOLUTIONS,
          symbols_types: [{ name: "crypto", value: "crypto" }],
        });
      }, 0);
    },
    searchSymbols: () => {},
    resolveSymbol: (
      _symbolName,
      onSymbolResolvedCallback,
      onResolveErrorCallback
    ) => {
      setTimeout(() => {
        const symbolInfo: LibrarySymbolInfo = {
          ticker: tokenInfo?.symbol ?? "MemeSymbol",
          name: tokenInfo?.name ?? "MemeName",
          description: `${tokenInfo?.symbol ?? "MemeSymbol"}/Doge`,
          type: "crypto",
          session: "24x7",
          timezone: "Etc/UTC",
          format: "price",
          exchange: "DogeCoin.Ai",
          listed_exchange: "DogeCoin.Ai",
          minmov: 100,
          pricescale: 10 ** 15,
          visible_plots_set: "ohlcv",
          has_daily: true,
          has_weekly_and_monthly: true,
          has_intraday: true,
          has_seconds: true,
          has_ticks: true,
          supported_resolutions: [
            // "1S",
            // "5S",
            // "10S",
            // "15S",
            // "30S",
            "1",
            "5",
            "15",
            "30",
            "60",
            "240",
            "1D",
            "1W",
          ] as ResolutionString[],
          intraday_multipliers: [
            // "1S",
            // "5S",
            // "10S",
            // "15S",
            // "30S",
            "1",
            "5",
            "15",
            "30",
            "60",
            "240",
          ],
          volume_precision: 2,
          data_status: "streaming",
        };

        try {
          onSymbolResolvedCallback(symbolInfo);
        } catch (err: any) {
          onResolveErrorCallback(err.message);
        }
      }, 50);
    },
    getBars: async (
      _symbolInfo,
      resolution,
      periodParams,
      onHistoryCallback
    ) => {
      try {
        const resolutionInSeconds = getResolutionInSeconds(resolution);
        const timeRange = resolutionInSeconds * 2000;
        const endTime = periodParams.to * 1000;
        const startTime = endTime - timeRange * 1000;
        const klineList = await getKLineHistory({
          tokenAddress: tokenInfo.tokenAddress as Address,
          type: getKlineType(resolution),
          startTimestamp: startTime,
          endTimestamp: endTime,
          // startTimestamp: periodParams.from * 1000,
          // endTimestamp: periodParams.to * 1000,
          // endTimestamp: Math.floor(periodParams.to),
        });
        if (klineList.length > 0) {
          const bars = klineList.map((item) => ({
            time: new Date(item.timestamp).getTime(),
            open: parseFloat(item.o),
            high: parseFloat(item.h),
            low: parseFloat(item.l),
            close: parseFloat(item.c),
            volume: parseFloat(item.v),
          }));
          onHistoryCallback(bars);
        } else {
          onHistoryCallback([], { noData: true });
        }
      } catch (error) {
        console.error("Error fetching kline data:", error);
        onHistoryCallback([], { noData: true });
      }
    },
    subscribeBars: async (
      _symbolInfo,
      resolution,
      onRealtimeCallback,
      listenerGuid
    ) => {
      const fetchData = async () => {
        try {
          const now = Math.floor(Date.now() / 1000);
          const periodInterval = getIntervalByResolution(resolution) / 1000;
          const lastValidKLine = await getKLineLast({
            tokenAddress: tokenInfo.tokenAddress as Address,
            type: getKlineType(resolution),
            startTimestamp: (now - periodInterval) * 1000,
          });
          if (lastValidKLine) {
            const bar = {
              time: new Date(lastValidKLine.timestamp).getTime(),
              open: Number(lastValidKLine.o),
              high: Number(lastValidKLine.h),
              low: Number(lastValidKLine.l),
              close: Number(lastValidKLine.c),
              volume: Number(lastValidKLine.v),
            };
            onRealtimeCallback(bar);
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      };
      await fetchData();
      const intervalId = setInterval(fetchData, 5 * 1000);
      subscriptions.set(listenerGuid, intervalId);
      return listenerGuid;
    },
    unsubscribeBars: (subscriberUID) => {
      if (subscriptions.has(subscriberUID)) {
        clearInterval(subscriptions.get(subscriberUID));
        subscriptions.delete(subscriberUID);
      }
    },
  };
};
