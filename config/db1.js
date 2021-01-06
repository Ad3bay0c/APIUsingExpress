const mongoose = require('mongoose');
const config = require('config');
const connectDb = require('./db');

const db = config.get('mongoURI');

const connectDB1 = async () => {
    try {
        await mongoose.connect(db, {
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Mongo Db Connected')
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}


module.exports = connectDB1;
