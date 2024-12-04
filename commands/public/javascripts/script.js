document.getElementById("addDirectlyBtn").addEventListener("click", () =>{
fetchCmds('addDirectly')
})
document.getElementById("addBySiteBtn").addEventListener("click", () =>{
fetchCmds('addBySite')
})




let cmdArray = [];
const search = document.getElementById("searchBar");
const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
const handleSearchPosts = (query) => {

  const searchQuery = query.trim().toLowerCase();
  
    if (searchQuery.length < 1) {
    searchCommand()
    return
  }
  
  if(!format.test(searchQuery)){

  let pTags = document.getElementsByTagName("p")

  for (let i = 0; i < pTags.length; i++) {

    if (pTags[i].innerText.includes(searchQuery)) {
      pTags[i].style.display = "block"
    } else {
      pTags[i].style.display = "none"
    }
  }
  }
}

let debounceTimer;
const debounce = (callback, time) => {
  window.clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(callback, time);
};

search.addEventListener(
    "input",
    (event) => {
      const query = event.target.value;
      debounce(() => handleSearchPosts(query), 500);
    })

function searchCommand() {
  let j = 0;
  for (let i = 0; i < cmdArray.length; i++) {
    document.getElementById("commands").innerHTML = ''
    
    if (i !== 0) {
      let splitedCmdFirst = cmdArray[i - 1].split(';')
      let splitedCmdSecond = cmdArray[i].split(';')
      if (splitedCmdFirst[0].replaceAll(" ", "").toLowerCase() === splitedCmdSecond[0].replaceAll(" ", "").toLowerCase()) {
        document.getElementById(`p-${j - 1}`).innerHTML += `<span>${cmdArray[i]}</span><br>`
      } else {
        document.getElementById("commands").innerHTML += `<p id="p-${j}">${cmdArray[i]}</p>`
        j++
      }
    } else {
      document.getElementById("commands").innerHTML += `<p id="p-${j}"\>${cmdArray[0]}</p>`
      j++
    }
  }
}

function fetchCmds(file) {

  const fetchCommands = new XMLHttpRequest();

  fetchCommands.onload = function () {

    document.getElementById("commands").innerHTML = ''

    let cmds = this.responseText.split("\n")
    cmdArray = cmds
    let j = 0;

    for (let i = 0; i < cmds.length; i++) {

      if (i !== 0) {

        let splitedCmdFirst = cmds[i - 1].split(';')
        let splitedCmdSecond = cmds[i].split(';')

        if (splitedCmdFirst[0].replaceAll(" ", "").toLowerCase() === splitedCmdSecond[0].replaceAll(" ", "").toLowerCase()) {
          document.getElementById(`p-${j - 1}`).innerHTML += `<br><br><span>${cmds[i]}</span>`
        } else {
          document.getElementById("commands").innerHTML += `<p id="p-${j}">${cmds[i]}</p>`
          j++
        }
      } else {
        document.getElementById("commands").innerHTML += `<p id="p-${j}"\>${cmds[0]}</p>`
        j++
      }
    }
  }
  fetchCommands.open("GET", `/${file}.txt`);
  fetchCommands.send();
}
