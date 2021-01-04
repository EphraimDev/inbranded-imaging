const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const routes = require('./route');
dotenv.config();
const app = express();

// Allows access from any server
app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + '/files'));
app.get('/', (_req, res) => {
	res.send('Inbraded Backend Developer Challenge');
});
app.use('/api/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log('Listening on port: ' + PORT);
});
