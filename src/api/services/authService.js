// const sequelize = require('sequelize');
// const { truncate } = require('fs');
const ethUtil = require('ethereumjs-util');
const jwt = require('jsonwebtoken');

// const SECRET = 'shhhh';
// const PREFIX = 'Sign this one-time nonce to authenticate: ';

class AuthService {
  constructor(dbService) {
    this.dbService = dbService;
  }

  async genNonce() {
    return Math.floor(Math.random() * 10000000);
  }

  cleanNonce(nonce) {
    return {
      // id: nonce.id,
      nonce: nonce.nonce,
      msg: nonce.msg,
      expiresAt: nonce.expiresAt
    };
  }

  async findUserByAddress(address) {
    const userRef = await this.dbService.findByWhere("User", { address }, { raw: true });
    if (userRef[0]) {
      return userRef[0];
    } else {
      // throw new Error("No row found for this address")
      return null;
    }
  }

  async generateNonceAndUpdateUser(address) {
    const nonce = await this.genNonce();
    const prefix = await this.dbService.getMetadataItem('defaultMsgPrefix');
    const expiresAt = new Date(Date.now() + (5 * 60 * 1000));
    const userRef = await this.dbService.findByWhere("User", { address }, { raw: true });
    if (userRef[0]) {
      await this.dbService.update("User", userRef[0].id, {
        nonce,
        msg: prefix + nonce,
        expiresAt
      });
      const newNonce = await this.dbService.findByWhere("User", { address }, { raw: true });
      return JSON.parse(JSON.stringify(newNonce[0]));
    } else {
      throw new Error("No nonce found for this address");
    }
  }

  async generateNonceAndCreateUser(address) {
    const nonce = await this.genNonce();
    const prefix = await this.dbService.getMetadataItem('defaultMsgPrefix');
    const expiresAt = new Date(Date.now() + (5 * 60 * 1000));
    await this.dbService.create("User", {
      address,
      nonce,
      msg: prefix + nonce,
      expiresAt
    });
    const newNonce = await this.dbService.findByWhere("User", { address }, { raw: true });
    return JSON.parse(JSON.stringify(newNonce[0]));
  }

  async verifySignature(address, signature) {
    const foundNonce = await this.dbService.findByWhere("User", { address }, { raw: true });
    if (foundNonce[0]) {
      const msg = foundNonce[0].msg;
      // in possession of msg, publicAddress and signature.
      // perform an elliptic curve signature verification with ecrecover

      const msgHex = '0x' + Buffer.from(msg, 'utf8').toString('hex');
      const msgBuffer = ethUtil.toBuffer(msgHex);
      const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
      const signatureBuffer = ethUtil.toBuffer(signature);
      const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
      const publicKey = ethUtil.ecrecover(
        msgHash,
        signatureParams.v,
        signatureParams.r,
        signatureParams.s
      );
      const addressBuffer = ethUtil.publicToAddress(publicKey);
      const signatureCreatorAddress = ethUtil.bufferToHex(addressBuffer);

      // The signature verification is successful if the address found with
      // ecrecover matches the initial publicAddress
      if (signatureCreatorAddress.toLowerCase() === address.toLowerCase()) {
        return signatureCreatorAddress;
      } else {
        throw new Error("Signature verification failed");
      }
    } else {
      throw new Error("No nonce found for this address");
    }
  }

  async genJWT(uid, address) {
    // //////////////////////////////////////////////////
    // Step 4: Create JWT
    // //////////////////////////////////////////////////
    // set issuer
    const issuer = "auth3.org";
    const secret = await this.dbService.getMetadataItem('secret');

    return new Promise(async (resolve, reject) =>
      // https://github.com/auth0/node-jsonwebtoken
      jwt.sign({
        uid
      },
      secret,
      {
        issuer,
        subject: address,
        expiresIn: (5 * 60) // in seconds
      },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        return resolve(token);
      }));
  }
}


module.exports = AuthService;
