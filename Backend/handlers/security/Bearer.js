/**
 * Bearer
 */
module.exports = function Bearer(req, res, next) {
  // TODO: implement decodeToken and getTokenScopes
  //const token = decodeToken(req)
  //if (token) {
  //  const scopes = getTokenScopes(token)
  //  next(req.verifyScopes(scopes))
  //} else {
  //   const error = new Error('Unauthorized')
  //   error.status = error.statusCode = 401
  //   next(error)
  //}
    next()
}
