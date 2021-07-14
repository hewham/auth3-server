const express = require('express');
const router = express.Router();
const registry = require('../services/registry').getInstance;
const validateRoles = require('../security/validateRoles');
const log = require('../../log');

router
  .get("/",
    async (req, res, next) => {
      try {
        const users = await registry().dbService.findAll('Users');
        const addresses = [];
        for (const user of users) {
          addresses.push(user.address);
        }
        return res.status(200).json({ data: addresses, message: "Successfully retrieved users" });
      } catch (e) {
        log.error(e.message);
        return res.status(400).json({ status: 400, message: e.message });
      }
    });


module.exports = router;
