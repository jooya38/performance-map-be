//로그인,회원가입 관련 컨트롤러
const bcrypt = require('bcrypt');
const tokenService = require('../middlewares/auth.js');

const signup = async (req, res) => {
    try{
        const { id, password } = req.body;
        const db = req.app.get('db');

        if (!id || !password) {
            res.status(400).send({ "code" : "Invalid ID or password." });
            return;
        }

        const exist_user = await db.collection('user').findOne({id});
        if (exist_user) {
            res.status(400).send({ "code" : "User already exists." });
            return;
        }

        const hashpw = await bcrypt.hash(password, 10);

        await db.collection('user').insertOne({
            id : id,
            password : hashpw,
        })
        // res.redirect('/')
        res.send({
            "token": `Bearer ${tokenService.getToken(id)}`,
            "id": id
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({ "code" : "Server error." });
    }
};

const signin = async (req, res) => {
    try{
        const { id, password } = req.body;
        const db = req.app.get('db');

        const user = await db.collection('user').findOne({id});
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send({ "code": "WRONG_USERNAME_OR_PASSWORD" });
        }

        res.json({ 
            "token": `Bearer ${tokenService.getToken(id)}`,
            "id": id
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ "code" : "Server error." });
    }
};


module.exports = { signup, signin };