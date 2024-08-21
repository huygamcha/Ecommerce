const JWT = require('jsonwebtoken')

const generateToken = async (user, secretSignature, tokenLife) => {
  const ALGORITHM_JWT = process.env.ALGORITHM_JWT
  try {
    return JWT.sign({ user }, secretSignature, {
      algorithm: ALGORITHM_JWT,
      expiresIn: tokenLife
    })
  } catch (error) {
    throw new Error(error)
  }
}

const verifyToken = async (token, secretSignature) => {
  try {
    return JWT.verify(token, secretSignature)
  } catch (error) {
    throw new Error(error)
  }
}

const generateRefreshToken = (id) => {
  const EXPIRATION_REFRESH_TOKEN = process.env.EXPIRATION_REFRESH_TOKEN
  return JWT.sign({ id }, process.env.REFRESH_TOKEN_SECRET_SIGNATURE, { EXPIRATION_REFRESH_TOKEN })
}

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken
}
