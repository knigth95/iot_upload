import { utils, writeFile } from 'xlsx'

// 导出为CSV
export const exportToCSV = (data: any[], filename: string) => {
  const csvContent = [
    Object.keys(data[0]).join(','),
    ...data.map(item => Object.values(item).join(',')),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
}


// 导出为JSON
export const exportToJSON = (data: any[], filename: string) => {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.json`
  link.click()
}

// 导出为Excel
export const exportToExcel = (data: any[], filename: string) => {
  const worksheet = utils.json_to_sheet(data)
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  writeFile(workbook, `${filename}.xlsx`)
}
