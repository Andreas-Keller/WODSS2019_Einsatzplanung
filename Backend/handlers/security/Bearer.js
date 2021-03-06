/**
 * Bearer
 */

function verify(token, req) {
    if (token === null) {
        return false
    }

    let role = token.role;
    let url = String(req.url);
    let method = String(req.method)

    url = url.split('?')[0];

    if (req.params.id !== undefined) {
        url = url.replace("/" + req.params.id, '');
    }

    switch (url) {
        case '/api/allocation':
            switch (method) {
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
        case '/api/contract':
            switch (method) {
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
        case '/api/employee':
            switch (method) {
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
        case '/api/project':
            switch (method) {
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
        if (req.headers.authorization == null) {
            const error = new Error('Unauthenticated or invalid token');
            error.status = error.statusCode = 401;
            next(error);
        } else {
            //console.log("OTHER");
            const util = require("../../util/Util");
            const token = util.decodeToken(req);
            if (!verify(token, req)) {
                const error = new Error('Unauthenticated or invalid token');
                error.status = error.statusCode = 401;
                next(error);
            }
        }
    }
    next();
};
