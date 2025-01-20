import { useEffect, useRef } from "react";
import {
  widget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
  TimeFrameItem,
  IChartingLibraryWidget,
} from "../../../../../public/charting_library";
import * as React from "react";
import { datafeed } from "./datafeed";
import { useParams } from "react-router-dom";
import { useAgentInfo } from "@/hooks/tokenDetial/useAgentInfo";

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
export const SUPPORTED_RESOLUTIONS = [
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
  const { characterId } = useParams();
  const { data: tokenInfo } = useAgentInfo(characterId!);
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  useEffect(() => {
    let tvWidget: IChartingLibraryWidget;

    if (tokenInfo?.tokenAddress) {
      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: tokenInfo?.symbol ?? ("MemeSymbol" as string),
        // BEWARE: no trailing slash is expected in feed URL
        // tslint:disable-next-line:no-any
        datafeed: datafeed(tokenInfo),
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

                const parts = Number(price).toFixed(18).toString().split(".");
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
  }, [tokenInfo?.tokenAddress, tokenInfo?.symbol]);

  return <div ref={chartContainerRef} className="h-full" />;
};
export default TradingViewChart;
