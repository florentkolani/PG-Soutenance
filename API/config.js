// const mongoose = require('mongoose');
// require('dotenv').config();

// // Connexion à la base de données MongoDB
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('Erreur de connexion MongoDB:', err));

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Erreur de connexion MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
