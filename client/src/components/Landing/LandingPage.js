import React, { Component } from 'react';
import LandingForm from './LandingForm';
import Header from './Header'


class LandingPage extends Component {
    state = {}
    render() {
        return (
            <div className="landingWrapper">
                <Header />
                <LandingForm />
            </div>
        );
    }
}

export default LandingPage;