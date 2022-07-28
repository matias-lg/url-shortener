const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const urlSchema = new Schema({
    original_url: { type: String, required: true },
    shortened_hash: { type: String, required: true },
    // expiration_date: { type: Date },
});

module.exports = mongoose.model("Url", urlSchema)
