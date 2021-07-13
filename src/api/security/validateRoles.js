const log = require("../../log");

// Checks if a request context includes a set of roles.
// The endpointRolesList argument is expected to be in the format [{name: string, required: true | false}]
// where the "name" key of each entry is the name of a role and the "required" key indicates if the entire request should
// be rejected with a 403 if the role is not found.
// An example may be an endpoint GET /jobs which requires the role "user" to access. It may also return additional jobs
// details if the user is additionally an admin. The call to build the middleware would be
// validateRoles([{name: 'user', required: true},{name: 'admin', required: false}])
// Note that this middleware only makes sense with overloaded response behaviour from endpoints. If endpoints are
// guaranteed to have one and only one response regardless of the request context, a different middleware which checks
// for a list of required roles would be more appropriate.

const validateRoles = (endpointRolesList) => (req, res, next) => {
  next();
};

module.exports = validateRoles;
