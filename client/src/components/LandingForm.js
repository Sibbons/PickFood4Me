import React, { Component } from "react";
import PlacesAutocomplete from "react-places-autocomplete";

class LandingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      addressError: "",
      options: {
        types: ["(cities)"],
        componentRestrictions: { country: "us" },
      },
    };
    this.getLocation = this.getLocation.bind(this);
    this.getCoords = this.getCoords.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  isValid = () => {
    let addressError = "Must enter an address";
    console.log("Inside isValid", this.state.address.anchor.length);
    if (!this.state.address.length) {
      this.setState({
        addressError,
      });
      return false;
    }
    return true;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let valid = this.isValid();
    if (valid) {
      const address = this.state.address;
      const data = {
        address,
      };
      console.log(data);
      fetch("/api/inputFields", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      window.location = "/place";
    }
  };

  handleChange = (address) => {
    this.setState({ address });
  };

  handleSelect = (address) => {
    this.setState({ address });
  };

  getLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(this.getCoords);
    } else {
      alert("GeoLocation not enabled");
    }
  }

  getCoords(pos) {
    console.log(pos);
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.coords.latitude},${pos.coords.longitude}&key=AIzaSyBvloS4OahFAEgjuX67ntBAB6FgdVhQgZU`
    )
      .then((response) => response.json())
      .then((data) =>
        this.setState({ address: data.results[0].formatted_address })
      )
      .catch((error) => alert(error));
  }

  render() {
    return (
      <div className="landingWrapper">
        <div className="header">
          <h1>Can't decide where to eat?</h1>
        </div>
        <form onSubmit={this.handleSubmit} className="formContainer">
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
            searchOptions={this.state.options}
            requiredTxt
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <input
                  {...getInputProps({
                    placeholder: "Enter Location Here",
                    className: "searchBox",
                  })}
                />
                <div className="autocomplete">
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => {
                    const style = {
                      backgroundColor: suggestion.active ? "#b6d0e3" : "#fff",
                      cursor: "pointer",
                      padding: "0px 0px 0px 10px",
                    };
                    return (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          style,
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
          <div className="errorMsg">{this.state.addressError}</div>
          <input
            type="button"
            className="butn blue"
            onClick={this.getLocation}
            value="Use Current Location"
          />

          <input type="submit" className="butn lightBlue" value="Submit" />
        </form>
        <div className="footer">
          <p>Only Displays Open Locations</p>
        </div>
      </div>
    );
  }
}

export default LandingForm;
