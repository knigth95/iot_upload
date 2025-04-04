'use client'

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function HistoryTable ({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-4">暂无数据</div>
  }

  // 获取表头
  const headers = Object.keys(data[0])

  return (
    <div className="border rounded-md overflow-auto max-h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>
                {header === 'timestamp'
                  ? '时间'
                  : header === 'device'
                    ? '设备'
                    : header === 'property'
                      ? '属性'
                      : header === 'value'
                        ? '数值'
                        : header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {headers.map((header) => (
                <TableCell key={`${index}-${header}`}>{row[header]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
