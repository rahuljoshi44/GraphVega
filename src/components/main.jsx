import React, { Component } from "react";
import {
  Row,
  Col,
  Container,
} from 'react-bootstrap';
import Search from './search';
import Quote from './quote';
import OptionChain from './chain/optionChain';
import Analysis from './analysis/analysis';
import NavTabs from './navTabs';
import QuoteSkeleton from './skeletons/quoteSkeleton';
import axios from 'axios';
import { SERVER_URL } from '../utils/url';

class Main extends Component {
  state = {
      quantity: 0,
      quote:{},
      positions:[],
      tab: 0, //0 for chain, 1 for analysis page
  }
  /**
   * Triggered when new stock is selected from search bar.
   * @param {Object} value: Object returned from search bar 
   */
  handleTickerChange = value => {
    this.getQuote(value.symbol);
    this.setState({ quote:{}, positions:[], tab:0, quantity:0 });
  }

  /**
   * Function used to get the quote of a stock. Called when new stock
   * is selected from search bar.
   * @param {String} symbol: ticker of the stock 
   */
  getQuote = (symbol) => {
    this.setState({ quoteLoading: true }, () => {
      const url = `${SERVER_URL}/api/stocks/quote`;
      console.log(url);
      axios
        .post(url, {
          ticker: symbol,
        })
        .then((res) => {
          const quote = res.data.quotes.quote;
          this.setState({ quote, quoteLoading: false });
        });
    });
  };
  

  /**
   * Function to add an option to the positions[] object
   * @param {Object} option Options object to add to positions[]
   */
  handleAddPosition = (option) => {
    var positions = [...this.state.positions];
    var found = false;
    for(var i = 0; i < positions.length; i++) {
      if(positions[i].description === option.description){
        positions[i].quantity = positions[i].quantity + option.quantity;
        found = true;
        break;
      }
    }
    if(!found){
      positions.push(option);
    }
    this.setState({positions});
  }

  /**
   * Function to remove an options from positions[]
   * @param {Integer} idx remove object at index 'idx' from positions[]
   */
  handleRemovePosition= idx => {
    const positions = [...this.state.positions];
    positions.splice(idx, 1);
    this.setState({ positions });
  }

  /**
   * Function handles switching tabs between OptionChain and Analysis
   * @param {Integer} value: sets tab to value  
   */
  handleChangeTabs = value => {
    if(value !== this.state.tab) {
      this.setState({tab:value});
    }
  }

  /**
   * Adds quantity to/from stock.
   * @param {Object} event: triggered by adding/removing stock  
   */
  handleStockQuantityChange = (event) => {
    var quantity = Number(event.target.value);
    this.setState({quantity})
  }

  // Adds 1 stock (increments quantity by 1.) 
  handleAddStock = () => {
    const quantity = this.state.quantity? this.state.quantity + 1 : 1;
    this.setState({quantity});
  }

  // Removes 1 stock (decrements quantity by 1.) 
  handleRemoveStock = () => {
    const quantity = this.state.quantity? this.state.quantity - 1 : -1;
    this.setState({quantity});
  }

  // decides whether OptionChain component will be displayed or not
  display = () => {
    return this.state.tab === 0 ? "block" : "none";
  }

  // decides whether Analysis component is displayed or not.
  display2 = () => {
    return this.state.tab === 1? "block" : "none";
  }
  
  render() {
    return(
      <>
      <Container>
        <Row>
          <Col sm={{span:4}}>
            <h4 style={{marginTop:'10px'}}>
              GraphVega
            </h4>
          </Col>
          <Col lg={{ span:4, offset:4 }}>
              <Search onValueChange={this.handleTickerChange}/>
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm={{span:12}}>
            {this.state.quote.symbol ? 
            <Quote 
            quote={this.state.quote} 
            quantity={this.state.quantity}
            onStockQuantityChange={this.handleStockQuantityChange}
            addStock={this.handleAddStock}
            removeStock={this.handleRemoveStock}
          />: <QuoteSkeleton />}
            
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm={{span:4, offset:4}}>
            <center>
              <NavTabs onChangeTabs={this.handleChangeTabs}/>
            </center>
          </Col>
        </Row>

        <br />
        <Row>
          <Col sm={{span:12}}>
            <div style={{display:this.display()}}>
              <OptionChain 
                quote={this.state.quote} 
                positions={this.state.positions}
                onAddPosition={this.handleAddPosition}
                onRemovePosition={this.handleRemovePosition} 
              />  
            </div>
            {this.state.positions[0]?
            <div style={{display:this.display2()}}>
              <Analysis 
                positions={this.state.positions}
                quote={this.state.quote}
                quantity={this.state.quantity}
              />
            </div>
            : ""
            }  
          </Col>
        </Row>
      </Container>
      </>
    )
  }
}

export default Main;