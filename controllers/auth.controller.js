//로그인,회원가입 관련 컨트롤러
const bcrypt = require('bcrypt');
const tokenService = require('../middlewares/auth.js');

const signup = async (req, res) => {
    try{
        const { id, password } = req.body;
        const db = req.app.get('db');

        if (!id || !password) {
            res.status(400).send({ 
                "code" : 400,
                "success" : false,
                "message" : "Invalid ID or password."
            });
            return;
        }

        const hashpw = await bcrypt.hash(password, 10);

        await db.collection('user').insertOne({
            id : id,
            password : hashpw,
        })
        res.send({
            "code": 200,
            "success": true,
            "token": `Bearer ${tokenService.getToken(id)}`,
            "id": id
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({ 
            "code": 500,
            "success": false,
            "message": "Server error."
        });
    }
};

const signin = async (req, res) => {
    try{
        const { id, password } = req.body;
        const db = req.app.get('db');

        const user = await db.collection('user').findOne({id});
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send({ 
                "code": 400,
                "success": false,
                "message": "WRONG_USERNAME_OR_PASSWORD" 
            });
        }

        res.send({ 
            "code": 200,
            "success": true,
            "token": `Bearer ${tokenService.getToken(id)}`,
            "id": id
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            "code": 500, 
            "success": false,
            "message": "Server error."
        });
    }
};

const idcheck = async(req, res) => {
    try{
        const { id } = req.body;
        const db = req.app.get('db');

        if (!id) {
            res.status(400).send({ 
                "code": 400,
                "id-check": false,
                "message": "Invalid ID."
            });
            return;
        }

        const exist_user = await db.collection('user').findOne({id});
        if (exist_user) {
            res.status(409).send({ 
                "code": 409,
                "id-check": false,
                "message": "User already exists."
            });
            return;
        }
        res.send({
            "code": 200,
            "id-check": true,
            "message": "Availabel ID."
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ 
            "code": 500,
            "success": false,
            "message": "Server error."
        });
    }
};


module.exports = { signup, signin, idcheck };