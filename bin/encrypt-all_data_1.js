/* eslint-disable */

const csv = require("csvtojson");

const buildSessionTokenArray = async () =>
  (await csv().fromFile("./initial_survey_api_hardcoded.csv")).map(
    (l) => l.session
  );

(async () => {
  const sessionTokens = await buildSessionTokenArray();
  console.log(
    JSON.stringify(
      // (await csv().fromFile("./all_data_1.csv")).reduce(
      //   (acc, { id, ...rest }) => ({
      //     [sessionTokens[parseInt(id, 10) % sessionTokens.length]]: [
      //       acc[sessionTokens[parseInt(id, 10) % sessionTokens.length]],
      //       rest,
      //     ].filter((e) => e != null),
      //     ...acc,
      //   }),
      //   {}
      // )
      (await csv().fromFile("./all_data_1.csv"))
        .map(({ id, ...rest }) => ({
          ...rest,
          id: sessionTokens[parseInt(id, 10) % sessionTokens.length],
        }))
        .reduce(
          (acc, { id, ...rest }) => ({
            ...acc,
            [id]: acc.id ? [...acc.id, rest] : [rest],
          }),
          {}
        )
    )
  );
})();
