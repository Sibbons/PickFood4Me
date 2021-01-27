'use strict';
const keys = require('../config/keys')
const yelp = require('yelp-fusion');
const client = yelp.client(keys.yelpKey);


module.exports = app => {

    let address = undefined;
    const foodType = "restaurants";
    const choices = "Japanese,Sushi,Ramen,Chinese,Buffet,Mexican,Filipino,Indian,Nepalease,American";
    const range = 15000;



    app.post('/api/inputFields', (req, res) => {
        address = req.body.address.replace(', USA', '');
        console.log('Post', address)
    })

    app.get('/api/getPlace', async (req, res) => {
        console.log('addy', address);
        let response;
        try {
            response = await client.search({
                searchType: foodType,
                location: address,
                categories: choices,
                radius: range,
                open_now: true,
                limit: 50
            })
        } catch (err) {
            res.send({
                error: "No locations found"
            })
        }



        const randomNum = Math.floor((Math.random() * response.jsonBody.businesses.length));
        const randomfoodPlace = response.jsonBody.businesses[randomNum];
        const locationCombined = `${randomfoodPlace.location.address1}, ${randomfoodPlace.location.city}, ${randomfoodPlace.location.state} ${randomfoodPlace.location.zip_code}`;
        const finalPlace = {
            name: randomfoodPlace.name,
            location: locationCombined,
            phone: randomfoodPlace.display_phone,
            url: randomfoodPlace.url
        }

        res.json(finalPlace);


    })

}