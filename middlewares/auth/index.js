const authTools  = require('../../shared/Auth')
const {statusCodes} = require('../../utilities');
const {verify} = require('../../shared/Auth');
const config = require('../../config');

const mapRouteToUser = function({validRoles}) {
  return async(req, res, next) => {

    /* 
    * When we use this middleware, we prevent authenticated
    * users from modifying data belonging to other users.
    * Because if you check our auth flow, we pass everyone with
    * a valid jwt. which means that if raaj has a valid token 
    * and knows the _id of michael, he can modify michaels data.
    * But this middleware will prevent that from happening.
    */

    let {_id:userId, role} = req.user;
    let {id:paramsId} = req.params;
    let {path} = req.route;

    // all we are doing here is to enforce some permissions
    // migh group them all into one place

    if (path == `/` && validRoles.includes(role)) {
      return next()
    } else if (
      path == `/:id` && 
      (userId == paramsId || validRoles.includes(role))
      ) {
      return next()
    } else {
      return next(new Error('UnauthorizedError'))
    }
  }
}

const mapRouteToAdmin = (req, res, next) => {
  let {_id:userId} = req.user;
  let {id:paramsId} = req.params;
  let {path} = req.route;

  if (path == '/') return next()
  if (path == '/:id' && (userId == paramsId)) return next()

  return next(new Error('UnauthorizedError'))
}

const getId = function(path) {
  return path.split('/')[2]
}

const authenticate = ({whiteList=[]}) => async (req, res, next) => {
  const {url, method} = req;  

  for (const whiteChunk of whiteList) {
    let reqUrl = '';

    whiteChunk.clean 
      ? reqUrl = url.split('?')[0] 
      : reqUrl = url

    if ((reqUrl === whiteChunk.url) && (method === whiteChunk.method)) {
      req.whiteListed = true;
      return next()
    }
  }

  // if it doesnt pass our whiteList, we run validations
  if (req.headers && req.headers.auth && req.headers.auth.split(' ')[0] === 'JWT') {
    const token = req.headers.auth.split(' ')[1];

      // verify json web token
      verify(token, config.BS_SECRET).then(async (payload) => {

        // make sure the token is not expired
        if (payload.exp < Date.now()) {
          throw new Error('Expired Token')
        }

        // destructure em two props
       const {_id, role} = payload;

        let Adapter = authTools.mapRoleToAdapter(role.toLowerCase());

        let user = await Adapter.findByIdAndToken(_id, token);

        if (!user) {
          return next(new Error('Authentication Failed'))
        }

        req.payload = payload;
        req.user = user;
        req.token = token;
        req.paramsId = getId(req.path);

        return next()
      }).catch(next)
  } else {
    return next(new Error('Bad Request'))
  }
}

const userHasPermission = (validRoles, role) => {
  return validRoles.includes(role)
}

const authorize = function({name}) {
  return async function(req, res, next) {
    try {
      // pass whitelisted guys before running any complex logic
      if (req.whiteListed) {
        return next()
      } 

      const {
        user: {_id, auth: {token}, role}, 
        paramsId,
        token:deserialisedToken, 
      } = req;
      
      const {mapResourceToRoles} = authTools;
      const {[name]:validRoles} = mapResourceToRoles;
      
      if ((paramsId == _id) && (token === deserialisedToken)) {
        return next()
      } else if (userHasPermission(validRoles, role)) {
        return next()
      } else {
        return next(new Error('UnauthorizedError'))
      }
    } catch (error) {
      return next(error)
    }
  }
}


module.exports = {
  mapRouteToUser,
  mapRouteToAdmin,
  authenticate, 
  authorize
}