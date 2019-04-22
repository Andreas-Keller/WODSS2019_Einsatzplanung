function decodeToken(req) {
    let jwt = require('jsonwebtoken');
    let token = jwt.decode(String(req.headers.authorization).split(' ')[1]);
    // console.log(token);
    return token;
}

module.exports = {decodeToken};