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
    await forLoopLoadData(respAsJsonResults, temporaryPokemonDataArray);
    activateRenderingFunctions(temporaryPokemonDataArray);
}

async function forLoopLoadData(respAsJsonResults, temporaryPokemonDataArray) {
    for (let index = 0; index < respAsJsonResults.length; index++) {
        let pokemonUrl = respAsJsonResults[index].url;
        if (!pokemons.some((pokemon) => pokemon.url === pokemonUrl)) {
            await loadPoekmonProcessData(pokemonUrl, respAsJsonResults, index, temporaryPokemonDataArray);
        }
    }
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
    currentPokemonIndex = indexNum + 1;
    let popUp = document.getElementById("popUp");
    let shadowBox = document.getElementById("shadowBox");
    let leftArrow = document.getElementById("leftArrow");
    let rightArrow = document.getElementById("rightArrow");
    hidePopUpAndScrollbar(popUp, shadowBox, leftArrow, rightArrow);
    setArrowEventHandlers(pokemonImg, index, pokemonName, pokemonCardClass);
    let pokemonData = await fetchPokemonData(indexNum);
    let statsHTML = await generateStatsHtml(pokemonData, pokemonCardClass);
    showShadowBox(shadowBox, pokemonImg, pokemonCardClass, currentPokemonIndex, pokemonName, statsHTML);
    setWidthOfProgressBar(pokemonData);
}

function setArrowEventHandlers(pokemonImg, index, pokemonName, pokemonCardClass) {
    let rightArrow = document.getElementById("rightArrow");
    let leftArrow = document.getElementById("leftArrow");

    rightArrow.onclick = function () {
        nextPokemon(pokemonImg, index, pokemonName, pokemonCardClass, currentPokemonIndex);
    };

    leftArrow.onclick = function () {
        previousPokemon(pokemonImg, index, pokemonName, pokemonCardClass, currentPokemonIndex);
    };
}

async function fetchPokemonData(index) {
    let pokemonUrl = pokemons[index].url;
    let pokemonResp = await fetch(pokemonUrl);
    return await pokemonResp.json();
}

async function generateStatsHtml(pokemonData, pokemonCardClass) {
    let statsHTML = "";
    for (let i = 0; i < pokemonData.stats.length; i++) {
        let pokemonStatsName = capitalizeFirstLetter(pokemonData.stats[i].stat.name).replace(/Special/i, "Spec.").replace(/Attack/i, "Atk.").replace(/Defense/i, "Def.");
        let pokemonStats = pokemonData.stats[i].base_stat;
        let progressBarId = `progressbar-${i}`;
        statsHTML += `
            <div class="${pokemonCardClass} stat">
                <span class="${pokemonCardClass} stat-name">${pokemonStatsName}: ${pokemonStats}</span>
                <span id="${progressBarId}" class="progressbar"></span>
            </div>`;
    }
    return statsHTML;
}

function showShadowBox(shadowBox, pokemonImg, pokemonCardClass, currentPokemonIndex, pokemonName, statsHTML) {
    shadowBox.innerHTML = `
        <img ID="popUp-img" class="popUp-img" src="${pokemonImg}" />
        <div class="${pokemonCardClass} background-info-div" id="background-info-div">
            <div id="header-popup" class="header-popup">
                <div class="number-popup">#${currentPokemonIndex}</div>
                <div class="name-popup">${pokemonName}</div>
            </div>
            <div class="stats">${statsHTML}</div>
        </div>
    `;
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
    for (let i = 0; i < pokemonData.stats.length; i++) {
        let progressBar = document.getElementById(`progressbar-${i}`);
        let widthPercentage = (pokemonData.stats[i].base_stat / 200) * 100;
        progressBar.style.width = `${widthPercentage}%`;
    }
}

function generateStatsHtml(pokemonData, pokemonCardClass) {
    return new Promise((resolve) => {
        let statsHTML = pokemonData.stats.map((stat, index) => {
            let pokemonStatsName = formatStatName(stat.stat.name);
            let pokemonStats = stat.base_stat;
            let progressBarId = `progressbar-${index}`;
            return createStatHtml(pokemonCardClass, pokemonStatsName, pokemonStats, progressBarId);
        }).join("");
        resolve(statsHTML);
    });
}

function formatStatName(statName) {
    let formattedName = capitalizeFirstLetter(statName);
    formattedName = formattedName.replace(/Special/i, "Spec.");
    if (formattedName.includes("Spec")) {
        formattedName = formattedName.replace(/Attack/i, "Atk.");
        formattedName = formattedName.replace(/Defense/i, "Def.");
    }
    return formattedName;
}

function createStatHtml(pokemonCardClass, statName, statValue, progressBarId) {
    return `
        <div class="${pokemonCardClass} stat">
            <span class="${pokemonCardClass} stat-name">${statName}: ${statValue}</span>
            <span id="${progressBarId}" class="progressbar"></span>
        </div>`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function hidePopUpAndScrollbar(popUp, shadowBox, leftArrow, rightArrow) {
    popUp.classList.remove("d-none");
    shadowBox.classList.remove("d-none");
    shadowBox.classList.add("d-block");
    document.body.classList.add("disable-scrolling");
    leftArrow.classList.remove("d-none");
    rightArrow.classList.remove("d-none");
}

function showShadowBox(shadowBox, pokemonImg, pokemonCardClass, currentPokemonIndex, pokemonName, statsHTML) {
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
}

function setWidthOfProgressBar(pokemonData) {
    // Set the width of the progress bars
    for (let i = 0; i < pokemonData.stats.length; i++) {
        let progressBar = document.getElementById(`progressbar-${i}`);
        let widthPercentage = (pokemonData.stats[i].base_stat / 200) * 100;
        progressBar.style.width = `${widthPercentage}%`;
    }
}

async function nextPokemon(pokemonImg, index, pokemonName, pokemonCardClass, currentPokemonIndex) {
    if (currentPokemonIndex < pokemons.length) {
        let nextPokemonIndex = currentPokemonIndex;
        let nextPokemonData = await fetchPokemonData(nextPokemonIndex);
        let nextPokemonCardClass = getPokemonCardClass(nextPokemonData);
        showNextOrPreviousPokemon(nextPokemonData, nextPokemonIndex, nextPokemonCardClass);
    }
}

async function previousPokemon(pokemonImg, index, pokemonName, pokemonCardClass, currentPokemonIndex) {
    if (currentPokemonIndex > 1) {
        let previousPokemonIndex = currentPokemonIndex - 2;
        let previousPokemonData = await fetchPokemonData(previousPokemonIndex);
        let previousPokemonCardClass = getPokemonCardClass(previousPokemonData);
        showNextOrPreviousPokemon(previousPokemonData, previousPokemonIndex, previousPokemonCardClass);
    }
}

function getPokemonCardClass(pokemonData) {
    return pokemonData.types[0].type.name + "1";
}

async function showNextOrPreviousPokemon(pokemonData, pokemonIndex, pokemonCardClass) {
    let pokemonImg = pokemonData.sprites.other["official-artwork"]["front_default"];
    let pokemonName = capitalizeFirstLetter(pokemonData.name);
    showDetails(pokemonImg, pokemonIndex, pokemonName, pokemonCardClass);
}

async function fetchPokemonData(index) {
    let pokemonUrl = pokemons[index].url;
    let pokemonResp = await fetch(pokemonUrl);
    return await pokemonResp.json();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
    hideArrows();
    
    const currentPokemonIndexZeroBased = currentPokemonIndex - 1;
    const pokemonData = await fetchPokemonData(currentPokemonIndexZeroBased);
    const pokemonType = getPokemonType(pokemonData);
    const evolutionChain = await fetchEvolutionChain(pokemonData.species.url);
    
    const evolutionHTML = await generateEvolutionHtml(evolutionChain);
    renderEvolutionChain(evolutionHTML, pokemonType);
    hideTooltip();
}

function hideArrows() {
    document.getElementById("rightArrow").classList.add("d-none");
    document.getElementById("leftArrow").classList.add("d-none");
}

async function fetchEvolutionChain(speciesUrl) {
    const nextGenerPokemonUrl = await fetchJsonData(speciesUrl);
    const evolutionChainUrl = nextGenerPokemonUrl.evolution_chain.url;
    return await fetchJsonData(evolutionChainUrl);
}

function getPokemonType(pokemonData) {
    return pokemonData.types[0].type.name + "1";
}

async function generateEvolutionHtml(evolutionChain) {
    let evolutionHTML = "";
    let evolutionCount = 0;
    const evolutionChainList = buildEvolutionChainList(evolutionChain);

    for (const currentPokemon of evolutionChainList) {
        const { pokemonName, pokemonImg } = await getPokemonDetails(currentPokemon);
        const { additionalId, pokemonHeaderNameInfoCard } = getEvolutionCssIds(evolutionCount);

        evolutionHTML += createEvolutionHtml(pokemonName, pokemonImg, additionalId, pokemonHeaderNameInfoCard, currentPokemon);
    }

    return evolutionHTML;
}

function buildEvolutionChainList(evolutionChain) {
    let evolutionCount = 0;
    let currentPokemon = evolutionChain.chain;
    const evolutionChainList = [];

    while (currentPokemon) {
        evolutionCount++;
        evolutionChainList.push(currentPokemon);
        currentPokemon = currentPokemon.evolves_to[0];
    }

    return evolutionChainList;
}

async function getPokemonDetails(currentPokemon) {
    const pokemonName = currentPokemon.species.name;
    const pokemonData = pokemons.find((pokemon) => pokemon.name === pokemonName);
    let pokemonImg = "";

    if (pokemonData) {
        const pokemonDataIndex = pokemons.indexOf(pokemonData);
        const pokemonDataDetails = await fetchPokemonData(pokemonDataIndex);
        pokemonImg = pokemonDataDetails.sprites.other["official-artwork"]["front_default"];
    }

    return { pokemonName, pokemonImg };
}

function getEvolutionCssIds(evolutionCount) {
    return {
        additionalId: evolutionCount === 2 ? ' id="moreSpace"' : '',
        pokemonHeaderNameInfoCard: evolutionCount === 2 ? ' id="pokemonHeaderNameInfoCard"' : ''
    };
}

function createEvolutionHtml(pokemonName, pokemonImg, additionalId, pokemonHeaderNameInfoCard, currentPokemon) {
    let html = `
        <div class="first-pokemon-generation-div">
            <div ${pokemonHeaderNameInfoCard} class="evolution-name">${capitalizeFirstLetter(pokemonName)}</div>
            <img ${additionalId} class="evolution-img" src="${pokemonImg}" alt="${pokemonName}" />
            <img class="popUp-returnarrow" onclick="disableEvolutionChainCard()" src="src/img/return.png" alt="arrow">
            <img class="popUp-arrow" onclick="showPokemonText()" src="src/img/next.png" alt="arrow">`;

    if (currentPokemon.evolves_to.length > 0) {
        html += `<img class="arrow-down" src="src/img/down.png">`;
    }

    html += `</div>`;
    return html;
}

function renderEvolutionChain(evolutionHTML, pokemonType) {
    let popUpCard = document.getElementById("popupCard");
    popUpCard.innerHTML = `
        <div id="evolutionChainCard" class="popUp">
            <div class="${pokemonType} background-info-div">
                <h3 id="popupCardTitle">Evolution Chain</h3>
                ${evolutionHTML}
            </div>
        </div>`;
}

function hideTooltip() {
    document.getElementById("tooltip").style.opacity = "0";
}

async function fetchPokemonData(index) {
    let pokemonUrl = pokemons[index].url;
    let pokemonResp = await fetch(pokemonUrl);
    return await pokemonResp.json();
}

async function fetchJsonData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function disableEvolutionChainCard() {
    showArrows();
    hideEvolutionChainCard();
    resetPopupCard();
}

function showArrows() {
    document.getElementById("leftArrow").classList.remove("d-none");
    document.getElementById("rightArrow").classList.remove("d-none");
}

function hideEvolutionChainCard() {
    document.getElementById("evolutionChainCard").classList.add("d-none");
}

function resetPopupCard() {
    document.getElementById("popupCard").innerHTML = `
        <img class="popUp-arrow" onclick="nextPokemonVersion(event)" data-tooltip="see pokemon version" src="src/img/next.png" alt="arrow">
    `;
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