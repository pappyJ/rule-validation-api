const { MSG, STATUS_CODE } = require('../constants');

//CENTRAL ERROR HANDLER

const errorResponse = (err, req, res) => {
  return res.status(STATUS_CODE.BAD_REQUEST).json({
    message: err.message,

    status: MSG.ERROR,

    data: null,
  });
};

module.exports = (err, req, res, next) => {
  return errorResponse(err, req, res);
};
