const Employee = require('../domain/employee.js');
const jwt = require('jsonwebtoken');

const requestToken = (req ,res, next) => {

    Employee.find((err, employees) => {
        if(err) {
            res.status(412).json(err)
        }
        return employees
        })
        .then(employees => employees.filter( e => e.emailAddress === req.body.emailAddress && e.password === req.body.rawPassword))
        .then(hit => jwt.sign(hit[0].toJSON() , 'secret123'))
        .then(token => {
            res.status(201).send({ token: token});
        })
        .catch(err => {
            // todo throw err http status
            console.log(err)
        })
    //todo next() necessary?
     //next()
};

const refreshToken = undefined;


module.exports = {
    requestToken,
    refreshToken,
};
