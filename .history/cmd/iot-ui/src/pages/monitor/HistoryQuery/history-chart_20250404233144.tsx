'use client'

import React, { useEffect, useRef } from 'react'
import { Chart, ChartDataSets } from 'chart.js'

interface HistoryChartProps {
  data: {
    labels: string[]
    datasets: ChartDataSets[]
  }
}

// 设置默认字体
Chart.defaults.font.family = 'system-ui, -apple-system, "Segoe UI"'

export default function HistoryChart({ data }: HistoryChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    // 如果已经有图表实例，销毁它
          },
          scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: '时间'
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: '数值'
              }
            }]
          }
        },
      })
    }

    // 组件卸载时清理
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return <canvas ref={chartRef} />
}
