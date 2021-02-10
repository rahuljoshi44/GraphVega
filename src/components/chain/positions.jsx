import React, { useState } from "react";
import {
  Modal,
  Table,
} from "react-bootstrap";
import {
  Button,
  Badge,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';

const Positions = props => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const displayQuantity = index => {
    return props.positions[index].position === "long" ? (
      <div className="text-success">+{props.positions[index].quantity}</div>
    ) : (
      <div className="text-danger">{props.positions[index].quantity}</div>
    );
  };
  return (
    <>
      <Badge badgeContent={props.positions.length} color="secondary">
        <Button onClick={handleShow} variant="contained" color="primary">
          Positions
        </Button>
      </Badge>

      <Modal
        show={show}
        onHide={handleClose}
        style={{ background: "rgba(0, 0, 0,0.5)" }}
      >
        <Modal.Body>
          <h4>
            <b>Positions</b>
          </h4>
          <br />
          {props.positions[0]?
            ""
            :<div className="text-secondary">Looks like you have not added any positions yet! </div>
          }
          <Table>
            {props.positions.map((option, index) => {
              return (
                <tr>
                  <th>
                    {displayQuantity(index)}
                  </th>
                  <th>
                    {option["description"]}
                  </th>
                  <th>
                    <Button
                      size="small"
                      // variant="outlined"
                      color="secondary"
                      onClick={() => {
                        props.onRemovePosition(index);
                      }}
                    >
                      <ClearIcon fontSize="small"/>  Remove 
                    </Button>
                  </th>
                </tr>
              );
            })}
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Positions;
