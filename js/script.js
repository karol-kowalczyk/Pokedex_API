const POKE_API = "https://pokeapi.co/api/v2/pokemon?limit=10500&offset=14";

let pokemons = [];
let currentOffset = 0;

async function loadData() {
  let resp = await fetch(POKE_API);
  let respAsJson = await resp.json();
  let respAsJsonResults = respAsJson.results;
  showPokemonCards(respAsJsonResults);
}

function showPokemonCards(respAsJsonResults) {
  for (let index = 0; index < 20; index++) {
    pokemons.push(respAsJsonResults[index]);
    addPokemons(index);
  }
}

function addPokemons(index) {
  let card = document.getElementById("card-field");
  card.innerHTML += /*html*/ `
    <div class="card"><p class="number">${pokemons.length}</p>
            <div class="name">${pokemons[index].name}</div>
            <img src="" alt="" />
            <div class="attributes"></div>
            </div>`;
}

function increasePositions() {
  currentOffset += 5;
  fetchMorePokemon();
}

async function fetchMorePokemon() {
  let resp = await fetch(`${POKE_API}&offset=${currentOffset}`);
  let respAsJson = await resp.json();
  let respAsJsonResults = respAsJson.results;
  showMorePokemonCards(respAsJsonResults);
}

function showMorePokemonCards(respAsJsonResults) {
  for (let index = 0; index < 5; index++) {
    pokemons.push(respAsJsonResults[index]);
    addPokemons(index + 20);
  }
}

function reloadSite() {
    location.reload();
  }