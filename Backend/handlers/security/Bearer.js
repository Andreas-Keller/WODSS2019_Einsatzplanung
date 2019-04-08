/**
 * Bearer
 */
function decodeToken(req) {
    let jwt = require('jsonwebtoken');
    return jwt.decode(req.headers.authorization.split(' ')[1]);
}

function verify(token, req) {
    let role = token.role;
    switch (req.url) {
        case "/api​/allocation":
            switch (req.method) {
                case 'GET':
                    if (role === 'ADMINISTRATOR' || role === 'PROJECTMANAGER' || role === 'DEVELOPER') {
                        return true;
                    }
                    break;
                case 'POST':
                    if (role === 'ADMINISTRATOR' || role === 'PROJECTMANAGER') {
                        return true;
                    }
                    break;
            }
            break;
        case "/api​/allocation​/{id}":
            switch (req.method) {
                case 'GET':
                    if (role === 'ADMINISTRATOR' || role === 'PROJECTMANAGER' || role === 'DEVELOPER') {
                        return true;
                    }
                    break;
                case 'PUT':
                    if (role === 'ADMINISTRATOR' || role === 'PROJECTMANAGER') {
                        return true;
                    }
                    break;
                case 'DELETE':
                    if (role === 'ADMINISTRATOR' || role === 'PROJECTMANAGER') {
                        return true;
                    }
                    break;
            }
            break;
        case "/api​/contract":
            switch (req.method) {
                case 'GET':
                    if (role === 'ADMINISTRATOR' || role === 'PROJECTMANAGER' || role === 'DEVELOPER') {
                        return true;
                    }
                    break;
                case 'POST':
                    if (role === 'ADMINISTRATOR') {
                        return true;
                    }
                    break;
            }
            break;
        case "/api​/contract​/{id}":
            switch (req.method) {
                case 'GET':
                    if (role === 'ADMINISTRATOR' || role === 'PROJECTMANAGER' || role === 'DEVELOPER') {
                        return true;
                    }
                    break;
                case 'PUT':
                    if (role === 'ADMINISTRATOR') {
                        return true;
                    }
                    break;
                case 'DELETE':
                    if (role === 'ADMINISTRATOR') {
                        return true;
                    }
                    break;
            }
            break;
        case "/api​/employee":
            switch (req.method) {
                case 'GET':
                    if (role === 'ADMINISTRATOR' || role === 'PROJECTMANAGER' || role === 'DEVELOPER') {
                        return true;
                    }
                    break;
                case 'POST':
                    if (role === 'ADMINISTRATOR') {
                        return true;
                    }
                    break;
            }
            break;
        case "/api​/employee​/{id}":
            switch (req.method) {
                case 'GET':
                    if (role === 'ADMINISTRATOR' || role === 'PROJECTMANAGER' || role === 'DEVELOPER') {
                        return true;
                    }
                    break;
                case 'PUT':
                    if (role === 'ADMINISTRATOR') {
                        return true;
                    }
                    break;
                case 'DELETE':
                    if (role === 'ADMINISTRATOR') {
                        return true;
                    }
                    break;
            }
            break;
        case "/api​/project":
            switch (req.method) {
                case 'GET':
                    if (role === 'ADMINISTRATOR' || role === 'PROJECTMANAGER' || role === 'DEVELOPER') {
                        return true;
                    }
                    break;
                case 'POST':
                    if (role === 'ADMINISTRATOR') {
                        return true;
                    }
                    break;
            }
            break;
        case "/api​/project​/{id}":
            switch (req.method) {
                case 'GET':
                    if (role === 'ADMINISTRATOR' || role === 'PROJECTMANAGER' || role === 'DEVELOPER') {
                        return true;
                    }
                    break;
                case 'PUT':
                    if (role === 'ADMINISTRATOR' || role === 'PROJECTMANAGER') {
                        return true;
                    }
                    break;
                case 'DELETE':
                    if (role === 'ADMINISTRATOR') {
                        return true;
                    }
                    break;
            }
            break;
    }
    return false;
}

module.exports = function Bearer(req, res, next) {
    if (req.url === '/api/token') {
        //LOGIN DOES NOT REQUIRE A TOKEN
    } else {
        const token = decodeToken(req);
        if (!verify(token, req)) {
            const error = new Error('Unauthorized');
            error.status = error.statusCode = 401;
            next(error);
        }
    }
    next();
};
