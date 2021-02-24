import React, { Component } from "react";
import {
	TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import { SERVER_URL } from '../../utils/url';

class Expiries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expirations: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.symbol !== prevProps.symbol) {
      this.getOptionExpiries(this.props.symbol);
    }
  }

  getOptionExpiries = symbol => {
    if(symbol) {
      axios
        .post(`${SERVER_URL}/api/options/expiries`, {
          symbol: symbol
        })
        .then((res) => {
          const expirations = res.data.expirations.date;
          this.setState({ expirations });
        })
        .catch((err) => { 
          console.log(err)
        })
    }
  };

  // triggers every time a user selects an option from suggestions
	valueChange = (event, value) => {
		if (!(value === null)) {
      console.log(value);
      this.props.onExpiryChange(value);
    }
  };

  render() {
    return(
      <Autocomplete
        noOptionsText={"Select an underlying from the search first!"}
        options={this.state.expirations}
        getOptionLabel={(option) => option}
        onChange={this.valueChange}
        renderInput={(params) => <TextField {...params} label="Select expiration" margin="normal" />}
      />
    )
  }
}

export default Expiries;