const router = require('express').Router()
const mongoose = require('mongoose')
const College = require('../../models/college')

router.get('/', (req, res, next) => {
    College.find({ active: true }, 'name city _id', (err, colleges) => {
        if (err) next(err)
        res.status(200).send({ colleges: colleges })
    })
})

module.exports = router
