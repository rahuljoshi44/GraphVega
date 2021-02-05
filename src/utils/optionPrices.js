import clone from 'clone';
import bs from "black-scholes";
import iv from "implied-volatility";

export const getHigh = (price, high) => {
  // return ((high-price)*100/price) > 20 ? high : (price + price/5);
  return Math.floor(price + price/5);
}

export const getLow = (price, low) => {
  // return ((price-low)*100/price) > 20 ? low : (price - price/5);
  return Math.floor(price - price/5);
}

export const getLabels = (quote) => {
  // var high = Math.round(getHigh(quote.last, quote.week_52_high));
  // var low = Math.round(getLow(quote.last, quote.week_52_low));
  const price = Math.floor(quote.last);
  const high = Math.floor(price + price/5);
  const low = Math.floor(price - price/5);
  var labels = [];
  for(var i = low; i < high; i++)
    labels.push(i);
  console.log(labels);
  return labels;
}

export const round = (num) => {
  return Math.round((num + Number.EPSILON) * 100)/100;
}

export const netProfitArray = (positions, quote) => {
  var netProfit = clone(optionPriceArray(positions[0], quote));
  var i = 1;
  for(i=1; i<positions.length; i++) {
    console.log("Adding positions")
    var array = optionPriceArray(positions[i], quote);
    console.log(array);
    var j = 0;
    for(j=0; j<netProfit.length; j++) {
      netProfit[j].price = round(netProfit[j].price + array[j].price);
      netProfit[j].profit = round(netProfit[j].profit + array[j].profit);
    }
  }
  console.log("TOTAL", netProfit);
  return netProfit;
}

export const optionPriceArray = (option, quote) => {
  if(option.option_type === "call") {
    return callPriceArray(option, quote);
  }
  else {
    return putPriceArray(option, quote);
  }
}

// Function to estimate gamma of an option
// option -> standard options object
// price -> price to predict gamma at
// last -> current price of stock
// option has a gamma 'g' when stock is at 'last'. What is its
// gamma when stock is at 'price'? 
export const predictGamma = (option, price, last) => {
  const perc = (option.strike - price)/price;
  const equivPrice = last + perc * last;
  var gamma;
  if(equivPrice < (0.80 * last) || equivPrice > (1.2 * last))
    gamma = 0;
  else if(equivPrice < (0.87 * last) || equivPrice > (1.13 * last))
    gamma = 0.01;
  else {
    const model = option.gammaModel;
    const terms = model.getTerms();
    gamma = round(model.predictY(terms, equivPrice));
    if(gamma < 0)
      gamma = 0.01;
  }
  return gamma;
}

// Returns an array of option prices for a call option as stock 
// moves. short is correct
export const callPriceArray = (option, quote) => {
  console.log("Call option");
  console.log("Volatility given", option.greeks.mid_iv, option.greeks.smv_vol);
  var priceIncrArray = []; // array of option prices when option increases
  var priceDecrArray = []; // array of option prices when option decreases
  const quantity = Math.abs(option.quantity);
  var delta = option.greeks.delta;
  var gamma = option.greeks.gamma;
  var optionPrice = (option.ask + option.bid)/2;
  var price = Math.floor(quote.last);
  const initial = round(optionPrice); 
  var vol = iv.getImpliedVolatility(optionPrice, price, option.strike, 14/365, 0.0015, "call");
  console.log("BSM vol", vol);
  var bsm = bs.blackScholes(price, option.strike, 14/365, vol, 0.05,"call");
  console.log("BSM price", bsm);
  console.log("Actual", optionPrice);
  const high = getHigh(price, quote.week_52_high);
  const low = getLow(price, quote.week_52_low);

  console.log(high, price, low);
  console.log(quantity);

  const mul = option.position === 'short' ? -1 : 1;
  console.log("Position: ", mul);
  priceIncrArray.push({
    underlying: price,
    price: mul * round(optionPrice * quantity),
    profit: 0,
  });

  while(price < high - 1) {
    price += 1;
    optionPrice += delta;
    delta += gamma;
    if(delta > 0.99)
      delta = 0.99;
    gamma = predictGamma(option, price, initial);
    // console.log(delta);
    priceIncrArray.push({
      underlying: price,
      price: mul * round(optionPrice * quantity),
      profit: mul * round((optionPrice - initial) * quantity),
    });
  }
  // console.log("prices:", priceIncrArray);

  price = Math.floor(quote.last);
  optionPrice = (option.ask + option.bid)/2;
  gamma = option.greeks.gamma;
  delta = option.greeks.delta;
  
  while(price > low) {
    if(optionPrice <= 0.01) {
      optionPrice = 0.01;
    }
    else {
      optionPrice -= delta;
      delta -= gamma;
      if(delta < 0)
        delta = 0;
      gamma = predictGamma(option, price, initial);
      if(optionPrice <= 0.01) {
        optionPrice = 0.01;
      }
    }
    price -= 1;
    priceDecrArray.push({
      underlying: price,
      price: mul * round(optionPrice * quantity),
      profit: mul * round((optionPrice - initial) * quantity),
    });
  }
  // console.log(price);
  // console.log("prices", priceDecrArray);

  var priceArray = priceDecrArray.reverse().concat(priceIncrArray);
  console.log(option.description, priceArray);
  return priceArray;
}

// returns array of option prices for a put when stock moves 
// within specified range (+- 30%)
export const putPriceArray = (option, quote) => {
  console.log("Put option")
  var priceIncrArray = [];
  var priceDecrArray = [];

  const quantity = Math.abs(option.quantity);

  const high = getHigh(quote.last, quote.week_52_high);
  const low = getLow(quote.last, quote.week_52_low);
  
  console.log(high, quote.last, low);
  var delta = option.greeks.delta;
  var gamma = option.greeks.gamma;
  var optionPrice = (option.ask + option.bid)/2;
  var price = Math.floor(quote.last);

  const initial = round(optionPrice); // initial value of position
  // var profit = 0; 
  const mul = option.position === "short" ? -1 : 1;

  priceIncrArray.push({
    underlying: price,
    price: round(optionPrice * quantity),
    profit: 0,
  });

  while(price < high) {
    if(optionPrice <= 0.01) {
      optionPrice = 0.01;
    }
    else {
      optionPrice += delta;
      delta += gamma;
      if(delta > 0)
        delta = -0.01;
      gamma = predictGamma(option, price, initial);
      if(optionPrice <= 0.01)
        optionPrice = 0.01;
    }
    price = price + 1;
    priceIncrArray.push({
      underlying: price,
      price: round(optionPrice * quantity),
      profit: mul * round((optionPrice - initial) * quantity),
    });
  }
  // console.log("prices:", priceIncrArray);

  price = Math.floor(quote.last - 1);
  optionPrice = (option.ask + option.bid)/2;
  gamma = option.greeks.gamma;
  delta = option.greeks.delta;
  
  while(price > low) {
    optionPrice -= delta;
    delta -= gamma;
    if(delta < -0.99)
      delta = -0.99;
    gamma = predictGamma(option, price, initial);
    price = price - 1;
    priceDecrArray.push({
      underlying: price,
      price: round(optionPrice * quantity),
      profit: mul * round((optionPrice - initial) * quantity),
    });
  }

  // console.log("prices", priceDecrArray);

  var priceArray = priceDecrArray.reverse().concat(priceIncrArray);
  console.log(option.description, priceArray);
  return priceArray;
}

