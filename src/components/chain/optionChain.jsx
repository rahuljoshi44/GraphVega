import React, {Component} from 'react';
import {
  Row,
  Col,
} from 'react-bootstrap';
import {
  LinearProgress,
  CircularProgress,
  Card,
  CardContent,
} from '@material-ui/core';
import Expiries from './expiries';
import EditLayout from './editLayout';
import OptionTable from './optionTable';
import Positions from './positions';
import axios from 'axios';
import clone from 'clone';

class OptionChain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      symbol: "",
      expiry:"",
      calls: [],
      puts: [],
      layout: ["bid", "ask", "last"],
      loading: false,
    };
  }



  handleExpiryChange = date => {
    this.getOptionChain(this.props.quote.symbol, date);
  }

  // Rounds number to 2 decimal points
  round = num => {
    return Math.round((num + Number.EPSILON) * 100)/100;
  }

  getOptionChain = (symbol, expiry) => {
    this.setState({ loading: true }, () => {
      axios
        .post("http://localhost:8000/api/options/getChain", {
          symbol: symbol,
          expiry: expiry
        })
        .then(res => {
          const options = res.data.options.option;
          const puts = options.filter(option => {
            return option.option_type === "put";
          });
          const calls = options.filter(option => {
            return option.option_type === "call";
          });
          
          this.setState({ puts, calls, loading:false, expiry, symbol });
        });
    });
  };

  handleLayoutChange = layout => {
    this.setState({layout});
  }
  
  handleAddPosition = (idx, optionType, positionType, quantity) => {
    var option = {};
    var options = [];

    // Find option
    if(optionType==="call"){
      option = clone(this.state.calls[idx]);
      options = this.state.calls;
    }
    else {
      option = clone(this.state.puts[idx]);
      options = this.state.puts;
    }

    // Set position -> Long/Short
    option.position = positionType;
    option.quantity = quantity;

    // Set expiry time
    var dateTime = new Date(option.expiration_date);
    dateTime.setHours(21,0,0,0);
    dateTime.setDate(dateTime.getDate() + 1);
    option.expiration_date = dateTime.toString();
    
    this.props.onAddPosition(option);
  }

  render() {
    return(
      <Card>
        {this.state.loading ? <LinearProgress /> : ""}
        <CardContent>
        <Row>
          <Col sm={{span:3}}>
            <Expiries 
              symbol={this.props.quote.symbol} 
              onExpiryChange={this.handleExpiryChange}
            />
          </Col>
          <Col sm={{span:2, offset:5}}>
            <EditLayout onLayoutChange={this.handleLayoutChange}/>
          </Col>
          <Col sm={{span:2}}>
            <Positions 
              positions={this.props.positions}
              onRemovePosition={this.props.onRemovePosition}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={{span:12}}>
            <OptionTable
              layout={this.state.layout}
              onAddToFlask={this.handleAddToFlask}
              calls={this.state.calls}
              puts={this.state.puts}
              symbol={this.state.symbol}
              expiry={this.state.expiry}
              quote={this.props.quote}
              onAddPosition={this.handleAddPosition}
            />
          </Col>
        </Row>
        </CardContent>
      </Card>
    )
  }
}

export default OptionChain;