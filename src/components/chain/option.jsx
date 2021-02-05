import React, { useState } from "react";
import {
  Modal,
  Table,
  Row,
  Col
} from "react-bootstrap";
import {
  Button
} from '@material-ui/core';
import {
  Add,
  Remove,
} from '@material-ui/icons';

const Option = props => {
  // const [show, setShow] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      // props.onClose();
    }, 500);
  };
  const handleShow = () => setShow(true);

  const add = position => {
    setShow(false);
    props.onAddPosition(props.index, props.option["option_type"], position);
  };

  const setAlign = () => {
    return props.option["option_type"] === "put" ? "right" : "left";
  };

  const getColor = () => {
    return props.option.change >= 0 ? "text-success" : "text-danger";
  };

  const setSign = () => {
    return props.option.change > 0 ? "+" : "";
  };

  const setBackground = () => {
    if(props.option.option_type === "put"){
      return props.option.strike > props.quote.last ? "#E0EBFD":"white";
    }
    else{
      return props.option.strike > props.quote.last ? "white": "#E0EBFD";
    }
  };

  const setBorder = idx => {
    if(props.option.option_type==="put" && idx == props.layout.length-1) {
      const style = {};
      style.borderRight = props.option.strike > props.quote.last ? "6px solid #3f51b5":"";
      return style;
    }
    else if (props.option.option_type==="call" && idx == 0){
      const style = {};
      style.borderLeft = props.option.strike < props.quote.last ? "10px solid #3f51b5":"";
      return style;
    }
  };

  const displayItem = data => {
    return data ? data : "N/A";
  }

  return (
    <>
      <tr style={{ textAlign: 'center'}} onClick={handleShow}>
        {props.layout.map((item, index) => {
          return <td style={setBorder(index)}>{displayItem(props.option[item.toString()])}</td>;
        })}
      </tr>

      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        style={{ background: "rgba(0, 0, 0,0.5)" }}
      >
        <Modal.Body closeButton>

          <Row>
						<Col
							lg={{ span: 12 }}
							style={{ clear: 'both', textAlign: 'center' }}
						>
							<h4 style={{ display: 'inline' }}>
								<b>{props.option.description}</b>
							</h4>
							<br />
							<h4 style={{ display: 'inline' }}>{props.option.last}</h4>
							&nbsp;&nbsp;
							<h5 className={getColor()} style={{ display: 'inline' }}>
								{props.option.change}
							</h5>
							&nbsp;&nbsp;
							<h5 className={getColor()} style={{ display: 'inline' }}>
								({props.option.change_percentage}%)
							</h5>
						</Col>
					</Row>
          <br />
          <Row style={{ fontSize: '0.8rem' }}>
						<Col lg={{ span: 5, offset: 1 }}>
							<Table>
								<tbody>
                  <tr>
										<td style={{ textAlign: 'left' }}>Bid</td>
										<td style={{ textAlign: 'right' }}>
											<b>{props.option.bid}</b>
										</td>
									</tr>
									<tr>
										<td style={{ textAlign: 'left' }}>Ask</td>
										<td style={{ textAlign: 'right' }}>
											<b>{props.option.ask}</b>
										</td>
									</tr>
                  <tr>
										<td style={{ textAlign: 'left' }}>Open</td>
										<td style={{ textAlign: 'right' }}>
											<b>{props.option.open}</b>
										</td>
									</tr>
									<tr>
										<td style={{ textAlign: 'left' }}>Previous Close</td>
										<td style={{ textAlign: 'right' }}>
											<b>{props.option.prevclose}</b>
										</td>
									</tr>
                  <tr>
										<td style={{ textAlign: 'left' }}>Open Interest</td>
										<td style={{ textAlign: 'right' }}>
											<b>{props.option.open_interest}</b>
										</td>
									</tr>
								</tbody>
							</Table>
						</Col>

						<Col lg={{ span: 5 }}>
							<Table>
								<tbody>
									<tr>
										<td style={{ textAlign: 'left' }}>Implied Volatility</td>
										<td style={{ textAlign: 'right' }}>
											<b>{props.option.greeks.mid_iv}</b>
										</td>
									</tr>
									<tr>
										<td style={{ textAlign: 'left' }}>Delta</td>
										<td style={{ textAlign: 'right' }}>
											<b> {props.option.greeks.delta}</b>
										</td>
									</tr>
									<tr>
										<td style={{ textAlign: 'left' }}>Gamma</td>
										<td style={{ textAlign: 'right' }}>
											<b>{props.option.greeks.gamma}</b>
										</td>
									</tr>
									<tr>
										<td style={{ textAlign: 'left' }}>Theta</td>
										<td style={{ textAlign: 'right' }}>
											<b> {props.option.greeks.theta}</b>
										</td>
									</tr>
                  <tr>
										<td style={{ textAlign: 'left' }}>Vega</td>
										<td style={{ textAlign: 'right' }}>
											<b> {props.option.greeks.vega}</b>
										</td>
									</tr>
								</tbody>
							</Table>
						</Col>
					</Row>
        </Modal.Body>





        <Modal.Footer>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => {
              add("long");
            }}
          >
            <Add fontSize="small"/>
            <b>Long</b>
          </Button>
          &nbsp;
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => {
              add("short");
            }}
          >
            <Remove fontSize="small"/>
            <b>Short</b>
          </Button>
          &nbsp;
          <Button 
            color="secondary" 
            onClick={handleClose} 
            size="small">
            &nbsp;
            <b>Close</b>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Option;
