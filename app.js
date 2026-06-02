let cards = [];

async function loadCards() {
    const response = await fetch("cards.json");
    cards = await response.json();

    populateFilters();

    document.getElementById("sort").value = "nameAsc";

    renderCards();
}

function populateFilters() {
    const monsterTypes = new Set();
    const monsterClasses = new Set();
    const attributes = new Set();

    cards.forEach(card => {
        if (card.race) {
            monsterTypes.add(card.race);
        }

        if (card.type) {

    if (card.type.includes("Monster")) {

        const className =
            card.type.replace(" Monster", "");

        monsterClasses.add(className);
    }
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

const monsterClassSelect =
    document.getElementById("monsterClass");

[...monsterClasses]
    .sort()
    .forEach(type => {

        const option =
            document.createElement("option");

        option.value = type;
        option.textContent = type;

        monsterClassSelect.appendChild(option);
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

function applyNumericFilter(cards, field, inputId, opId) {

    const value =
        document.getElementById(inputId).value;

    if (value === "") {
        return cards;
    }

    const number = Number(value);

    const op =
        document.getElementById(opId).value;

    return cards.filter(card => {

        if (card[field] === null ||
            card[field] === undefined) {
            return false;
        }

        switch (op) {
            case "=":
                return card[field] === number;

            case ">=":
                return card[field] >= number;

            case "<=":
                return card[field] <= number;

            default:
                return true;
        }
    });
}


function renderCards() {

    const previousScrollY = window.scrollY;

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

    const searchDesc =
        document.getElementById("searchDesc")
            .value
            .toLowerCase();

    if (searchDesc) {
        filtered = filtered.filter(card =>
            (card.desc || "")
                .toLowerCase()
                .includes(searchDesc)
        );
    }

    const category =
        document.getElementById("cardCategory")
            .value;

    if (category) {

        filtered = filtered.filter(card => {

            if (category === "Monster") {
                return card.type.includes("Monster");
            }

            if (category === "Spell") {
                return card.type.includes("Spell");
            }

            if (category === "Trap") {
                return card.type.includes("Trap");
            }

            return true;
        });
    }

    const monsterType =
        document.getElementById("monsterType")
            .value;

    if (monsterType) {
        filtered = filtered.filter(
            card => card.race === monsterType
        );
    }
    
    const monsterClass =
    document.getElementById("monsterClass")
        .value;

if (monsterClass) {

    filtered = filtered.filter(card => {

        if (!card.type) {
            return false;
        }

        return card.type.includes(monsterClass);
    });
}

    const attribute =
        document.getElementById("attribute")
            .value;

    if (attribute) {
        filtered = filtered.filter(
            card => card.attribute === attribute
        );
    }

    filtered =
        applyNumericFilter(
            filtered,
            "points",
            "pointsFilter",
            "pointsOp"
        );

    filtered =
        applyNumericFilter(
            filtered,
            "level",
            "levelFilter",
            "levelOp"
        );

    filtered =
        applyNumericFilter(
            filtered,
            "atk",
            "atkFilter",
            "atkOp"
        );

    filtered =
        applyNumericFilter(
            filtered,
            "def",
            "defFilter",
            "defOp"
        );

    const sort =
        document.getElementById("sort")
            .value;

    filtered.sort((a, b) => {

        const compareWithNameFallback = (field, direction) => {

            const aMissing = a[field] === null || a[field] === undefined;
            const bMissing = b[field] === null || b[field] === undefined;

            if (aMissing && bMissing) {
                return a.name.localeCompare(b.name);
            }

            if (aMissing) return 1;
            if (bMissing) return -1;

            const diff = direction === "asc"
                ? a[field] - b[field]
                : b[field] - a[field];

            return diff !== 0
                ? diff
                : a.name.localeCompare(b.name);
        };

        switch (sort) {

            case "nameAsc":
                return a.name.localeCompare(b.name);

            case "nameDesc":
                return b.name.localeCompare(a.name);

            case "pointsAsc":
                return compareWithNameFallback("points", "asc");

            case "pointsDesc":
                return compareWithNameFallback("points", "desc");

            case "levelAsc":
                return compareWithNameFallback("level", "asc");

            case "levelDesc":
                return compareWithNameFallback("level", "desc");

            case "atkAsc":
                return compareWithNameFallback("atk", "asc");

            case "atkDesc":
                return compareWithNameFallback("atk", "desc");

            case "defAsc":
                return compareWithNameFallback("def", "asc");

            case "defDesc":
                return compareWithNameFallback("def", "desc");

            default:
                return a.name.localeCompare(b.name);
        }
    });

    
const imageObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const img = entry.target;

        if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
        }

        imageObserver.unobserve(img);
    });
}, {
    rootMargin: "200px"
});

filtered.forEach(card => {

        const div =
            document.createElement("div");

        div.className = "card";

        const img =
            document.createElement("img");

        img.loading = "lazy";
        img.dataset.src = card.image;
        imageObserver.observe(img);
        img.alt = card.name;

        div.appendChild(img);

        if (card.points > 0) {

            const badge =
                document.createElement("div");

            badge.className = "pointsBadge";
            badge.textContent = card.points;

            div.appendChild(badge);
        }

        div.addEventListener("mousedown", () => {

            const lightbox =
                document.getElementById("lightbox");

            const lightboxImage =
                document.getElementById("lightboxImage");

            lightboxImage.removeAttribute("src");

            const preloader = new Image();

            preloader.onload = () => {
                lightboxImage.src = card.image;
                lightbox.classList.add("active");
            };

            preloader.src = card.image;
        });

        grid.appendChild(div);
    });

    document.getElementById("stats").textContent =
        `${filtered.length} cards shown`;

    requestAnimationFrame(() => {
        window.scrollTo(0, previousScrollY);
    });
}

document
    .getElementById("lightbox")
    .addEventListener("click", () => {

        document
            .getElementById("lightbox")
            .classList
            .remove("active");

        document
            .getElementById("lightboxImage")
            .removeAttribute("src");

        document
            .getElementById("lightboxImage")
            .removeAttribute("src");
    });

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        document
            .getElementById("lightbox")
            .classList
            .remove("active");

        document
            .getElementById("lightboxImage")
            .removeAttribute("src");
    }
});

document.querySelectorAll("#filters input, #filters select").forEach(el => {
    el.addEventListener("input", renderCards);
    el.addEventListener("change", renderCards);
});

loadCards();


const lightboxImage = document.getElementById("lightboxImage");

if (lightboxImage) {
    lightboxImage.draggable = false;

    lightboxImage.style.userSelect = "none";
    lightboxImage.style.webkitUserSelect = "none";
    lightboxImage.style.webkitUserDrag = "none";
    lightboxImage.style.webkitTouchCallout = "none";

    lightboxImage.addEventListener("dragstart", e => {
        e.preventDefault();
    });
}

const lightbox = document.getElementById("lightbox");

if (lightbox) {
    lightbox.style.webkitTapHighlightColor = "transparent";
}


const rulesText = document.getElementById("rulesText");

if (rulesText) {
    const lightbox = document.getElementById("lightbox");

    let rulesContent = document.getElementById("rulesContent");

    if (!rulesContent) {
        rulesContent = document.createElement("div");
        rulesContent.id = "rulesContent";
        rulesContent.innerHTML = `
            <p>Build a deck from these cards! Standard Yugioh rules apply (40-60 cards in your main deck, 0-15 cards in extra deck, 0-15 cards in side deck, max. 3 copies of any one card).</p>
            <p>No banlist! Instead, players have a budget of 100 points to spend between their main, extra, and side deck. Use your points on numerous strong cards, or splurge for cards so powerful they were banned for most of Yugioh's history; specialize however you want!</p>
            <p>This format's point system is borrowed directly from Yugioh's official Genesis format. Cyberdino is much lower power than Genesis, targeting a speed/feel similar to Edison format (2010 Yugioh).</p>
            <p>
                The snappiest, snazziest place to build decks and play for free is DuelingBook: 
                <a href="https://www.duelingbook.com/" target="_blank" rel="noopener noreferrer">
    DuelingBook
</a>
            </p>
            <p>
                Contact: 
                <a href="https://discord.gg/u38YxahQRt" target="_blank" rel="noopener noreferrer">
    DiscordServer
</a>
            </p>
        `;
        lightbox.appendChild(rulesContent);
    }

    rulesText.addEventListener("click", (e) => {
        e.stopPropagation();
        lightbox.classList.add("active");
        lightbox.classList.add("rules-mode");
    });
}

document.getElementById("lightbox").addEventListener("click", () => {
    document.getElementById("lightbox").classList.remove("rules-mode");
});
