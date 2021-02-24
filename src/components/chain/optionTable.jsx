import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Option from "./option";

const OptionTable = props => {
  return (
    <Row>
      <Col lg={{span:11, offset:1}}>
        <Row>
          <Col lg={{ span: 1, offset: 2 }}>
            <h5 style={{display:"inline"}}>Calls</h5>
          </Col>
          <Col lg={{span:2, offset:2}}>
            <b>{props.expiry}</b>
          </Col>
          <Col lg={{ span: 1, offset: 1}}>
            <h5 style={{display:"inline"}}>Puts</h5>
          </Col>
        </Row>
      
        <Row className="option-tables">
          <Col lg={{ span: 5, offset:0 }}>
            <Table hover bordered size="sm" responsive>
              <thead>
                <tr style={{ textAlign: "center" }}>
                  {props.layout.map((item, idx) => {
                    return <th key={idx}>{item}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {props.calls.map((option, index) => (
                  <Option
                    option={option}
                    layout={props.layout}
                    index={index}
                    quote={props.quote}
                    onAddPosition={props.onAddPosition}
                  />
                ))}
              </tbody>
            </Table>
          </Col>
          <Col lg={1}>
            <Table size="sm">
              <thead>
                <tr style={{textAlign:'center'}}>
                  <th>Strike</th>
                </tr>
              </thead>
              <tbody>
                {props.calls.map(option => (
                  <tr style={{textAlign:'center'}}>
                    <td>{option.strike}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col lg={5}>
            <Table hover bordered size="sm" responsive>
              <thead>
                <tr style={{ textAlign: "center" }}>
                  {props.layout.map((item, idx) => {
                    return <th key={idx}>{item}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {props.puts.map((option, index) => (
                  <Option
                    option={option}
                    layout={props.layout}
                    index={index}
                    quote={props.quote}
                    onAddPosition={props.onAddPosition}
                  />
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default OptionTable;
