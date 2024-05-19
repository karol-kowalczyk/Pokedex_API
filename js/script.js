const POKE_API = "https://pokeapi.co/api/v2/pokemon?limit=";

let pokemons = [];
let currentOffset = 0;
let currentPokemonIndex = 0;

async function loadAllPokemons() {
  hideButtons();
  let loadingAllPokemon = document.getElementById("loadingAllPokemon");
  loadingAllPokemon.classList.remove("d-none");
  let scrollBar = document.body;
  scrollBar.classList.add("overflow-hidden");
  const numLoadedPokemons = pokemons.length;
  currentOffset = numLoadedPokemons;
  const remainingPokemons = 800 - numLoadedPokemons;
  if (remainingPokemons > 0) {
    await fetchAdditionalPokemon(remainingPokemons);
    loadAllPokemons();
  } else {
    loadingAllPokemon.classList.add("d-none");
    scrollBar.classList.remove("overflow-hidden");
  }
}

function loadTwentyMore() {
  showLoading();
  currentOffset += 20;
  fetchAdditionalPokemon(20).then(() => {
    hideLoading();
  });
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function loadData() {
  let loadAllBttn = document.getElementById("loadAllButton");
  let load20Btn = document.getElementById("loadTwentyMoreButton");
  showLoading();
  let resp = await fetch(`${POKE_API}20`);
  let respAsJson = await resp.json();
  let respAsJsonResults = respAsJson.results;

  let temporaryPokemonDataArray = [];

  for (let index = 0; index < respAsJsonResults.length; index++) {
    let pokemonUrl = respAsJsonResults[index].url;
    if (!pokemons.some((pokemon) => pokemon.url === pokemonUrl)) {
      let pokemonResp = await fetch(pokemonUrl);
      let pokemonData = await pokemonResp.json();
      pokemons.push(respAsJsonResults[index]);
      temporaryPokemonDataArray.push(pokemonData);
    }
  }

  // Now render all Pokémon cards at once
  temporaryPokemonDataArray.forEach((pokemonData, index) => {
    addPokemons(
      pokemons.length - temporaryPokemonDataArray.length + index,
      pokemonData
    );
  });

  hideLoading();
  loadAllBttn.classList.remove("d-none");
  load20Btn.classList.remove("d-none");
}

function showPokemonCards(respAsJsonResults, pokemonDataArray) {
  const startIndex = pokemons.length;

  for (let index = 0; index < respAsJsonResults.length; index++) {
    const pokemonIndex = startIndex + index;
    const pokemonId = respAsJsonResults[index].id;

    if (pokemons.findIndex((pokemon) => pokemon.id === pokemonId) === -1) {
      const pokemonImg =
        pokemonDataArray[index].sprites.other["official-artwork"][
          "front_default"
        ];
      pokemons.push(respAsJsonResults[index]);
      addPokemons(pokemonDataArray[index]);
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
  if (abilities.length > 0) {
    return `<div class="abilities">${abilities[0].ability.name}</div>`;
  } else {
    return ""; // Return an empty string if no abilities are available
  }
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
        <div class="pokemon-abilities-div">
            <div>abilities:</div>
            <div>${abilitiesHTML}</div>
            <div></div>
        </div>
    </div>
      </div>
    </div>`;
}

async function fetchAdditionalPokemon(numPokemons) {
  let resp = await fetch(`${POKE_API}&offset=${currentOffset}`);
  let respAsJson = await resp.json();
  let respAsJsonResults = respAsJson.results;

  let temporaryPokemonDataArray = [];

  for (let index = 0; index < numPokemons; index++) {
    if (respAsJsonResults[index]) {
      let pokemonUrl = respAsJsonResults[index].url;

      if (!pokemons.some((pokemon) => pokemon.url === pokemonUrl)) {
        let pokemonResp = await fetch(pokemonUrl);
        let pokemonData = await pokemonResp.json();
        pokemons.push(respAsJsonResults[index]);
        temporaryPokemonDataArray.push(pokemonData);
      }
    } else {
      break;
    }
  }

  // Now render all Pokémon cards at once
  temporaryPokemonDataArray.forEach((pokemonData, index) => {
    addPokemons(
      pokemons.length - temporaryPokemonDataArray.length + index,
      pokemonData
    );
  });
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

async function showDetails(pokemonImg, index, pokemonName, pokemonCardClass) {
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

  // Fetch Pokemon data for the selected Pokemon
  let pokemonData = await fetchPokemonData(indexNum);

  // Generate stats HTML
  let statsHTML = "";
  for (let i = 0; i < pokemonData.stats.length; i++) {
    let pokemonStatsName = capitalizeFirstLetter(
      pokemonData.stats[i].stat.name
    );

    // Replace "special" with "spec"
    pokemonStatsName = pokemonStatsName.replace(/Special/i, "Spec.");

    // Abbreviate "attack" and "defense" only if "spec" is before them
    if (pokemonStatsName.includes("Spec")) {
      pokemonStatsName = pokemonStatsName.replace(/Attack/i, "Atk.");
      pokemonStatsName = pokemonStatsName.replace(/Defense/i, "Def.");
    }

    let pokemonStats = pokemonData.stats[i].base_stat;
    let progressBarId = `progressbar-${i}`;
    statsHTML += /*html*/ `
    <div class="${pokemonCardClass} stat">
      <span class="${pokemonCardClass} stat-name">${pokemonStatsName}: ${pokemonStats}</span>
      <span id="${progressBarId}" class="progressbar"></span>
    </div>`;
  }

  shadowBox.innerHTML = /*html*/ `
  <div class="header-popup">
    <div class="number-popup">#${currentPokemonIndex}</div>
    <div class="name-popup">${pokemonName}</div>
  </div>
  <img class="popUp-img" src="${pokemonImg}" />
  <div class="${pokemonCardClass} background-info-div" id="background-info-div">
  </label>
    <div class="stats">${statsHTML}</div>
  </div>
  `;

  // Set the width of the progress bars
  for (let i = 0; i < pokemonData.stats.length; i++) {
    let progressBar = document.getElementById(`progressbar-${i}`);
    let widthPercentage = (pokemonData.stats[i].base_stat / 200) * 100;
    progressBar.style.width = `${widthPercentage}%`;
  }
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
    .value.toLowerCase();
  let cards = document.getElementsByClassName("card");
  let cardField = document.getElementById("card-field");
  let loadAllBtn = document.getElementById("loadAllButton");
  let load20Btn = document.getElementById("loadTwentyMoreButton");
  let found = false;

  // Verstecke die Load-Buttons während der Suche
  loadAllBtn.style.display = "none";
  load20Btn.style.display = "none";

  for (let i = 0; i < cards.length; i++) {
    let pokemonName = cards[i]
      .getElementsByClassName("name")[0]
      .innerText.toLowerCase();
    if (pokemonName.startsWith(searchTerm)) {
      cards[i].style.display = "block";
      found = true;
    } else {
      cards[i].style.display = "none";
    }
  }

  let noPokemonMessage = document.querySelector(".no-pokemon");
  if (!found) {
    if (!noPokemonMessage) {
      let message = document.createElement("div");
      message.className = "no-pokemon";
      message.innerText = "No Pokémon found ...";
      cardField.appendChild(message);
    }
  } else {
    if (noPokemonMessage) {
      noPokemonMessage.remove();
    }
  }

  // Zeige die Load-Buttons wieder an, wenn das Suchfeld leer ist
  if (searchTerm === "") {
    loadAllBtn.style.display = "block";
    load20Btn.style.display = "block";
  }
}

function handleResize() {
  let pokball = document.getElementById("pokeball");
  if (window.innerWidth <= 1456) {
    pokball.classList.add("d-none");
  } else {
    pokball.classList.remove("d-none");
  }
}

window.addEventListener("resize", handleResize);

function showLoading() {
  let loading = document.getElementById("loading");
  loading.style.display = "flex";
}

function hideLoading() {
  let loading = document.getElementById("loading");
  loading.style.display = "none";
}

function hideButtons() {
  document.getElementById("loadAllButton").classList.add("d-none");
  document.getElementById("loadTwentyMoreButton").classList.add("d-none");
}
