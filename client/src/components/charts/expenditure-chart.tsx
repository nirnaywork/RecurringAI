import { useEffect, useRef } from "react";

interface ExpenditureChartProps {
  type: "line" | "doughnut";
  data: any;
  className?: string;
}

export default function ExpenditureChart({ type, data, className }: ExpenditureChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Dynamic import of Chart.js to avoid SSR issues
    import("chart.js").then((ChartModule) => {
      const Chart = ChartModule.Chart;

      // Destroy existing chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current!.getContext('2d')!;

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
            }
          },
        }
      };

      if (type === "line") {
        config.options.scales = {
          y: {
            beginAtZero: true,
            grid: {
              color: '#E5E7EB'
            }
          },
          x: {
            grid: {
              color: '#E5E7EB'
            }
          }
        };
      }

      chartInstanceRef.current = new Chart(ctx, config);
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [type, data]);

  return <canvas ref={chartRef} className={className} />;
}
