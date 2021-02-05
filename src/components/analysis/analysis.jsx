import React, {Component } from 'react';
import {
  Row,
  Col,
} from 'react-bootstrap';
import {
  Slider,
  Card,
  CardContent,
} from '@material-ui/core';
import {
  avgVolatility,
  netProfitArray,
} from "../../utils/bsm";
import {
  daysTillExpiry,
  getCurrentDate,
  getMaxDate,
} from "../../utils/date";
import LineChart from './lineChart';
import Positions from './positions';
import ReplayIcon from '@material-ui/icons/Replay';


class Analysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateNum: 0,
      maxDateNum: 0,
      date: "",
      originalIV: 0,
      iv: 0,
      ivChange: 0,
      chartData: [],
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props !== prevProps) {
      console.log("Calculating...")
      const originalIV = avgVolatility(this.props.positions, this.props.quote) * 100;
      var date = new Date();
      date.setHours(21,0,0,0);
      date = date.toString();
      const prices = netProfitArray(
        this.props.positions, 
        this.props.quote,
        this.props.quantity, 
        date, 
      0);
      const maxDate = getMaxDate(this.props.positions.map(option => option.expiration_date));
      const maxDateNum = Math.ceil(daysTillExpiry(date, maxDate));
      var chartData = [];
      prices.forEach(obj => {
        chartData.push({
          label: obj.underlying,
          profit: obj.profit,
        })
      })
      date = getCurrentDate();
      this.setState({ chartData, originalIV, iv:originalIV, maxDateNum, date, ivChange:0 });
    }
  }

  setChartData = (arr) => {
    var chartData = [];
    arr.forEach(obj => {
      chartData.push({
        label: obj.underlying,
        profit: obj.profit,
      })
    })
    return chartData;
  }

  handleIVChange = (event, newIV) => {
    var date = new Date();
    date.setDate(date.getDate() + this.state.dateNum);
    const ivChange = newIV - this.state.originalIV;
    const prices = netProfitArray(
      this.props.positions, 
      this.props.quote,
      this.props.quantity,
      date.toString(), 
      ivChange/this.props.positions.length
    );
    const chartData = this.setChartData(prices);
    this.setState({ iv:newIV, ivChange, chartData });
  }

  handleDateChange = (event, dateNum) => {
    var date = new Date();
    date.setDate(date.getDate() + dateNum);
    const dateString = date.getMonth() + 1
     + '-' + date.getDate() + '-' + date.getFullYear();
    const prices = netProfitArray(
      this.props.positions, 
      this.props.quote, 
      this.props.quantity,
      date.toString(), 
      this.state.ivChange/this.props.positions.length
    );
    const chartData = this.setChartData(prices);
    this.setState({dateNum, date:dateString, chartData})
  }

  render() {
    return(
      <>
        <Positions positions={this.props.positions} quantity={this.props.quantity}/>
        <br />
        <Row>
          <Col sm={{span:5, offset:1}}>
            <Card>
              <CardContent>
                <h6>
                  Volatility: {this.state.iv}% (avg.)
                </h6>
                <Slider 
                  defaultValue={this.state.originalIV}
                  value={this.state.iv}
                  onChange={this.handleIVChange}
                  min={0}
                  max={150}
                />
              </CardContent>
            </Card>
          </Col>
          <Col sm={{span:5}}>
            <Card>
              <CardContent>
                <h6>
                  Days till last option expiry: {this.state.maxDateNum - this.state.dateNum} ({this.state.date})
                </h6>
                <Slider 
                  value={this.state.dateNum}
                  onChange={this.handleDateChange}
                  min={0}
                  max={this.state.maxDateNum}
                />
              </CardContent>
            </Card>
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm={{span:12}}>
            <LineChart data={this.state.chartData}/>
          </Col>
        </Row>
      </>
    )
  }
}

export default Analysis;