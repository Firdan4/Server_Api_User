const {user} = require('../models')
const bcrypt = require("bcrypt")

exports.register = async (req, res, next) => {
    try {
        const inserData = req.body

        const hashedPassword = bcrypt.hashSync(inserData.password, 8)

        const valid = await user.findOne({ where: {email: inserData.email} })
        if (valid) return res.status(409).send(`email sudah terdaftar`)


        const regis = await user.create({
            firstname: inserData.firstname,
            lastname: inserData.lastname,
            username: inserData.username,
            email: inserData.email,
            password: hashedPassword
        })

        res.status(201).send({
            message: `User Created`,
            id: regis
        })
    } catch (error) {
        return res.status(500).send({
            error: error
        })
    }
}

exports.login = async (req, res, next) => {
    try {
        const payload = req.body
        
        const getUser = await user.findOne({
            where: {email: payload.email}
        })
        if (!getUser) return res.status(404).send(`user notfond`)

        const comparePassword = bcrypt.compareSync(payload.password, getUser.dataValues.password)
        
        if (comparePassword) {
            return res.status(200).send(`user login succesfully`)
        } else {
            return res.status (400).send(`password salah`)
        }
    } catch (error) {
        return res.status(500).send({
            error: error
        })
    }
}