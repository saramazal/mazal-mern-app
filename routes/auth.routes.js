const {
    Router
} = require('express')
const bcrypt = require('bcrypt')
const {
    check,
    validationResult
} = require('express-validator')
const User = require('../models/User')
const router = Router()


// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Email invalid').isEmail(),
        check('password', 'Min 6 symbols')
        .isLength({
            min: 6
        })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Error'
                })
            }


            const {
                email,
                password
            } = req.body
            const candidate = await User.findOne({
                email
            })

            if (candidate) {
                return res.status(400).json({
                    message: "User already exist"
                })
            }
            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({
                email,
                password: hashedPassword
            })
            await user.save()
            res.status(200).json({
                message: "New User was created"
            })

        } catch (e) {
            res.status(500).json({
                message: e.message
            })
        }
    })

// /api/auth/login
router.post(
        '/login',
        [
check
        ],
        async (req, res) => {
            try {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array(),
                        message: 'Error'
                    })





                } catch (e) {
                    res.status(500).json({
                        message: e.message
                    })
                }
            })


        module.exports = router