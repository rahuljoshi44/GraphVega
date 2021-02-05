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
		this.setState({ loading: true }, () => {
			axios
				.post(url, {
					ticker: value,
				})
				.then((res) => {
					if (res.data.securities && res.data.securities.security[0]) {
            var options = res.data.securities.security;
            const upper = options.length > 6 ? 6 : options.length - 1;
            options = options.slice(0, upper);
            console.log(options)
						this.setState({ options, loading: false });
					} else {
						this.setState({ options: [], loading: false });
          }
			});
		})
  };
    
  // triggers every time a user selects an option from suggestions
	valueChange = (event, value) => {
		if (!(value === null)) {
      this.props.onValueChange(value);
    }
  };
    
  render() {
    return(
      <Autocomplete
        options={
          this.state.options[0] === null ? [] : this.state.options
        }
        renderOption={(option, { selected }) => (
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