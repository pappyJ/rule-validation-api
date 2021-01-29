const profile = require('../data/profile');

const { MSG, STATUS_CODE } = require('../constants');

const ErrorDispatcher = require('../errors/appError');

const {
  parentValidate,
  payloadValidate,
  fieldCheck,
  ruleFieldsValidate,
  validationEngine,
} = require('../validations');

//USER PROFILE CONTROLLER
exports.userProfile = (_, res) => {
  return res.status(STATUS_CODE.OK).json({
    message: 'My Rule-Validation API',
    status: MSG.SUCCESS,
    data: profile,
  });
};

//VALIDATION CONTROLLER

exports.validateRule = (req, res, next) => {
  const { data, value, error } = validationEngine(
    [parentValidate, payloadValidate, ruleFieldsValidate, fieldCheck],
    req.body
  );

  if (error) return next(new ErrorDispatcher(error));

  const message = !value ? 'failed validation.' : 'successfully validated.';

  const status = value ? MSG.SUCCESS : MSG.ERROR;

  const status_code = value ? STATUS_CODE.OK : STATUS_CODE.BAD_REQUEST;

  const {
    rule: { field, condition, condition_value },
  } = req.body;

  return res.status(status_code).json({
    message: `field ${field} ${message}`,
    status,
    data: {
      error: !value,
      field,
      field_value: data,
      condition,
      condition_value,
    },
  });
};
