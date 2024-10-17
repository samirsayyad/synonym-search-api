const { addSynonym, findSynonyms } = require('../services/synonym');
const logger = require('../utils/logger');
exports.addSynonym = async (req, res, next) => {
  const { word, synonym } = req.body;
  if (!word || !synonym) {
    logger.warn('Add synonym: word or synonym is missing');
    return res.status(400).json({ error: 'Word and synonym are required' });
  }

  try {
    addSynonym(word, synonym);
    logger.info(`Synonym added: "${synonym}" for "${word}"`);
    res
      .status(201)
      .json({ message: `Synonym "${synonym}" added for "${word}".` });
  } catch (error) {
    logger.error(`Error adding synonym: ${error.message}`);
    next(error);
  }
};

exports.findSynonyms = async (req, res, next) => {
  const { word } = req.query;
  if (!word) {
    return res.status(400).json({ error: 'Word is required' });
  }

  try {
    const synonyms = await findSynonyms(word);
    res.json({ synonyms });
  } catch (error) {
    logger.error(`Error finding synonyms: ${error.message}`);
    next(error);
  }
};
