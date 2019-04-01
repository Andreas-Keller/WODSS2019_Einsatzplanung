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
            message: 'Authentication failed! Please check the request'
        });
    } else {
        const firebase = require('./firebase.admin.js');
        let employees = firebase.db.collection('employees');
        employees.where("emailAddress", '==', emailAddress).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching documents. (findBy)');
                    res.status(404).send({
                        success: false,
                        message: 'Authentication failed! Please check the request'
                    });
                }
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    if (doc.data().password === rawPassword) {
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
                });
            })
            .catch(err => {
                console.log('Error getting employee', err);
                res.status(500).send({
                    success: false,
                    message: 'Authentication failed! Internal Error'
                });
            });
    }
    next()
};
