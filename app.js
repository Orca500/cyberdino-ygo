let cards = [];

async function loadCards() {
    const response = await fetch("cards.json");
    cards = await response.json();

    populateFilters();
    renderCards();
}

function populateFilters() {
    const monsterTypes = new Set();
    const attributes = new Set();

    cards.forEach(card => {
        if (card.race) {
            monsterTypes.add(card.race);
        }

        if (card.attribute) {
            attributes.add(card.attribute);
        }
    });

    const monsterSelect =
        document.getElementById("monsterType");

    [...monsterTypes]
        .sort()
        .forEach(type => {
            const option =
                document.createElement("option");

            option.value = type;
            option.textContent = type;

            monsterSelect.appendChild(option);
        });

    const attributeSelect =
        document.getElementById("attribute");

    [...attributes]
        .sort()
        .forEach(attr => {
            const option =
                document.createElement("option");

            option.value = attr;
            option.textContent = attr;

            attributeSelect.appendChild(option);
        });
}

function renderCards() {

    const grid =
        document.getElementById("cardGrid");

    grid.innerHTML = "";

    let filtered = [...cards];

    const search =
        document.getElementById("search")
        .value
        .toLowerCase();

    if (search) {
        filtered = filtered.filter(card =>
            card.name
                .toLowerCase()
                .includes(search)
        );
    }

    filtered.forEach(card => {

        const div =
            document.createElement("div");

        div.className = "card";

        const img =
            document.createElement("img");

        img.loading = "lazy";
        img.src = card.image;
        img.alt = card.name;

        div.appendChild(img);

        if (card.points > 0) {

            const badge =
                document.createElement("div");

            badge.className = "pointsBadge";
            badge.textContent = card.points;

            div.appendChild(badge);
        }

        div.addEventListener("click", () => {

            document
                .getElementById("lightboxImage")
                .src = card.image;

            document
                .getElementById("lightbox")
                .classList
                .add("active");
        });

        grid.appendChild(div);
    });

    document.getElementById("stats").textContent =
        `${filtered.length} cards shown`;
}

document
    .getElementById("lightbox")
    .addEventListener("click", () => {

        document
            .getElementById("lightbox")
            .classList
            .remove("active");
    });

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        document
            .getElementById("lightbox")
            .classList
            .remove("active");
    }
});

document.addEventListener("input", renderCards);
document.addEventListener("change", renderCards);

loadCards();
