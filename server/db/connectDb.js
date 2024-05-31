const mongoose = require('mongoose');

const url ="mongodb+srv://new_user:temp123@cluster0.3ziyutr.mongodb.net/jwtauth_" ;

const connectDb = async () => {
    try {
        await mongoose.connect(url);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

module.exports = connectDb;
