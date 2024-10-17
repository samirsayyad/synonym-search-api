const express = require('express');
const {
  validateAddSynonym,
  validateFindSynonym,
} = require('../middlewares/validationMiddleware');
const {
  addSynonymRequestHandler,
  findSynonymsRequestHandler,
} = require('../controllers/synonymController');

const router = express.Router();

/**
 * @swagger
 * /add-synonym:
 *   post:
 *     summary: Add a new synonym
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               word:
 *                 type: string
 *               synonym:
 *                 type: string
 *     responses:
 *       200:
 *         description: Synonym added successfully
 *       400:
 *         description: Bad request
 */
router.post('/add-synonym', validateAddSynonym, addSynonymRequestHandler);

/**
 * @swagger
 * /find-synonym:
 *   post:
 *     summary: Find synonyms for a word
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               word:
 *                 type: string
 *     responses:
 *       200:
 *         description: Synonyms found successfully
 *       404:
 *         description: Word not found
 */
router.post('/find-synonym', validateFindSynonym, findSynonymsRequestHandler);

module.exports = router;
