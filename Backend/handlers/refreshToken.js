/**
 * Request an updated&#x2F;refreshed JWT token by providing the current valid one (Maybe soon expired?). The returned token contains the full employee, accessible via the claim employee
 *
 * PUT: /api/token
 * 
 * body:
 *   token {string} Login token with the employee claim that contains the full employee as JSON object (You can use a to...
 *   
 */
exports.handler = function refreshToken(req, res, next) {
  res.send('refreshToken')
  next()
}
