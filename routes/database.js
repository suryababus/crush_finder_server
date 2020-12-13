var mysql = require('mysql');
const util = require('util');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password"
});
const query = util.promisify(con.query).bind(con);
const crypto = require('crypto');
const { rejects } = require('assert');


con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    connected = true
});

exports.addUser = (name, password, ip, res) => {
    var sql = `INSERT INTO crushfinder.users (name, password,ip) VALUES ('${name}', '${password}','${ip}')`;
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err.message);
            const errcode = err.code
            var responseJson = {
                status: "failure",
                details: "Error"
            }
            if (errcode == 'ER_DUP_ENTRY') {
                responseJson.details = "username already taken"
            }
            res.send(responseJson)
        } else {
            console.log(result);
            res.send({
                status: "success",
                details: "user created"
            })
        }
    });
}

exports.login = (name, password, ip, res) => {
    var sql = `SELECT id,name,password,ip FROM crushfinder.users WHERE name='${name}' limit 1`;
    con.query(sql, async function (err, result) {
        var response = {}
        if (err) {
            console.log(err)
            response.status = "failure"
            response.details = "user not found"
        } else {
            const user = result[0]
            if (user) {
                if (user.password != password) {
                    response.status = "failure"
                    response.details = "Password mismatch"
                } else {
                    const token = crypto.randomBytes(48).toString('hex');
                    var sql = `INSERT INTO crushfinder.authtable (authtoken,user_id) VALUES ('${token}','${user.id}')`;
                    console.log(token)
                    await query(sql).then(data => {
                        console.log(data)
                        response.status = "success"
                        response.details = {
                            user_id: user.id,
                            user_name: user.name,
                            authtoken: token
                        }
                    }).catch(err => {
                        console.log(err)
                        response.status = "failure"
                        response.details = "internal error"
                    })
                }
            } else {
                response.status = "failure"
                response.details = "user not found"
            }
            console.log(result)
            res.send(response)
        }
    })
}

validateAuthtoken = async (authtoken) => {
    var sql = `SELECT user_id from crushfinder.authtable where authtoken='${authtoken}'`;
    const result = await query(sql)

    return result
}



exports.addToCrushList = (userid, username, crushname, ip, res) => {
    var sql = `INSERT INTO crushfinder.crushlist (user_id,username,crushname) values('${userid}','${username}','${crushname}')`;
    con.query(sql, function (err, result) {
        var response = {}
        if (err) {
            console.log(err)
            response.status = "failure"
            response.details = "Error"
        } else {

            response.status = "success"
            response.details = "Added"
        }

        console.log(result)
        res.send(response)
    })
}

exports.getList = async (authtoken, res) => {
    const data = await validateAuthtoken(authtoken)
    console.log(data)
    var response = {}
    if (data[0]) {
        const user_id = data[0].user_id
        console.log(user_id)
        var sql = `SELECT username,crushname,createdtime from crushfinder.crushlist where user_id='${user_id}' limit 100`;
        await query(sql).then((data) => {
            response.status = "success"
            response.details = data
            console.log(data)
        }).catch(err => {
            response.status = "failure"
            response.details = "Auth failure"
            console.log(err)
        })
    } else {
        response.status = "failure"
        response.details = "Auth failure"
    }
    res.send(response)
}