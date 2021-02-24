import React from 'react';
import {
  Row,
  Col
} from "react-bootstrap";
import {
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Typography
} from '@material-ui/core';

const chipStyle = type => {
  return type==="call"?"primary":"secondary";
}

const expiry = date => {
  var d = new Date(date);
  var dd = String(d.getDate()).padStart(2, '0');
  var mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = d.getFullYear();
  const today = mm + '-' + dd + '-' + yyyy;
  return today;
}
const roundOne = (num) => {
  return Math.round((num + Number.EPSILON) * 10)/10;
}
const Positions = props => {
  return (
    <Row>
      <Col sm={{span:12}}>
        <Card>
          <CardContent>
          <Typography variant="h6" display="block" gutterBottom>
            Positions
          </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>TYPE</TableCell>
                  <TableCell>QTY</TableCell>
                  <TableCell>MARK</TableCell>
                  <TableCell>STRIKE</TableCell>
                  <TableCell>EXPIRY</TableCell>
                  <TableCell>IMP VOL</TableCell>
                  <TableCell>VEGA</TableCell>
                  <TableCell>THETA</TableCell>
                  <TableCell>DELTA</TableCell>
                  <TableCell>GAMMA</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.positions.map((option) => (
                  <TableRow>
                    <TableCell>
                      <Chip label={option.option_type} color={chipStyle(option.option_type)}/>
                    </TableCell>
                    <TableCell>{option.quantity}</TableCell>
                    <TableCell>{(option.bid + option.ask)/2}</TableCell>
                    <TableCell>{option.strike}</TableCell>
                    <TableCell>{expiry(option.expiration_date)}</TableCell>
                    <TableCell>{roundOne(option.greeks.smv_vol*100)}%</TableCell>
                    <TableCell>{option.greeks.vega}</TableCell>
                    <TableCell>{option.greeks.theta}</TableCell>
                    <TableCell>{option.greeks.delta}</TableCell>
                    <TableCell>{option.greeks.gamma}</TableCell>
                  </TableRow>
                ))}
                {(props.quantity && props.quantity !== 0) ? 
                  <TableRow>
                    <TableCell>
                      <Chip label={"shares"} />
                    </TableCell>
                    <TableCell>{props.quantity}</TableCell>
                    <TableCell>{(props.quote.ask + props.quote.bid)/2}</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>{props.quantity}</TableCell>
                    <TableCell>--</TableCell>
                  </TableRow>
                : ""
                }
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Col>
    </Row>
  )
}

export default Positions;