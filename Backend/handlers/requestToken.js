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
exports.handler = async

function requestToken(req, res, next) {
    let jwt = require('jsonwebtoken');
    let emailAddress = req.body.emailAddress;
    let rawPassword = req.body.rawPassword;

    const employees = require('../firebase/employee.crud.js');

    let employee = await employees.findBy("emailAddress", emailAddress);
    if (employee === 404) {
        res.send(404).json({
            success: false,
            message: 'Authentication failed! Please check the request'
        });
    } else if (employee === 500) {
        res.send(500).json({
            success: false,
            message: 'Authentication failed! Internal Error'
        });
    } else {
        if (emailAddress && rawPassword) {
            if (employee.data().emailAddress === emailAddress && employee.data().password === rawPassword) {
                let token = jwt.sign({emailAddress: emailAddress},
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '24h' // expires in 24 hours
                    }
                );
                // return the JWT token for the future API calls
                res.send(201).json({
                    success: true,
                    message: 'Authentication successful!',
                    token: token
                });
            } else {
                res.send(403).json({
                    success: false,
                    message: 'Incorrect username or password'
                });
            }
        } else {
            res.send(400).json({
                success: false,
                message: 'Authentication failed! Please check the request'
            });
        }
    }
    next()
};
