const { createHmac } = require('node:crypto');

const secret = Buffer.from('sua-senha-super-secreta').toString('hex');
const oneHourInMilliseconds = 60 * 60 * 1000;

const generateJWTTokenForUser = (userId) => {
    return new Promise((res, rej) => {
        try {
            const now = Date.now();
            const header = { alg: "HS256", typ: "JWT" };
            const headerBase64 = Buffer.from(JSON.stringify(header)).toString('base64url');
            const payload = { userId: userId, iat: now, iss: 'salao-api', exp: now + oneHourInMilliseconds };
            const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
            const data = headerBase64 + '.' + payloadBase64;
            const signature = createHmac('sha256', secret)
                .update(data)
                .digest('base64url');
            const jwt = headerBase64 + '.' + payloadBase64 + '.' + signature;
            res(jwt);
        }
        catch (err) { rej(err); }
    });
};

const validateJWTToken = (token) => {
    return new Promise((res, rej) => {
        try {
            const [encHeader, encPayload, candidateSignature] = token.split('.');
            const decodedPayload = JSON.parse(Buffer.from(encPayload, 'base64url').toString());
            const computedSignature = createHmac('sha256', secret)
                .update(encHeader + '.' + encPayload)
                .digest('base64url');
            const valid = computedSignature === candidateSignature;
            const result = { valid, payload: valid ? decodedPayload : undefined };
            if(valid && Date.now() > decodedPayload.exp){
                result.valid = false;
                result.payload = undefined;
            }
            res(result);
        } catch (err) {
            rej(err);
        }
    });
};

module.exports = { generateJWTTokenForUser, validateJWTToken };