const express = require('express')
var bodyParser = require('body-parser')
const app = express()
require('dotenv').config()

// parse application/json
app.use(bodyParser.json())


const db = require('./app/model')
// db.sequelize.sync()
// db.products.drop()
// db.categories.drop()

require('./app/routes/products.routes')(app)

app.get('/', function (req, res) {
    res.send('Hello World!')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, function (err) {
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})