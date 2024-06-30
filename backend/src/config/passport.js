const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const user = require('../models/User');
const student = require('../models/Students');
const jwt = require('jsonwebtoken');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                console.log(email, password);
                const foundUser = await user.findOne({ email });

                if (!foundUser) {
                    const foundStudent = await student.findOne({ correo: email });

                    if (!foundStudent) {
                        return done(null, false, { message: 'Usuario no encontrado' });
                    } else {
                        const match = await foundStudent.matchPassword(password);

                        if (!match) {
                            return done(null, false, { message: 'Contraseña incorrecta' });
                        } else {
                            if (foundStudent.status === 'UNVERIFIED') {
                                return done(null, false, { message: 'Por favor, verifica tu cuenta' });
                            } else {
                                const token = jwt.sign({ _id: foundStudent._id, rol: foundStudent.rol }, 'secretkey');
                                foundStudent.token = token;
                                const userObject = {
                                    student: foundStudent,
                                    token: token,
                                };
                                return done(null, userObject);
                            }
                        }
                    }
                } else {
                    const match = await foundUser.matchPassword(password);
                    if (match) {
                        const token = jwt.sign({ _id: foundUser._id, rol: foundUser.roles }, 'secretkey');
                        foundUser.token = token;
                        return done(null, foundUser, { success: true });
                    } else {
                        return done(null, false, { message: 'Contraseña incorrecta' });
                    }
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    user.findById(id)
        .then((user) => {
            done(null, user);
        })
        .catch((error) => {
            done(error, null);
        });
});
