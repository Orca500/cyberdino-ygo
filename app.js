let cards = [];

fetch("cards.json")
  .then(res => res.json())
  .then(data => {
    cards = data;
    render(cards);
  });

function render(list) {
  const container = document.getElementById("cards");
  container.innerHTML = "";

  list.forEach(card => {
    const div = document.createElement("div");
    div.style.margin = "10px";
    div.innerHTML = `
      <img src="${card.image}" width="150" />
      <div>${card.name}</div>
      <div>${card.points} pts</div>
    `;
    container.appendChild(div);
  });
}
