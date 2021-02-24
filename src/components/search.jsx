import React, { Component } from "react";
import { TextField, CircularProgress } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { toast } from "react-toastify";
import axios from 'axios';
import { SERVER_URL } from '../utils/url';

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
  handleInputValueChange = async (event, value) => {
    var url = `${SERVER_URL}/api/stocks/`;
    var regExp = /\([^)]*\)/g;
    var matchTest = value.match(regExp);
    if (!!matchTest) {
      url += "lookup";
      value = value.replace(/[()]/g, ""); //removing parentheses
    } else {
      url += "search"; //default to search
    }
    console.log(url);
    try {
      this.setState({ loading: true }, () => {
      axios
        .post(url, {
          ticker: value,
        })
        .then((res) => {
          var options;   
          if (res.data.securities && res.data.securities.security) {
            if (res.data.securities.security.length) {
              options = res.data.securities.security;
            } else {
              const resSecurity = JSON.parse(JSON.stringify(res.data.securities.security));
              const emptySecurity = JSON.parse('{"symbol":"","exchange":"","type":"","description":""}');
              const data = Object.assign({}, res.data);
              data.securities.security = []; 
              data.securities.security.push(resSecurity);
              data.securities.security.push(emptySecurity);
              options = data.securities.security;
            }
            const upper = options.length > 10? 10: options.length > 1? options.length - 1: 1;
            options = options.slice(0, upper);
            this.setState({ options, loading: false });
          } else {
            this.setState({ options: [], loading: false });
          }
      });
    })
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong! Please try again later.");
    } finally {
      this.setState({ loading: false });
    }
  };

  // triggers every time a user selects an option from suggestions
  valueChange = (event, value) => {
    if (value !== null) {
      this.props.onValueChange(value);
    }
  };

  render() {
    return (
      <Autocomplete
        loading={this.state.loading}
        options={this.state.options}
        renderOption={(option, { selected }) => (
          <>
            {option.description}&nbsp;
            <div className="text-secondary">({option.symbol})</div>
          </>
        )}
        getOptionLabel={(option) => option.description}
        getOptionSelected={(option, value) =>
          option.description === value.description
        }
        onChange={this.valueChange}
        onInputChange={this.handleInputValueChange}
        filterOptions={(x) => x}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search by Company Name or (Symbol)"
            autoFocus={true}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {this.state.loading ? (
                    <CircularProgress size="1.5rem" />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    );
  }
}

export default Search;
