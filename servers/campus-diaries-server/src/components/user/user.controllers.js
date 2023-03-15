const loginUser = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, msg: 'This method will be implemented soon' });
  } catch(err) {
    next(err);
  }
};

module.exports = {
  loginUser: loginUser,
}