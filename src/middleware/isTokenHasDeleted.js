const User = require('../models/user');
// check is token was deleted
const isTokenHasDeleted = async (req, res, next) => {
  const tokenFromHeder = req.header('Authorization').replace('Bearer ', '');
  const userHasdeletedToken = await User.findOne({ "deletedtokens.tokenFromHeder": tokenFromHeder })
  if (userHasdeletedToken) {
    return res.status(400).send("token has deleted")
  }
  next();
}
module.exports = isTokenHasDeleted;
