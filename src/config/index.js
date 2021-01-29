module.exports = corsOptions = {
  origin: true,
  credentials: true,
  allowHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
    'Authorization',
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
};
