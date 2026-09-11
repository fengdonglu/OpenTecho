import type { Language, WeekStart } from '@/types'

export interface LocaleMessages {
  appName: string
  appTagline: string
  year: string
  theme: string
  language: string
  weekStart: string
  weekStartMonday: string
  weekStartSunday: string
  themes: Record<string, string>
  yearLabel: (year: number) => string
  threeYear: string
  currentYear: string
  appendix: string
  grid: string
  blank: string
  contact: string
  meeting: string
  intro: string
  downloadCurrent: string
  downloadAll: string
  exportPdf: string
  useTheme: string
  prevPage: string
  nextPage: string
  preview: string
  previewEmpty: string
  pdfFailed: string
  cancel: string
  install: string
  collapse: string
  expand: string
  groupPrevYearQ4: (year: number) => string
  groupCurrentYear: (year: number) => string
  groupNextYearQ1: (year: number) => string
  weekLabel: (n: number) => string
  weekdays: string[]
  months: string[]
  introTitle: string
  introItems: string[]
  author: string
  github: string
}

export const messages: Record<Language, LocaleMessages> = {
  'zh-CN': {
    appName: 'OpenTecho',
    appTagline: '电子手帐',
    year: '年份',
    theme: '主题',
    language: '语言',
    weekStart: '每周开始于',
    weekStartMonday: '周一',
    weekStartSunday: '周日',
    themes: {
      minimal: '极简',
      sakura: '樱花',
      milktea: '奶茶',
      lemon: '柠檬',
      matcha: '抹茶',
      cyan: '青',
      indigo: '靛蓝',
      grape: '葡萄',
    },
    yearLabel: year => `${year}年度`,
    threeYear: '三年年历',
    currentYear: '当年年历',
    appendix: '附录',
    grid: '方格纸',
    blank: '空白页',
    contact: '通讯录',
    meeting: '会议记录',
    intro: '使用说明',
    downloadCurrent: '下载当前页',
    downloadAll: '下载全部 SVG',
    exportPdf: '导出 PDF',
    useTheme: '主题色',
    prevPage: '上一页',
    nextPage: '下一页',
    preview: '手帐页面预览',
    previewEmpty: '暂无预览',
    pdfFailed: 'PDF 导出失败，请重试。',
    cancel: '取消',
    install: '安装应用',
    collapse: '折叠',
    expand: '展开',
    groupPrevYearQ4: year => `${year}年 Q4`,
    groupCurrentYear: year => `${year}年`,
    groupNextYearQ1: year => `${year}年 Q1`,
    weekLabel: n => `第${n}周`,
    weekdays: ['一', '二', '三', '四', '五', '六', '日'],
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    introTitle: '使用说明',
    introItems: [
      '网页即用，无需安装',
      '可安装为应用，支持离线使用',
      '多主题可选（极简 / 樱花 / 奶茶 / 柠檬 / 抹茶 / 青 / 靛蓝 / 葡萄）',
      '跨年编排：上年 Q4 + 全年 + 次年 Q1',
      '内置农历与常见节日',
      '附录：方格纸 / 空白页 / 通讯录 / 会议记录（数量可调）',
      '下载 SVG 可再次编辑，或直接导出 PDF',
      '纯本地处理，数据不上传',
    ],
    author: 'OpenTecho Team',
    github: 'fengdonglu/opentecho',
  },
  'zh-TW': {
    appName: 'OpenTecho',
    appTagline: '電子手帳',
    year: '年份',
    theme: '主題',
    language: '語言',
    weekStart: '每週開始於',
    weekStartMonday: '週一',
    weekStartSunday: '週日',
    themes: {
      minimal: '極簡',
      sakura: '櫻花',
      milktea: '奶茶',
      lemon: '檸檬',
      matcha: '抹茶',
      cyan: '青',
      indigo: '靛藍',
      grape: '葡萄',
    },
    yearLabel: year => `${year}年度`,
    threeYear: '三年年曆',
    currentYear: '當年年曆',
    appendix: '附錄',
    grid: '方格紙',
    blank: '空白頁',
    contact: '通訊錄',
    meeting: '會議記錄',
    intro: '使用說明',
    downloadCurrent: '下載目前頁',
    downloadAll: '下載全部 SVG',
    exportPdf: '匯出 PDF',
    useTheme: '主題色',
    prevPage: '上一頁',
    nextPage: '下一頁',
    preview: '手帳頁面預覽',
    previewEmpty: '暫無預覽',
    pdfFailed: 'PDF 匯出失敗，請重試。',
    cancel: '取消',
    install: '安裝應用',
    collapse: '摺疊',
    expand: '展開',
    groupPrevYearQ4: year => `${year}年 Q4`,
    groupCurrentYear: year => `${year}年`,
    groupNextYearQ1: year => `${year}年 Q1`,
    weekLabel: n => `第${n}週`,
    weekdays: ['一', '二', '三', '四', '五', '六', '日'],
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    introTitle: '使用說明',
    introItems: [
      '網頁即用，無需安裝',
      '可安裝為應用，支援離線使用',
      '多主題可選（極簡 / 櫻花 / 奶茶 / 檸檬 / 抹茶 / 青 / 靛藍 / 葡萄）',
      '跨年編排：上年 Q4 + 全年 + 次年 Q1',
      '內建農曆與常見節日',
      '附錄：方格紙 / 空白頁 / 通訊錄 / 會議記錄（數量可調）',
      '下載 SVG 可再次編輯，或直接匯出 PDF',
      '純本機處理，資料不上傳',
    ],
    author: 'OpenTecho Team',
    github: 'fengdonglu/opentecho',
  },
  en: {
    appName: 'OpenTecho',
    appTagline: 'Digital Planner',
    year: 'Year',
    theme: 'Theme',
    language: 'Language',
    weekStart: 'Week starts on',
    weekStartMonday: 'Monday',
    weekStartSunday: 'Sunday',
    themes: {
      minimal: 'Minimal',
      sakura: 'Sakura',
      milktea: 'Milk Tea',
      lemon: 'Lemon',
      matcha: 'Matcha',
      cyan: 'Cyan',
      indigo: 'Indigo',
      grape: 'Grape',
    },
    yearLabel: year => `${year}`,
    threeYear: 'Three-Year Calendar',
    currentYear: 'Current-Year Calendar',
    appendix: 'Appendix',
    grid: 'Grid',
    blank: 'Blank',
    contact: 'Contacts',
    meeting: 'Meeting Notes',
    intro: 'Guide',
    downloadCurrent: 'Download page',
    downloadAll: 'Download all SVG',
    exportPdf: 'Export PDF',
    useTheme: 'Theme',
    prevPage: 'Prev',
    nextPage: 'Next',
    preview: 'Planner page preview',
    previewEmpty: 'No preview',
    pdfFailed: 'PDF export failed. Please try again.',
    cancel: 'Cancel',
    install: 'Install app',
    collapse: 'Collapse',
    expand: 'Expand',
    groupPrevYearQ4: year => `${year} Q4`,
    groupCurrentYear: year => `${year}`,
    groupNextYearQ1: year => `${year} Q1`,
    weekLabel: n => `W${n}`,
    weekdays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    months: [
      '01 Jan',
      '02 Feb',
      '03 Mar',
      '04 Apr',
      '05 May',
      '06 Jun',
      '07 Jul',
      '08 Aug',
      '09 Sep',
      '10 Oct',
      '11 Nov',
      '12 Dec',
    ],
    introTitle: 'Getting Started',
    introItems: [
      'Use in the browser, no install needed',
      'Installable as an app, works offline',
      'Multiple themes (Minimal / Sakura / Milk Tea / Lemon / Matcha / Cyan / Indigo / Grape)',
      'Cross-year layout: prev Q4 + full year + next Q1',
      'Built-in lunar calendar & common holidays',
      'Appendix: Grid / Blank / Contacts / Meeting Notes (counts adjustable)',
      'Download SVG for further editing, or export PDF',
      '100% local, no data upload',
    ],
    author: 'OpenTecho Team',
    github: 'fengdonglu/opentecho',
  },
}

export function weekdayLabels(language: Language, weekStart: WeekStart): string[] {
  const base = messages[language].weekdays
  return weekStart === 'sunday' ? [base[6], ...base.slice(0, 6)] : base
}
