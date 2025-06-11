const { ValidationError } = require('../utils/errors');

const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    req.validatedData = validatedData;
    next();
  } catch (error) {
    next(new ValidationError(error.errors.map(err => err.message).join(', ')));
  }
};

module.exports = validate; 