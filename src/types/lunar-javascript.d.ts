declare module 'lunar-javascript' {
  export class Lunar {
    getYear(): number
    getMonth(): number
    getDay(): number
    getMonthInChinese(): string
    getDayInChinese(): string
    getYearInGanZhi(): string
    getYearShengXiao(): string
    getJieQi(): string
  }

  export class Solar {
    static fromDate(date: Date): Solar
    static fromYmd(year: number, month: number, day: number): Solar
    getLunar(): Lunar
  }
}
