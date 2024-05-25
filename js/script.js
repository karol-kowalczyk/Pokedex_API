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

document.addEventListener("DOMContentLoaded", function () {
  const tooltip = document.getElementById("tooltip");

  document.querySelectorAll("[data-tooltip]").forEach((element) => {
    let timer; // Timer variable

    element.addEventListener("mouseenter", function (event) {
      tooltip.innerText = event.target.getAttribute("data-tooltip");
      tooltip.style.opacity = "1";

      // Set a timeout to hide the tooltip after 3 seconds
      timer = setTimeout(() => {
        tooltip.style.opacity = "0";
      }, 3000);
    });

    element.addEventListener("mousemove", function (event) {
      tooltip.style.left = event.pageX + 10 + "px";
      tooltip.style.top = event.pageY + 10 + "px";
    });

    element.addEventListener("mouseleave", function () {
      // Clear the timeout when mouse leaves the element
      clearTimeout(timer);
      tooltip.style.opacity = "0";
    });
  });
});

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(1).toUpperCase() + string.slice(1);
}

async function showPokemonText() {
  const currentPokemonIndexZeroBased = currentPokemonIndex - 1; // just the number of the pokemon
  const pokemonData = await fetchPokemonData(currentPokemonIndexZeroBased);
  const pokemonsAbilitieText = pokemonData.forms[0].url;
  const pokemonsAbilitieTextJson = await fetchJsonData(pokemonsAbilitieText);
  const pokemonsAbilitieTextJsonName = await fetchJsonData(
    pokemonsAbilitieTextJson.pokemon.url
  );
  const pokeAbilitie = await fetchJsonData(
    pokemonsAbilitieTextJsonName.abilities[0].ability.url
  );

  // Function for language detection
  function detectLanguage(text) {
    const englishKeywords = ["the", "and", "is", "in", "on"];
    const germanKeywords = [
      "mit",
      "dieser",
      "der",
      "und",
      "ist",
      "in",
      "auf",
      "wenn",
      "Fähigkeit",
    ];

    let englishCount = 0;
    let germanCount = 0;

    const words = text.toLowerCase().split(/\W+/);

    words.forEach((word) => {
      if (englishKeywords.includes(word)) englishCount++;
      if (germanKeywords.includes(word)) germanCount++;
    });

    if (englishCount > germanCount) {
      return "English";
    } else if (germanCount > englishCount) {
      return "German";
    } else {
      return "Unknown";
    }
  }

  let pokeAbilitieTxt = pokeAbilitie.effect_entries[0].effect;

  // Check if the text is in German
  if (detectLanguage(pokeAbilitieTxt) === "German") {
    pokeAbilitieTxt = pokeAbilitie.effect_entries[1].effect;
  }

  const fullText = pokeAbilitieTxt;
  let truncatedText = fullText;
  let seeMoreButton = "";

  if (fullText.length > 180) {
    truncatedText = fullText.substring(0, 180) + "...";
    seeMoreButton = `<button id="seeMoreButton" onclick="showFullText()">see more...</button>`;
  }

  const pokemonType = pokemonData.types[0].type.name + "1";
  const backImg =
    pokemonsAbilitieTextJsonName.sprites.other.dream_world.front_default;

  let popUpCard = document.getElementById("popupCard");

  popUpCard.innerHTML = /*html*/ `
    <div id="informationText" class="popUp">
      <div class="${pokemonType} background-info-div">
        <h3 id="pokeAbilitieTitle">Information</h3>
        <div class="poke-abilitie-txt">
          <span id="truncatedText">${truncatedText}</span>
          <span id="fullText" style="display: none;">${fullText.substring(
            180
          )}</span>
          <div class="see-more-btn-div">${seeMoreButton}</div>
        </div>
        <div class="poke-abilitie-img-div">
          <img id="abilityImage" class="poke-abilitie-img" src="${backImg}">
          <img class="popUp-returnarrow" onclick="hideInfortmationText()" src="src/img/return.png" alt="arrow">
        </div>
      </div>
    </div>`;

  // Function to show full text and hide the image
  window.showFullText = function () {
    document.getElementById("fullText").style.display = "inline";
    document.getElementById("seeMoreButton").style.display = "none";
    document.getElementById("abilityImage").style.display = "none";
  };
}

function hideInfortmationText() {
  let leftArrow = document.getElementById("leftArrow");
  let rightArrow = document.getElementById("rightArrow");
  let informationText = document.getElementById("informationText");
  informationText.classList.add("d-none");

  leftArrow.classList.remove("d-none");
  rightArrow.classList.remove("d-none");

  let popUpCard = document.getElementById("popupCard");
  popUpCard.innerHTML +=
    '<img class="popUp-arrow" onclick="nextPokemonVersion(event)" data-tooltip="see pokemon version" src="src/img/next.png" alt="arrow">';
}

// Helper function to fetch JSON data from a given URL
async function fetchJsonData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

async function nextPokemonVersion() {
  let rightArrow = document.getElementById("rightArrow");
  let leftArrow = document.getElementById("leftArrow");
  rightArrow.classList.add("d-none");
  leftArrow.classList.add("d-none");

  const currentPokemonIndexZeroBased = currentPokemonIndex - 1;
  const pokemonData = await fetchPokemonData(currentPokemonIndexZeroBased);
  const pokemonType = pokemonData.types[0].type.name + "1";
  const pokemonDataUrl = pokemonData.species.url;

<<<<<<< HEAD
=======
  // Current Pokemon info
  const currentPokemon = pokemons[currentPokemonIndexZeroBased];
  const currentPokemonName = capitalizeFirstLetter(currentPokemon.name);
  const currentPokemonImg = pokemonData.sprites.other["official-artwork"]["front_default"];
  console.log(currentPokemonImg);
>>>>>>> d17556d3ade90702510bcfd589818dfc644b0a2e
  // Fetch the JSON data from the pokemonDataUrl
  const nextGenerPokemonUrl = await fetchJsonData(pokemonDataUrl);

  // Fetch the evolution chain JSON data
  const evolutionChainUrl = nextGenerPokemonUrl.evolution_chain.url;
  const evolutionChain = await fetchJsonData(evolutionChainUrl);

<<<<<<< HEAD
  let evolutionHTML = "";
  let evolutionCount = 0;
=======
  // Safely access the previous evolution species name
  const previousPokeGeneration = nextGenerPokemonUrl.evolves_from_species?.name ?? '';
  console.log(previousPokeGeneration); // Ausgabe des evolutionChain JSON-Objekts
>>>>>>> d17556d3ade90702510bcfd589818dfc644b0a2e

  let currentPokemon = evolutionChain.chain;
  const evolutionChainList = [];
  while (currentPokemon) {
    evolutionCount++;
    evolutionChainList.push(currentPokemon);
    currentPokemon = currentPokemon.evolves_to[0];
  }

  const additionalId = evolutionCount === 2 ? ' id="moreSpace"' : '';
  const pokemonHeaderNameInfoCard = evolutionCount === 2 ? ' id="pokemonHeaderNameInfoCard"' : '';

  for (const currentPokemon of evolutionChainList) {
    const pokemonName = currentPokemon.species.name;
    const pokemonData = pokemons.find(
      (pokemon) => pokemon.name === pokemonName
    );
    let pokemonImg = "";
    if (pokemonData) {
      const pokemonDataIndex = pokemons.indexOf(pokemonData);
      const pokemonDataDetails = await fetchPokemonData(pokemonDataIndex);
      pokemonImg =
        pokemonDataDetails.sprites.other["official-artwork"]["front_default"];
    }

    evolutionHTML += /*html*/ `
      <div class="first-pokemon-generation-div">
        <div ${pokemonHeaderNameInfoCard} class="evolution-name">${capitalizeFirstLetter(pokemonName)}</div>
        <img ${additionalId} class="evolution-img" src="${pokemonImg}" alt="${pokemonName}" />
        <img class="popUp-returnarrow" onclick="disableEvolutionChainCard()" src="src/img/return.png" alt="arrow">
        <img class="popUp-arrow" onclick="showPokemonText()" src="src/img/next.png" alt="arrow">
    `;

    // Add the arrow-down image only if there is a next evolution
    if (currentPokemon.evolves_to.length > 0) {
      evolutionHTML += `<img class="arrow-down" src="src/img/down.png">`;
    }

    evolutionHTML += `</div>`;
  }

  let popUpCard = document.getElementById("popupCard");
  popUpCard.innerHTML = /*html*/ `
    <div id="evolutionChainCard" class="popUp">
      <div class="${pokemonType} background-info-div">
        <h3 id="popupCardTitle">Evolution Chain</h3>
        ${evolutionHTML}
      </div>
    </div>
  `;

  const tooltip = document.getElementById("tooltip");
  tooltip.style.opacity = "0"; // Set opacity to 0 to hide the tooltip
}



function disableEvolutionChainCard() {
  let leftArrow = document.getElementById("leftArrow");
  let rightArrow = document.getElementById("rightArrow");
  leftArrow.classList.remove("d-none");
  rightArrow.classList.remove("d-none");
  let evolutionChainCard = document.getElementById("evolutionChainCard");
  evolutionChainCard.classList.add("d-none");

  let popupCard = document.getElementById("popupCard");
  popupCard.innerHTML = /*html*/ `<img class="popUp-arrow" onclick="nextPokemonVersion(event)" data-tooltip="see pokemon version" src="src/img/next.png" alt="arrow">`;
}

// Helper function to fetch JSON data from a given URL
async function fetchJsonData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }
  return response.json();
}

// Helper function to fetch JSON data from a given URL
async function fetchJsonData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }
  return response.json();
}

<<<<<<< HEAD
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
  let popupCard = document.getElementById("popupCard");
  popupCard.innerHTML = /*html*/ `
  <img class="popUp-arrow" onclick="nextPokemonVersion(event)" data-tooltip="see pokemon version" src="src/img/next.png" alt="arrow">`;
}
=======
{/* <div class="first-evolution">
<div class="evolution-name">${firstEvolutionJson.name}</div>
<img src="${firstEvolutionImg}" alt="${firstEvolutionJson.name}" />
</div>
<div class="second-evolution">
<div class="evolution-name">${secondEvolutionJson.name}</div>
<img src="${secondEvolutionImg}" alt="${secondEvolutionJson.name}" />
</div>
<div class="third-evolution">
<div class="evolution-name">${thirdEvolutionJson.name}</div>
<img src="${thirdEvolutionImg}" alt="${thirdEvolutionJson.name}" />
</div> */}
>>>>>>> d17556d3ade90702510bcfd589818dfc644b0a2e
