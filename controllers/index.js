const { nanoid } = require('nanoid');
const Url = require('../models/Url');

exports.checkConnection = (req, res) => {
    res.json({
        message: 'short.me - Shorten your URLs'
    });
};

// Return URL from id
exports.getURL = async (req, res) => {

    const { id: slug } = req.params;
    try {
        var exists = false;
        var url = "";
        Url.find({ slug })
            .then(data => {
                if (data.slug) {
                    url = data.url;
                    exists = true;
                }
            })
            .catch(err => {
                console.log(err);
            })

        if (exists) {
            res.json({ url });
        }
        else {
            res.json({
                "error": "URL not found"
            })
        }
    }
    catch (error) {
        res.json({
            error
        })
    }
};

// Create a short URL
exports.shortenURL = (req, res) => {

    var { slug, url } = req.body;
    try {
        var exists = false;

        // If slug is not provided
        if (!slug) {
            slug = nanoid(6);
        }

        // Check if slug exists
        Url.find({ slug })
            .then(data => {
                if (data.slug) {
                    exists = true;
                }
            })

        const newUrl = {
            slug,
            url
        }

        if (!exists) {
            Url.insertOne({ slug })
                .then(data => {
                    res.json(newUrl);
                })
                .catch(err => {
                    console.log(err);
                })            
        }
        else {
            res.json({
                "error": "Slug in use!"
            })
        }

    }
    catch (error) {
        next(error);
    }
};
