const POKE_API = 'https://pokeapi.co/api/v2/pokemon?limit=500';

async function loadData() {
  let resp = await fetch(POKE_API);
  let respAsJson = await resp.json();
  let respAsJsonResults = respAsJson.results;
  console.log(respAsJsonResults);
  loadCards(respAsJsonResults);
}