import clone from 'clone';
import bs from "black-scholes";
import iv from "implied-volatility";
import {daysTillExpiry, getCurrentDate} from './date';

// Set end point of the chart as 30% above the stock price
const getHigh = (price, high) => {
  return price + price/3;
}

// Set end point of the chart as 30% above the stock price
const getLow = (price, low) => {
  return price - price/3;
}

// Round a number to 2 decimal points
const round = (num) => {
  return Math.round((num + Number.EPSILON) * 100)/100;
}

// Round a number to 1 decimal point
const roundOne = (num) => {
  return Math.round((num + Number.EPSILON) * 10)/10;
}

/**  Main function used to obtain the data used in the chart.
 * @param {Array} positions - positions as stored in main.jsx
 * @param {Object} quote - quote object of stock as stored in main.jsx
 * @param {Integer} quantity - number of underlying shares (stored in main.jsx)
 * @param {String} date - date as determined by slider in analysis.jsx
 * @param {Float} ivChange - difference b/w average IV and new IV (slider) divided
 *                   by the number of positions.
 * @return {Array} netProfit - Array consisting of objects {underlying, price, profit} 
 */
export const netProfitArray = (positions, quote, quantity, date, ivChange) => {
  // calculate P/L for options positions
  var netProfit = clone(optionPriceArray(positions[0], quote, date, ivChange));
  var i = 1;
  for(i=1; i<positions.length; i++) {
    var array = optionPriceArray(positions[i], quote, date, ivChange);
    var j = 0;
    for(j=0; j<netProfit.length; j++) {
      netProfit[j].price = round(netProfit[j].price + array[j].price);
      netProfit[j].profit = round(netProfit[j].profit + array[j].profit);
    }
  }
  // add stock P/L if present.
  if(quantity !== 0) {
    netProfit = netProfit.map(obj => (
      {
        underlying: obj.underlying,
        price: round(obj.price*100 + quantity * obj.underlying),
        profit: round(obj.profit*100 + quantity * (obj.underlying - quote.last))
      }
    ))
  }
  return netProfit;
}

/**
 * @param {Array} positions - positions as stored in main.jsx' state.
 * @param {Object} quote - quote as stored in main.jsx' state. 
 * @returns - average volatility of positions (number)
 */
export const avgVolatility = (positions, quote) => {
  var vol = 0;
  positions.forEach(option => {
    const optionPrice = (option.ask + option.bid)/2;
    const daysDiff = daysTillExpiry(getCurrentDate(), option.expiration_date);
    vol += iv.getImpliedVolatility(
      optionPrice, quote.last, option.strike, daysDiff/365, 0.05, option.option_type
    );
    console.log(vol);
  });
  return round(vol/positions.length);
}

/**  Function used to obtain the P/L data for a single option.
 * @param {Object} option - object storing data of the option, element of positions.
 * @param {Object} quote - quote object of stock as stored in main.jsx
 * @param {String} date - date as determined by slider in analysis.jsx
 * @param {Float} volChange- difference b/w average IV and new IV (slider) divided
 *                   by the number of positions.
 * @return {Array} priceArray - Array consisting of objects {underlying, price, profit} 
 */
const optionPriceArray = (option, quote, date, volChange) => {
  var priceArray = []
  var optionPrice = (option.ask + option.bid)/2; // option price
  var price = 0; // underlying price

  // setting constants
  const quantity = Math.abs(option.quantity);
  const high = getHigh(quote.last, quote.week_52_high);
  const low = getLow(quote.last, quote.week_52_low);
  const initial = (option.ask + option.bid)/2;
  const mul = option.position === "short" ? -1 : 1;
  const interval = quote.last * 0.2/100;

  // calculate default days diff
  var daysDiff = daysTillExpiry(new Date().toString(), option.expiration_date);
  // find volatility of the options as of today (current date)
  var vol = iv.getImpliedVolatility(
    optionPrice, quote.last, option.strike, daysDiff/365, 0.05, option.option_type
  ) + volChange/100;
  // find new daysDiff if date is adjusted by slider.
  daysDiff = daysTillExpiry(date, option.expiration_date);
  price = low;
  // create priceArray
  while(price < high) {
    optionPrice = bs.blackScholes(
      price, 
      option.strike,
      daysDiff/365,
      vol,
      0.05,
      option.option_type
    );
    priceArray.push({
      underlying: roundOne(price),
      price: mul * round(optionPrice * quantity),
      profit: mul * round((optionPrice - initial) * quantity),
    });
    price += interval;
  }
  return priceArray;
}
