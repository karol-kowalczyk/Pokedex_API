/**
 * The base URL for the PokeAPI.
 * @constant {string}
 */
const POKE_API = "https://pokeapi.co/api/v2/pokemon?limit=";

/**
 * Array to hold the loaded Pokémon data.
 * @type {Array}
 */
let pokemons = [];

/**
 * Offset for the current set of loaded Pokémon.
 * @type {number}
 */
let currentOffset = 0;

/**
 * Index of the currently displayed Pokémon.
 * @type {number}
 */
let currentPokemonIndex = 0;

/**
 * DOM element that shows the loading indicator.
 * @type {HTMLElement}
 */
let loadingAllPokemon = document.getElementById("loadingAllPokemon");

/**
 * Reference to the scroll bar element.
 * @type {HTMLElement}
 */
let scrollBar = document.body;

/**
 * Loads all Pokémon from the API.
 * Updates the current offset and remaining Pokémon count.
 * Disables the scroll bar and hides buttons during loading.
 */
async function loadAllPokemons() {
    const numLoadedPokemons = pokemons.length;
    currentOffset = numLoadedPokemons;
    const remainingPokemons = 800 - numLoadedPokemons;

    hideButtons();
    disablesScrollBar();
    await checkRemainingPokemons(remainingPokemons);
}

/**
 * Checks the remaining number of Pokémon to be loaded.
 * If there are remaining Pokémon, it fetches more data and continues loading.
 * Otherwise, it enables the scroll bar.
 * @param {number} remainingPokemons - The number of Pokémon left to load.
 */
async function checkRemainingPokemons(remainingPokemons) {
    if (remainingPokemons > 0) {
        await fetchAdditionalPokemon(remainingPokemons);
        loadAllPokemons();
    } else {
        enableScrollBar();
    }
}

/**
 * Enables the scroll bar and hides the loading indicator.
 */
function enableScrollBar() {
    loadingAllPokemon.classList.add("d-none");
    scrollBar.classList.remove("overflow-hidden");
}

/**
 * Disables the scroll bar and shows the loading indicator.
 */
function disablesScrollBar() {
    loadingAllPokemon.classList.remove("d-none");
    scrollBar.classList.add("overflow-hidden");
}

/**
 * Loads an additional 20 Pokémon from the API.
 * Shows the loading indicator while fetching data.
 */
function loadTwentyMore() {
    showLoading();
    currentOffset += 20;
    fetchAdditionalPokemon(20).then(() => {
        hideLoading();
    });
}

/**
 * Fetches the initial set of Pokémon data from the API.
 * Processes and renders the data.
 */
async function loadData() {
    let resp = await fetch(`${POKE_API}40`);
    let respAsJson = await resp.json();
    let respAsJsonResults = respAsJson.results;
    let temporaryPokemonDataArray = [];
    showLoading();
    await forLoopLoadData(respAsJsonResults, temporaryPokemonDataArray);
    activateRenderingFunctions(temporaryPokemonDataArray);
}

/**
 * Loops through the fetched Pokémon data and processes each Pokémon.
 * @param {Array} respAsJsonResults - The array of fetched Pokémon results.
 * @param {Array} temporaryPokemonDataArray - The temporary array to hold processed Pokémon data.
 */
async function forLoopLoadData(respAsJsonResults, temporaryPokemonDataArray) {
    for (let index = 0; index < respAsJsonResults.length; index++) {
        let pokemonUrl = respAsJsonResults[index].url;
        if (!pokemons.some((pokemon) => pokemon.url === pokemonUrl)) {
            await loadPokemonProcessData(pokemonUrl, respAsJsonResults, index, temporaryPokemonDataArray);
        }
    }
}

/**
 * Processes a single Pokémon's data and adds it to the temporary array.
 * @param {string} pokemonUrl - The URL to fetch the Pokémon data from.
 * @param {Array} respAsJsonResults - The array of fetched Pokémon results.
 * @param {number} index - The current index in the loop.
 * @param {Array} temporaryPokemonDataArray - The temporary array to hold processed Pokémon data.
 */
async function loadPokemonProcessData(pokemonUrl, respAsJsonResults, index, temporaryPokemonDataArray) {
    let pokemonData = await fetchAndProcessPokemon(pokemonUrl, respAsJsonResults[index]);
    temporaryPokemonDataArray.push(pokemonData);
}

/**
 * Activates the rendering functions for the Pokémon data.
 * @param {Array} temporaryPokemonDataArray - The array of processed Pokémon data.
 */
function activateRenderingFunctions(temporaryPokemonDataArray) {
    renderPokemonCards(temporaryPokemonDataArray);
    hideLoading();
    hideLoadMorePokemonsBtns();
}

/**
 * Fetches and processes a single Pokémon's data from the API.
 * @param {string} pokemonUrl - The URL to fetch the Pokémon data from.
 * @param {Object} respAsJsonResult - The fetched Pokémon result object.
 * @returns {Promise<Object>} The processed Pokémon data.
 */
async function fetchAndProcessPokemon(pokemonUrl, respAsJsonResult) {
    let pokemonResp = await fetch(pokemonUrl);
    let pokemonData = await pokemonResp.json();
    pokemons.push(respAsJsonResult);
    return pokemonData;
}

/**
 * Renders the Pokémon cards using the provided data array.
 * @param {Array} pokemonDataArray - The array of Pokémon data to render.
 */
function renderPokemonCards(pokemonDataArray) {
    pokemonDataArray.forEach((pokemonData, index) => {
        addPokemons(
            pokemons.length - pokemonDataArray.length + index,
            pokemonData
        );
    });
}

/**
 * Shows the buttons to load more Pokémon and hides the loading indicator.
 */
function hideLoadMorePokemonsBtns() {
    let loadAllBttn = document.getElementById("loadAllButton");
    let load20Btn = document.getElementById("loadTwentyMoreButton");
    loadAllBttn.classList.remove("d-none");
    load20Btn.classList.remove("d-none");
}

/**
 * Shows the details of a specific Pokémon in a popup.
 * @param {string} pokemonImg - The URL of the Pokémon image.
 * @param {number} index - The index of the Pokémon in the array.
 * @param {string} pokemonName - The name of the Pokémon.
 * @param {string} pokemonCardClass - The CSS class for the Pokémon card.
 */
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

/**
 * Sets the event handlers for the left and right arrow buttons.
 * @param {string} pokemonImg - The URL of the Pokémon image.
 * @param {number} index - The index of the Pokémon in the array.
 * @param {string} pokemonName - The name of the Pokémon.
 * @param {string} pokemonCardClass - The CSS class for the Pokémon card.
 */
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

/**
 * Fetches the data for a specific Pokémon.
 * @param {number} index - The index of the Pokémon in the array.
 * @returns {Promise<Object>} The fetched Pokémon data.
 */
async function fetchPokemonData(index) {
    let pokemonUrl = pokemons[index].url;
    let pokemonResp = await fetch(pokemonUrl);
    return await pokemonResp.json();
}

/**
 * Generates the HTML for a Pokémon's stats.
 * @param {Object} pokemonData - The data of the Pokémon.
 * @param {string} pokemonCardClass - The CSS class for the Pokémon card.
 * @returns {Promise<string>} The generated HTML for the stats.
 */
async function generateStatsHtml(pokemonData, pokemonCardClass) {
    let statsHTML = "";
    for (let i = 0; i < pokemonData.stats.length; i++) {
        let pokemonStatsName = capitalizeFirstLetter(pokemonData.stats[i].stat.name)
            .replace(/Special/i, "Spec.")
            .replace(/Attack/i, "Atk.")
            .replace(/Defense/i, "Def.");
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

/**
 * Displays the shadow box with Pokémon details.
 * @param {HTMLElement} shadowBox - The shadow box element.
 * @param {string} pokemonImg - The URL of the Pokémon image.
 * @param {string} pokemonCardClass - The CSS class for the Pokémon card.
 * @param {number} currentPokemonIndex - The index of the currently displayed Pokémon.
 * @param {string} pokemonName - The name of the Pokémon.
 * @param {string} statsHTML - The HTML of the Pokémon's stats.
 */
function showShadowBox(shadowBox, pokemonImg, pokemonCardClass, currentPokemonIndex, pokemonName, statsHTML) {
    shadowBox.innerHTML = `

        <div class="${pokemonCardClass} background-info-div" id="background-info-div">
            <img ID="popUp-img" class="popUp-img" src="${pokemonImg}" />
            <div id="header-popup" class="header-popup">
                <div class="number-popup">#${currentPokemonIndex}</div>
                <div class="name-popup">${pokemonName}</div>
            </div>
            <div class="stats">${statsHTML}</div>
        </div>
    `;
}

/**
 * Hides the popup and scrollbar, and shows the left and right arrow buttons.
 * @param {HTMLElement} popUp - The popup element.
 * @param {HTMLElement} shadowBox - The shadow box element.
 * @param {HTMLElement} leftArrow - The left arrow button element.
 * @param {HTMLElement} rightArrow - The right arrow button element.
 */
function hidePopUpAndScrollbar(popUp, shadowBox, leftArrow, rightArrow) {
    popUp.classList.remove("d-none");
    shadowBox.classList.remove("d-none");
    shadowBox.classList.add("d-block");
    document.body.classList.add("disable-scrolling");
    leftArrow.classList.remove("d-none");
    rightArrow.classList.remove("d-none");
}

/**
 * Sets the width of the progress bars for the Pokémon's stats.
 * @param {Object} pokemonData - The data of the Pokémon.
 */
function setWidthOfProgressBar(pokemonData) {
    for (let i = 0; i < pokemonData.stats.length; i++) {
        let progressBar = document.getElementById(`progressbar-${i}`);
        let widthPercentage = (pokemonData.stats[i].base_stat / 200) * 100;
        progressBar.style.width = `${widthPercentage}%`;
    }
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} string - The string to capitalize.
 * @returns {string} The capitalized string.
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Sets the width of progress bars based on Pokemon data stats.
 * @param {Object} pokemonData - Data object containing Pokemon stats.
 */
function setWidthOfProgressBar(pokemonData) {
    // Set the width of the progress bars
    for (let i = 0; i < pokemonData.stats.length; i++) {
        let progressBar = document.getElementById(`progressbar-${i}`);
        let widthPercentage = (pokemonData.stats[i].base_stat / 200) * 100;
        progressBar.style.width = `${widthPercentage}%`;
    }
}

/**
 * Loads the next Pokemon data and displays it.
 * @param {string} pokemonImg - URL for the Pokemon image.
 * @param {number} index - Index of the current Pokemon.
 * @param {string} pokemonName - Name of the Pokemon.
 * @param {string} pokemonCardClass - CSS class for the Pokemon card.
 * @param {number} currentPokemonIndex - Index of the current Pokemon in the list.
 */
async function nextPokemon(pokemonImg, index, pokemonName, pokemonCardClass, currentPokemonIndex) {
    if (currentPokemonIndex < pokemons.length) {
        let nextPokemonIndex = currentPokemonIndex;
        let nextPokemonData = await fetchPokemonData(nextPokemonIndex);
        let nextPokemonCardClass = getPokemonCardClass(nextPokemonData);
        showNextOrPreviousPokemon(nextPokemonData, nextPokemonIndex, nextPokemonCardClass);
    }
}

/**
 * Loads the previous Pokemon data and displays it.
 * @param {string} pokemonImg - URL for the Pokemon image.
 * @param {number} index - Index of the current Pokemon.
 * @param {string} pokemonName - Name of the Pokemon.
 * @param {string} pokemonCardClass - CSS class for the Pokemon card.
 * @param {number} currentPokemonIndex - Index of the current Pokemon in the list.
 */
async function previousPokemon(pokemonImg, index, pokemonName, pokemonCardClass, currentPokemonIndex) {
    if (currentPokemonIndex > 1) {
        let previousPokemonIndex = currentPokemonIndex - 2;
        let previousPokemonData = await fetchPokemonData(previousPokemonIndex);
        let previousPokemonCardClass = getPokemonCardClass(previousPokemonData);
        showNextOrPreviousPokemon(previousPokemonData, previousPokemonIndex, previousPokemonCardClass);
    }
}

/**
 * Gets the CSS class for the Pokemon card based on its type.
 * @param {Object} pokemonData - Data object containing Pokemon type information.
 * @returns {string} - CSS class name.
 */
function getPokemonCardClass(pokemonData) {
    return pokemonData.types[0].type.name + "1";
}

/**
 * Displays details of the next or previous Pokemon.
 * @param {Object} pokemonData - Data object containing Pokemon details.
 * @param {number} pokemonIndex - Index of the Pokemon.
 * @param {string} pokemonCardClass - CSS class for the Pokemon card.
 */
async function showNextOrPreviousPokemon(pokemonData, pokemonIndex, pokemonCardClass) {
    let pokemonImg = pokemonData.sprites.other["official-artwork"]["front_default"];
    let pokemonName = capitalizeFirstLetter(pokemonData.name);
    showDetails(pokemonImg, pokemonIndex, pokemonName, pokemonCardClass);
}

/**
 * Fetches Pokemon data from the API based on index.
 * @param {number} index - Index of the Pokemon in the list.
 * @returns {Promise<Object>} - Promise resolving to Pokemon data.
 */
async function fetchPokemonData(index) {
    let pokemonUrl = pokemons[index].url;
    let pokemonResp = await fetch(pokemonUrl);
    return await pokemonResp.json();
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} string - Input string.
 * @returns {string} - String with the first letter capitalized.
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Fetches JSON data from a given URL.
 * @param {string} url - URL to fetch JSON data from.
 * @returns {Promise<Object|null>} - Promise resolving to JSON data or null if fetch fails.
 */
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

/**
 * Loads the next version of a Pokemon and renders its evolution chain.
 */
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

/**
 * Hides the navigation arrows.
 */
function hideArrows() {
    document.getElementById("rightArrow").classList.add("d-none");
    document.getElementById("leftArrow").classList.add("d-none");
}

/**
 * Fetches evolution chain data for a Pokemon species.
 * @param {string} speciesUrl - URL for the Pokemon species data.
 * @returns {Promise<Object>} - Promise resolving to evolution chain data.
 */
async function fetchEvolutionChain(speciesUrl) {
    const nextGenerPokemonUrl = await fetchJsonData(speciesUrl);
    const evolutionChainUrl = nextGenerPokemonUrl.evolution_chain.url;
    return await fetchJsonData(evolutionChainUrl);
}

/**
 * Gets the primary type of a Pokemon.
 * @param {Object} pokemonData - Data object containing Pokemon type information.
 * @returns {string} - Pokemon type name.
 */
function getPokemonType(pokemonData) {
    return pokemonData.types[0].type.name + "1";
}

/**
 * Generates HTML for displaying the evolution chain of a Pokemon.
 * @param {Object} evolutionChain - Data object containing evolution chain information.
 * @returns {Promise<string>} - Promise resolving to HTML string.
 */
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

/**
 * Builds a list of Pokemon in the evolution chain.
 * @param {Object} evolutionChain - Data object containing evolution chain information.
 * @returns {Array<Object>} - Array of Pokemon objects in the evolution chain.
 */
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

/**
 * Retrieves details of a Pokemon.
 * @param {Object} currentPokemon - Data object representing the current Pokemon.
 * @returns {Promise<Object>} - Promise resolving to Pokemon details.
 */
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

/**
 * Gets additional HTML IDs and classes based on the evolution count.
 * @param {number} evolutionCount - Current count in the evolution chain.
 * @returns {Object} - Object containing additional ID and class names.
 */
function getEvolutionCssIds(evolutionCount) {
    return {
        additionalId: evolutionCount === 2 ? ' id="moreSpace"' : '',
        pokemonHeaderNameInfoCard: evolutionCount === 2 ? ' id="pokemonHeaderNameInfoCard"' : ''
    };
}

/**
 * Creates HTML for displaying a Pokemon in the evolution chain.
 * @param {string} pokemonName - Name of the Pokemon.
 * @param {string} pokemonImg - URL for the Pokemon image.
 * @param {string} additionalId - Additional ID attribute for HTML element.
 * @param {string} pokemonHeaderNameInfoCard - Additional class for HTML element.
 * @param {Object} currentPokemon - Data object representing the current Pokemon.
 * @returns {string} - HTML string for displaying the Pokemon.
 */
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

/**
 * Renders the evolution chain HTML on the popup card and adjusts image sizes if necessary.
 * @param {string} evolutionHTML - HTML string representing the evolution chain.
 * @param {string} pokemonType - Type of the Pokemon.
 */
function renderEvolutionChain(evolutionHTML, pokemonType) {
    renderEvolutionCard(evolutionHTML, pokemonType);
    adjustImageSizes();
}

/**
 * Renders the evolution chain card HTML on the popup card.
 * @param {string} evolutionHTML - HTML string representing the evolution chain.
 * @param {string} pokemonType - Type of the Pokemon.
 */
function renderEvolutionCard(evolutionHTML, pokemonType) {
    let popUpCard = document.getElementById("popupCard");
    popUpCard.innerHTML = `
        <div id="evolutionChainCard" class="popUp">
            <div class="${pokemonType} background-info-div">
                <h3 id="popupCardTitle">Evolution Chain</h3>
                ${evolutionHTML}
            </div>
        </div>`;
}

/**
 * Adjusts the size of evolution images based on the number of elements in the evolution chain.
 */
function adjustImageSizes() {
    let elementsCount = document.getElementsByClassName('first-pokemon-generation-div').length;
    if (elementsCount < 3) {
        let evolutionImages = document.getElementsByClassName('evolution-img');
        for (let i = 0; i < evolutionImages.length; i++) {
            evolutionImages[i].style.height = '170px';
            evolutionImages[i].style.width = '170px';
        }
    }
}

/**
 * Hides the tooltip element.
 */
function hideTooltip() {
    document.getElementById("tooltip").style.opacity = "0";
}

/**
 * Resets the popup card and enables the navigation arrows.
 */
function disableEvolutionChainCard() {
    showArrows();
    hideEvolutionChainCard();
    resetPopupCard();
}

/**
 * Shows the navigation arrows.
 */
function showArrows() {
    document.getElementById("leftArrow").classList.remove("d-none");
    document.getElementById("rightArrow").classList.remove("d-none");
}

/**
 * Hides the evolution chain card.
 */
function hideEvolutionChainCard() {
    document.getElementById("evolutionChainCard").classList.add("d-none");
}

/**
 * Resets the popup card content to default.
 */
function resetPopupCard() {
    document.getElementById("popupCard").innerHTML = `
        <img class="popUp-arrow" onclick="nextPokemonVersion(event)" data-tooltip="see pokemon version" src="src/img/next.png" alt="arrow">
    `;
}

/**
 * Helper function to fetch JSON data from a given URL.
 * @param {string} url - The URL from which to fetch JSON data.
 * @returns {Promise<Object>} - A Promise resolving to the parsed JSON data.
 * @throws {Error} - Throws an error if the network response is not ok.
 */
async function fetchJsonData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
}

/**
 * Helper function to fetch JSON data from a given URL.
 * @param {string} url - The URL from which to fetch JSON data.
 * @returns {Promise<Object>} - A Promise resolving to the parsed JSON data.
 * @throws {Error} - Throws an error if the network response is not ok.
 */
async function fetchJsonData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
}