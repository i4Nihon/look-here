const stateButton = document.getElementById("stateButton");
let state = false;
async function getState(isChanging) {
  let localState;

  await fetch("/state", {
    method: "POST",
    headers: {
      ischanging: isChanging,
    },
  })
    .then((res) => res.json())
    .then((body) => {
      localState = body.state;
    });
  return localState;
}
document.addEventListener("DOMContentLoaded", async () => {
  state = await getState(false);
  stateButton.innerHTML =
    state === "true" ? "Aktualnie włączono" : "Akutalnie zapauzowano";
});
stateButton.addEventListener("click", async (e) => {
  e.preventDefault();
  state = await getState(true);

  stateButton.innerHTML =
    state === "true" ? "Aktualnie włączono" : "Akutalnie zapauzowano";
  alert(
    `ZMIENIONO STAN APLIKACJI. Akutalnie: ${
      state === "true" ? "dziala" : "pauza"
    }`
  );
});

async function getUsers(amountOfWatchtime) {
  const body = await fetch("/check", {
    method: "POST",
    headers: {
      amountOfWatchtime: amountOfWatchtime,
    },
  }).then((res) => res.json());
  return body.data;
}

async function drawRandom() {
  const minWatchTime = document.getElementById("watchtime").value;
  const numberOfViewers = document.getElementById("numberOfViewers").value;
  const selectedViewers = document.getElementById("selectedViewers");
  selectedViewers.innerHTML = "";
  let maxIndex = 1;
  const records = await getUsers(minWatchTime);
  const indexes = [];
  if (numberOfViewers < records.length) maxIndex = records.length;
  else maxIndex = numberOfViewers;

  for (let i = 0; i < numberOfViewers; i++) {
    const index = Math.floor(Math.random() * maxIndex);
    if (indexes.includes(index)) i--; // will do loop once again
    else indexes.push(index);
  }
  let orderNumber = 1;
  for (const index of indexes) {
    const elem = document.createElement("div");
    elem.innerHTML =
      records.length <= 0
        ? "Nie znaleziono żadnego widza"
        : `${orderNumber}. ${records[index].nick}, oglądając przez: ${records[index].myWatchtime} min<br>`;
    orderNumber++;
    selectedViewers.append(elem);
  }
}

async function resetDB() {
  const confirmDiv = document.getElementById("confirmDiv");
  let status;
  await fetch("/reset", {
    method: "POST",
  }).then((res) => (status = res.status));
  if (status === 200) alert("ZRESETOWANO");
  else if (status === 401) {
    confirmDiv.style.display = "block";
  }
}

