'use client'

import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

// 注册Chart.js组件
Chart.register(...registerables)

export default function HistoryChart ({ data }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    // 如果已经有图表实例，销毁它
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // 创建新的图表
    if (chartRef.current && data) {
      const ctx = chartRef.current.getContext('2d')

      chartInstance.current = new Chart(ctx, {
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
