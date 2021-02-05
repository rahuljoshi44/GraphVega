import React, { Component, useState } from "react";
import {
  Modal,
  Row,
  Col,
  Table,
  ButtonGroup,
} from 'react-bootstrap';
import {
  Button
} from '@material-ui/core';
import {
  Add,
  Remove,
  ArrowUpward,
  ArrowDownward,
} from '@material-ui/icons';

const EditLayoutModal = props => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      props.onClose();
    }, 500);
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <Button onClick={handleShow} variant="outlined" color="primary">
        Edit Layout
      </Button>

      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        style={{ background: "rgba(0, 0, 0,0.5)" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Layout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col lg={6}>
              <center>
                <h5>Layout options</h5>
              </center>
              <Table size="sm">
                <tbody>
                  {props.layoutOptions.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item}</td>
                        <th style={{ textAlign: "right" }}>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => {
                              props.onAddLayoutItem(index);
                            }}
                          >
                            <Add fontSize="small"/>
                          </Button>
                        </th>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
            <Col lg={6}>
              <center>
                <h5>Current Layout</h5>
              </center>
              <Table size="sm">
                <tbody>
                  {props.layout.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item}</td>
                        <th style={{ textAlign: "right" }}>
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={() => {
                              props.onRemoveLayoutItem(index);
                            }}
                          >
                            <Remove fontSize="small"/>
                          </Button>
                          &nbsp;
                          <ButtonGroup>
                            <Button
                              size="small"
                              onClick={() => {
                                props.onMoveUp(index);
                              }}
                            >
                              <ArrowUpward fontSize="small"/>
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                props.onMoveDown(index);
                              }}
                            >
                              <ArrowDownward fontSize="small"/>
                            </Button>
                          </ButtonGroup>
                        </th>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>
            Close
          </Button>
          &emsp;
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setShow(false);
              props.onSaveLayout();
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditLayoutModal;