import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  ResponsiveContainer
} from "recharts";
import {
  Card,
  CardContent
} from '@material-ui/core';
import {
  Row,
  Col
} from "react-bootstrap";


const LineChart = (props) => {

  const data = props.data ? props.data : [];

  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((i) => i.profit));
    const dataMin = Math.min(...data.map((i) => i.profit));

    if (dataMax <= 0){
      return 0
    }
    else if (dataMin >= 0){
      return 1
    }
    else{
      return dataMax / (dataMax - dataMin);
    }
  }
  
  const off = gradientOffset();

  return(
    <Card>
      <CardContent>
        <Row>
          <Col sm={{span:12}}>
            <h5>
              Profit & Loss Chart
            </h5>
          </Col>
        </Row>
        
        <Row>
          <Col sm={{span:12}} >
            <AreaChart
              height={600}
              width={900}
              data={data}
              margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="label">
                <Label value="Stock price" offset={0} position="insideBottom"/>
              </XAxis>
              <YAxis label={{ value: 'Profit', angle: -90, position: 'insideLeft', textAnchor: 'middle' }}/>
              <Tooltip/>
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={off} stopColor="green" stopOpacity={1}/>
                  <stop offset={off} stopColor="red" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="profit" stroke="#000" fill="url(#splitColor)" />
            </AreaChart>
          </Col>
        </Row>
      </CardContent>
    </Card>
  )
}

export default LineChart;