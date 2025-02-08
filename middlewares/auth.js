//토큰 생성(인증)
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;

const tokenService = {
    getToken(id) {
        return jwt.sign({id}, SECRET_KEY, {
            expiresIn: '1d'
        });
    },

    getPayload(token){
        return jwt.verify(token, SECRET_KEY);
    }
}

module.exports = tokenService;