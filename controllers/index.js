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
        await ref.once("value", (snapshot) => {
            if (snapshot.val().urls[slug]) {
                url = snapshot.val().urls[slug].url;
                exists = true;
            }
        });

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
exports.shortenURL = async (req, res, next) => {

    let { slug, url } = req.body;
    try {
        let exists = false;

        // If slug is not provided
        if (!slug) {
            slug = nanoid(6);
        }

        // Check if slug exists
        await ref.once("value", (snapshot) => {
            if (snapshot.val().urls[slug]) {
                exists = true;
            }
        });

        // Validate params
        await schema.validate({
            slug,
            url,
        });

        const newUrl = {
            slug,
            url
        }

        if (!exists) {
            await ref.child('urls').child(slug).set(newUrl);

            // Send data
            res.json(newUrl);
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
