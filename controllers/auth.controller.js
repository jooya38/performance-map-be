//로그인,회원가입 관련 컨트롤러
const bcrypt = require('bcrypt');
const { User } = require('../models/User');
const tokenService = require('../middlewares/auth.js');

const signup = async (req, res) => {
    try{
        console.log(req.body);
        const { id, password } = req.body;

        if (!id || !password) {
            res.status(400).json({ 
                "code" : 400,
                "success" : false,
                "message" : "Invalid ID or password."
            });
            return;
        }

        const exist_user = await User.findOne({ id });
        if (exist_user) {
        return res.status(409).json({
            "code": 409,
            "success": false,
            "message": "User already exists.",
        });
        }

        const hashpw = await bcrypt.hash(password, 10);

        const newUser = new User({ id, password: hashpw, email: ""  });
        
        await newUser.save();
        res.status(200).json({
            "code": 200,
            "success": true,
            "token": `Bearer ${tokenService.getToken(newUser.id)}`,
            "id": newUser.id,
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

        const user = await User.findOne({ id });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send({ 
                "code": 400,
                "success": false,
                "message": "WRONG_USERNAME_OR_PASSWORD" 
            });
        }

        res.status(200).send({ 
            "code": 200,
            "success": true,
            "token": `Bearer ${tokenService.getToken(user.id)}`,
            "id": user.id,
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

        if (!id) {
            res.status(400).send({ 
                "code": 400,
                "id-check": false,
                "message": "Invalid ID."
            });
            return;
        }

        const exist_user = await User.findOne({id});
        if (exist_user) {
            res.status(409).send({ 
                "code": 409,
                "id-check": false,
                "message": "User already exists."
            });
            return;
        }
        res.status(200).send({
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