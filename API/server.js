const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config');


const app = express();

// Middleware pour activer CORS
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: false
}));

app.use(express.json());

// Déclaration des Routes
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const productRoutes = require('./routes/productRoutes');
const messageRoutes = require('./routes/messageRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const typeDeDemandeRoutes = require('./routes/typeDeDemandeRoutes');
const userRoutes = require('./routes/userRoutes');
const pdfRoutes = require("./routes/pdfRoutes");
const path = require("path");

// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/products', productRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/types', typeDeDemandeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', messageRoutes);
app.use("/api/pdfs", pdfRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
