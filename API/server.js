const express = require('express');
require('dotenv').config();

const cors = require('cors');
const connectDB = require('./config');
require('./services/taskScheduler');

const app = express();

const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

// Stocker les sockets par userId
const userSockets = {};

io.on('connection', (socket) => {
  // Quand un client s'identifie
  socket.on('register', (userId) => {
    userSockets[userId] = socket.id;
  });

  socket.on('disconnect', () => {
    for (const [userId, id] of Object.entries(userSockets)) {
      if (id === socket.id) delete userSockets[userId];
    }
  });
});

// Pour émettre une notification à un userId
function sendNotificationToUser(userId, notification) {
  const socketId = userSockets[userId];
  if (socketId) {
    io.to(socketId).emit('notification', notification);
  }
}

// Rendre la fonction accessible globalement
app.set('sendNotificationToUser', sendNotificationToUser);



// Middleware pour activer CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://192.168.1.70:5173', 'http://192.168.1.70:8001'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: false
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


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
const countryRoutes = require('./routes/countryRoutes');
const cityRoutes = require('./routes/cityRoutes');
const videoRoutes = require('./routes/videoRoutes');
const emailRoutes = require("./routes/emailRoutes");
const reportingRoutes = require('./routes/ReportingRoutes');
const TaskRoutes = require('./routes/TaskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');


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
app.use('/api/videos', videoRoutes);
app.use("/api/emails", emailRoutes);
app.use('/api/reporting', reportingRoutes);
app.use('/api/tasks', TaskRoutes);
app.use('/api/notifications', notificationRoutes);
// Gestion des fichiers statiques et des en-têtes pour les téléchargements
app.use('/API/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filePath) => {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.pdf': 'application/pdf',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        };
        res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    }
}));


app.use('/api', countryRoutes);
app.use('/api', cityRoutes);


connectDB();

server.listen(5000, () => {
  console.log('Serveur démarré sur le port 5000');
});
