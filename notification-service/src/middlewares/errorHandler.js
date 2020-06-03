module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(err);
    return res.status(500).json({
      error: err.name,
      message: err.message,
      stack: err.stack,
    });
  }
  return res.status(500).json({
    error: err.name,
    message: err.message,
  });
};
