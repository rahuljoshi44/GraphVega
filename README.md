## About The Project
GraphVega is an open sourced options analytics platform that analyses and projects the P/L of a multi-legged options position with variation of the stock price under changes in volatility and days till expiration, using a black-scholes simulation.  

It is designed with a goal to provide a simple and intuitive interface to analyze options, while also providing developers with the flexibility to add their own custom features.

## Getting Started
To get GraphVega up and running on your local machine, follow these steps:
1. Clone the repository
```
https://github.com/rahuljoshi44/GraphVega.git
```
2. Switch to the root directory of the project and install the dependencies
```
npm install
```
3. Get a free API Key (for sandbox) from Tradier [here](https://developer.tradier.com/user/sign_up?_ga=2.9691381.1305307848.1613100396-1783872143.1609733953). This project uses tradier's market data API for options and stock prices.
4. In the root directory create a `.env` file
5. Enter your API key in `.env`
```
TRADIER_API_KEY = YOUR_API_KEY_HERE
```
6. Run the application.
```
npm start
```
