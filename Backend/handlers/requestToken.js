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

const controller = require('../mongodb/controllers/token.controller')


exports.handler = function requestToken(req, res, next) {
    controller.requestToken(req,res,next)
}
