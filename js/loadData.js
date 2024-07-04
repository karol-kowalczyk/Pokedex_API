const POKE_API = "https://pokeapi.co/api/v2/pokemon?limit=";

let pokemons = [];
let currentOffset = 0;
let currentPokemonIndex = 0;
let loadingAllPokemon = document.getElementById("loadingAllPokemon");
let scrollBar = document.body;

async function loadAllPokemons() {
    const numLoadedPokemons = pokemons.length;
    currentOffset = numLoadedPokemons;
    const remainingPokemons = 800 - numLoadedPokemons;

    hideButtons();
    disablesCrollBar();
    await checkRemainingPokemons(remainingPokemons);
}

async function checkRemainingPokemons(remainingPokemons) {
    if (remainingPokemons > 0) {
        await fetchAdditionalPokemon(remainingPokemons);
        loadAllPokemons();
    } else {
        enableScrollBar();
    }
}

function enableScrollBar() {
    loadingAllPokemon.classList.add("d-none");
    scrollBar.classList.remove("overflow-hidden");
}

function disablesCrollBar() {
    loadingAllPokemon.classList.remove("d-none");
    scrollBar.classList.add("overflow-hidden");
}

function loadTwentyMore() {
    showLoading();
    currentOffset += 20;
    fetchAdditionalPokemon(20).then(() => {
        hideLoading();
    });
}

async function loadData() {
    let resp = await fetch(`${POKE_API}40`);
    let respAsJson = await resp.json();
    let respAsJsonResults = respAsJson.results;
    let temporaryPokemonDataArray = [];
    showLoading();

    for (let index = 0; index < respAsJsonResults.length; index++) {
        let pokemonUrl = respAsJsonResults[index].url;
        if (!pokemons.some((pokemon) => pokemon.url === pokemonUrl)) {
            await loadPoekmonProcessData(pokemonUrl, respAsJsonResults, index, temporaryPokemonDataArray);
        }
    }

    activateRenderingFunctions(temporaryPokemonDataArray);
}

async function loadPoekmonProcessData(pokemonUrl, respAsJsonResults, index, temporaryPokemonDataArray) {
    let pokemonData = await fetchAndProcessPokemon(pokemonUrl, respAsJsonResults[index]);
    temporaryPokemonDataArray.push(pokemonData);
}

function activateRenderingFunctions(temporaryPokemonDataArray) {
    renderPokemonCards(temporaryPokemonDataArray);
    hideLoading();
    hideLoadMorePokemonsBtns();
}

async function fetchAndProcessPokemon(pokemonUrl, respAsJsonResult) {
    let pokemonResp = await fetch(pokemonUrl);
    let pokemonData = await pokemonResp.json();
    pokemons.push(respAsJsonResult);
    return pokemonData;
}

function renderPokemonCards(pokemonDataArray) {
    pokemonDataArray.forEach((pokemonData, index) => {
        addPokemons(
            pokemons.length - pokemonDataArray.length + index,
            pokemonData
        );
    });
}

function hideLoadMorePokemonsBtns() {
    let loadAllBttn = document.getElementById("loadAllButton");
    let load20Btn = document.getElementById("loadTwentyMoreButton");
    loadAllBttn.classList.remove("d-none");
    load20Btn.classList.remove("d-none");
}

async function showDetails(pokemonImg, index, pokemonName, pokemonCardClass) {
    let indexNum = parseInt(index);
    let popUp = document.getElementById("popUp");
    let shadowBox = document.getElementById("shadowBox");
    let leftArrow = document.getElementById("leftArrow");
    let rightArrow = document.getElementById("rightArrow");

    currentPokemonIndex = indexNum + 1;

    hidePopUpAndScrollbar(popUp, shadowBox, leftArrow, rightArrow);

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
  
    <img ID="popUp-img" class="popUp-img" src="${pokemonImg}" />
    <div class="${pokemonCardClass} background-info-div" id="background-info-div">
    </label>
    <div id="header-popup" class="header-popup">
        <div class="number-popup">#${currentPokemonIndex}</div>
        <div class="name-popup">${pokemonName}</div>
    </div>
      <div class="stats">${statsHTML}</div>
    </div>
    `;

    setWidthOfProgressBar(pokemonData);
}

function hidePopUpAndScrollbar(popUp, shadowBox, leftArrow, rightArrow) {
    popUp.classList.remove("d-none");
    shadowBox.classList.remove("d-none");
    shadowBox.classList.add("d-block");
    document.body.classList.add("disable-scrolling");
    leftArrow.classList.remove("d-none");
    rightArrow.classList.remove("d-none");
}

function setWidthOfProgressBar(pokemonData) {
    // Set the width of the progress bars
    for (let i = 0; i < pokemonData.stats.length; i++) {
        let progressBar = document.getElementById(`progressbar-${i}`);
        let widthPercentage = (pokemonData.stats[i].base_stat / 200) * 100;
        progressBar.style.width = `${widthPercentage}%`;
    }
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

    // Fetch the JSON data from the pokemonDataUrl
    const nextGenerPokemonUrl = await fetchJsonData(pokemonDataUrl);

    // Fetch the evolution chain JSON data
    const evolutionChainUrl = nextGenerPokemonUrl.evolution_chain.url;
    const evolutionChain = await fetchJsonData(evolutionChainUrl);

    let evolutionHTML = "";
    let evolutionCount = 0;

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
