const City = require('../models/City');

exports.createCity = async (req, res) => {
    try {
        const { name, country } = req.body;
        const city = new City({ name, country });
        await city.save();
        res.status(201).json(city);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCities = async (req, res) => {
    try {
        const cities = await City.find().populate('country');
        res.status(200).json(cities);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCityById = async (req, res) => {
    try {
        const city = await City.findById(req.params.id).populate('country');
        if (!city) return res.status(404).json({ error: 'City not found' });
        res.status(200).json(city);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateCity = async (req, res) => {
    try {
        const { name, country } = req.body;
        const city = await City.findByIdAndUpdate(
            req.params.id,
            { name, country },
            { new: true }
        );
        if (!city) return res.status(404).json({ error: 'City not found' });
        res.status(200).json(city);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCity = async (req, res) => {
    try {
        const city = await City.findByIdAndDelete(req.params.id);
        if (!city) return res.status(404).json({ error: 'City not found' });
        res.status(200).json({ message: 'City deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
