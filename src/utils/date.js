// const parseDate = (str) => {
//   var mdy = str.split('-');
//   return new Date(mdy[2], mdy[0]-1, mdy[1]);
// }

export const daysTillExpiry = (date1, date2) => {
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = (secondDate - firstDate)/msPerDay;
  return diff < 0 ? 0 : diff;
}

export const getCurrentDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '-' + dd + '-' + yyyy;
  return today;
}

export const getMaxDate = (dates) => {
  return new Date(Math.max.apply(null, dates.map(date => { 
    return new Date(date);
  })));
}
