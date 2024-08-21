const JWT = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')
const { generateToken, verifyToken } = require('../../utils/jwtHelper')
const { Customer, Employee } = require('../../models')

module.exports = {
  login: async (req, res, next) => {
    try {
      let user
      const { email, password } = req.body
      const exitEmployee = await Employee.findOne({ email: email })
      // const userCustomer = Customer.findOne({ email: email });
      // const [exitEmployee, exitCustomer] = await Promise.all([
      //   userEmployee,
      //   userCustomer,
      // ]);

      // if (exitCustomer) user = exitCustomer;
      if (exitEmployee) user = exitEmployee

      if (user && (await user.isValidPass(password))) {
        const token = await generateToken(
          user,
          process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
          process.env.EXPIRATION_ACCESS_TOKEN
          // 5
          // '1h'
        )
        const refreshToken = await generateToken(
          user,
          process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
          process.env.EXPIRATION_REFRESH_TOKEN
          // 15
        )
        return res.send(200, {
          message: 'Đăng nhập thành công',
          payload: {
            id: user._id,
            name: user.lastName,
            isAdmin: user.isAdmin,
            token: token,
            refreshToken: refreshToken
          }
        })
      } else {
        return res.send(404, {
          message: 'Sai mật khẩu hoặc email'
        })
      }
    } catch (err) {
      return res.send(500, { code: 500, error: err })
    }
  },

  refreshToken: async (req, res) => {
    try {
      const refreshTokenFromBody = req.body.refreshToken
      // Kiểm tra thời hạn của refreshToken
      // const accessTokenDecoded = await JwtProvider.verifyToken(refreshTokenFromCookies, REFRESH_TOKEN_SECRET_SIGNATURE)
      const accessTokenDecoded = await verifyToken(
        refreshTokenFromBody,
        process.env.REFRESH_TOKEN_SECRET_SIGNATURE
      )

      const accessToken = await generateToken(
        accessTokenDecoded.user,
        process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
        process.env.EXPIRATION_ACCESS_TOKEN
        
        // '1h'
      )

      res.status(StatusCodes.OK).json({ accessToken })
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
  }
}
