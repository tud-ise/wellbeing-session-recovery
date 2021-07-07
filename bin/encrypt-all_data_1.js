/* eslint-disable */

const csv = require("csvtojson");
const Blowfish = require("egoroof-blowfish");
const md5 = require("crypto-js/md5");
const fs = require("fs");

(async () => {
  const students = await csv().fromFile("./initial_survey_api_hardcoded.csv");

  const data = fs.readFileSync("./all_data_pre_final.csv").toString();
  for (let i = 0; i < students.length; i++) {
    if (!students[i].participant_email) {
      continue;
    }

    fs.writeFileSync(
      `../src/assets/${students[i].session}.csv`,
      Buffer.from(
        new Blowfish(
          md5(students[i].participant_email).toString(),
          Blowfish.MODE.ECB,
          Blowfish.PADDING.NULL
        ).encode(data)
      ).toString("hex")
    );
  }
})();
