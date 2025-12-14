const express = require('express');
const router = express.Router();
const gitController = require('../controllers/gitController');

// Folder Picker
router.post('/folder/select', gitController.selectFolder);

// Check Git Status of a folder
router.post('/project/status', gitController.checkStatus);

// Init, Commit, Push flow
router.post('/project/push', gitController.pushProject);

module.exports = router;
