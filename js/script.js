const POKE_API = "https://pokeapi.co/api/v2/pokemon?limit=20"; // Ändern Sie das Limit auf 20

let pokemons = [];
let currentOffset = 0; // Track the current offset for fetching more Pokemon

async function loadData() {
  let resp = await fetch(POKE_API);
  let respAsJson = await resp.json();
  let respAsJsonResults = respAsJson.results;
  showPokemonCards(respAsJsonResults);
}

function showPokemonCards(respAsJsonResults) {
  for (let index = 0; index < 10; index++) {
    pokemons.push(respAsJsonResults[index]);
    addPokemons(pokemons.length - 1); // Pass the index of the last added pokemon
  }
}

function addPokemons(index) {
  let card = document.getElementById("card-field");
  card.innerHTML += /*html*/ `
    <div class="card"><div class="number">${index + 1}</div>
            <div class="name">${pokemons[index].name}</div>
            <img src="" alt="" />
            <div class="attributes"></div>
            </div>`;
}

function increasePositions() {
  // Increment the current offset by 10 to fetch the next set of 10 Pokemon
  currentOffset += 10;
  fetchMorePokemon();
}

async function fetchMorePokemon() {
  let resp = await fetch(`${POKE_API}&offset=${currentOffset}`);
  let respAsJson = await resp.json();
  let respAsJsonResults = respAsJson.results;
  showMorePokemonCards(respAsJsonResults);
}

function showMorePokemonCards(respAsJsonResults) {
  for (let index = 0; index < 10; index++) {
    pokemons.push(respAsJsonResults[index]);
    addPokemons(pokemons.length - 1); // Pass the index of the last added pokemon
  }
}

function reloadSite() {
  location.reload();
}
