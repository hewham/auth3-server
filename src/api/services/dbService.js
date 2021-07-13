class dbService {
  constructor(dbRepository) {
    this.dbRepository = dbRepository;
  }

  async findById(type, id, options = {}) {
    return await this.dbRepository.findById(type, id, options);
  }

  async findAll(type) {
    return await this.dbRepository.findAll(type);
  }

  async existsById(type, id) {
    return await this.dbRepository.existsById(type, id);
  }

  async findByWhere(type, where, options = {}) {
    return await this.dbRepository.findByWhere(type, where, options);
  }

  async create(type, body) {
    return await this.dbRepository.create(type, body);
  }

  async update(type, id, body) {
    return await this.dbRepository.update(type, id, body);
  }

  async delete(type, id) {
    return await this.dbRepository.delete(type, id);
  }

  async incrementMetadata(field) {
    // field is totalEmailForwards, totalSMSIncoming, totalSMSIncoming
    if (
      field == "totalEmailForwards"
      || field == "totalSMSIncoming"
      || field == "totalSMSOutgoing") {
      const metadata = await this.dbRepository.findByWhere('Metadata', { id: 1 });
      await metadata[0].increment(field, { by: 1 });
    }
  }
}


module.exports = dbService;
