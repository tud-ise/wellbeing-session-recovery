/* eslint-disable */

const csv = require("csvtojson");
const sha256 = require("crypto-js/sha256");
const md5 = require("crypto-js/md5");
const Blowfish = require("egoroof-blowfish");

const values = require("./values.json");

(async () => {
  console.log(
    (await csv().fromFile("./initial_survey_api_hardcoded.csv"))
      .map((u) => u.participant_email)
      .map((email) => ({ ...values[sha256(email)], participant_email: email }))
      .map((u) => ({
        ...u,
        key: new Blowfish(
          md5(u.participant_email).toString(),
          Blowfish.MODE.ECB,
          Blowfish.PADDING.NULL
        ).decode(Buffer.from(u.key_bf, "hex")),
        age: new Blowfish(
          md5(u.participant_email).toString(),
          Blowfish.MODE.ECB,
          Blowfish.PADDING.NULL
        ).decode(Buffer.from(u.age_bf, "hex")),
      }))
  );
})();
