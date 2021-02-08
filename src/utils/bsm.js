import clone from 'clone';
import bs from "black-scholes";
import iv from "implied-volatility";
import {daysTillExpiry, getCurrentDate} from './date';

const getHigh = (price, high) => {
  // return ((high-price)*100/price) > 20 ? high : (price + price/5);
  return price + price/3;
}

const getLow = (price, low) => {
  // return ((price-low)*100/price) > 20 ? low : (price - price/5);
  return price - price/3;
}

const getLabels = (quote) => {
  var high = Math.round(getHigh(quote.last, quote.week_52_high));
  var low = Math.round(getLow(quote.last, quote.week_52_low));
  var labels = [];
  for(var i = low; i < high; i++)
    labels.push(i);
  console.log(labels);
  return labels;
}

const round = (num) => {
  return Math.round((num + Number.EPSILON) * 100)/100;
}

const roundOne = (num) => {
  return Math.round((num + Number.EPSILON) * 10)/10;
}

// Function used to obtain data to chart. Calls optionPriceArray()
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
  if(quantity != 0) {
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

const optionPriceArray = (option, quote, date, volChange) => {
  var priceArray = []
  var optionPrice = (option.ask + option.bid)/2; // option price
  var price = 0; // underlying price

  const quantity = Math.abs(option.quantity);
  const high = getHigh(quote.last, quote.week_52_high);
  const low = getLow(quote.last, quote.week_52_low);
  const initial = (option.ask + option.bid)/2;
  const mul = option.position === "short" ? -1 : 1;
  const interval = quote.last * 0.2/100;

  var daysDiff = daysTillExpiry(new Date().toString(), option.expiration_date);
  var vol = iv.getImpliedVolatility(
    optionPrice, quote.last, option.strike, daysDiff/365, 0.05, option.option_type
  ) + volChange/100;

  daysDiff = daysTillExpiry(date, option.expiration_date);
  price = low;
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
  // console.log(priceArray);
  return priceArray;
}
