import React, { useState } from "react";
import {
  Modal,
  Table,
  Row,
  Col
} from "react-bootstrap";
import {
  Button,
  TextField,
  IconButton
} from '@material-ui/core';
import {
  Add,
  Remove,
  
} from '@material-ui/icons';

const Option = props => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
    }, 500);
  };
  const handleShow = () => setShow(true);

  const [quantity, setQuantity] = useState(0);

  const add = () => {
    setShow(false);
    const position = quantity > 0 ? "long" : "short";
    props.onAddPosition(props.index, props.option["option_type"], position, quantity);
    // const quantity = 0;
    setQuantity(0);
  };

  const getColor = () => {
    return props.option.change >= 0 ? "text-success" : "text-danger";
  };

  const setSign = () => {
    return props.option.change > 0 ? "+" : "";
  };

  // const setBackground = () => {
  //   if(props.option.option_type === "put"){
  //     return props.option.strike > props.quote.last ? "#E0EBFD":"white";
  //   }
  //   else{
  //     return props.option.strike > props.quote.last ? "white": "#E0EBFD";
  //   }
  // };

  const setBorder = idx => {
    if(props.option.option_type==="put" && idx === props.layout.length-1) {
      const style = {};
      style.borderRight = props.option.strike > props.quote.last ? "6px solid #3f51b5":"";
      return style;
    }
    else if (props.option.option_type==="call" && idx === 0){
      const style = {};
      style.borderLeft = props.option.strike < props.quote.last ? "10px solid #3f51b5":"";
      return style;
    }
  };

  const displayItem = data => {
    return data ? data : "N/A";
  }

  const addOption = () => {
    setQuantity(quantity + 1);
  }
  const removeOption = () => {
    setQuantity(quantity - 1);
  }

  const changeQuantity = (event, value) => {
    var quantity = Number(event.target.value);
    setQuantity(quantity)
  }

  const setButtonColor = () => {
    if(quantity >= 0)
      return "primary";
    else
      return "secondary";
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
								{setSign()}{props.option.change}
							</h5>
							&nbsp;&nbsp;
							<h5 className={getColor()} style={{ display: 'inline' }}>
								({setSign()}{props.option.change_percentage}%)
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
          <IconButton color="secondary" >
            <Remove onClick={removeOption}/>
          </IconButton>
          <TextField
            size="small"
            value={quantity}
            defaultValue={0}
            onChange={changeQuantity}
            inputProps={{ maxLength: "4px" }}
            label="# of contracts" 
            variant="outlined" 
          />
          <IconButton color="primary">
            <Add onClick={addOption}/>
          </IconButton>
          <Button
            color={setButtonColor()}
            variant="outlined"
            size="small"
            disabled={quantity===0}
            onClick={() => add()}
          >
            {quantity >= 0 ? "Buy" : "Sell"}
          </Button>
          &nbsp;
          <Button 
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
