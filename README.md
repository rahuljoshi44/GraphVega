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
## Usage
1. After launching the app, type in the name of a company in the search bar and select the appropriate suggestion.
2. Select an expiration date for the options chain
3. After the option chain loads, add your options positions by clicking on the rows of the table.
4. Switch to the analysis tab.
5. Observe the P/L chart and adjust the implied volatility and days till expiry with the sliders as you like.

## Code structure
Broadly, the project is divided into the front end and the back end.
 - All frontend files are stored in the `src` directory.
 - Backend files are stored in `server`. These are used primarily for making API calls to for market data.
 
There are three main front end components
 - `src/components/main.jsx` is the root component that uses `optionChain.jsx` and `analysis.jsx` 
 - `src/components/chain/optionChain.jsx` is the base component for all 'Option Chain' tab
    - All files related to the option chain tab is stored under `src/components/chain`
 - `src/components/analysis/analysis.jsx` is the base component for the 'Analysis' tab
    - All files related to the analysis tab are stored under `src/components/analysis`
  
## Built With
- [React.js](https://reactjs.org/) - Front end library
- [Node.js](https://nodejs.org/en/) - Runtime environment for JS
- [Express.js](https://expressjs.com/) - Web framework for NodeJS
- [Material-UI](https://material-ui.com/) - Front end component library
- [react-bootstrap](https://react-bootstrap.github.io/) - Front end component library
- [recharts](https://recharts.org/en-US/) - Charting library

## Authors
- [Rahul Joshi](https://www.linkedin.com/in/rahuljoshi4/)

## License
GraphVega is distributed under the MIT license. See `LICENSE.md` for more information.

## Contact
Rahul Joshi - rjoshi9@umd.edu

Feel free to contact me regarding any concerns about the app.

## Acknowledgements
Thanks to [Tradier](https://tradier.com/) for the market data used on the platform.
