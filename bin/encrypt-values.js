/* eslint-disable */

const csv = require("csvtojson");
const sha256 = require("crypto-js/sha256");
const md5 = require("crypto-js/md5");
const Blowfish = require("egoroof-blowfish");

(async () => {
  console.log(
    JSON.stringify(
      (await csv().fromFile("./initial_survey_api_hardcoded.csv")).reduce(
        (acc, u) => ({
          ...acc,
          [sha256(u.participant_email).toString()]: {
            session: u.session,
            key_bf: u.participant_api_key
              ? Buffer.from(
                  new Blowfish(
                    md5(u.participant_email).toString(),
                    Blowfish.MODE.ECB,
                    Blowfish.PADDING.NULL
                  ).encode(u.participant_api_key)
                ).toString("hex")
              : "",
            age_bf: u.age
              ? Buffer.from(
                  new Blowfish(
                    md5(u.participant_email).toString(),
                    Blowfish.MODE.ECB,
                    Blowfish.PADDING.NULL
                  ).encode(u.age)
                ).toString("hex")
              : "",
          },
        }), {}
      )
    )
  );
})();
