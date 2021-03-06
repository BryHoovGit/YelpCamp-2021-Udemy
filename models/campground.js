const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

// https://res.cloudinary.com/bryce-test-env/image/upload/v1621897413/YelpCamp/gxl2wty9fu7wqyzkyiqr.jpg'

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_150');
});

const opts = {toJSON: {virtuals: true}};

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
    },

    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <div class="card border-0 mt-2" style="width: 12rem;">
        <img class="card-img-top" src="${this.images[0].url}"
        <div class="card-body">
            <br>
            <h5 class="card-title text-center">${this.title}</h5>
            <p class="card-body text-center text-truncate">${this.description}</p>
            <ul class="list-group list-group-flush">
                <li class="list-group-item text-muted text-center">${this.location}</li>
            </ul>
            <div class="card-body">
                <form action="/campgrounds/${this._id}" class="text-center">
                    <button class="btn btn-primary">View Campground</button>
                </form>
            </div>
        </div>
    </div>
    `
});



CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);