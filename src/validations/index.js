const _ = require('lodash');

//VALIDATING THE WHOLE REQUEST BODY

/**
 *
 * @param {*} prop request body
 * @returns true or Error object
 */

exports.parentValidate = (prop) => {
    const newObj = { ...prop };

    if (!_.isObject(newObj)) {
        return {
            error: 'Invalid JSON payload passed.',
        };
    }

    //VALIDATING IF FOR AVAILABILITY OF RULEAND DATE OBJECTS

    const validKeys = ['rule', 'data'];

    const keys = _.keys(newObj);

    const testBody = validKeys.filter((e) => keys.indexOf(e) == -1);

    if (testBody.length !== 0) {

        return {
            error: `${testBody[0]} is  required.`,
        };

    }

    return true;
};

/**
 *
 * @param {*} prop request body
 * @returns true or Error object
 */

//VALIDATING THE RULE AND DATA DATATYPES

exports.payloadValidate = (prop) => {
    const newObj = { ...prop };


    const validTypes = _.map([
        _.isArray(newObj.data),
        _.isObject(newObj.data),
        _.isString(newObj.data),
    ]);

    if (!validTypes.includes(true)) {
        return {
            error: 'The data field should a|an (object|array|string).',
        };
    }

    return (
        _.isObject(newObj.rule) || {
            error: 'The rule field should be a valid JSON object.',
        }
    );
};

//VALIDATION RULES OBJECT
const conditions = {
    eq: '==',

    neq: '!=',

    gt: '>',

    gte: '>=',

    contains: '==',
};

/**
 *
 * @param {*} prop request body
 * @returns true or Error object
 */

//VALIDATING THE RULES OBJECT FOR AVAILABILITY OF ALL FIELDS

exports.ruleFieldsValidate = (prop) => {
    const newObj = { ...prop.rule };

    const validKeys = _.keys(conditions);

    if (!validKeys.includes(newObj.condition)) {
        return {
            error: `invalid rule, rule conditions must be either ${validKeys.join(
                '|'
            )}.`,
        };
    }

    if (!_.isString(newObj.field) && !_.isUndefined(newObj.field)) {
      return {
          
          error: 'rule.field should be a string.',
      };
  }

    const ruleFields = ['field', 'condition', 'condition_value'];

    const keys = _.keys(newObj);

    const misingFields = ruleFields.filter((e) => keys.indexOf(e) == -1);

    return misingFields.length > 0
        ? {
              error: `fields ${misingFields.join(
                  ' '
              )} are required in rule data.`,
          }
        : true;
};

/**
 *
 * @param {*} prop request body
 * @returns true or Error object
 */

//VALIDATING THE CONDITIONS

exports.fieldCheck = (prop) => {
    const newObj = { ...prop };

    const ruleField = _.get(newObj, 'rule.field');

    const conditionField = _.get(newObj, 'rule.condition');

    const conditionValue = _.get(newObj, 'rule.condition_value');

    const fields = _.split(ruleField, '.');

    const data = _.get(newObj, `data.${ruleField}`);

    if (fields.length > 3) {
        return { error: `The nesting should not be more than two levels.` };
    }

    //VALIDATING IF RULE>FIELD ENDS WITH A DOT.

    if (_.isUndefined(data)) {
        return{ error: `field ${ruleField} is missing from data.`, data }
    }


    const value =
        eval(`data ${conditions[conditionField]} conditionValue`) || false;

    return { value, data };
};

//COMPOSE ALL VALIDATION FUNCTIONS
exports.validationEngine = (fns, data) => {
    let value;

    for (fn of fns) {
        value = fn(data);

        if (value !== true) {
            return value;
        }
    }

    return value;
};