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
    name: String,
    varibale: [String],
    equation: String,
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
module.exports = router