const express = require('express');
const router = express.Router();
const registry = require('../services/registry').getInstance;
// const validateRoles = require('../security/validateRoles');
const log = require('../../log');

router
  .post("/nonce",
    async (req, res, next) => {
      const { address } = req.body;
      let userRef = await registry().authService.findUserByAddress(address);

      if (!userRef) {
        // generate new nonce & create new user row in table
        userRef = await registry().authService.generateNonceAndCreateUser(address);
      } else if (!userRef.msg || !userRef.nonce) {
        // generate new nonce & update new user row in table if something is missing
        userRef = await registry().authService.generateNonceAndUpdateUser(address);
      }
      // TODO: Add expires at detection

      return res.status(200).json({
        status: 200,
        data: await registry().authService.cleanNonce(userRef),
        message: "Successfully got nonce for address"
      });
    })

  .post("/verify",
    async (req, res, next) => {
      const { address, signature } = req.body;

      try {
        const signatureCreatorAddress = await registry().authService.verifySignature(address, signature);
        const user = await registry().authService.findUserByAddress(signatureCreatorAddress);

        const token = await registry().authService.genJWT(user.id, address);

        if (token) {
          await registry().authService.generateNonceAndUpdateUser(address);
          return res.status(200).json({
            status: 200,
            data: token,
            message: "Successfully verified user"
          });
        } else {
          return res.status(400).json({ status: 400, message: "Unable to authenticate and create token" });
        }
      } catch (e) {
        log.error(e.message);
        return res.status(400).json({ status: 400, message: e.message });
      }
    });

module.exports = router;
