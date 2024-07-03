function reloadSite() {
  location.reload();
}

function stopPropagationFunction(event) {
  event.stopPropagation();
}

function searchPokemon() {
  let searchTerm = document.getElementById("searchPokemons").value.toLowerCase();
  let cards = document.getElementsByClassName("card");
  let cardField = document.getElementById("card-field");
  let loadAllBtn = document.getElementById("loadAllButton");
  let load20Btn = document.getElementById("loadTwentyMoreButton");
  let found = false;

  searchPokemonFilters(searchTerm, cards, loadAllBtn, load20Btn, found, cardField);
}

function searchPokemonFilters(searchTerm, cards, loadAllBtn, load20Btn, found, cardField) {
  loadAllBtn.style.display = "none";
  load20Btn.style.display = "none";

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

function searchPokemonIfElseState(searchTerm, loadAllBtn, load20Btn, found, cardField) {
  updateNoPokemonMessage(found, cardField);
  toggleLoadButtons(searchTerm, loadAllBtn, load20Btn);
}

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

function displayNoPokemonMessage(cardField) {
  let message = document.createElement("div");
  message.className = "no-pokemon";
  message.innerText = "No Pokémon found ...";
  cardField.appendChild(message);
}

function toggleLoadButtons(searchTerm, loadAllBtn, load20Btn) {
  if (searchTerm === "") {
    loadAllBtn.style.display = "block";
    load20Btn.style.display = "block";
  } else {
    loadAllBtn.style.display = "none";
    load20Btn.style.display = "none";
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