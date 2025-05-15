import passport from 'passport'
// creating require in ES6 module
import {createRequire} from "module"
const require = createRequire(import.meta.url)
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
import bcrypt from 'bcryptjs'
import User from '../models/user.js'

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email })

        if (!user) {
            return done(null, false, { error: 'Incorrect email or password' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return done(null, false, { error: 'Incorrect email or password' })
        }

        done(null, user)
    } catch (error) {
        done(error)
    }
}))


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOne({ email: profile.emails[0].value})

        if (user) {
            return done(null, user)
        }

        const newUser = await User.create({
            _id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profile: profile.photos[0].value
        })  

        await newUser.save()

        done(null, newUser)
    } catch (error) {
        done(error)
    }
}))


passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await User.findOne({ _id: userId })

        if (!user) {
            return done(new Error('User not found'))
        }

        done(null, user)
    } catch (error) {
        done(error)
    }
})

