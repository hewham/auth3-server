var db = require('../../db/models');
const includesDict = require('./includesDict');

class DBRepository {
  constructor(models) {
    this.models = models;
  }

  async findAll(type) {
    return await db[type].findAll({
      include: includesDict[type]
    });
  }

  async findById(type, id, options = {}) {
    // options contain things like { raw: true, nest: true }
    let include = includesDict[type];
    if (options.customIncludeType) {
      include = includesDict[options.customIncludeType];
      delete options.customIncludeType;
    }

    return await db[type].findByPk(id, {
      include,
      ...options
    });
  }

  async existsById(type, id) {
    return await db[type].count({ where: { id } }).then((count) => count !== 0);
  }

  async findByWhere(type, where, options = {}) {
    // input 'where' in obj of form: { field: input } - ie: { email: 'user.mail.com' }
    // options contain things like { raw: true, nest: true }
    return await db[type].findAll({
      where,
      include: includesDict[type],
      ...options
    });
  }

  async create(type, body) {
    // input body is object to create
    return await db[type].create(body);
  }

  async update(type, id, body) {
    // input body is updated object to write
    return await db[type].update(
      body,
      {
        where: {
          id
        }
      }
    );
  }

  async delete(type, id) {
    return db[type].destroy({
      where: {
        id
      }
    });
  }
}

module.exports = DBRepository;
