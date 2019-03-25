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
    token = {token: 'eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJGSE5XIHdvZHNzIiwic3ViIjoiTG9naW4gdG9rZW4iLCJlbXBsb3llZSI6eyJpZCI6MSwiZmlyc3ROYW1lIjoiU2ltb24iLCJsYXN0TmFtZSI6IldhZWNodGVyIiwiZW1haWxBZGRyZXNzIjoic2ltb24ud2FlY2h0ZXJAc3R1ZGVudHMuZmhudy5jaCIsInJvbGUiOiJBRE1JTklTVFJBVE9SIiwiYWN0aXZlIjp0cnVlfSwiaWF0IjoxNTE2MjM5MDIyfQ.3eFaVQ_QOJSFq8CnIudMGNnvzCQFRblTR9K5yxXmfClczT3UN6ZrFZ5eKUc0L1H-67ROPv5hz_odMq867P9ofA'}
    res.send(token)
    next()
}
