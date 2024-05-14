const POKE_API = "https://pokeapi.co/api/v2/pokemon?limit=20"; // Ändern Sie das Limit auf 20

let pokemons = [];
let currentOffset = 0; // Track the current offset for fetching more Pokemon

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function loadData() {
  let resp = await fetch(POKE_API);
  let respAsJson = await resp.json();
  let respAsJsonResults = respAsJson.results;
  let pokemonResp = await fetch(respAsJsonResults[0].url);
  let pokemonData = await pokemonResp.json();
  showPokemonCards(respAsJsonResults, pokemonData); // Gibt die URL des ersten Pokémons aus

  // Um weitere Informationen über das erste Pokémon abzurufen
}

function showPokemonCards(respAsJsonResults, pokemonData) {
  for (let index = 0; index < 20; index++) {
    console.log(pokemonImg);
    pokemons.push(respAsJsonResults[index]);
    addPokemons(pokemons.length - 1, pokemonData); // Pass the index of the last added pokemon
  }
}

let typeImg = {
  box: "box",
  bug: "bug",
  futureball: "futureball",
  grass: "grass",
  ground: "ground",
  stone: "stone",
  water: "water",
  poison: "poison",
  flying: "flying",
  flash: "flash",
  fire: "fire",
  normal: "pokeball",
  electric: "flash",
  fighting: "box",
  fairy: "fairy",
  psychic: "futureball",
  rock: "rock",
  ghost: "ghost",
  steel: "steel",
  ice: "ice",
  dragon: "dragon",
};

// Erstelle HTML für Pokemon-Typen
function generateTypeHTML(types) {
  let typesHTML = "";
  for (let i = 0; i < types.length; i++) {
    let typeName = types[i].type.name;
    let typeImgSrc = typeImg[typeName]; // Bildpfad aus dem typeImg-Objekt abrufen
    typesHTML += `<div class="types"><div class="type-name"> ${typeName}</div> <img class="img-types" src="./src/img/${typeImgSrc}.png"/></div>`;
  }
  return typesHTML;
}

// Erstelle HTML für Pokemon-Fähigkeiten
function generateAbilityHTML(abilities) {
  let abilitiesHTML = "";
  for (let i = 0; i < Math.min(2, abilities.length); i++) {
    // Änderung hier: Math.min(2, abilities.length)
    abilitiesHTML += `<div class="abilities">${abilities[i].ability.name}</div>`;
  }
  return abilitiesHTML;
}

function addPokemons(index, pokemonData) {
  let card = document.getElementById("card-field");
  let pokemonName = capitalizeFirstLetter(pokemons[index].name);
  let pokemonImg = pokemonData.sprites.other['official-artwork']['front_default'];
  let pokemonTypes = pokemonData.types;
  let pokemonWeight = pokemonData.weight;
  let pokemonAbilities = pokemonData.abilities;

  let typesHTML = generateTypeHTML(pokemonTypes);
  let abilitiesHTML = generateAbilityHTML(pokemonAbilities);

  let typesDivClass = pokemonTypes.length > 1 ? "pokemon-types-div" : "oneType"; // Choose class based on number of types
  let abilitiesDivClass = "pokemon-abilities-div"; // Default class

  // Check if the total length of abilities is greater than 10 and if there is only one ability
  if (
    pokemonAbilities.length === 1 &&
    pokemonAbilities[0].ability.name.length > 10
  ) {
    // If yes, display the ability with a thinner margin
    abilitiesHTML = `<div class="one-ability-thiner-margin">${pokemonAbilities[0].ability.name}</div>`;
  } else if (
    pokemonAbilities.length === 1 &&
    pokemonAbilities[0].ability.name.length <= 12
  ) {
    // If yes, display the ability with the default margin
    abilitiesHTML = `<div class="abilities one-ability">${pokemonAbilities[0].ability.name}</div>`;
  }

  // Check if the total length of abilities is greater than 22
  if (
    pokemonAbilities.length === 2 &&
    pokemonAbilities[0].ability.name.length +
      pokemonAbilities[1].ability.name.length >
      22
  ) {
    // If yes, display only the first ability
    abilitiesHTML = `<div class="abilities">${pokemonAbilities[0].ability.name}</div>`;
  }

  // Generate class based on the first type
  let pokemonCardClass = pokemonTypes[0].type.name + "1";

  card.innerHTML += /*html*/ `
  <div onclick="showDetails('${pokemonImg}', '${[index]}', '${pokemonName}')" class="card ${pokemonCardClass}">
      <div class="header">
        <div class="number">#${index + 1}</div>
        <div class="name">${pokemonName}</div>
      </div>
      <img class="pokemon-images" src="${pokemonImg}" alt="" />
      <div class="properties">
        <div class="${typesDivClass}"> <div class="type-div">types:</div> ${typesHTML} </div>
        <div class="${abilitiesDivClass}"><div class="abilities-div">abilities:</div> ${abilitiesHTML} </div>
        <div class="weight">weight: ${pokemonWeight}kg</div>
      </div>
    </div>`;
}

function loadFiveMore() {
  currentOffset += 5;
  fetchAdditionalPokemon(5);
}

function loadTwentyMore() {
  currentOffset += 30;
  fetchAdditionalPokemon(30);
}

async function fetchAdditionalPokemon(numPokemons) {
  let resp = await fetch(`${POKE_API}&offset=${currentOffset}`);
  let respAsJson = await resp.json();
  let respAsJsonResults = respAsJson.results;
  for (let index = 0; index < numPokemons; index++) {
    if (respAsJsonResults[index]) {
      let pokemonResp = await fetch(respAsJsonResults[index].url);
      let pokemonData = await pokemonResp.json();
      pokemons.push(respAsJsonResults[index]);
      addPokemons(pokemons.length - 1, pokemonData);
    } else {
      // Wenn keine weiteren Pokemon vorhanden sind, beenden Sie die Schleife
      break;
    }
  }
}

async function showPokemonCards(respAsJsonResults) {
  for (let index = 0; index < 20; index++) {
    let pokemonResp = await fetch(respAsJsonResults[index].url);
    let pokemonData = await pokemonResp.json();
    pokemons.push(respAsJsonResults[index]);
    addPokemons(pokemons.length - 1, pokemonData); // Pass the index and pokemonData
  }
}

async function loadAllPokemons() {
  currentOffset += 30; // Aktualisiere currentOffset um 100
  await fetchMorePokemon(); // Lade weitere Pokemons
}
function reloadSite() {
  location.reload();
}

function showDetails(pokemonImg, index, pokemonName) {
  let popUp = document.getElementById("popUp");
  popUp.classList.remove("d-none");
  let shadowBox = document.getElementById("shadowBox");
  shadowBox.classList.remove("d-none");
  shadowBox.classList.add("d-block");
  document.body.classList.add("disable-scrolling");

  let indexNum = parseInt(index);

  shadowBox.innerHTML = /*html*/ `
  <div class="header">
  <div class="number-popup">#${indexNum +1}</div>
  <div class="name-popup">${pokemonName}</div>
</div>
    <img class="popUp-img" src="${pokemonImg}" />
  `;
}

function closeDetails() {
  let popUp = document.getElementById("popUp");
  popUp.classList.add("d-none");
  let shadowBox = document.getElementById("shadowBox");
  shadowBox.classList.remove("d-block");
  shadowBox.classList.add("d-none");
  document.body.classList.remove("disable-scrolling");
}

function stopPropagationFunction(event) {
  event.stopPropagation();
}
