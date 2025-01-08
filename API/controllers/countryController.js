const Country = require('../models/Country');

exports.createCountry = async (req, res) => {
    try {
        const { name, code } = req.body;
        const country = new Country({ name, code });
        await country.save();
        res.status(201).json(country);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCountries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const countries = await Country.find().skip(skip).limit(limit);
        const totalItems = await Country.countDocuments();

        res.status(200).json({ countries, totalItems });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCountryById = async (req, res) => {
    try {
        const country = await Country.findById(req.params.id);
        if (!country) return res.status(404).json({ error: 'Country not found' });
        res.status(200).json(country);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateCountry = async (req, res) => {
    try {
        const { name, code } = req.body;
        const country = await Country.findByIdAndUpdate(
            req.params.id,
            { name, code },
            { new: true }
        );
        if (!country) return res.status(404).json({ error: 'Country not found' });
        res.status(200).json(country);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCountry = async (req, res) => {
    try {
        const country = await Country.findByIdAndDelete(req.params.id);
        if (!country) return res.status(404).json({ error: 'Country not found' });
        res.status(200).json({ message: 'Country deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
