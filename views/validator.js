const {check} = require('express-validator')
//const repo = require('./repository')
exports.verifyPasswordsMatch = (req, res, next) => {
  const {confirmPassword} = req.body.password2

  return check('password')
    .isLength({ min: 4 })
    .withMessage('password must be at least 4 characters')
    .equals(confirmPassword)
}