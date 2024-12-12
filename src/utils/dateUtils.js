const moment = require('moment');

class DateUtils {
  static formatDate(date, format = 'YYYY-MM-DD') {
    return moment(date).format(format);
  }

  static parseDate(dateString, format = 'YYYY-MM-DD') {
    return moment(dateString, format).toDate();
  }

  static addDays(date, days) {
    return moment(date).add(days, 'days').toDate();
  }

  static addMonths(date, months) {
    return moment(date).add(months, 'months').toDate();
  }

  static isWeekend(date) {
    const day = moment(date).day();
    return day === 0 || day === 6;
  }

  static isBusinessDay(date) {
    return !this.isWeekend(date);
  }

  static getNextBusinessDay(date) {
    let nextDay = moment(date).add(1, 'days');
    while (this.isWeekend(nextDay)) {
      nextDay = nextDay.add(1, 'days');
    }
    return nextDay.toDate();
  }

  static getDaysBetween(startDate, endDate) {
    return moment(endDate).diff(moment(startDate), 'days');
  }
}

module.exports = DateUtils;