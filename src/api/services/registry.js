const DBRepository = require("../repository/dbRepository");
const DBService = require("../services/dbService");
const NonceService = require("../services/nonceService");

class ServiceRegistry {
  constructor(
    dbService,
    nonceService
  ) {
    this.dbService = dbService;
    this.nonceService = nonceService;
  }
}

let serviceRegistry;

const initialize = (models) => {
  if (!serviceRegistry) {
    const dbRepositoryInstance = new DBRepository(models);
    const dbServiceInstance = new DBService(dbRepositoryInstance);
    const nonceServiceInstance = new NonceService(dbRepositoryInstance);

    const newServiceRegistry = new ServiceRegistry(
      dbServiceInstance,
      nonceServiceInstance
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
