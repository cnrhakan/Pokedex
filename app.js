const pokeNumber = 151;
/* COLORS */
const bgColor = {
  fire: "#FDDFDF",
  grass: "#DEFDE0",
  electric: "#FCF7DE",
  water: "#DEF3FD",
  ground: "#f4e7da",
  rock: "#d5d5d4",
  fairy: "#fceaff",
  poison: "#d6b3ff",
  bug: "#f8d5a3",
  dragon: "#97b3e6",
  psychic: "#eaeda1",
  flying: "#F5F5F5",
  fighting: "#E6E0D4",
  normal: "#F5F5F5",
  ice: "#e0f5ff ",
};

const pokemonTypeURL = "https://pokeapi.co/api/v2/type";

/* GET POKEMON TYPE DATA */
const searchInput = document.querySelector(".search-input");
const typeSelect = document.querySelector(".filterSelect");
async function getAllPokemonTypes() {
  const res = await fetch(pokemonTypeURL);
  const dataType = await res.json();

  const sortedTypes = dataType.results.map((item) => item.name).sort();

  sortedTypes.forEach((type) => {
    const typeOption = document.createElement("option");
    typeOption.textContent = type;
    typeSelect.appendChild(typeOption);
  });
}

getAllPokemonTypes();

for (let id = 1; id <= pokeNumber; id++) {
  getPokemon(id);
}

/* GET POKEMON DATA BY ID */

async function getPokemon(id) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    pokemonDataObject[id] = data;
    getPokemonCard(data);
  } catch (error) {
    console.log("Error:", error);
  }
}
/* CREATE CARDS */
function getPokemonCard(data) {
  const pokeWrapper = document.querySelector(".poke-wrapper");

  const pokeCard = document.createElement("div");
  pokeCard.classList.add("poke-card");

  pokeCard.innerHTML = `
    <div class="poke-card-div-img">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
              data.id
            }.png"alt="${data.forms[0].name}"
            class="poke-card-img"
          />
   </div>

    <div class="poke-card-info">
          <p class="poke-id">#${data.id.toString().padStart(3, "0")}</p>
          <p class="poke-name">
            ${data.forms[0].name}
          </p>
          <p class="poke-type">
            ${data.types[0].type.name}
            </p>

            
    </div>
  `;

  const type = data.types[0].type.name;
  pokeCard.children[0].style.backgroundColor = bgColor[type];

  pokeWrapper.appendChild(pokeCard);
  addHoverEventsToVisibleCards();
}

let getAllCards = () => document.querySelectorAll(".poke-card");
let getVisibleCards = () =>
  document.querySelectorAll(".poke-card:not([style*='display: none'])");

/* CARD HOVER */
const pokemonDataObject = {};

function addHoverEventsToVisibleCards() {
  getVisibleCards().forEach((card) => {
    card.addEventListener("mouseenter", onCardHover);
    card.addEventListener("mouseleave", onCardOut);
  });
}

function onCardHover(event) {
  const card = event.currentTarget;
  const pokeName = card.querySelector(".poke-name");
  const pokeCardInfo = card.querySelector(".poke-card-info");
  const pokeCardID = card.querySelector(".poke-id");

  if (!pokeCardID) {
    console.warn("poke-id not found");
    return;
  }

  pokeCardInfo.setAttribute("data-original", pokeCardInfo.innerHTML);
  const pokeCardIntID = parseInt(pokeCardID.textContent.slice(1));
  const data = pokemonDataObject[pokeCardIntID];

  const abilitiesHTML = data.abilities
    .map((ability) => ability.ability.name)
    .join(", ");

  pokeCardInfo.innerHTML = ` <h2 class="poke-hover-title">${data.forms[0].name}</h2>

  <p class="stat-item">
    <b><span class="material-symbols-outlined">weight</span></b>: ${data.weight}
  </p>
  <h3>Abilities</h3>
    <p>${abilitiesHTML}</p>
  <h3>Stats</h3>
    <div class="stat-item">
      <b><span class="material-icons-outlined">favorite_border</span></b>: ${data.stats[0].base_stat}
      <b> <span class="material-symbols-outlined">swords</span></b>: ${data.stats[1].base_stat}
      <b><span class="material-icons-outlined">shield</span></b>: ${data.stats[2].base_stat}
    </div>

    <div class="stat-item">
      <b><span class="material-symbols-outlined red-icon">swords</span></b>: ${data.stats[3].base_stat}
      <b><span class="material-icons-outlined red-icon">shield</span></b>: ${data.stats[4].base_stat}
      <b><span class="material-symbols-outlined">electric_bolt</span></b>: ${data.stats[5].base_stat}
    </div>

  `;
}
function onCardOut(event) {
  const card = event.currentTarget;
  const pokeCardInfo = card.querySelector(".poke-card-info");
  pokeCardInfo.innerHTML = pokeCardInfo.getAttribute("data-original");
}

/* BACK TO TOP */
const scrollTopBtn = document.querySelector(".top-arrow-btn");

window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY + window.innerHeight;
  const scrollThreshold = document.documentElement.scrollHeight * 0.4;

  if (scrollPosition >= scrollThreshold) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

/* CLEAR SEARCH INPUT */
const xIcon = document.querySelector(".fa-xmark");
searchInput.addEventListener("input", filterCards);
typeSelect.addEventListener("change", filterCards);

function updateXIconState(isActive) {
  xIcon.style.opacity = isActive ? 1 : 0.5;
  xIcon.style.color = isActive ? "red" : "black";
  xIcon.style.cursor = isActive ? "pointer" : "default";
  xIcon.style.pointerEvents = isActive ? "auto" : "none";
}
xIcon.addEventListener("click", () => {
  searchInput.value = "";

  const selectedType = typeSelect.value.trim().toLowerCase();

  if (selectedType === "all" || selectedType === "filter by type") {
    getAllCards().forEach((card) => {
      card.style.display = "flex";
    });
  } else {
    getAllCards().forEach((card) => {
      const cardType = card
        .querySelector(".poke-type")
        .textContent.trim()
        .toLowerCase();
      card.style.display = cardType === selectedType ? "flex" : "none";
    });
  }
  updateXIconState(false);

  addHoverEventsToVisibleCards();
});

/* FILTER CARDS */
function filterCards() {
  let selectedType = typeSelect.value.trim().toLowerCase();
  let searchTerm = searchInput.value.trim().toLowerCase();

  getAllCards().forEach((card) => {
    const cardType = card
      .querySelector(".poke-type")
      .textContent.trim()
      .toLowerCase();
    const pokeName = card
      .querySelector(".poke-name")
      .textContent.trim()
      .toLowerCase();

    const matchesType =
      selectedType === "all" ||
      selectedType === "filter by type" ||
      cardType === selectedType;
    const matchesSearch = searchTerm === "" || pokeName.includes(searchTerm);

    if (matchesType && matchesSearch) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
  updateXIconState(searchTerm.length > 0);
  addHoverEventsToVisibleCards();
}

/* SORT BY ID */
const sortByDescBtn = document.querySelector(".sortIdBtn");
let isDescendingID = true;

sortByDescBtn.addEventListener("click", () => {
  const visibleCards = Array.from(getVisibleCards());

  visibleCards.sort((a, b) => {
    const idA = parseInt(
      a.querySelector(".poke-id").textContent.replace("#", "")
    );
    const idB = parseInt(
      b.querySelector(".poke-id").textContent.replace("#", "")
    );

    return isDescendingID ? idB - idA : idA - idB;
  });

  const pokeWrapper = document.querySelector(".poke-wrapper");
  visibleCards.forEach((card) => pokeWrapper.appendChild(card));

  isDescendingID = !isDescendingID;

  sortByDescBtn.textContent = isDescendingID
    ? "Sort by ID (Desc)"
    : "Sort by ID (Asc)";
  sortByDescBtn.style.backgroundColor = isDescendingID ? "white" : "#d5d5d4";
});
/* SORT BY NAME */
const sortByNameBtn = document.querySelector(".sortNameBtn");
let isDescendingName = true;
sortByNameBtn.addEventListener("click", () => {
  const visibleCards = Array.from(document.querySelectorAll(".poke-card"));
  visibleCards.sort((a, b) => {
    const nameA = a.querySelector(".poke-name").textContent;
    const nameB = b.querySelector(".poke-name").textContent;
    const ascSorting = nameA.localeCompare(nameB);
    const descSorting = nameB.localeCompare(nameA);
    return isDescendingName ? descSorting : ascSorting;
  });
  const pokeWrapper = document.querySelector(".poke-wrapper");
  visibleCards.forEach((card) => pokeWrapper.appendChild(card));

  isDescendingName = !isDescendingName;
  sortByNameBtn.textContent = isDescendingName
    ? "Sort by Name (Desc)"
    : "Sort by Name (Asc)";
  sortByNameBtn.style.backgroundColor = isDescendingName ? "white" : "#d5d5d4";
});
