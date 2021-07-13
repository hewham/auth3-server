const express = require('express');
const router = express.Router();
const registry = require('../services/registry');
const validateRoles = require('../security/validateRoles');
const log = require('../../log');

router
  .get("/",
    async (req, res, next) => {
      try {
        return res.status(200).json({ data: ["hello", "world!"], message: "Successfully retrieved users" });
      } catch (e) {
        log.error(e.message);
        return res.status(400).json({ status: 400, message: e.message });
      }
    });


module.exports = router;
