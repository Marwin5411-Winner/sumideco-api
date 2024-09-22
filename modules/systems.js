const db = require('../models');

exports.postTestUpload = async (req, res) => {
    req.files.forEach(file => {
        console.log(file + ' uploaded');
    });

    return res.json(req.files);
};