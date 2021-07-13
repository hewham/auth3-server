// const sequelize = require('sequelize');
// const { truncate } = require('fs');
const ethUtil = require('ethereumjs-util');
const jwt = require('jsonwebtoken');

const SECRET = 'shhhh';
const PREFIX = 'Sign this one-time nonce to authenticate: ';

class NonceService {
  constructor(dbRepository) {
    this.dbRepository = dbRepository;
  }

  async genNonce() {
    return Math.floor(Math.random() * 10000000);
  }

  cleanNonce(nonce) {
    return {
      id: nonce.id,
      nonce: nonce.nonce,
      prefix: nonce.prefix,
      expiresAt: nonce.expiresAt
    };
  }

  async getNonce(address) {
    const nonceRef = await this.dbRepository.findByWhere("Nonce", { address }, { raw: true });
    if (nonceRef[0]) {
      return nonceRef[0];
    } else {
      // throw new Error("No row found for this address")
      return null;
    }
  }

  async newNonceAndUpdate(address) {
    const nonce = await this.genNonce();
    const expiresAt = new Date(Date.now() + (5 * 60 * 1000));
    const nonceRef = await this.dbRepository.findByWhere("Nonce", { address }, { raw: true });
    if (nonceRef[0]) {
      await this.dbRepository.update("Nonce", nonceRef[0].id, {
        nonce,
        prefix: PREFIX,
        expiresAt
      });
      const newNonce = await this.dbRepository.findByWhere("Nonce", { address }, { raw: true });
      return JSON.parse(JSON.stringify(newNonce[0]));
    } else {
      throw new Error("No row found for this address");
    }
  }

  async newNonceAndCreate(address) {
    const nonce = await this.genNonce();
    const expiresAt = new Date(Date.now() + (5 * 60 * 1000));
    await this.dbRepository.create("Nonce", {
      address,
      nonce,
      prefix: PREFIX,
      expiresAt
    });
    const newNonce = await this.dbRepository.findByWhere("Nonce", { address }, { raw: true });
    return JSON.parse(JSON.stringify(newNonce[0]));
  }

  async verifySignature(address, signature) {
    const foundNonce = await this.dbRepository.findByWhere("Nonce", { address }, { raw: true });
    if (foundNonce[0]) {
      const msg = foundNonce[0].prefix + foundNonce[0].nonce;

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
    }
  }

  async userByAddress(address) {
    const results = await this.dbRepository.findByWhere("User", { address });
    if (results[0]) {
      return results[0];
    } else {
      return null;
    }
  }

  async createUser(address) {
    // const username = `u${await this.genNonce()}`;
    const userDetails = { address };
    const user = await this.dbRepository.create('User', userDetails);
    return user;
  }

  async genJWT(uid, address) {
    // //////////////////////////////////////////////////
    // Step 4: Create JWT
    // //////////////////////////////////////////////////
    // set issuer
    const issuer = "auth3.org";

    return new Promise(async (resolve, reject) =>
      // https://github.com/auth0/node-jsonwebtoken
      jwt.sign({
        uid
      },
      SECRET,
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


module.exports = NonceService;
