var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const { Schema } = mongoose;
mongoose.connect('mongodb://localhost/calculator')
    .then(() => {
        console.log('Connected to mongodb')
    })
    .catch(() => {
        console.log('error connecting to mongodb')
    })

const formulaSchema = new Schema({
    title: String,
    variables: [String],
    formula: String,
    createdTime: { type: Date, default: Date.now },
    active: Boolean
})
const Formula = mongoose.model('Formula', formulaSchema)

router.get("/formulas", (req, res, next) => {
    Formula.find({}).then((formulas) => {
        res.send({
            status: "success",
            details: formulas
        })
    }).catch(() => {
        res.send({
            status: "failure",
            details: "Internal server error"
        })
    })
})
router.post("/formulas", (req, res, next) => {
    let userFormula = req.body
    let ckey = req.headers.ckey
    console.log(req)
    if (ckey != "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMywidXNlcl9uYW1lIjoidGVzdHVzZXIxIiwiaWF0IjoxNjA5MTUyNTQyfQ.xHznA7hGGCAjOGFbxTfRsyOEicmYm79nutzlnSjUwCU") {
        res.send({
            status: "failure",
            details: 'CKey not valid'
        })
        return
    }
    userFormula.active = false
    const formula = new Formula(userFormula)
    formula.save().then((data) => {
        console.log('created:', data)

        res.send({
            status: "success",
            details: 'formula added',
            id: data['_id']
        })
    }).catch(() => {
        res.send({
            status: "failure",
            details: 'formula not added'
        })
    })


})

router.delete("/formulas", (req, res, next) => {
    const secreteKey = req.headers.key
    const id = req.headers.id
    if (secreteKey == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMywidXNlcl9uYW1lIjoidGVzdHVzZXIxIiwiaWF0IjoxNjA5MTUyNTQyfQ.xHznA7hGGCAjOGFbxTfRsyOEicmYm79nutzlnSjUwCU") {
        Formula.findOneAndDelete({ _id: id }).then(() => {
            res.send("Success")
        }).catch(() => {
            res.send("failure")
        })
    } else {
        res.send("failure")
    }



})
module.exports = router