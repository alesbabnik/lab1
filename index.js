const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");


mongoose.connect("mongodb+srv://admin:sommar12345@cluster1337.dfndc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true }, () => {
    console.log('connected to db');
});
//api routes
const apiUsers = require('./routes/users');

app.use(express.json());
app.use(express.static('public'));

app.use('/api/users', apiUsers);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    });
