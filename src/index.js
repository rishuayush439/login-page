// index.js

const express = require('express');
const User = require('./config'); // Import the Mongoose model

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ name: username });

        if (existingUser) {
            return res.send('User already exists. Please choose a different username.');
        }

        // Create a new user using the User model
        await User.create({ name: username, password: password });

        res.send('User registered successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ name: username });

        if (!user) {
            return res.status(401).send('User not found.');
        }

        // Compare the plaintext password
        if (user.password !== password) {
            return res.status(401).send('Incorrect password.');
        }

        res.render('home');

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


const port = 3000; // Change port to 3000 
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
