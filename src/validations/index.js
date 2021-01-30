const _ = require('lodash');

//VALIDATING THE WHOLE REQUEST BODY

/**
 *
 * @param {*} prop request body
 * @returns true or Error object
 */

exports.parentValidate = (prop) => {
    const newObj = { ...prop };

    const response = { value: ' ', error: ' ' };

    if (!_.isObject(newObj)) {
        return {
            ...response,
            error: 'Invalid JSON payload passed.',
        };
    }

    //VALIDATING IF FOR AVAILABILITY OF RULEAND DATE OBJECTS

    const validKeys = ['rule', 'data'];

    const keys = _.keys(newObj);

    const testBody = validKeys.filter((e) => keys.indexOf(e) == -1);

    if (testBody.length !== 0) {
        return {
            ...response,
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

    const response = { value: ' ', error: ' ' };

    const validTypes = _.map([
        _.isArray(newObj.data),
        _.isObject(newObj.data),
        _.isString(newObj.data),
    ]);

    if (!validTypes.includes(true)) {
        return {
            ...response,
            error: 'The data field should be a valid JSON object.',
        };
    }

    return (
        _.isObject(newObj.rule) || {
            ...response,
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
          
          error: 'invalid type, rule.field must be string.',
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

    const dataField = _.get(newObj, 'data');

    const ruleField = _.get(newObj, 'rule.field');

    const conditionField = _.get(newObj, 'rule.condition');

    const conditionValue = _.get(newObj, 'rule.condition_value');

    const fields = _.split(ruleField, '.');

    let data = _.get(newObj, `data.${ruleField}`);

    if (fields.length > 3) {
        return { error: `The nesting should not be more than two levels.` };
    }

    //VALIDATING IF RULE>FIELD ENDS WITH A DOT.

    if (ruleField.endsWith('.')) {
        return { value: false, data: "empty field" };
    }

    if (_.isObject(data) || fields.length == 1) {
      
        return _.isUndefined(_.get(newObj, `data.${ruleField}`))
            ? {
                  error: `field ${ruleField} is is missing from data.`,
                  data,
              }

            : {
                  data,
                  value:
                  eval(

                  `dataField[ruleField] ${conditions[conditionField]} conditionValue`

                  ) || false,
              };
    }

    let i = 0;

    let query = `data.${fields[i]}.${[fields[i + 1]]}`;

    data = _.get(newObj, query, undefined);

    if (!_.isObject(data) || fields.length == 2) {

        return _.isUndefined(data)

            ? { error: `field ${fields[i]}.${fields[i + 1]} is missing from data.`, data }

            : {
                data,
                value:
                eval(

                `dataField.${ruleField} ${conditions[conditionField]} ${conditionValue}`

                ) || false,

              };
    }

    query = query.concat(`.${fields[i + 2]}`);

    data = data = _.get(newObj, query, undefined);

    if (data == undefined) {

        return {
            data,
            error: `field ${fields[i + 1]}.${fields[i + 2]} is missing from data.`,
        };

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
