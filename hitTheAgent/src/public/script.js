const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

let links;
async function fetchLinks() {
  await fetch("/links.json")
    .then((res) => res.json())
    .then((body) => (links = body));
}
fetchLinks();

const r = document.querySelector(":root");
const clientWidth = document.getElementById("body").clientWidth;
r.style.setProperty(
  "--width",
  `${document.getElementById("body").clientWidth}px`
);
r.style.setProperty(
  "--heigth",
  `${document.getElementById("body").clientHeight}px`
);

const agent = document.getElementById("agent");
const agentOnHit = document.getElementById("agentOnHit");
const agentOnHitContainer = document.getElementById("agentOnHitContainer");
const pango = document.getElementById("pango");
const pangoSign = document.getElementById("pangoSign");
const audioPlayer = document.getElementById("audioPlayer");

ComfyJS.onCommand = (user, command, message, flags, extra) => {
  const myFlags =
    flags.broadcaster || flags.mod || flags.subscriber || flags.vip;

  const lastUsageAny =
    extra.sinceLastCommand.any > 2750 || extra.sinceLastCommand.any === 0;

  if (links.hasOwnProperty(command) && myFlags && lastUsageAny) {
    const randomAgentPosition = Math.floor(Math.random() * 4) * 384 + 100;
    r.style.setProperty("--agent-position", `${randomAgentPosition}px`);
    agent.style.display = "block";
    pangoSign.classList.add("pangoSignAnimated");
    pango.classList.add("pangoAnimated");

    agent.src = links[command];

    setTimeout(async () => {
      agentOnHit.style.display = "block";
      audioPlayer.play();
      let j = 1;
      for (let i = 1; i <= 3; i++) {
        console.log(i);
        agentOnHitContainer.style.transform = `rotate(${i * 30 * j}deg)`;
        agentOnHitContainer.style.left = `${
          clientWidth - 885 + i * clientWidth * 0.04
        }px`;
        console.log(agentOnHitContainer.style.left);
        j = j * -1;
        await sleep(250);
      }
    }, 2150);
    setTimeout(() => {
      agentOnHitContainer.style.transform = "rotate(0deg)";
      agentOnHitContainer.style.left = `${clientWidth - 885}px`;
      agent.style.display = "none";
      agentOnHit.style.display = "none";
      pangoSign.classList.remove("pangoSignAnimated");
      pango.classList.remove("pangoAnimated");
      agentOnHit.classList.remove("agentOnHitAnimated");
    }, 2700);
  }
};

ComfyJS.Init("nihonik");
