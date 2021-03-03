import React, {Component} from 'react';
import {
  Row,
  Col,
} from 'react-bootstrap';
import {
  LinearProgress,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  Select,
  MenuItem,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreOutlined';
import Expiries from './expiries';
import EditLayout from './editLayout';
import OptionTable from './optionTable';
import Positions from './positions';
import IVSkewChart from './ivSkewChart';
import GreeksChart from './greeksChart';
import axios from 'axios';
import clone from 'clone';
import { SERVER_URL } from '../../utils/url';

class OptionChain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      symbol: "",
      expiry:"",
      greeksChart: "calls",
      calls: [],
      puts: [],
      ivSkewData: [],
      callGreeksData: [],
      putGreeksData: [],
      layout: ["bid", "ask", "last"],
      loading: false,
      displayTable: false,
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
      const url = `${SERVER_URL}/api/options/getChain`;
      axios
        .post(url, {
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
          var ivSkewData = [], callGreeksData = [], putGreeksData=[];

          calls.forEach((call, idx) => {
            ivSkewData.push({
              strike: call.strike,
              iv: call.greeks.smv_vol,
            });
            callGreeksData.push({
              strike: call.strike,
              delta: this.round(call.greeks.delta),
              gamma: this.round(call.greeks.gamma),
              theta: this.round(call.greeks.theta),
              vega: this.round(call.greeks.vega),
            });
            putGreeksData.push({
              strike: call.strike,
              delta: this.round(puts[idx].greeks.delta),
              gamma: this.round(puts[idx].greeks.gamma),
              theta: this.round(puts[idx].greeks.theta),
              vega: this.round(puts[idx].greeks.vega),
            })
          })
          // console.log(greeksData);
          this.setState({ 
            puts, 
            calls,
            ivSkewData, 
            callGreeksData,
            putGreeksData,
            loading:false, 
            displayTable: true, 
            expiry, 
            symbol 
          });
        });
    });
  };

  handleLayoutChange = layout => {
    this.setState({layout});
  }
  
  handleAddPosition = (idx, optionType, positionType, quantity) => {
    var option = {};

    // Find option
    if(optionType==="call"){
      option = clone(this.state.calls[idx]);
    }
    else {
      option = clone(this.state.puts[idx]);
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

  handleGreeksChartChange = (event) => {
    const greeksChart = event.target.value;
    this.setState({ greeksChart })
  }
  
  accChange = () => {
    const displayTable = !this.state.displayTable;
    this.setState({ displayTable })
  }

  errorMessage = () => {
    return (
      <Typography variant="body1" gutterBottom class="text-secondary">
        Uh-oh! Looks like you need to select an underlying and an expiration date first.
      </Typography>
    )
  }

  render() {
    return(
      <>
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
        </CardContent>
      </Card>
      <br />
      <Accordion expanded={this.state.displayTable} onChange={this.accChange} >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="h6" display="block" gutterBottom>
            Option Table 
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid sm={12}>
              {!this.state.calls[0] ? this.errorMessage() :  
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
              }
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="h6" display="block" gutterBottom>
            Implied Volatility Skew
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
          {!this.state.calls[0] ? this.errorMessage() :
            <>
              <Grid item xs={1}></Grid>
              <Grid item sm={11}>
                <center>
                  <h6>IV skew for&nbsp;
                    <div style={{color:"royalblue", display:"inline"}}>
                      {this.state.symbol} {this.state.expiry} 
                    </div>
                    &nbsp;expiry option chain</h6>
                </center>
                <IVSkewChart data={this.state.ivSkewData}/>
              </Grid>
            </>
          }
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="h6" display="block" gutterBottom>
            Greeks
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid item sm={4}></Grid>
            <Grid item sm={4}>
              {!this.state.calls[0]? "" : 
              <center>
                <Select
                  value={this.state.greeksChart}
                  onChange={this.handleGreeksChartChange}
                >
                  <MenuItem value={"calls"}>calls</MenuItem>
                  <MenuItem value={"puts"}>puts</MenuItem>
                </Select>
              </center>
              }
            </Grid>
            <Grid item sm={4}></Grid>
            {!this.state.calls[0] ? this.errorMessage() :
              <>
                <Grid item sm={1}></Grid>
                <Grid item sm={10}>
                  <br />
                  <center>
                    <h6>Greeks for&nbsp;
                      <div style={{color:"royalblue", display:"inline"}}>
                        {this.state.symbol} {this.state.expiry} 
                      </div>
                      &nbsp;expiry option chain (rounded to 2 places)</h6>
                  </center>
                  <GreeksChart
                    data={this.state.greeksChart === "calls" ? 
                      this.state.callGreeksData :
                      this.state.putGreeksData}
                  />
                </Grid>
              </>
            }
          </Grid>
        </AccordionDetails>
      </Accordion>
      <br />
      </>
    )
  }
}

export default OptionChain;