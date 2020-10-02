const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { nanoid } = require('nanoid');

const PORT = process.env.PORT || 1337;

const app = express();

app.use(helmet());

// Logger
app.use(morgan('tiny'));

// Cross-site connection
app.use(cors());

// Body parser
app.use(express.json());

// // Static serve
// app.use(express.static('./public'));

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(res => {
    console.log('mongoDB connected to ' + res.connection.host);
})
.catch(e => {
    console.log(e);
})

/* ROUTES */

app.get('/', indexRouter);

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
app.listen(PORT, () => {
    console.log(PORT);
})




