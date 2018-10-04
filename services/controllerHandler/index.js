/**
 * Handles controller execution and responds to user (API Express version).
 * Web socket has a similar handler implementation.
 * @param {responseHandler, requestType} Config we pass to module
 * @param promise Controller Promise. I.e. getUser.
 * @param params A function (req, res, next), all of which are optional
 * that maps our desired controller parameters. I.e. (req) => [req.params.username, ...].
*/


module.exports = function(promise, params){
  return async function(req, res, next) {
    const boundParams = params ? params(req, res, next) : [];

    try {
      const data = await promise(...boundParams);
      return res.status(data.code).json(data)
    } catch (error) {
      return next(error)
    };
  };
}