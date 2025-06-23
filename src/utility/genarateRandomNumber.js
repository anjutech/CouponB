import { randomInt } from 'crypto';
export const generateRandomNumber = (length = 6) => {
    // return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();

  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += randomInt(0, 10); 
  }
  return otp;
};