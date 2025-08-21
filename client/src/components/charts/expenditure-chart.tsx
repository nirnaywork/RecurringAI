import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  DoughnutController,
  LinearScale,
  CategoryScale,
  ArcElement,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register all necessary components once globally
Chart.register(
  LineController,
  DoughnutController,
  LinearScale,
  CategoryScale,
  ArcElement,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ExpenditureChartProps {
  type: "line" | "doughnut";
  data: any;
  className?: string;
}

export default function ExpenditureChart({ type, data, className }: ExpenditureChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    // If there's an existing chart instance, destroy it before creating a new one
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current?.getContext("2d");
    if (!ctx) return;

    // The config object for the chart
    const config: any = {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: type === "doughnut",
            position: type === "doughnut" ? "bottom" : undefined,
          },
        },
        scales: {},
      },
    };

    // Configure scales only for line charts
    if (type === "line") {
      config.options.scales = {
        y: {
          beginAtZero: true,
          grid: {
            color: '#E5E7EB'
          },
        },
        x: {
          grid: {
            color: '#E5E7EB'
          },
        },
      };
    }

    // Create the new chart instance
    chartInstanceRef.current = new Chart(ctx, config);

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [type, data]);

  return <canvas ref={chartRef} className={className} />;
}