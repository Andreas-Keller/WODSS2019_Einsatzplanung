const {instances} = require('gstore-node');
const bcrypt = require('bcrypt-nodejs');

// Retrieve the gstore instance
const gstore = instances.get('unique-id');
const {Schema} = gstore;

const employeeSchema = new Schema({
    firstName: {joi: Joi.string().required()},
    lastName: {joi: Joi.string().required()},
    emailAddress: {joi: Joi.string().email().required()},
    password: {joi: Joi.string().required()},
    activeID: {joi: Joi.boolean().required()},
    role: {joi: Joi.string().valid(['ADMINISTRATOR', 'PROJECTMANAGER', 'DEVELOPER']).required()}
}, {
    joi: {
        extra: {
            // validates that when "email" is present, "password" must be too
            // when: ['email', 'password'],
        },
    }
});

/**
 * List entities query shortcut
 */
const list = {
    order: {property: 'email'}
};
employeeSchema.queries('list', list);

/**
 * Pre "save" middleware
 * Each time the entity is saved or updated, if there is a password passed, it will be hashed
 */
function hashPassword() {
    // scope *this* is the entity instance
    const _this = this;
    const password = this.password;

    if (!password) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        bcrypt.genSalt(5, function onSalt(err, salt) {
            if (err) {
                return reject(err);
            }
            ;

            bcrypt.hash(password, salt, null, function onHash(err, hash) {
                if (err) {
                    // reject will *not* save the entity
                    return reject(err);
                }
                ;

                _this.password = hash;

                // resolve to go to next middleware or save method
                return resolve();
            });
        });
    });
}

// add the "pre" middleware to the save method
employeeSchema.pre('save', hashPassword);

/**
 * Export the Employee Model
 * It will generate "Employee" entity kind in the Datastore
 */
module.exports = gstore.model('Employee', employeeSchema);