import * as moment from 'moment';

export enum DateLocale {
  AR = 'ar',
  En = 'en',
  FR = 'fr',
  IT = 'it',
}
export class DateUtil {
  constructor() { }

  /**
   * @description check if the parsed date is a valid date
   */
  static isValidDate(date: any) {
    let checkDate = moment(
      date,
      [
        'DD-MM-YYYY',
        'DD/MM/YYYY',
        'MM-DD-YYYY',
        'MM/DD/YYYY',
        'YYYY-MM-DD',
        'YYYY/MM/DD',
      ],
      true
    ).isValid();
    return checkDate;
  }
  /**
   * @description check if the parsed full time in format `hh:mm:ss a | HH:mm:ss a`  is valid
   */

  static isValidFullTime(time: any) {
    let checkTime = moment(time, ['hh:mm:ss a', 'HH:mm:ss a'], true).isValid();
    return checkTime;
  }

  /**
   * check if the parsed time is valid
   */
  static isValidTime(time: any) {
    let checkTime = moment(
      time,
      ['hh:mm:ss', 'HH:mm:ss', 'hh:mm', 'HH:mm'],
      true
    ).isValid();
    return checkTime;
  }

  /** parse string to date */
  static parseString(date: string) {
    return moment(date, true).toDate();
  }

  static parseStringformat(date: string, format: string): string {
    return moment(date, true).format(format);
  }

  /**
   * @description `isDateTime` Method Check if the value is a valida date time with `AM` or `PM` Just
   * pass it at the end of the date time
   * @param dateTimeVal
   * @default formats
   *    "DD-MM-YYYY hh:mm:ss",
        "DD/MM/YYYY hh:mm:ss",
        "MM-DD-YYYY hh:mm:ss",
        "MM/DD/YYYY hh:mm:ss",
        "YYYY-MM-DD hh:mm:ss",
        "YYYY/MM/DD hh:mm:ss a",
        "DD-MM-YYYY hh:mm:ss a",
        "DD/MM/YYYY hh:mm:ss a",
        "MM-DD-YYYY hh:mm:ss a",
        "MM/DD/YYYY hh:mm:ss a",
        "YYYY-MM-DD hh:mm:ss a",
        "YYYY/MM/DD hh:mm:ss a"
        @returns `boolean`
   */
  static isDateTime(dateTimeVal: any): boolean {
    return moment(dateTimeVal, [
      'DD-MM-YYYY hh:mm:ss',
      'DD/MM/YYYY hh:mm:ss',
      'MM-DD-YYYY hh:mm:ss',
      'MM/DD/YYYY hh:mm:ss',
      'YYYY-MM-DD hh:mm:ss',
      'YYYY/MM/DD hh:mm:ss a',
      'DD-MM-YYYY hh:mm:ss a',
      'DD/MM/YYYY hh:mm:ss a',
      'MM-DD-YYYY hh:mm:ss a',
      'MM/DD/YYYY hh:mm:ss a',
      'YYYY-MM-DD hh:mm:ss a',
      'YYYY/MM/DD hh:mm:ss a',
    ]).isValid();
  }

  /**
   * @description `formatDate` Metho is used to format date with multile supported formats
   * but it first check is the dat is valid or no
   * @default default check formats ar "DD-MM-YYYY",
        "DD/MM/YYYY",
        "MM-DD-YYYY",
        "MM/DD/YYYY",
        "YYYY-MM-DD",
        "YYYY/MM/DD"
   */
  static formatDate(dateValue: any, format = 'DD/MM/YYYY') {
    let dateFormat = '';
    if (DateUtil.isValidDate(dateValue)) {
      dateFormat = moment(
        dateValue,
        [
          'DD-MM-YYYY',
          'DD/MM/YYYY',
          'MM-DD-YYYY',
          'MM/DD/YYYY',
          'YYYY-MM-DD',
          'YYYY/MM/DD',
        ],
        true
      ).format(format);
    }
    return dateFormat;
  }
  /**
   * @description `getWeekDays` Method return with an array of week days names based on locale
   * @param locale  the locale for the user
   * @default 'ar'
   */
  static getWeekDays(locale: DateLocale) {
    moment.locale(locale);
    return moment.weekdays();
  }
  /**
   * @description `getYearMonths` Method return with an array of year months names based on locale
   * @param locale  the locale for the user
   * @default 'ar'
   */
  static getYearMonths(locale = 'en') {
    moment.locale(locale);
    return moment.weekdays();
  }
  /**
   * @description return the day number in year such as `05 of january` is the 5t day in the year
   */
  getDayNumberInYear(date: string) {
    return moment(
      date,
      [
        'DD-MM-YYYY',
        'DD/MM/YYYY',
        'MM-DD-YYYY',
        'MM/DD/YYYY',
        'YYYY-MM-DD',
        'YYYY/MM/DD',
      ],
      true
    ).dayOfYear();
  }

  /**
   *@description this method is used for subtract months from date and then return the months names
   * @param workDate the date t work with
   * @param SubtractDuration the duration to subtract from the income date
   * @param locale the locale for language that array will return with
   * @returns `string[]` array of months
   */
  static getMonthsNamesBetweenDates(
    workDate: string,
    SubtractDuration: number = 0,
    locale: string = 'ar'
  ) {
    moment.locale(locale);
    let months = [];
    let date1 = moment(workDate, 'DD/MM/YYYY', true);

    if (!date1.isValid()) {
      throw Error('invalid date or format date must in format [DD/MM/YYYY]');
    }
    if (isNaN(SubtractDuration)) {
      throw Error('duration must be a number');
    }
    for (let index = 0; index < SubtractDuration; index++) {
      months.push(date1.subtract(1, 'months').format('MMMM'));
    }
    return months;
  }

}
