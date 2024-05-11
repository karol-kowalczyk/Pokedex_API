let maxPokemons = 20;
const POKE_API = "https://pokeapi.co/api/v2/pokemon?limit=" + maxPokemons;

async function loadData() {
  let resp = await fetch(POKE_API);
  let respAsJson = await resp.json();
  let respAsJsonResults = respAsJson.results;
  console.log(respAsJsonResults);
  loadCards(respAsJsonResults);
}

let positions = [];

function reloadSite() {
    location.reload();
}

function loadCards(respAsJsonResults) {
    for (let index = 0; index < maxPokemons; index++) {
        let card = document.getElementById("card-field");
        positions.push(index);

        card.innerHTML += /*html*/ `<div class="card"><p class="number">${positions[index]+1}</p>
        <div class="name">${respAsJsonResults[index].name}</div>
        <img src="" alt="" />
        <div class="attributes"></div>
        </div>`;
    }
}