// export const isNumber = (num) => {
//   try {
//   return parseFloat(num).toString() === num;
//   } catch (err) {
//     return false;
//   }
// }

export const isInt = (n) => {
  return Number(n) === n && n % 1 === 0
}

export const isFloat = (n) => {
  return Number(n) === n && n % 1 !== 0;
}

export const isNumber = (n) => {
  return isInt(n) || isFloat(n);
}

export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function fprice(price) {
  if (!price) {
    return 'Invalid';
  }

  return `Rs. ${price.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
}