import { useEffect, useRef } from "react";
import {
  widget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
  LibrarySymbolInfo,
  TimeFrameItem,
  IChartingLibraryWidget,
} from "../../../../../public/charting_library";
import * as React from "react";
import { getKLineHistory, getKLineLast } from "@/api/api";
import { getIntervalByResolution, getKlineType } from "@/utils";
import { useAgentInfoStore } from "@/store/tokenDetail";
import { Address } from "viem";

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions["symbol"];
  interval: ChartingLibraryWidgetOptions["interval"];

  // BEWARE: no trailing slash is expected in feed URL
  datafeedUrl: string;
  libraryPath: ChartingLibraryWidgetOptions["library_path"];
  chartsStorageUrl: ChartingLibraryWidgetOptions["charts_storage_url"];
  chartsStorageApiVersion: ChartingLibraryWidgetOptions["charts_storage_api_version"];
  clientId: ChartingLibraryWidgetOptions["client_id"];
  userId: ChartingLibraryWidgetOptions["user_id"];
  fullscreen: ChartingLibraryWidgetOptions["fullscreen"];
  autosize: ChartingLibraryWidgetOptions["autosize"];
  studiesOverrides: ChartingLibraryWidgetOptions["studies_overrides"];
  container: ChartingLibraryWidgetOptions["container"];
}

const getLanguageFromURL = (): LanguageCode | null => {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null
    ? null
    : (decodeURIComponent(results[1].replace(/\+/g, " ")) as LanguageCode);
};
const SUPPORTED_RESOLUTIONS = [
  "1S",
  "5S",
  "10S",
  "15S",
  "30S",
  "1",
  "5",
  "15",
  "30",
  "60",
  "240",
  "1D",
  "1W",
] as ResolutionString[];
const TradingViewChart = () => {
  const subscriptions = new Map<string, NodeJS.Timeout>();

  const tokenInfo = useAgentInfoStore((state) => state.agent);
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  useEffect(() => {
    let tvWidget: IChartingLibraryWidget;

    if (tokenInfo?.tokenAddress) {
      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: tokenInfo?.symbol ?? ("MemeSymbol" as string),
        // BEWARE: no trailing slash is expected in feed URL
        // tslint:disable-next-line:no-any
        datafeed: {
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
                minmov: 1,
                pricescale: 100000000000,
                visible_plots_set: "ohlcv",
                has_daily: true,
                has_weekly_and_monthly: true,
                has_intraday: true,
                has_seconds: true,
                has_ticks: true,
                supported_resolutions: [
                  "1S",
                  "5S",
                  "10S",
                  "15S",
                  "30S",
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
                  "1S",
                  "5S",
                  "10S",
                  "15S",
                  "30S",
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
            symbolInfo,
            resolution,
            periodParams,
            onHistoryCallback
          ) => {
            try {
              const klineList = await getKLineHistory({
                tokenAddress: tokenInfo.tokenAddress as Address,
                type: getKlineType(resolution),
                startTimestamp: periodParams.from * 1000,
                endTimestamp: periodParams.to * 1000,
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
                const periodInterval =
                  getIntervalByResolution(resolution) / 1000;
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
            const intervalId = setInterval(fetchData, 10 * 1000);
            subscriptions.set(listenerGuid, intervalId);
            return listenerGuid;
          },
          unsubscribeBars: (subscriberUID) => {
            if (subscriptions.has(subscriberUID)) {
              clearInterval(subscriptions.get(subscriberUID));
              subscriptions.delete(subscriberUID);
            }
          },
        },
        interval: "1" as ChartingLibraryWidgetOptions["interval"],
        container: chartContainerRef.current,
        library_path: "/charting_library/" as string,
        locale: getLanguageFromURL() || "en",
        disabled_features: [
          "use_localstorage_for_settings",
          "header_symbol_search",
          "header_compare",
          "header_quick_search",
          "header_undo_redo",
        ],
        header_widget_buttons_mode: "adaptive",
        time_frames: [
          // Seconds group
          { text: "1S", resolution: "1S", description: "1 Second" },
          { text: "5S", resolution: "5S", description: "5 Seconds" },
          { text: "10S", resolution: "10S", description: "10 Seconds" },
          { text: "15S", resolution: "15S", description: "15 Seconds" },
          { text: "30S", resolution: "30S", description: "30 Seconds" },
          // Minutes group
          { text: "1M", resolution: "1", description: "1 Minute" },
          { text: "5M", resolution: "5", description: "5 Minutes" },
          { text: "15M", resolution: "15", description: "15 Minutes" },
          { text: "30M", resolution: "30", description: "30 Minutes" },
          { text: "1H", resolution: "60", description: "1 Hour" },
          { text: "4H", resolution: "240", description: "4 Hours" },
          { text: "1D", resolution: "1D", description: "1 Day" },
          { text: "1W", resolution: "1W", description: "1 Week" },
        ] as TimeFrameItem[],
        custom_formatters: {
          priceFormatterFactory: () => {
            return {
              format: (price) => {
                if (typeof price !== "number") {
                  return "";
                }
                if (price === 0) {
                  return "0";
                }

                const parts = Number(price).toFixed(11).toString().split(".");
                if (parts.length === 1) {
                  return parts[0];
                }

                const integerPart = parts[0];
                const fractionalPart = parts[1];
                const leadingZeros =
                  fractionalPart.match(/^0+/)?.[0].length ?? 0;
                const significantPart = fractionalPart.slice(leadingZeros);
                if (leadingZeros === 0) {
                  return `${integerPart}.${fractionalPart}`;
                }
                const subscripts: { [key: string]: string } = {
                  "0": "₀",
                  "1": "₁",
                  "2": "₂",
                  "3": "₃",
                  "4": "₄",
                  "5": "₅",
                  "6": "₆",
                  "7": "₇",
                  "8": "₈",
                  "9": "₉",
                };
                const subscriptZeros = leadingZeros
                  .toString()
                  .split("")
                  .map((digit) => subscripts[digit])
                  .join("");
                return `${integerPart}.0${subscriptZeros}${significantPart}`;
              },
            };
          },
        },
        enabled_features: ["study_templates"],
        charts_storage_url: "https://saveload.tradingview.com",
        charts_storage_api_version: "1.1",
        client_id: "tradingview.com",
        user_id: "public_user_id",
        fullscreen: false,
        autosize: true,
        studies_overrides: {},
        theme: "light",
      };

      tvWidget = new widget(widgetOptions);

      tvWidget.onChartReady(() => {
        tvWidget.headerReady().then(() => {
          const button = tvWidget.createButton();
          button.setAttribute("title", "Click to show a notification popup");
          button.classList.add("apply-common-tooltip");
          button.addEventListener("click", () =>
            tvWidget.showNoticeDialog({
              title: "Notification",
              body: "TradingView Charting Library API works correctly",
              callback: () => {
                console.log("Noticed!");
              },
            })
          );
          button.innerHTML = "Check API";
        });
      });
    }
    return () => {
      if (tvWidget) {
        tvWidget.remove();
      }
    };
  }, [subscriptions, tokenInfo]);

  return <div ref={chartContainerRef} className="h-full" />;
};
export default TradingViewChart;
