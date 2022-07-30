const Url = require("../models/url")
const crypto = require("crypto")
const HASH_LENGTH = 5;

const createUrl = async (req, res) => {
    const new_url = req.body.new_url;
    // check if url is a valid one
    let match = new_url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (match == null)
        res.status(404).json({ error: `${new_url} is not a valid url` });

    existingUrl = await Url.findOne({ original_url: new_url });
    if (existingUrl)
        res.status(404).json({ error: `${new_url} was already shortened` });

    else {
        // since hashes are shortened to HASH_LENGTH characters there might be collisions
        let hash = new_url;
        while (true) {
            let salt = (Math.random() + 1).toString(36).substring(HASH_LENGTH);
            hash = crypto.createHash('sha256').update(hash + salt, 'utf8').digest('hex').substring(0, HASH_LENGTH);
            let exists = await Url.findOne({ shortened_url: hash });
            if (!exists) break;
        }
        new Url({ original_url: new_url, shortened_url: hash }).save();
        res.status(200).json({ original_url: req.query.new_url, shortened_url: hash })
    }
}

const getUrlByHash = async (req, res) => {
    let urlDoc = await Url.findOne({ shortened_url: req.params.url });
    if (urlDoc) res.json({ original_url: urlDoc.original_url, shortened_url: urlDoc.shortened_url });
    else res.status(404).json({ error: "Url not found" });
}

const redirectController = async (req, res) => {
    let parsed_url = req.url.substring(1);
    console.log(`In redirectController! url is: ${parsed_url}`);
    let url = await Url.findOne({ shortened_url: parsed_url });
    if (url) res.redirect(url.original_url);
    else res.status(404).json({ error: "Url not found" });
}

module.exports = { createUrl, getUrlByHash, redirectController }
