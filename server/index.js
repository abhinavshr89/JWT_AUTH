const express = require('express');
const cors = require('cors');
const connectDb = require('./db/connectDb');
const authRoutes = require("./Routes/AuthRoutes")

const app = express();
const cookieParser = require("cookie-parser");

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true,
}));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

connectDb().catch(error => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(cookieParser());
app.use(express.json());
app.use("/",authRoutes);
