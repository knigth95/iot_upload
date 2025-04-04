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

export default function HistoryChart ({ data }: HistoryChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    // 如果已经有图表实例，销毁它
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // 创建新的图表
    if (chartRef.current && data) {
      const ctx = chartRef.current.getContext('2d')

      chartInstance.current = new Chart(ctx!, {
        type: 'line',
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: '时间',
              },
            },
            y: {
              title: {
                display: true,
                text: '数值',
              },
            },
          },
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
