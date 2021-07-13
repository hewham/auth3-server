const express = require('express');
const router = express.Router();
const registry = require('../services/registry').getInstance;
// const validateRoles = require('../security/validateRoles');
const log = require('../../log');

router
  .post("/nonce",
    async (req, res, next) => {
      const { address } = req.body;
      let nonce = await registry().nonceService.getNonce(address);

      if (nonce) {
        // generate new nonce and save to row
        nonce = await registry().nonceService.newNonceAndUpdate(address);
      } else {
        // generate new nonce & generate new row in table
        nonce = await registry().nonceService.newNonceAndCreate(address);
      }

      return res.status(200).json({
        status: 200,
        data: await registry().nonceService.cleanNonce(nonce),
        message: "Successfully updated new nonce for address"
      });
    })

  .post("/verify",
    async (req, res, next) => {
      const { address, signature } = req.body;

      try {
        const signatureCreatorAddress = await registry().nonceService.verifySignature(address, signature);
        let user = JSON.parse(JSON.stringify(await registry().nonceService.userByAddress(signatureCreatorAddress)));

        if (!user) {
          user = JSON.parse(JSON.stringify(await registry().nonceService.createUser(signatureCreatorAddress)));
        }

        const token = await registry().nonceService.genJWT(user.id, address);

        return res.status(200).json({
          status: 200,
          data: token,
          message: "Successfully verified user"
        });
      } catch (e) {
        log.error(e.message);
        return res.status(400).json({ status: 400, message: e.message });
      }
    });

module.exports = router;
