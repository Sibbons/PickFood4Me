'use strict';
const keys = require('../keys')
const yelp = require('yelp-fusion');
const client = yelp.client(keys.yelpKey);


module.exports = app => {

    let address = "";
    const foodType = "restaurants";
    const choices = "Japanese,Sushi,Ramen,Chinese,Buffet,Mexican,Filipino,Indian,Nepalease,American";
    const range = 30000;



    app.post('/api/inputFields', (req, res) => {
        address = req.body.address.replace(', USA', '');
        console.log('Post', address)
    })

    app.get('/api/getPlace', async (req, res) => {
        const response = await client.search({
            searchType: foodType,
            location: address,
            categories: choices,
            radius: range,
            open_now: true,
        })

        let randomNum = Math.floor((Math.random() * response.jsonBody.businesses.length));
        const randomfoodPlace = response.jsonBody.businesses[randomNum];
        let locationCombined = `${randomfoodPlace.location.address1}, ${randomfoodPlace.location.city} ${randomfoodPlace.location.zip_code} ${randomfoodPlace.location.state}`;
        const finalPlace = {
            name: randomfoodPlace.name,
            price: randomfoodPlace.price,
            location: locationCombined,
            phone: randomfoodPlace.display_phone
        }

        res.json(finalPlace);

    })

}