import { sqlite } from "./dbConfig.js";
import axios from "axios";
let listOfCurrentUsers = [];

async function getCurrentUsers() {
  const channel = process.env.CHANNEL;
  const limit = 100;
  let body;
  let multi = 0;
  do {
    body = await axios
      .get(
        `https://api.streamelements.com/kappa/v2/points/${channel}/watchtime`,
        {
          params: {
            limit: limit,
            offset: multi * limit,
          },
          headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: `Bearer ${process.env.SE_JWT_TOKEN}`,
          },
        }
      )
      .then((res) => res.data);
    multi += 1;

    body.users.forEach((user) => {
      listOfCurrentUsers.push({
        username: user.username,
        SEWatchtime: user.minutes,
      });
    });

  } while (body._total > limit * multi);
}
await getCurrentUsers();

const createUsersInDatabse = sqlite.transaction((users) => {
  const stmt = sqlite.prepare(
    `INSERT OR IGNORE INTO users (nick, SEWatchtime) VALUES (?, ?)`
  );
  users.forEach((user) => {
    stmt.run([user.username, user.SEWatchtime]);
  });
});
createUsersInDatabse(listOfCurrentUsers);
setInterval(async () => {
  listOfCurrentUsers = [];
  await getCurrentUsers();
  deleteOldUsersFromDatabase(listOfCurrentUsers);
}, 60 * 1000);

export default async function pullFromDb() {
  const records = sqlite.prepare("SELECT nick, SEWatchtime FROM users").all();
  const listOfLastUsers = [];
  records.map((record) => {
    listOfLastUsers.push({
      username: record.nick,
      SEWatchtime: record.SEWatchtime,
    });
  });

  changeUsersInDatabse(listOfCurrentUsers);

  const differences = [];
  calculateDifferences(differences, listOfCurrentUsers, listOfLastUsers);
  const updateWatchtime = sqlite.transaction((differences) => {
    const stmt = sqlite.prepare(
      `UPDATE users SET myWatchtime = myWatchtime + ? WHERE nick = ?`
    );
    differences.forEach((difference) => {
      stmt.run([difference.myWatchtime, difference.username]);
    });
  });
  updateWatchtime(differences);
}

const changeUsersInDatabse = sqlite.transaction((users) => {
  const insertStmt = sqlite.prepare(
    `INSERT OR REPLACE INTO users (nick, SEWatchtime, myWatchtime) VALUES (?, ?, (SELECT myWatchtime FROM users WHERE nick=?))`
  );
  users.forEach((user) => {
    insertStmt.run([user.username, user.SEWatchtime, user.username]);
  });
});

function deleteOldUsersFromDatabase(usernames) {
  sqlite.prepare(`CREATE TEMPORARY TABLE temp_names (nick TEXT)`).run();
  const insertStmt = sqlite.prepare("INSERT INTO temp_names (nick) VALUES (?)");
  const insertManyStmt = sqlite.transaction((users) => {
    for (const user of users) insertStmt.run(user.username);
  });
  insertManyStmt(usernames);
  sqlite.exec(`
    DELETE FROM users 
    WHERE nick NOT IN (SELECT nick FROM temp_names);
  `);
  sqlite.exec("DROP TABLE temp_names");
}

function calculateDifferences(
  differences,
  localListOfCurrentUsersm,
  localListOfLastUsers
) {
  if (process.env.STATE !== "true") return;
  for (let i = 0; i < listOfCurrentUsers.length; i++) {
    if (
      localListOfCurrentUsersm.length !== localListOfLastUsers.length ||
      localListOfCurrentUsersm[i].username !== localListOfLastUsers[i].username
    ) {
      console.error(
        `Error in retriving user watchtime\n
        listOfCurrentUsersm === listOfLastUsers: ${
          localListOfCurrentUsersm.length === localListOfLastUsers.length
        }\n
        currentNick === lastNick: ${localListOfCurrentUsersm[i].username} === ${
          localListOfLastUsers[i].username
        }\n`
      );
      break;
    }
    const differenceInTime =
      localListOfCurrentUsersm[i].SEWatchtime -
      localListOfLastUsers[i].SEWatchtime;
    differences.push({
      username: localListOfCurrentUsersm[i].username,
      myWatchtime: differenceInTime,
    });
  }
}
