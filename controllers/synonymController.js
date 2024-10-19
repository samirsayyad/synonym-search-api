const {
  addSynonym,
  findSynonyms,
  deleteSynonym,
} = require('../services/synonym');
const logger = require('../utils/logger');

const addSynonymRequestHandler = async (req, res, next) => {
  const { word, synonym } = req.body;
  try {
    if (!word || !synonym) {
      throw new Error('Word and synonym are required');
    }

    addSynonym(word, synonym);
    logger.info(`Synonym added: "${synonym}" for "${word}"`);
    res
      .status(201)
      .json({ message: `Synonym "${synonym}" added for "${word}".` });
  } catch (error) {
    next(error);
  }
};

const findSynonymsRequestHandler = async (req, res, next) => {
  const { word } = req.body;
  try {
    if (!word) {
      throw new Error('Word is required');
    }

    const synonyms = await findSynonyms(word);
    res.json({ synonyms });
  } catch (error) {
    next(error);
  }
};

const deleteSynonymRequestHandler = async (req, res, next) => {
  const { word, synonym } = req.body;
  try {
    if (!word || !synonym) {
      throw new Error('Word and synonym are required');
    }

    deleteSynonym(word, synonym);
    logger.info(`Synonym deleted: "${synonym}" for "${word}"`);
    res.json({ message: `Synonym "${synonym}" deleted for "${word}".` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addSynonymRequestHandler,
  findSynonymsRequestHandler,
  deleteSynonymRequestHandler,
};
