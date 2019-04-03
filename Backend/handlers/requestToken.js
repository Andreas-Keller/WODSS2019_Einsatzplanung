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
    let emailAddress = "" + req.body.emailAddress;
    let rawPassword = "" + req.body.rawPassword;

    if (emailAddress == null || rawPassword == null) {
        res.status(412).send({
            success: false,
            message: 'Precondition for the username/password failed'
        });
    } else {
        const employeeFirebase = require('../firebase/employee.crud.js');
        let foundUser = await employeeFirebase.findBy("emailAddress", emailAddress);
        console.log(foundUser);
        if (foundUser === 500) {
            res.status(foundUser).send('Uncaught or internal server error');
        } else if (foundUser === 404) {
            res.status(404).send('Employee not found or invalid password')
        } else {
            if (foundUser.data().emailAddress === emailAddress && foundUser.data().password === rawPassword) {
                let token = jwt.sign(foundUser.data(),
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
                    message: 'Employee not found or invalid password'
                });
            }
        }
    }
    next()
};
