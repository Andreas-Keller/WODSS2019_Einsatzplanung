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

    const employees = require('../firestore/employee.crud.js');

    let employee = await employees.findBy("emailAddress", emailAddress);
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
    // //TODO check if in database and password okay, if yes return jwt
    // token = {token: 'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJGSE5XIHdvZHNzIiwic3ViIjoiTG9naW4gdG9rZW4iLCJlbXBsb3llZSI6eyJpZCI6MSwiZmlyc3ROYW1lIjoiU2ltb24iLCJsYXN0TmFtZSI6IldhZWNodGVyIiwiZW1haWxBZGRyZXNzIjoic2ltb24ud2FlY2h0ZXJAc3R1ZGVudHMuZmhudy5jaCIsInJvbGUiOiJBRE1JTklTVFJBVE9SIiwiYWN0aXZlIjp0cnVlfSwiaWF0IjoxNTE2MjM5MDIyfQ.3eFaVQ_QOJSFq8CnIudMGNnvzCQFRblTR9K5yxXmfClczT3UN6ZrFZ5eKUc0L1H-67ROPv5hz_odMq867P9ofA'}
    // res.status(201).send(token)
    next()
}
