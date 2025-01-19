import { useEffect, useRef } from "react";
import {
  widget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
  LibrarySymbolInfo,
  TimeFrameItem,
} from "../../../../../public/charting_library";
import * as React from "react";
// import { getKLineHistory, getKLineLast } from "@/api/api";
import { getIntervalByResolution } from "@/utils";
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
const TradingViewChart = ({ tokenInfo }: { tokenInfo: any }) => {
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: "Doge" as string,
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
          symbolName,
          onSymbolResolvedCallback,
          onResolveErrorCallback
        ) => {
          setTimeout(() => {
            const symbolInfo: LibrarySymbolInfo = {
              ticker: "MemeTicker",
              name: "MemeToken",
              description: "MemeName/Doge",
              type: "crypto",
              session: "24x7",
              timezone: "Etc/UTC",
              format: "price",
              exchange: "DogeCoin.Ai",
              listed_exchange: "DogeCoin.Ai",
              minmov: 5,
              pricescale: 10000,
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
        /*
        getBars: async (
          symbolInfo,
          resolution,
          periodParams,
          onHistoryCallback
        ) => {
          try {
            const klineList = await getKLineHistory({
              tokenAddress: "0x650b89f5e67927fc9081F211B2a2fAd9487D1A69",
              type: getKlineType(resolution),
              startTimestamp: Math.floor(periodParams.from),
              endTimestamp: Math.floor(periodParams.to),
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
          symbolInfo,
          resolution,
          onRealtimeCallback,
          subscriberUID,
          onResetCacheNeededCallback
        ) => {
          const intervalId = setInterval(async () => {
            try {
              const now = Math.floor(Date.now() / 1000);
              const periodInterval = getIntervalByResolution(resolution) / 1000;
              const lastValidKLine = await getKLineLast({
                tokenAddress: "0x650b89f5e67927fc9081F211B2a2fAd9487D1A69",
                type: getKlineType(resolution),
                startTimestamp: now - periodInterval,
                endTimestamp: now,
              });

              if (lastValidKLine) {
                const bar = {
                  time: new Date(lastValidKLine.timestamp).getTime(),
                  open: parseFloat(lastValidKLine.o),
                  high: parseFloat(lastValidKLine.h),
                  low: parseFloat(lastValidKLine.l),
                  close: parseFloat(lastValidKLine.c),
                  volume: parseFloat(lastValidKLine.v),
                };
                onRealtimeCallback(bar);
              }
            } catch (error) {
              console.error("Polling error:", error);
            }
          }, getIntervalByResolution(resolution));

          return () => clearInterval(intervalId);
        },
        */
        getBars: async (
          symbolInfo,
          resolution,
          periodParams,
          onHistoryCallback
        ) => {
          function generateKLineData(interval: number, count = 1) {
            const endTime = Math.floor(Date.now() / interval) * interval;
            const klineList = [];

            for (let i = count - 1; i >= 0; i--) {
              const time = endTime - interval * i;
              const volatility = 0.02;
              const change = (Math.random() - 0.5) * volatility * 100;
              const open = 100 + change;
              const high = open + Math.random() * 1;
              const low = open - Math.random() * 1;
              const close = (high + low) / 2 + (Math.random() - 0.5) * 0.5;
              const volume = Math.floor(Math.random() * 1000 + 500);

              klineList.push({
                time: time,
                open: parseFloat(open.toFixed(4)),
                high: parseFloat(high.toFixed(4)),
                low: parseFloat(low.toFixed(4)),
                close: parseFloat(close.toFixed(4)),
                volume: volume,
              });
            }
            return klineList;
          }

          try {
            if (periodParams.firstDataRequest) {
              let interval;
              switch (resolution) {
                case "1S":
                  interval = 1000;
                  break;
                case "5S":
                  interval = 5 * 1000;
                  break;
                case "10S":
                  interval = 10 * 1000;
                  break;
                case "15S":
                  interval = 15 * 1000;
                  break;
                case "30S":
                  interval = 30 * 1000;
                  break;
                case "1":
                  interval = 60 * 1000;
                  break;
                case "5":
                  interval = 5 * 60 * 1000;
                  break;
                case "15":
                  interval = 15 * 60 * 1000;
                  break;
                case "30":
                  interval = 30 * 60 * 1000;
                  break;
                case "60":
                  interval = 60 * 60 * 1000;
                  break;
                case "240":
                  interval = 4 * 60 * 60 * 1000;
                  break;
                case "1D":
                  interval = 24 * 60 * 60 * 1000;
                  break;
                case "1W":
                  interval = 7 * 24 * 60 * 60 * 1000;
                  break;
                default:
                  interval = 60 * 1000;
              }

              const currentTime = Date.now();
              const alignedCurrentTime =
                Math.floor(currentTime / interval) * interval;
              const klineData = generateKLineData(interval);

              const filteredData = klineData.filter(
                (bar) => bar.time <= alignedCurrentTime
              );

              if (filteredData.length > 0) {
                onHistoryCallback(filteredData);
              } else {
                onHistoryCallback([], { noData: true });
              }
            } else {
              onHistoryCallback([], { noData: true });
            }
          } catch (error) {
            console.error("getBars Error:", error);
            onHistoryCallback([], { noData: true });
          }
        },
        subscribeBars: async (symbolInfo, resolution, onRealtimeCallback) => {
          const interval = getIntervalByResolution(resolution);
          let lastPrice = 100;
          let currentBarStartTime =
            Math.floor(Date.now() / interval) * interval;
          let currentBar = {
            time: currentBarStartTime,
            open: lastPrice,
            high: lastPrice,
            low: lastPrice,
            close: lastPrice,
            volume: 0,
          };

          const intervalId = setInterval(() => {
            try {
              const now = Date.now();
              const newBarStartTime = Math.floor(now / interval) * interval;
              const volatility = 0.02;
              const change = (Math.random() - 0.5) * volatility * lastPrice;
              const newPrice = lastPrice + change;
              lastPrice = parseFloat(newPrice.toFixed(4));
              if (newBarStartTime > currentBarStartTime) {
                onRealtimeCallback(currentBar);

                currentBarStartTime = newBarStartTime;
                currentBar = {
                  time: currentBarStartTime,
                  open: lastPrice,
                  high: lastPrice,
                  low: lastPrice,
                  close: lastPrice,
                  volume: Math.floor(Math.random() * 100),
                };
              } else {
                currentBar.close = lastPrice;
                currentBar.high = Math.max(currentBar.high, lastPrice);
                currentBar.low = Math.min(currentBar.low, lastPrice);
                currentBar.volume += Math.floor(Math.random() * 10);

                onRealtimeCallback(currentBar);
              }
            } catch (error) {
              console.error("Real-time data generation error:", error);
            }
          }, 1000);

          return intervalId;
        },
        unsubscribeBars: (subscriberUID) => {
          if (typeof subscriberUID === "number") {
            clearInterval(subscriberUID);
          }
        },
      },
      interval: "5S" as ChartingLibraryWidgetOptions["interval"],
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
      // toolbar_bg:,

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

    const tvWidget = new widget(widgetOptions);

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

    return () => {
      tvWidget.remove();
    };
  });

  return <div ref={chartContainerRef} className="h-full" />;
};
export default TradingViewChart;
