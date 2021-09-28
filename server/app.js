const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//Allow Cross-Origin Requests
app.use(cors());

mongoose.connect('mongodb+srv://mert:mert123123@graphql-react.ufkhw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
mongoose.connection.once('open', () => {
    console.log("Connected to database");
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql:true
}));

app.listen(5000, () => {
    console.log('Server connected to port 5000!');
})