import { utils, writeFile } from 'xlsx'

// 导出为CSV
export const exportToCSV = (data: any[], filename: string) => {
  const csvContent = [
    Object.keys(data[0]).join(','),
    ...data.map(item => Object.values(item).join(',')),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  writeFile(workbook, `${filename}.xlsx`);
};