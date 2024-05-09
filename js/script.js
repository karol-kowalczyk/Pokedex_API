let positions = [];

function reloadSite() {
    location.reload();
}

function loadCards(respAsJsonResults) {
    for (let index = 0; index < 10; index++) {
        let card = document.getElementById("card");
        positions.push(index);

        card.innerHTML += /*html*/ `<p class="number">${positions[index]+1}</p>
        <div class="name">${respAsJsonResults[index].name}</div>
        <img src="" alt="" />
        <div class="attributes"></div>`;
    }
}