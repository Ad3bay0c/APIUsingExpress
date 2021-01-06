const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

const connectDb =  async () => {
    try {
        await mongoose.connect(db, {
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useNewUrlParser: true
        });

        console.log('Mongo DB connected') ;
    } catch(err) {
        console.log(err.message);
        process.exit(1);
    }
   
}

module.exports = connectDb;