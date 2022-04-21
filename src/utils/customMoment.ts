import moment from 'moment';
moment.locale('vi');

export function formatTime(time: string) {
  return moment(time).format('DD/MM/YYYY');
}
