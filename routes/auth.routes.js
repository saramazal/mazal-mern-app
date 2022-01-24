const { Router } = require('express')
const config = require('config')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
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
                    message: 'Incorrect registration data'
                })
            }

            const { email, password} = req.body
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
            res.status(201).json({
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
    check('email', 'Please enter a valid email').normalizeEmail().isEmail(),
    check('password', 'enter password').exists()
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Incorrect login data'
      })
    }

    const {email, password} = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: 'User is not found' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password, please try again' })
    }

    const token = jwt.sign(
      { userId: user.id },
      config.get('jwtSecret'),
      { expiresIn: '1h' }
    )

    res.json({ token, userId: user.id })

  } catch (e) {
    res.status(500).json({ message: 'Something went wrong, please try again' })
  }
})


module.exports = router