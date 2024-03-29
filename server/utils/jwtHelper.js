const JWT = require("jsonwebtoken");

const generateToken = (user) => {
  const expiresIn = "24h";
  const algorithm = "HS25s6";

  return JWT.sign(
    {
      iat: Math.floor(Date.now() / 1000),
      user,
      algorithm,
    },
    process.env.SECRET,
    // "ADB57C459465E3ED43C6C6231E3C9",
    {
      expiresIn,
    }
  );
};

const generateRefreshToken = (id) => {
  const expiresIn = "30d";

  return JWT.sign({ id }, process.env.SECRET, { expiresIn });
};

module.exports = {
  generateToken,
  generateRefreshToken,
};
