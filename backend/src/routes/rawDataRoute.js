const express = require('express');
const router = express.Router();
const { rawDataDownload } = require('../controllers/rawDataController');

// GET /api/raw-data/:category — retorna CSV completo para policies, initiatives ou factors
router.get('/:category', rawDataDownload);

module.exports = router;
