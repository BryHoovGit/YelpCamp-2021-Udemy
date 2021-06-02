const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "60ab1c67551d442b1072a793",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/bryce-test-env/image/upload/v1622337928/YelpCamp/hflyenhsabtitrl710vv.jpg',
                    filename: 'YelpCamp/hflyenhsabtitrl710vv'
                },
                {
                    url: 'https://res.cloudinary.com/bryce-test-env/image/upload/v1622337928/YelpCamp/ms48w3m9cmtuezzvoyta.jpg',
                    filename: 'YelpCamp/ms48w3m9cmtuezzvoyta'
                },
                {
                    url: 'https://res.cloudinary.com/bryce-test-env/image/upload/v1622337928/YelpCamp/phewfx6pvdywwzfhvvn5.jpg',
                    filename: 'YelpCamp/phewfx6pvdywwzfhvvn5'
                }
            ],
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})