const express = require('express');
const {
  validateAddSynonym,
  validateFindSynonym,
} = require('../middlewares/validationMiddleware');
const { addSynonym, findSynonym } = require('../controllers/synonymController');

const router = express.Router();

// Add synonym route
router.post('/add-synonym', validateAddSynonym, addSynonym);

// Find synonym route
router.post('/find-synonym', validateFindSynonym, findSynonym);

module.exports = router;
