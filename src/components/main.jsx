import React, { Component } from "react";
import {
  Row,
  Col,
  Container,
  Image
} from 'react-bootstrap';
import {
  Card,
  CardContent,
} from '@material-ui/core';
import Search from './search';
import Quote from './quote';
import OptionChain from './chain/optionChain';
import Analysis from './analysis/analysis';
import NavTabs from './navTabs';
import axios from 'axios';

class Main extends Component {
  state = {
      quantity: 0,
      quote:{},
      positions:[],
      tab: 0, //0 for chain, 1 for analysis page
  }
  handleTickerChange = value => {
    this.getQuote(value.symbol);
    this.setState({ quote:{}, positions:[], tab:0, quantity:0 });
  }

  // Get stock quote. @param symbol: stock symbol (ticker)
  getQuote = (symbol) => {
    this.setState({ quoteLoading: true }, () => {
      const url = 'http://localhost:8000/api/stocks/quote';
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

  handleAddPosition = (option) => {
    var positions = [...this.state.positions];
    var found = false;
    for(var i = 0; i < positions.length; i++) {
      if(positions[i].description === option.description
        && positions[i].position === option.position){
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

  handleRemovePosition= idx => {
    // const position = clone(this.state.positions[idx]);
    // if(position.position === 'long') 
    //   position.quantity = position.quantity - 1;
    // else
    //   position.quantity = position.quantity + 1;

    // var positions = [...this.state.positions];
    // if(position.quantity == 0)
    //   positions.splice(idx, 1);
    // else
    //   positions[idx] = position;
    // this.setState({positions});
    // const positions = clone(this.state.positions);
    const positions = [...this.state.positions];
    positions.splice(idx, 1);
    this.setState({ positions });
  }

  handleChangeTabs = value => {
    if(value != this.state.tab) {
      this.setState({tab:value});
    }
  }

  handleStockQuantityChange = (event, value) => {
    var quantity = Number(event.target.value);
    this.setState({quantity})
  }

  handleAddStock = () => {
    const quantity = this.state.quantity? this.state.quantity + 1 : 1;
    this.setState({quantity});
  }

  handleRemoveStock = () => {
    const quantity = this.state.quantity? this.state.quantity - 1 : -1;
    this.setState({quantity});
  }

  display = () => {
    return this.state.tab === 0 ? "block" : "none";
  }

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
            <Card>
              <CardContent>
                <Quote 
                  quote={this.state.quote} 
                  quantity={this.state.quantity}
                  onStockQuantityChange={this.handleStockQuantityChange}
                  addStock={this.handleAddStock}
                  removeStock={this.handleRemoveStock}
                />
              </CardContent>
            </Card>
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
              <Card>
                <CardContent >
                  <OptionChain 
                    quote={this.state.quote} 
                    positions={this.state.positions}
                    onAddPosition={this.handleAddPosition}
                    onRemovePosition={this.handleRemovePosition} 
                  />  
                </CardContent>
              </Card>
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