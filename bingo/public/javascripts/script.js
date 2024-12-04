document.addEventListener("DOMContentLoaded", () => {

let names = [];
const xhr = new XMLHttpRequest();

xhr.open("GET", "/names.txt")

xhr.onload = ()=>{
  names = xhr.response.split("\n");
  const elements = document.querySelectorAll(`.field`)
  elements.forEach(e => e.classList.add("active"))
  for (let i = 1; i <= 16; i++)
    document.getElementById(`field-${i}`).innerHTML = `<span class="center">${names[i-1]}</span>`;
}
xhr.send();


  const subscription = new EventSource('/event');

  window.addEventListener("beforeunload", () => {
    subscription.close()
  })

  subscription.addEventListener('open', (event) => {
    if (event.data !== '' && event.data !== undefined)
      event.data.split(",").forEach((i) => {
        document.querySelector(`#field-${i}`).classList.remove('active');
        document.querySelector(`#field-${i}`).classList.add('inactive');
      });
  })
  subscription.addEventListener('change', (event) => {
    if (!document.getElementById(`field-${event.data}`).classList.contains("inactive")) {
      document.getElementById(`field-${event.data}`).classList.remove("active")
      document.getElementById(`field-${event.data}`).classList.add("inactive")
    } else {
      document.getElementById(`field-${event.data}`).classList.remove("inactive")
      document.getElementById(`field-${event.data}`).classList.add("active")
    }
  })
})
