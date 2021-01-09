import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';


const relativeDateString = (date: number) => {

  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo('en-US');

  return timeAgo.format(date);

};

export default relativeDateString;