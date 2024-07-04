/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} str - The input string.
 * @returns {string} The string with the first letter capitalized.
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} string - The input string.
 * @returns {string} The string with the first letter capitalized.
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// English keywords used for filtering
let englishKeywords = ["the", "and", "is", "in", "on"];

// German keywords used for filtering
let germanKeywords = [
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

// Mapping of Pokemon types to their respective image names
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