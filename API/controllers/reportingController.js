const Ticket = require('../models/ticketModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const type = require('../models/typeDeDemandeModel');
const rating = require('../models/ratingModel');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

const buildFilters = (query) => {
  const filters = {};
  if (query.startDate) filters.createdAt = { $gte: new Date(query.startDate) };
  if (query.endDate) filters.createdAt = { ...filters.createdAt, $lte: new Date(query.endDate) };
  if (query.user) filters.user = query.user; // Ensure user filter is applied
  if (query.role) filters.role = query.role;
  if (query.status) filters.status = query.status;
    return filters;
};

// Tickets par mois
exports.getTicketsParMois = async (req, res) => {
  try {
    const filters = buildFilters(req.query);
    const result = await Ticket.aggregate([
      { $match: filters },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.setHeader('Content-Type', 'application/json');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Satisfaction globale (moyenne des notes)
exports.getSatisfactionGlobale = async (req, res) => {
  try {
    const filters = buildFilters(req.query);
    const result = await Ticket.aggregate([
      { $match: { ...filters, rating: { $ne: null } } },
      {
        $group: {
          _id: null,
          satisfaction: { $avg: '$rating' }
        }
      }
    ]);
    res.setHeader('Content-Type', 'application/json');
    res.json({ satisfaction: result[0]?.satisfaction || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Totaux : utilisateurs, tickets, produits, types de demande, notes
exports.getTotaux = async (req, res) => {
  try {
    const filters = buildFilters(req.query);
    const [totalTickets, totalUsers, totalProduits] = await Promise.all([
      Ticket.countDocuments(filters),
      User.countDocuments(),
      Product.countDocuments(),
      type.countDocuments(),
      rating.countDocuments()

    ]);
    res.setHeader('Content-Type', 'application/json');
    res.json({ totalTickets, totalUsers, totalProduits });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Total types de demande
exports.getTotalTypesDeDemande = async (req, res) => {
  try {
    const totalTypesDeDemande = await type.countDocuments();
    res.setHeader('Content-Type', 'application/json');
    res.json({ totalTypesDeDemande });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Total notes
exports.getTotalNotes = async (req, res) => {
  try {
    const totalNotes = await rating.countDocuments();
    res.setHeader('Content-Type', 'application/json');
    res.json({ totalNotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Export data
exports.exportData = async (req, res) => {
  try {
    const filters = buildFilters(req.query);
    const tickets = await Ticket.find(filters).lean();

    if (req.query.format === 'excel') {
      const fields = ['_id', 'title', 'status', 'createdAt', 'user', 'role'];
      const parser = new Parser({ fields });
      const csv = parser.parse(tickets);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="reporting.csv"');
      res.send(csv);
    } else if (req.query.format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="reporting.pdf"');
      doc.pipe(res);
      doc.fontSize(16).text('Reporting Data', { align: 'center' });
      tickets.forEach(ticket => {
        doc.fontSize(12).text(`ID: ${ticket._id}, Title: ${ticket.title}, Status: ${ticket.status}, Created At: ${ticket.createdAt}`);
      });
      doc.end();
    } else {
      res.status(400).json({ error: 'Invalid format' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
