const Joi = require('joi');

// Schema for adding a synonym
const addSynonymSchema = Joi.object({
  word: Joi.string().min(1).required().label('Word'),
  synonym: Joi.string().min(1).required().label('Synonym'),
});

// Schema for finding synonyms of a word
const findSynonymSchema = Joi.object({
  word: Joi.string().min(1).required().label('Word'),
});

// Schema for deleting a synonym
const deleteSynonymSchema = Joi.object({
  word: Joi.string().min(1).required().label('Word'),
  synonym: Joi.string().min(1).required().label('Synonym'),
});

/**
 * Middleware to validate requests for adding synonyms.
 */
const validateAddSynonym = (req, res, next) => {
  const { error } = addSynonymSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

/**
 * Middleware to validate requests for finding synonyms.
 */
const validateFindSynonym = (req, res, next) => {
  const { error } = findSynonymSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

/**
 * Middleware to validate requests for deleting synonyms.
 */
const validateDeleteSynonym = (req, res, next) => {
  const { error } = deleteSynonymSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateAddSynonym,
  validateFindSynonym,
  validateDeleteSynonym,
};
