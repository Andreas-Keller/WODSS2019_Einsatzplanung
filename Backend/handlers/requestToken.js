/**
 * Request a JWT token by an initial login process. The returned token contains the full employee, accessible via the claim employee
 *
 * POST: /api/token
 *
 * body:
 *   emailAddress {string} Employee email address.
 *   rawPassword {string} Raw employee password.
 *
 */
exports.handler = async function requestToken(req, res, next) {
    let jwt = require('jsonwebtoken');
    let emailAddress = req.body.emailAddress;
    let rawPassword = req.body.rawPassword;

    if (emailAddress == null || rawPassword == null) {
        res.status(412).send({
            success: false,
            message: 'Authentication failed! Please check the request'
        });
    } else {
        const employees = require('../firebase/employee.crud.js');

        let employee = await employees.findByEmail(emailAddress);
        if (employee === 404) {
            res.status(404).send({
                success: false,
                message: 'Authentication failed! Please check the request'
            });
        } else if (employee === 500) {
            res.status(500).send({
                success: false,
                message: 'Authentication failed! Internal Error'
            });
        } else {
            if (employee.data().emailAddress === emailAddress && employee.data().password === rawPassword) {
                let token = jwt.sign({emailAddress: emailAddress},
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '24h' // expires in 24 hours
                    }
                );
                // return the JWT token for the future API calls
                res.status(201).send({
                    success: true,
                    message: 'Authentication successful!',
                    token: token
                });
            } else {
                res.status(404).send({
                    success: false,
                    message: 'Incorrect username or password'
                });
            }
        }
    }
    next()
};
