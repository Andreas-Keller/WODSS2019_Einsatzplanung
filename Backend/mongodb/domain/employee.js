"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    firstName: String,
    lastName: String,
    emailAddress: String,
    password: String,
    active: Boolean,
    role: String,
}, {
    collection: "employees",
});

/**
 * List entities query shortcut

    const list = {
        order: {property: 'emailAddress'}
    };
    employeeSchema.queries('list', list);
*/

/*
 * We need a field called 'id' to be compatible with Spring Mongo document.
 * Make it virtual so this field is not persisted.
 */
employeeSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

/*
 * Activate the usage of virtual fields if toJSON method is called.
 */
employeeSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Employee', employeeSchema);
