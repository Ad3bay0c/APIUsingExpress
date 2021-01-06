const express = require('express');
const connectDB = require('./config/db');
const connectDB1 = require('./config/db1');
const app = express();

//Connect Database
connectDB();
// connectDB1();

//Init Middlewre
app.use(express.json({ extended: false }));


app.get('/', (req, res) => res.json({ msg: 'Hello world'}));

// Deine Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

// app.use('/api/user1', require('./routes/user1'));
// app.use('/api/auth1', require('./routes/auth1'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));