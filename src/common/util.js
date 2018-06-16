import moment from 'moment';

export const isInt = (n) => {
  if (typeof n === 'string') {
    if (n !== parseInt(n).toString()) {
      return false;
    }
    n = parseInt(n);
  }
  return Number(n) === n && n % 1 === 0
}

export const isFloat = (n) => {
  if (typeof n === 'string') {
    if (n !== parseFloat(n).toString()) {
      return false;
    }
    n = parseFloat(n);
  }
  return Number(n) === n && n % 1 !== 0;
}

export const isNumber = (n) => {
  return isInt(n) || isFloat(n);
}

export const validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const fprice = price => {
  if (price == null) {
    return 'Invalid';
  }

  return `Rs. ${price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
}

export const duration_minutes = (t1, t2) => {
  return moment(t1).diff(moment(t2), 'minutes');
}