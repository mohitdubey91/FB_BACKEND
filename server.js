const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { readdirSync } = require('fs');
const dotenv = require('dotenv');

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

// Routes
readdirSync("./routes").map(route => app.use(`/api`, require(`./routes/${route}`)));

// DATABASE
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
})
    .then(() => console.log("database connected"))
    .catch(() => console.log('connection error'))

//
app.get("/", (req, res) => {
    res.send("welcome from home")
})

const POST = process.env.PORT || 8000;

app.listen(POST, () => {
    console.log(`Server is running on port ${POST}`);
})