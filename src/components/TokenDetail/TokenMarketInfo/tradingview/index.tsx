import React, { useEffect, useRef } from "react";
import { ColorType, createChart, IChartApi } from "lightweight-charts";

const TradingViewChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef(null);
  const intervalIdRef = useRef();
  const samplePoint = (i: number) => {
    const randomFactor = 25 + Math.random() * 25;
    return (
      i *
        (0.5 +
          Math.sin(i / 1) * 0.2 +
          Math.sin(i / 2) * 0.4 +
          Math.sin(i / randomFactor) * 0.8 +
          Math.sin(i / 50) * 0.5) +
      200 +
      i * 2
    );
  };

  const generateData = (
    numberOfCandles = 500,
    updatesPerCandle = 5,
    startAt = 100
  ) => {
    const createCandle = (val: number, time: number) => ({
      time,
      open: val,
      high: val,
      low: val,
      close: val,
    });

    const updateCandle = (candle: any, val: number) => ({
      time: candle.time,
      close: val,
      open: candle.open,
      low: Math.min(candle.low, val),
      high: Math.max(candle.high, val),
    });

    const date = new Date(Date.UTC(2018, 0, 1, 12, 0, 0, 0));
    const numberOfPoints = numberOfCandles * updatesPerCandle;
    const initialData = [];
    const realtimeUpdates = [];
    let lastCandle;
    let previousValue = samplePoint(-1);

    for (let i = 0; i < numberOfPoints; ++i) {
      if (i % updatesPerCandle === 0) {
        date.setUTCDate(date.getUTCDate() + 1);
      }
      const time = date.getTime() / 1000;
      let value = samplePoint(i);
      const diff = (value - previousValue) * Math.random();
      value = previousValue + diff;
      previousValue = value;

      if (i % updatesPerCandle === 0) {
        const candle = createCandle(value, time);
        lastCandle = candle;
        if (i >= startAt) {
          realtimeUpdates.push(candle);
        }
      } else {
        const newCandle = updateCandle(lastCandle, value);
        lastCandle = newCandle;
        if (i >= startAt) {
          realtimeUpdates.push(newCandle);
        } else if ((i + 1) % updatesPerCandle === 0) {
          initialData.push(newCandle);
        }
      }
    }

    return {
      initialData,
      realtimeUpdates,
    };
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        textColor: "black",
        background: { type: ColorType.Solid, color: "white" },
      },
      height: 400,
      width: chartContainerRef.current.clientWidth,
    });
    //@ts-expect-error text
    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    const data = generateData(2500, 20, 1000);
    //@ts-expect-error text
    seriesRef.current.setData(data.initialData);

    chartRef.current.timeScale().fitContent();
    //@ts-expect-error text
    chartRef.current.timeScale().scrollToPosition(5);

    // //@ts-expect-error text
    function* getNextRealtimeUpdate(realtimeData: any[]) {
      for (const dataPoint of realtimeData) {
        yield dataPoint;
      }
      return null;
    }

    const streamingDataProvider = getNextRealtimeUpdate(data.realtimeUpdates);
    //@ts-expect-error text
    intervalIdRef.current = setInterval(() => {
      const update = streamingDataProvider.next();
      if (update.done) {
        clearInterval(intervalIdRef.current);
        return;
      }
      //@ts-expect-error text
      seriesRef.current?.update(update.value);
    }, 1000);

    // 响应窗口大小变化
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize);
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  const handleGoToRealtime = () => {
    chartRef.current?.timeScale().scrollToRealTime();
  };

  return (
    <div className="w-full">
      <div ref={chartContainerRef} />
      <div className="flex gap-2 mt-4">
        <button
          className="px-6 py-2 bg-[#F0F3FA] hover:bg-[#E0E3EB] active:bg-[#D1D4DC] rounded-lg text-[#131722] font-medium"
          onClick={handleGoToRealtime}
        >
          Go to realtime
        </button>
      </div>
    </div>
  );
};

export default TradingViewChart;
