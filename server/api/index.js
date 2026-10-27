let app;
let initError = null;

try {
  app = require('../src/index');
} catch (err) {
  initError = err;
  console.error('Fatal initialization error in Vercel function:', err);
}

module.exports = (req, res) => {
  if (initError) {
    console.error('Serverless function failed to initialize:', initError);
    return res.status(500).json({
      success: false,
      error: 'Vercel Serverless Initialization Error',
      message: initError.message,
    });
  }
  return app(req, res);
};
