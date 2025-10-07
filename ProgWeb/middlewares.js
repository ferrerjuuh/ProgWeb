const { validateJWTToken } = require('./jwt');

const logMiddleware = (req, res, next) => {
    const startTime = Date.now();
    const formatLog = (method, url, statusCode, userId, duration) =>
        `${method.padEnd(6, ' ')} ${url.padEnd(25, ' ')} - user: ${userId ? userId.toString().padEnd(9, ' ') : 'anonimous'} - ${statusCode} - ${duration}ms`;

    res.on('finish', () => {
        const { method, url } = req;
        const { statusCode } = res;
        const { userId } = res.locals; // Pega o userId do res.locals
        const duration = Date.now() - startTime;
        console.log(formatLog(method, url, statusCode, userId, duration));
    });
    next();
};

const corsMiddleware = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
};

const authorizationMiddleware = (req, res, next) => {
    const { headers } = req;
    const { authorization } = headers;
    if (!authorization) return res.status(403).send('Authorization header expected with credential token');

    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer') return res.status(400).send('Malformed header: Expected "authorization: Bearer <JWT Token>"');
    if (!token || token.split('.').length !== 3) return res.status(400).send('Malformed token: Expected "<header base64>.<payload base64>.<signature base64>"');

    validateJWTToken(token)
        .then(t => {
            const { valid, payload } = t;
            if (!valid) return res.status(403).send('Invalid token');

            res.locals.userId = payload.userId; // Armazena o userId para o log
            next();
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send('Error validating token');
        });
};

module.exports = { logMiddleware, corsMiddleware, authorizationMiddleware };