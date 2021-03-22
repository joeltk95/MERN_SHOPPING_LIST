const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
//const bodyParser = require('body-parser');
/* 
bodyParser was added back to Express in release 4.16.0, because people wanted it bundled with Express like before. 
That means you don't have to use bodyParser.json() anymore if you are on the latest release. You can use express.json() instead.
*/

const items = require('./routes/api/items');

const app = express();

app.use(express.json());

//DB config
const db = require('./config/keys').mongoURI;

//Connect to Mongo
mongoose
    .connect(db, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//Use Routes
app.use('/api/items', items);

//Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    //Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(_dirname, 'client', 'build', 'index.html'));
    })
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
