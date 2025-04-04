// middlewares/validation.js

export const idValidation = (req, res, next) => {
    const id = parseInt(req.params.id, 10);
  
    if (!isNaN(id) && Number.isInteger(id)) {
      req.id = id;
      return next();
    }
  
    res.status(400).json({ error: 'Ogiltigt ID. Måste vara ett heltal.' });
  };
  
  
  