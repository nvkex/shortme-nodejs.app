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

    console.log(slug)

    try {
        Url.findOne({ slug })
            .then(data => {
                if (data) {
                    res.json({ url: data.url });
                }
                else {
                    res.json({
                        "error": "URL not found"
                    })
                }

            })
            .catch(err => {
                console.log(err);
            })
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
    var slugLength = req.body.len || 6;

    try {
        var exists = false;

        // If slug is not provided
        if (!slug) {
            slug = nanoid(slugLength);
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
            Url.create({ slug, url })
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
        console.log(error)
    }
};
