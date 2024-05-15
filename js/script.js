const POKE_API = "https://pokeapi.co/api/v2/pokemon?limit="; // Ändern Sie das Limit auf 20

let pokemons = [];
let currentOffset = 0; // Track the current offset for fetching more Pokemon
let currentPokemonIndex = 0;

async function loadAllPokemons() {
  // Berechne die Anzahl der bereits geladenen Pokémon
  const numLoadedPokemons = pokemons.length;

  // Setze den Offset so, dass die nächste Charge von Pokémon geladen wird
  currentOffset = numLoadedPokemons;

  // Berechne die Anzahl der fehlenden Pokémon, die geladen werden sollen
  const remainingPokemons = 800 - numLoadedPokemons; // Annahme: Maximal 1000 Pokémon

  // Lade die restlichen Pokémon, nur wenn noch nicht alle geladen sind
  if (remainingPokemons > 0) {
    await fetchAdditionalPokemon(remainingPokemons);

    loadAllPokemons();
  }
}

function loadTwentyMore() {
  currentOffset += 20;
  fetchAdditionalPokemon(20);
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function loadData() {
  let resp = await fetch(POKE_API);
  let respAsJson = await resp.json();
  let respAsJsonResults = respAsJson.results;

  // Überprüfe, ob die Pokemon bereits geladen wurden, bevor du sie der Seite hinzufügst
  for (let index = 0; index < respAsJsonResults.length; index++) {
    let pokemonUrl = respAsJsonResults[index].url;
    if (!pokemons.some((pokemon) => pokemon.url === pokemonUrl)) {
      let pokemonResp = await fetch(pokemonUrl);
      let pokemonData = await pokemonResp.json();
      pokemons.push(respAsJsonResults[index]);
      addPokemons(pokemons.length - 1, pokemonData);
    }
  }
}

function showPokemonCards(respAsJsonResults, pokemonDataArray) {
  const startIndex = pokemons.length; // Startindex für das Hinzufügen neuer Pokémon

  for (let index = 0; index < respAsJsonResults.length; index++) {
    const pokemonIndex = startIndex + index;
    const pokemonId = respAsJsonResults[index].id; // Eindeutige ID des Pokémons aus den API-Daten

    // Überprüfe, ob das Pokémon bereits in der Liste pokemons vorhanden ist
    if (pokemons.findIndex((pokemon) => pokemon.id === pokemonId) === -1) {
      const pokemonImg =
        pokemonDataArray[index].sprites.other["official-artwork"][
          "front_default"
        ];
      pokemons.push(respAsJsonResults[index]);
      addPokemons(pokemonIndex, pokemonDataArray[index]); // Pass the index of the newly added pokemon
    }
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
  dark: "dark",
};

function generateTypeHTML(types) {
  let typesHTML = "";
  for (let i = 0; i < types.length; i++) {
    let typeName = types[i].type.name;
    let typeImgSrc = typeImg[typeName];
    typesHTML += `<div class="types"><div class="type-name">${typeName}</div> <img class="img-types" src="./src/img/${typeImgSrc}.png"/></div>`;
  }
  return typesHTML;
}

function generateAbilityHTML(abilities) {
  let abilitiesHTML = "";
  for (let i = 0; i < Math.min(2, abilities.length); i++) {
    abilitiesHTML += `<div class="abilities">${abilities[i].ability.name}</div>`;
  }
  return abilitiesHTML;
}

function addPokemons(index, pokemonData) {
  let card = document.getElementById("card-field");
  let pokemonName = capitalizeFirstLetter(pokemons[index].name);
  let pokemonImg =
    pokemonData.sprites.other["official-artwork"]["front_default"];
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

  if (
    pokemonAbilities.length === 2 &&
    pokemonAbilities[0].ability.name.length +
      pokemonAbilities[1].ability.name.length >
      22
  ) {
    abilitiesHTML = `<div class="abilities">${pokemonAbilities[0].ability.name}</div>`;
  }

  let pokemonCardClass = pokemonTypes[0].type.name + "1";

  card.innerHTML += /*html*/ `
  <div onclick="showDetails('${pokemonImg}', '${index}', '${pokemonName}', '${pokemonCardClass}')" class="card ${pokemonCardClass}">
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

async function fetchAdditionalPokemon(numPokemons) {
  let resp = await fetch(`${POKE_API}&offset=${currentOffset}`);
  let respAsJson = await resp.json();
  let respAsJsonResults = respAsJson.results;

  for (let index = 0; index < numPokemons; index++) {
    if (respAsJsonResults[index]) {
      let pokemonUrl = respAsJsonResults[index].url;

      // Überprüfen, ob das Pokémon bereits geladen wurde
      if (!pokemons.some((pokemon) => pokemon.url === pokemonUrl)) {
        let pokemonResp = await fetch(pokemonUrl);
        let pokemonData = await pokemonResp.json();
        pokemons.push(respAsJsonResults[index]);
        addPokemons(pokemons.length - 1, pokemonData);
      }
    } else {
      break;
    }
  }
}

async function showPokemonCards(respAsJsonResults) {
  for (let index = 0; index < 20; index++) {
    let pokemonResp = await fetch(respAsJsonResults[index].url);
    let pokemonData = await pokemonResp.json();
    pokemons.push(respAsJsonResults[index]);
    addPokemons(pokemons.length - 1, pokemonData);
  }
}

function reloadSite() {
  location.reload();
}

function showDetails(pokemonImg, index, pokemonName, pokemonCardClass) {
  let indexNum = parseInt(index);
  currentPokemonIndex = indexNum + 1;
  let popUp = document.getElementById("popUp");
  popUp.classList.remove("d-none");
  let shadowBox = document.getElementById("shadowBox");
  shadowBox.classList.remove("d-none");
  shadowBox.classList.add("d-block");
  document.body.classList.add("disable-scrolling");
  let leftArrow = document.getElementById("leftArrow");
  let rightArrow = document.getElementById("rightArrow");
  leftArrow.classList.remove("d-none");
  rightArrow.classList.remove("d-none");
  rightArrow.onclick = function () {
    nextPokemon(
      pokemonImg,
      index,
      pokemonName,
      pokemonCardClass,
      currentPokemonIndex
    );
  };

  leftArrow.onclick = function () {
    previousPokemon(
      pokemonImg,
      index,
      pokemonName,
      pokemonCardClass,
      currentPokemonIndex
    );
  };

  shadowBox.innerHTML = /*html*/ `
<div class="header-popup">
  <div class="number-popup">#${currentPokemonIndex}</div>
  <div class="name-popup">${pokemonName}</div>
</div>
    <img class="popUp-img" src="${pokemonImg}" />
    <div class="${pokemonCardClass} background-info-div" id="background-info-div"></div>

  `;
}

function closeDetails() {
  let popUp = document.getElementById("popUp");
  popUp.classList.add("d-none");
  let shadowBox = document.getElementById("shadowBox");
  shadowBox.classList.remove("d-block");
  shadowBox.classList.add("d-none");
  document.body.classList.remove("disable-scrolling");
  let leftArrow = document.getElementById("leftArrow");
  let rightArrow = document.getElementById("rightArrow");
  leftArrow.classList.add("d-none");
  rightArrow.classList.add("d-none");
  currentPokemonIndex = 0;
}

function stopPropagationFunction(event) {
  event.stopPropagation();
}

async function nextPokemon(
  pokemonImg,
  index,
  pokemonName,
  pokemonCardClass,
  currentPokemonIndex
) {
  if (currentPokemonIndex < pokemons.length) {
    let nextPokemonIndex = currentPokemonIndex;
    let nextPokemonData = await fetchPokemonData(nextPokemonIndex);
    let nextPokemonCardClass = nextPokemonData.types[0].type.name + "1";
    showDetails(
      nextPokemonData.sprites.other["official-artwork"]["front_default"],
      nextPokemonIndex,
      capitalizeFirstLetter(nextPokemonData.name),
      nextPokemonCardClass
    );
  }
}

async function previousPokemon(
  pokemonImg,
  index,
  pokemonName,
  pokemonCardClass,
  currentPokemonIndex
) {
  if (currentPokemonIndex > 1) {
    let previousPokemonIndex = currentPokemonIndex - 2;
    let previousPokemonData = await fetchPokemonData(previousPokemonIndex);
    let previousPokemonCardClass = previousPokemonData.types[0].type.name + "1";
    showDetails(
      previousPokemonData.sprites.other["official-artwork"]["front_default"],
      previousPokemonIndex,
      capitalizeFirstLetter(previousPokemonData.name),
      previousPokemonCardClass
    );
  }
}

async function fetchPokemonData(index) {
  let pokemonUrl = pokemons[index].url;
  let pokemonResp = await fetch(pokemonUrl);
  return await pokemonResp.json();
}

function searchPokemon() {
  let searchTerm = document
    .getElementById("searchPokemons")
    .value.toLowerCase(); // Suchbegriff in Kleinbuchstaben konvertieren
  let cards = document.getElementsByClassName("card");

  for (let i = 0; i < cards.length; i++) {
    let pokemonName = cards[i]
      .getElementsByClassName("name")[0]
      .innerText.toLowerCase(); // Pokémon-Namen aus der Karte extrahieren und in Kleinbuchstaben konvertieren
    if (pokemonName.startsWith(searchTerm)) {
      cards[i].style.display = "block"; // Karte anzeigen, wenn der Pokémon-Name mit dem Suchbegriff beginnt
    } else {
      cards[i].style.display = "none"; // Ansonsten Karte ausblenden
    }
  }
}
