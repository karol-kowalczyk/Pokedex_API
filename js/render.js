/**
 * Displays Pokemon cards based on fetched data.
 *
 * @param {Object[]} respAsJsonResults - Array of JSON objects representing Pokemon data.
 * @param {Object[]} pokemonDataArray - Array containing additional Pokemon data.
 */
function showPokemonCards(respAsJsonResults, pokemonDataArray) {
    for (let index = 0; index < respAsJsonResults.length; index++) {
        const pokemonId = respAsJsonResults[index].id;
        iterateThroughAllpokemonsIfStatement(pokemonId);
    }
}

/**
 * Iterates through all Pokemon data if specific conditions are met.
 *
 * @param {number} pokemonId - The ID of the Pokemon.
 */
function iterateThroughAllpokemonsIfStatement(pokemonId) {
    if (pokemons.findIndex((pokemon) => pokemon.id === pokemonId) === -1) {
        const pokemonImg =
            pokemonDataArray[index].sprites.other["official-artwork"][
                "front_default"
            ];
        pokemons.push(respAsJsonResults[index]);
        addPokemons(pokemonDataArray[index]);
    }
}

/**
 * Generates HTML for displaying Pokemon types.
 *
 * @param {Object[]} types - Array of type objects.
 * @returns {string} HTML string representing the types.
 */
function generateTypeHTML(types) {
    let typesHTML = "";
    for (let i = 0; i < types.length; i++) {
        let typeName = types[i].type.name;
        let typeImgSrc = typeImg[typeName];
        typesHTML += `<div class="types"><div class="type-name">${typeName}</div> <img class="img-types" src="./src/img/${typeImgSrc}.png"/></div>`;
    }
    return typesHTML;
}

/**
 * Generates HTML for displaying Pokemon abilities.
 *
 * @param {Object[]} abilities - Array of ability objects.
 * @returns {string} HTML string representing the abilities.
 */
function generateAbilityHTML(abilities) {
    if (abilities.length > 0) {
        return `<div class="abilities">${abilities[0].ability.name}</div>`;
    } else {
        return ""; // Return an empty string if no abilities are available
    }
}

/**
 * Adds Pokemon data to the UI.
 *
 * @param {number} index - Index of the Pokemon data.
 * @param {Object} pokemonData - Pokemon data object.
 */
function addPokemons(index, pokemonData) {
    let card = document.getElementById("card-field");
    let pokemonName = capitalizeFirstLetter(pokemons[index].name);
    let pokemonImg = pokemonData.sprites.other["official-artwork"]["front_default"];
    let pokemonTypes = pokemonData.types;
    let pokemonAbilities = pokemonData.abilities;
    let typesHTML = generateTypeHTML(pokemonTypes);
    let abilitiesHTML = generateAbilityHTML(pokemonAbilities);
    let typesDivClass = pokemonTypes.length > 1 ? "pokemon-types-div" : "oneType"; // Choose class based on number of types
    let pokemonCardClass = pokemonTypes[0].type.name + "1";

    checkPokemonsAbilities(pokemonAbilities);
    checkPokemonsAbilitiesLength(pokemonAbilities);
    showCardinHTML(card, pokemonImg, index, pokemonName, pokemonCardClass, typesDivClass, typesHTML, abilitiesHTML);
}

/**
 * Checks and modifies Pokemon abilities for HTML display.
 *
 * @param {Object[]} pokemonAbilities - Array of ability objects.
 */
function checkPokemonsAbilities(pokemonAbilities) {
    if (
        pokemonAbilities.length === 1 &&
        pokemonAbilities[0].ability.name.length > 10
    ) {
        abilitiesHTML = `<div class="one-ability-thiner-margin">${pokemonAbilities[0].ability.name}</div>`;
    } else if (
        pokemonAbilities.length === 1 &&
        pokemonAbilities[0].ability.name.length <= 12
    ) {
        abilitiesHTML = `<div class="abilities one-ability">${pokemonAbilities[0].ability.name}</div>`;
    }
}

/**
 * Checks Pokemon abilities length for special formatting.
 *
 * @param {Object[]} pokemonAbilities - Array of ability objects.
 */
function checkPokemonsAbilitiesLength(pokemonAbilities) {
    if (
        pokemonAbilities.length === 2 &&
        pokemonAbilities[0].ability.name.length +
            pokemonAbilities[1].ability.name.length >
            22
    ) {
        abilitiesHTML = `<div class="abilities">${pokemonAbilities[0].ability.name}</div>`;
    }
}

/**
 * Displays a Pokemon card in HTML.
 *
 * @param {HTMLElement} card - HTML element where the card will be displayed.
 * @param {string} pokemonImg - URL of the Pokemon image.
 * @param {number} index - Index of the Pokemon data.
 * @param {string} pokemonName - Name of the Pokemon.
 * @param {string} pokemonCardClass - CSS class for the Pokemon card.
 * @param {string} typesDivClass - CSS class for types display.
 * @param {string} typesHTML - HTML string representing Pokemon types.
 * @param {string} abilitiesHTML - HTML string representing Pokemon abilities.
 */
function showCardinHTML(card, pokemonImg, index, pokemonName, pokemonCardClass, typesDivClass, typesHTML, abilitiesHTML) {
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
    </div>`;
}

/**
 * Fetches additional Pokemon data asynchronously.
 *
 * @param {number} numPokemons - Number of additional Pokemon to fetch.
 */
async function fetchAdditionalPokemon(numPokemons) {
    let resp = await fetch(`${POKE_API}&offset=${currentOffset}`);
    let respAsJson = await resp.json();
    let respAsJsonResults = respAsJson.results;
    let temporaryPokemonDataArray = [];

    await fetchAdditionalPokemonForLoop(respAsJsonResults, numPokemons, temporaryPokemonDataArray);
    renderPokemonCards(temporaryPokemonDataArray);
}

/**
 * Renders Pokemon cards based on fetched additional Pokemon data.
 *
 * @param {Object[]} pokemonArray - Array of additional Pokemon data.
 */
function renderPokemonCards(pokemonArray) {
    pokemonArray.forEach((pokemonData, index) => {
        addPokemons(
            pokemons.length - pokemonArray.length + index,
            pokemonData
        );
    });
}

/**
 * Fetches additional Pokemon data for a loop of results.
 *
 * @param {Object[]} respAsJsonResults - Array of JSON objects representing Pokemon data.
 * @param {number} numPokemons - Number of additional Pokemon to fetch.
 * @param {Object[]} temporaryPokemonDataArray - Array to store temporary Pokemon data.
 */
async function fetchAdditionalPokemonForLoop(respAsJsonResults, numPokemons, temporaryPokemonDataArray) {
    for (let index = 0; index < numPokemons; index++) {
        if (respAsJsonResults[index]) {
            let pokemonUrl = respAsJsonResults[index].url;
            if (!pokemons.some((pokemon) => pokemon.url === pokemonUrl)) {
                await processPokemonData(respAsJsonResults[index], pokemonUrl, temporaryPokemonDataArray);
                pokemons.push(respAsJsonResults[index]);
            }
        } else {
            break;
        }
    }
}

/**
 * Processes Pokemon data asynchronously.
 *
 * @param {Object} pokemonResult - Result object containing Pokemon data.
 * @param {string} pokemonUrl - URL for fetching Pokemon data.
 * @param {Object[]} temporaryPokemonDataArray - Array to store temporary Pokemon data.
 */
async function processPokemonData(pokemonResult, pokemonUrl, temporaryPokemonDataArray) {
    let pokemonResp = await fetch(pokemonUrl);
    let pokemonData = await pokemonResp.json();
    temporaryPokemonDataArray.push(pokemonData);
}

/**
 * Fetches and displays Pokemon cards based on fetched data.
 *
 * @param {Object[]} respAsJsonResults - Array of JSON objects representing Pokemon data.
 */
async function showPokemonCards(respAsJsonResults) {
    for (let index = 0; index < 20; index++) {
        let pokemonResp = await fetch(respAsJsonResults[index].url);
        let pokemonData = await pokemonResp.json();
        pokemons.push(respAsJsonResults[index]);
        addPokemons(pokemons.length - 1, pokemonData);
    }
}
