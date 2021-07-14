const DBRepository = require("../repository/dbRepository");
const DBService = require("../services/dbService");
const AuthService = require("./authService");

class ServiceRegistry {
  constructor(
    dbService,
    authService
  ) {
    this.dbService = dbService;
    this.authService = authService;
  }
}

let serviceRegistry;

const initialize = (models) => {
  if (!serviceRegistry) {
    const dbRepositoryInstance = new DBRepository(models);
    const dbServiceInstance = new DBService(dbRepositoryInstance);
    const authServiceInstance = new AuthService(dbServiceInstance);

    const newServiceRegistry = new ServiceRegistry(
      dbServiceInstance,
      authServiceInstance
    );

    Object.freeze(newServiceRegistry);
    serviceRegistry = newServiceRegistry;
  }
};

const getInstance = () => {
  if (!serviceRegistry) throw Error("Cannot get service registry before it's initialized");
  return serviceRegistry;
};

module.exports = {
  initialize,
  getInstance,
  ServiceRegistry
};
