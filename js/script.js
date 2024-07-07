/**
 * Reloads the current page.
 */
function reloadSite() {
  location.reload();
}

/**
 * Stops event propagation.
 * @param {Event} event - The event object.
 */
function stopPropagationFunction(event) {
  event.stopPropagation();
}

/**
 * Searches for Pokémon based on the input value.
 */
function searchPokemon() {
  let cardField = document.getElementById("card-field");
  let loadAllBtn = document.getElementById("loadAllButton");
  let load20Btn = document.getElementById("loadTwentyMoreButton");
  let searchTerm = document.getElementById("searchPokemons").value.toLowerCase();
  let cards = document.getElementsByClassName("card");
  let found = false;
  searchPokemonFilters(searchTerm, cards, loadAllBtn, load20Btn, found, cardField);
}

/**
 * Filters Pokémon cards based on the search term.
 * @param {string} searchTerm - The term to search for.
 * @param {HTMLCollectionOf<Element>} cards - Collection of card elements.
 * @param {HTMLElement} loadAllBtn - Button to load all Pokémon.
 * @param {HTMLElement} load20Btn - Button to load 20 Pokémon.
 * @param {boolean} found - Flag indicating if any Pokémon was found.
 * @param {HTMLElement} cardField - Container for Pokémon cards.
 */
function searchPokemonFilters(searchTerm, cards, loadAllBtn, load20Btn, found, cardField) {
  loadAllBtn.style.display = "none";
  load20Btn.style.display = "none";
  checkAllPokemonsInForLoop(cards, searchTerm, loadAllBtn, load20Btn, found, cardField);
}

/**
 * Iterates through all Pokémon cards to show or hide based on the search term.
 * @param {HTMLCollectionOf<Element>} cards - Collection of card elements.
 * @param {string} searchTerm - The term to search for.
 * @param {HTMLElement} loadAllBtn - Button to load all Pokémon.
 * @param {HTMLElement} load20Btn - Button to load 20 Pokémon.
 * @param {boolean} found - Flag indicating if any Pokémon was found.
 * @param {HTMLElement} cardField - Container for Pokémon cards.
 */
function checkAllPokemonsInForLoop(cards, searchTerm, loadAllBtn, load20Btn, found, cardField) {
  for (let i = 0; i < cards.length; i++) {
    let pokemonName = cards[i].getElementsByClassName("name")[0].innerText.toLowerCase();
    if (pokemonName.startsWith(searchTerm)) {
      cards[i].style.display = "block";
      found = true;
    } else {
      cards[i].style.display = "none";
    }
  }
  searchPokemonIfElseState(searchTerm, loadAllBtn, load20Btn, found, cardField);
}

/**
 * Handles the state after searching Pokémon cards.
 * @param {string} searchTerm - The term to search for.
 * @param {HTMLElement} loadAllBtn - Button to load all Pokémon.
 * @param {HTMLElement} load20Btn - Button to load 20 Pokémon.
 * @param {boolean} found - Flag indicating if any Pokémon was found.
 * @param {HTMLElement} cardField - Container for Pokémon cards.
 */
function searchPokemonIfElseState(searchTerm, loadAllBtn, load20Btn, found, cardField) {
  updateNoPokemonMessage(found, cardField);
  toggleLoadButtons(searchTerm, loadAllBtn, load20Btn);
}

/**
 * Updates the message when no Pokémon is found.
 * @param {boolean} found - Flag indicating if any Pokémon was found.
 * @param {HTMLElement} cardField - Container for Pokémon cards.
 */
function updateNoPokemonMessage(found, cardField) {
  let noPokemonMessage = document.querySelector(".no-pokemon");
  if (!found) {
    if (!noPokemonMessage) {
      displayNoPokemonMessage(cardField);
    }
  } else {
    if (noPokemonMessage) {
      noPokemonMessage.remove();
    }
  }
}

/**
 * Displays a message when no Pokémon is found.
 * @param {HTMLElement} cardField - Container for Pokémon cards.
 */
function displayNoPokemonMessage(cardField) {
  let message = document.createElement("div");
  message.className = "no-pokemon";
  message.innerText = "No Pokémon found ...";
  cardField.appendChild(message);
}

/**
 * Toggles visibility of load buttons based on search term.
 * @param {string} searchTerm - The term to search for.
 * @param {HTMLElement} loadAllBtn - Button to load all Pokémon.
 * @param {HTMLElement} load20Btn - Button to load 20 Pokémon.
 */
function toggleLoadButtons(searchTerm, loadAllBtn, load20Btn) {
  if (searchTerm === "") {
    loadAllBtn.style.display = "block";
    load20Btn.style.display = "block";
  } else {
    loadAllBtn.style.display = "none";
    load20Btn.style.display = "none";
  }
}

/**
 * Handles window resize to show or hide elements.
 */
function handleResize() {
  let pokball = document.getElementById("pokeball");
  if (window.innerWidth <= 1456) {
    pokball.classList.add("d-none");
  } else {
    pokball.classList.remove("d-none");
  }
}

/**
 * Shows the loading indicator.
 */
function showLoading() {
  let loading = document.getElementById("loading");
  loading.style.display = "flex";
}

/**
 * Hides the loading indicator.
 */
function hideLoading() {
  let loading = document.getElementById("loading");
  loading.style.display = "none";
}

/**
 * Hides certain buttons.
 */
function hideButtons() {
  document.getElementById("loadAllButton").classList.add("d-none");
  document.getElementById("loadTwentyMoreButton").classList.add("d-none");
}

/**
 * Retrieves and displays Pokémon text information asynchronously.
 */
async function showPokemonText() {
  const currentPokemonIndexZeroBased = currentPokemonIndex - 1;
  const pokemonData = await fetchPokemonData(currentPokemonIndexZeroBased);
  const pokemonsAbilitieText = pokemonData.forms[0].url;
  const pokemonsAbilitieTextJson = await fetchJsonData(pokemonsAbilitieText);
  const pokemonsAbilitieTextJsonName = await fetchJsonData(pokemonsAbilitieTextJson.pokemon.url);
  const pokeAbilitie = await fetchJsonData(pokemonsAbilitieTextJsonName.abilities[0].ability.url);
  const pokemonType = getPokemonType(pokemonData);
  const backImg = getBackgroundImage(pokemonsAbilitieTextJsonName);
  let pokeAbilitieTxt = getPokemonAbilityText(pokeAbilitie);
  const fullText = pokeAbilitieTxt;
  const { truncatedText, seeMoreButton } = generateTruncatedTextAndButton(fullText);
  // Call the render function instead of directly setting innerHTML
  renderPopupCard(truncatedText, fullText, seeMoreButton, pokemonType, backImg);
}

/**
 * Generates truncated text and see more button if necessary.
 * @param {string} fullText - The full text to potentially truncate.
 * @returns {Object} Object containing truncated text and see more button HTML.
 */
function generateTruncatedTextAndButton(fullText) {
  let truncatedText = fullText;
  let seeMoreButton = "";

  if (shouldTruncateText(fullText)) {
    truncatedText = truncateText(fullText);
    seeMoreButton = `<button id="seeMoreButton" onclick="showFullText()">see more...</button>`;
  }

  return { truncatedText, seeMoreButton };
}

/**
 * Retrieves Pokémon ability text.
 * @param {Object} pokeAbilitie - Pokémon ability object.
 * @returns {string} The text of the Pokémon's ability.
 */
function getPokemonAbilityText(pokeAbilitie) {
  let pokeAbilitieTxt = pokeAbilitie.effect_entries[0].effect;

  if (detectLanguage(pokeAbilitieTxt) === "German") {
    pokeAbilitieTxt = pokeAbilitie.effect_entries[1].effect;
  }

  return pokeAbilitieTxt;
}

/**
 * Checks if text should be truncated based on length.
 * @param {string} fullText - The full text to check.
 * @returns {boolean} True if text should be truncated, false otherwise.
 */
function shouldTruncateText(fullText) {
  return fullText.length > 100;
}

/**
 * Truncates text to a specified length.
 * @param {string} fullText - The full text to truncate.
 * @returns {string} Truncated text with "..." at the end.
 */
function truncateText(fullText) {
  return fullText.substring(0, 100) + "...";
}

/**
 * Retrieves Pokémon type.
 * @param {Object} pokemonData - Pokémon data object.
 * @returns {string} The Pokémon's type.
 */
function getPokemonType(pokemonData) {
  return pokemonData.types[0].type.name + "1";
}

/**
 * Retrieves background image for Pokémon.
 * @param {Object} pokemonsAbilitieTextJsonName - Pokémon ability data object.
 * @returns {string} URL of the Pokémon's background image.
 */
function getBackgroundImage(pokemonsAbilitieTextJsonName) {
  return pokemonsAbilitieTextJsonName.sprites.other.dream_world.front_default;
}

/**
 * Detects the language of the text.
 * @param {string} text - The text to analyze.
 * @returns {string} The detected language ("English", "German", or "Unknown").
 */
function detectLanguage(text) {
  let englishCount = 0;
  let germanCount = 0;

  countKeywords(text, englishKeywords, germanKeywords, (countEN, countDE) => {
    englishCount = countEN;
    germanCount = countDE;
  });

  return decideLanguage(englishCount, germanCount);
}

/**
 * Counts occurrences of keywords in text.
 * @param {string} text - The text to count keywords in.
 * @param {string[]} englishKeywords - Keywords related to English.
 * @param {string[]} germanKeywords - Keywords related to German.
 * @param {function} callback - Callback function to handle counts.
 */
function countKeywords(text, englishKeywords, germanKeywords, callback) {
  let englishCount = 0;
  let germanCount = 0;

  const words = text.toLowerCase().split(/\W+/);

  words.forEach((word) => {
    if (englishKeywords.includes(word)) englishCount++;
    if (germanKeywords.includes(word)) germanCount++;
  });

  callback(englishCount, germanCount);
}

/**
 * Decides the language based on keyword counts.
 * @param {number} englishCount - Count of English keywords.
 * @param {number} germanCount - Count of German keywords.
 * @returns {string} The detected language ("English", "German", or "Unknown").
 */
function decideLanguage(englishCount, germanCount) {
  if (englishCount > germanCount) {
    return "English";
  } else if (germanCount > englishCount) {
    return "German";
  } else {
    return "Unknown";
  }
}

/**
 * Renders the popup card with Pokémon information.
 * @param {string} truncatedText - Truncated text to display.
 * @param {string} fullText - Full text to potentially show on "see more".
 * @param {string} seeMoreButton - Button HTML to show full text.
 * @param {string} pokemonType - Pokémon's type.
 * @param {string} backImg - URL of the Pokémon's background image.
 */
function renderPopupCard(truncatedText, fullText, seeMoreButton, pokemonType, backImg) {
  const adjustedFullText = adjustFullText(fullText);

  const popupCardHTML = generatePopupCardHTML(truncatedText, adjustedFullText, seeMoreButton, pokemonType, backImg);

  renderCard(popupCardHTML);
}

/**
 * Generates the HTML for the popup card based on provided data.
 * @param {string} truncatedText - Truncated text to display.
 * @param {string} adjustedFullText - Adjusted full text to display.
 * @param {string} seeMoreButton - Button HTML to show full text.
 * @param {string} pokemonType - Pokémon's type.
 * @param {string} backImg - URL of the Pokémon's background image.
 * @returns {string} Generated HTML for the popup card.
 */
function generatePopupCardHTML(truncatedText, adjustedFullText, seeMoreButton, pokemonType, backImg) {
  return /*html*/ `
    <div id="informationText" class="popUp">
      <div class="${pokemonType} background-info-div" id="backgroundInfoDiv">
        <h3 id="pokeAbilitieTitle">Information</h3>
        <div class="poke-abilitie-txt">
          <span id="truncatedText">${truncatedText}</span>
          <span id="fullText" style="display: none;">${adjustedFullText}</span>
          <div class="see-more-btn-div">${seeMoreButton}</div>
        </div>
        <div class="poke-abilitie-img-div">
          <img id="abilityImage" class="poke-abilitie-img" src="${backImg}">
          <img class="popUp-returnarrow" onclick="hideInfortmationText()" src="src/img/return.png" alt="arrow">
        </div>
      </div>
    </div>`;
}

/**
 * Adjusts the full text based on screen width.
 * @param {string} fullText - Full text to potentially adjust.
 * @returns {string} Adjusted full text.
 */
function adjustFullText(fullText) {
  if (window.innerWidth < 425) {
    return truncateTextToWordCount(fullText, 100);
  }
  return fullText;
}

/**
 * Truncates text to a specified word count.
 * @param {string} text - The text to truncate.
 * @param {number} maxWords - Maximum number of words.
 * @returns {string} Truncated text.
 */
function truncateTextToWordCount(text, maxWords) {
  const words = text.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return text;
}

/**
 * Renders the generated HTML into the popup card element.
 * @param {string} html - HTML content to render.
 */
function renderCard(html) {
  const popUpCard = document.getElementById("popupCard");
  popUpCard.innerHTML = html;
}

/**
 * Truncates text to a specified word count.
 * @param {string} text - The text to truncate.
 * @param {number} maxWords - Maximum number of words.
 * @returns {string} Truncated text.
 */
function truncateTextToWordCount(text, maxWords) {
  const words = text.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return text;
}


/**
 * Hides Pokémon information text.
 */
function hideInfortmationText() {
  let leftArrow = document.getElementById("leftArrow");
  let rightArrow = document.getElementById("rightArrow");
  let popUpCard = document.getElementById("popupCard");

  adjustPopupCardStyle(popUpCard);
  showArrows(leftArrow, rightArrow);
}

/**
 * Adjusts the style of the popup card based on window width.
 * @param {HTMLElement} popUpCard - The popup card element.
 */
function adjustPopupCardStyle(popUpCard) {
  if (window.innerWidth <= 485) {
    popUpCard.style.border = "8px solid #ffcc00";
  } else {
    popUpCard.style.border = "16px solid #ffcc00";
  }
  popUpCard.style.borderRadius = "10px";
}

/**
 * Shows the left and right arrows.
 * @param {HTMLElement} leftArrow - The left arrow element.
 * @param {HTMLElement} rightArrow - The right arrow element.
 */
function showArrows(leftArrow, rightArrow) {
  leftArrow.classList.remove("d-none");
  rightArrow.classList.remove("d-none");
  addPopUpCardIntoHtml(document.getElementById("popupCard"));
}

/**
 * Closes Pokémon details popup.
 */
function closeDetails() {
  currentPokemonIndex = 0;
  let popUp = document.getElementById("popUp");
  let leftArrow = document.getElementById("leftArrow");
  let rightArrow = document.getElementById("rightArrow");
  let shadowBox = document.getElementById("shadowBox");
  let popUpCard = document.getElementById("popupCard");

  addDisplayNone(popUp, leftArrow, rightArrow);
  removeFromClasslist(shadowBox);
  addPopUpCardIntoHtml(popUpCard);
  adjustPopupCardStyle(popUpCard)
}

/**
 * Adds display none to specified elements.
 * @param {HTMLElement} popUp - Popup element.
 * @param {HTMLElement} leftArrow - Left arrow element.
 * @param {HTMLElement} rightArrow - Right arrow element.
 */
function addDisplayNone(popUp, leftArrow, rightArrow) {
  popUp.classList.add("d-none");
  shadowBox.classList.add("d-none");
  leftArrow.classList.add("d-none");
  rightArrow.classList.add("d-none");
}

/**
 * Adds popup card HTML into the DOM.
 * @param {HTMLElement} popUpCard - Popup card element.
 */
function addPopUpCardIntoHtml(popUpCard) {
  popUpCard.innerHTML = /*html*/ `
  <img class="popUp-arrow" onclick="nextPokemonVersion(event)" data-tooltip="see pokemon version" src="src/img/next.png" alt="arrow">`;
}

/**
 * Removes specified class from the shadow box element.
 * @param {HTMLElement} shadowBox - Shadow box element.
 */
function removeFromClasslist(shadowBox) {
  shadowBox.classList.remove("d-block");
  document.body.classList.remove("disable-scrolling");
}