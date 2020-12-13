var express = require('express');
var router = express.Router();
var db = require('./database')



router.post("/signup", (req, res, next) => {
    const username = req.headers.name
    const password = req.headers.password
    const ip = req.ip
    if (username || password) {
        db.addUser(username, password, ip, res)
    } else {
        res.send({
            status: "failure",
            details: "mandatory not found.(name, password)"
        })
    }
})

router.post("/login", (req, res, next) => {
    const username = req.headers.name
    const password = req.headers.password
    const ip = req.ip
    if (username || password) {
        db.login(username, password, ip, res)
    } else {
        res.send({
            status: "failure",
            details: "mandatory not found.(name, password)"
        })
    }
})
router.post("/add/:user_id", (req, res, next) => {
    const userid = req.params['user_id']
    const username = req.query['username']
    const crushname = req.query['crushname']
    const ip = req.ip
    if (userid || username || crushname) {
        db.addToCrushList(userid, username, crushname, ip, res)
    } else {
        res.send({
            status: "failure",
            details: "mandatory not found.(username, crushname)"
        })
    }
})

router.post("/getlist", (req, res, next) => {
    const authtoken = req.headers.authtoken
    if (authtoken) {
        db.getList(authtoken, res)
    } else {
        res.send({
            status: "failure",
            details: "mandatory not found.(authtoken)"
        })
    }
})


module.exports = router