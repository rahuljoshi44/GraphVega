import React, { Component } from "react";
import {
	TextField,
	CircularProgress
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import axios from 'axios';

class Search extends Component {
    constructor(props) {
      super(props);
      this.state = {
        options: [],
        value: {},
        loading: false,
      };
	  }

	// triggers every time a user changes the input value
	handleInputValueChange = (event, value) => {
    const url = 'http://localhost:8000/api/stocks/search';
    //Work in progress
    /*
    var url = 'http://localhost:8000/api/stocks/';
    var regExp = /\([^)]*\)|\[[^\]]*\]/g;  //TODO: simplify regex to remove [] support
    var matchTest = value.match(regExp);
    if (!!matchTest) {
      url += "lookup";
      value = value.replace(/[()]/g, '');  //removing parentheses
    } else {
      url += "search"; //default to search
    }
    */
    this.setState({ loading: true }, () => {
      axios
        .post(url, {
          ticker: value,
        })
        .then((res) => {
          var options = [];
          if (res.data.securities && res.data.securities.security) {
            options.push(res.data.securities.security);
            if (res.data.securities.security.length) {
              const upper = options.length > 10? 10: options.length - 1;
              options = options.slice(0, upper);
            } else {
              options = options.slice(0, 1);
            }
            this.setState({ options, loading: false });
          } else {
            this.setState({ options: [], loading: false });
          }
      });
    })
    
  };
    
  // triggers every time a user selects an option from suggestions
	valueChange = (event, value) => {
		if (value !== null) {
      this.props.onValueChange(value);
    }
  };
    
  render() {
    return(
      <Autocomplete
        options={
          this.state.options
        }
        renderOption={(option, { selected }) => (   //TODO: Symbol search still not populating dropdown with options array
          <>
            {option.description}&nbsp;
            <div className='text-secondary'>({option.symbol})</div>
          </>
        )}
        getOptionLabel={(option) => option.description}
        onChange={this.valueChange}
        onInputChange={this.handleInputValueChange}
        renderInput={(params) => (
          <TextField 
            {...params} 
            label='Search company'
            //label='Search by Company Name or (Symbol)'  //Work in progress
            autoFocus={true}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {this.state.loading ? <CircularProgress size='1.5rem' /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    )
  }
}

export default Search;