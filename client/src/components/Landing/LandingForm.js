import React, { Component } from 'react';
import PlacesAutocomplete from "react-places-autocomplete";

class LandingForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            options: {
                types: ['(cities)'],
                componentRestrictions: { country: 'us' }
            }
        };
        this.getLocation = this.getLocation.bind(this);
        this.getCoords = this.getCoords.bind(this);
    }


    handleSubmit = event => {
        const address = this.state.address;
        const data = {
            address
        }
        event.preventDefault();
        console.log(data);
        fetch('/api/inputFields', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        window.location = "/place";
    }

    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = address => {
        this.setState({ address });
    };

    getLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(this.getCoords)
        } else {
            alert('GeoLocation not enabled');
        }
    }

    getCoords(pos) {
        console.log(pos)
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.coords.latitude},${pos.coords.longitude}&key=AIzaSyBvloS4OahFAEgjuX67ntBAB6FgdVhQgZU`)
            .then(response => response.json())
            .then(data => this.setState(
                { address: data.results[0].formatted_address }
            ))
            .catch(error => alert(error));
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit} className="formContainer">
                    <PlacesAutocomplete
                        value={this.state.address}
                        onChange={this.handleChange}
                        onSelect={this.handleSelect}
                        searchOptions={this.state.options}
                        requiredTxt
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                                <input
                                    {...getInputProps({
                                        placeholder: 'Enter Location Here',
                                        className: 'searchBox',
                                    })}
                                />
                                <div className="autocomplete">
                                    {loading && <div>Loading...</div>}
                                    {suggestions.map(suggestion => {
                                        const style = {
                                            backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                                            cursor: 'pointer',
                                            padding: "0px 0px 0px 20px"

                                        }
                                        return (
                                            <div
                                                {...getSuggestionItemProps(suggestion, {
                                                    style
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
                    <input type="button" className="butn blue" onClick={this.getLocation} value="Use Current Location" />

                    <input type="submit" className="butn green" />
                </form>

            </div>
        );
    }
}

export default LandingForm;