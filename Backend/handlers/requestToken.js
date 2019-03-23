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
exports.handler = function requestToken(req, res, next) {
  res.send('requestToken')
  next()
}
