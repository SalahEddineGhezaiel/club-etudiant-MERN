// Runs for any URL that no route matched
const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

// Express knows this is the error handler because it takes 4 arguments.
// Express 5 sends errors thrown in async controllers here automatically.
const errorHandler = (err, req, res, next) => {
  // Schema rule broken (required, minlength, enum, min/max...)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }
  // Unique index broken (email already used, second review...)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }
  // Badly formed id in the URL, e.g. /api/events/123
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}` });
  }
  // Errors that already carry a status, e.g. invalid JSON in the body (400)
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({ message: 'Server error' });
};

module.exports = { notFound, errorHandler };
