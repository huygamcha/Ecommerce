const { StatusCodes } = require('http-status-codes')
const { verifyToken } = require('../utils/jwtHelper')

const isAuthorized = async (req, res, next) => {
  const accessTokenFromHeader = req.headers.authorization
  if (!accessTokenFromHeader) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Không có token' })
  }
  try {
    const accessTokenDecoded = await verifyToken(
      accessTokenFromHeader.substring('Bearer '.length),
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    req.JwtProvider = accessTokenDecoded.user
    next()
  } catch (error) {
    // Trường hợp 1 khi accessToken hết hạn
    if (error.message?.includes('jwt expired')) {
      return res.status(StatusCodes.GONE).json({ message: 'Cần refresh token' })
    }
    // Ngoài trường hợp 1
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Bạn chưa đăng nhập kìa' })
  }
}

module.exports = isAuthorized
