var express = require('express');
var router = express.Router();
var db = require('./database')



router.post("/signup", (req, res, next) => {
    const username = req.headers.name
    const password = req.headers.password
    const ip = req.ip
    const result = db.addUser(username, password, ip, res)
})

router.post("/login", (req, res, next) => {
    const username = req.headers.name
    const password = req.headers.password
    const ip = req.ip
    db.login(username, password, ip, res)
})
router.post("/add/:user_id", (req, res, next) => {
    const userid = req.params['user_id']
    const username = req.query['username']
    const crushname = req.query['crushname']
    const ip = req.ip
    db.addToCrushList(userid, username, crushname, ip, res)
    // res.send({
    //     userid,
    //     username,
    //     crushname
    // })
})

router.post("/getlist", (req, res, next) => {
    const authtoken = req.headers.authtoken
    db.getList(authtoken, res)
})


module.exports = router