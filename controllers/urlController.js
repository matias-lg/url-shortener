const Url = require("../models/url")
const crypto = require("crypto")
const HASH_LENGTH = 5;

const createUrl = async (req, res) => {
    existingUrl = await Url.findOne({ original_url: req.new_url });
    if (existingUrl)
        res.json({ error: `${new_url} already exists` });
    else {
        // since hashes are shortened to HASH_LENGTH characters there might be collisions
        let hash;
        while (true) {
            let salt = (Math.random() + 1).toString(36).substring(HASH_LENGTH);
            hash = crypto.createHash('sha256').update(hash + salt, 'utf8').digest('hex').substring(0, HASH_LENGTH);
            let exists = await Url.findOne({ shortened_hash: hash });
            if (!exists) break;
        }
        new Url({ original_url: req.query.new_url, shortened_hash: hash }).save();
        res.json({ original_url: req.query.new_url, shortened_url: `localhost:3000/${hash}` })
    }
}

const getUrl = async (req, res) => {
    let url = await Url.findOne({ original_url: req.params.url });
    if (url) res.json({ shortened_url: url.shortened_url });
    else res.json({ error: "Url not found" });
}

const redirectController = async (req, res) => {
    console.log(`In redirectController! url is: ${req.url.substring(1)}`);
    let url = await Url.findOne({ original_url: req.params.url });
    if (url) res.redirect(url.original_url);
    else res.json({ error: "Url not found" });
}

module.exports = { createUrl, getUrl, redirectController }
