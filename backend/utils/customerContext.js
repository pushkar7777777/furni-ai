const getUserIdFromRequest = (req) => {
  const headerValue = req.headers["x-user-id"];
  const userId = Number(headerValue);

  if (!userId) {
    const error = new Error("Please log in to continue");
    error.statusCode = 401;
    throw error;
  }

  return userId;
};

module.exports = { getUserIdFromRequest };
