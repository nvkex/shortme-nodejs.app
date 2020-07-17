const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const { nanoid } = require('nanoid');
const admin = require('firebase-admin');

const app = express();

/**
 * Firestore Configuration
 */
const serviceAccount = require('./short-me-65f93-firebase-adminsdk-md8ke-8fc91ad414.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://short-me-65f93.firebaseio.com"
});

// Firestore Database
var db = admin.database();
var ref = db.ref("short-me");
ref.once("value", function (snapshot) {
    console.log("connected");
})


app.use(helmet());

// Logger
app.use(morgan('tiny'));

// Cross-site connection
app.use(cors());

// Body parser
app.use(express.json());

// // Static serve
// app.use(express.static('./public'));

// Input Schema
const schema = yup.object().shape({
    slug: yup.string().trim().matches(/[\w\-]/i),
    url: yup.string().trim().url().required(),
});

/* ROUTES */

app.get('/', (req, res) => {
    res.json({
        message: 'short.me - Shorten your URLs'
    });
});

// Return URL from id
app.get('/:id', async (req, res) => {

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
});

// Create a short URL
app.post('/url', async (req, res, next) => {

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
});

// Errors
app.use((error, req, res, next) => {
    if (error.status) {
        res.status(error.status);
    }
    else {
        res.status(500);
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? 'nice' : error.stack,
    })
})



// Listen to default port or 1337
const port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log(port);
})




