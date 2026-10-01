"use strict";
const produktliste = document.querySelector("#produktliste");
const status = document.querySelector("#status");
const proevIgen = document.querySelector("#proev-igen");
const filtre = document.querySelector("#filtre");
const sortering = document.querySelector("#sortering");
const kategori = new URLSearchParams(window.location.search).get("category");

// Gem originaldata og det aktuelle udsnit, som både filter og sortering bruger.
let alleProdukter = [];
let udsnit = [];
let valgtGender = "Alle";
let valgtSort = "";
let valgtRetning = "asc";
if (kategori) document.querySelector("#overskrift").textContent = kategori;

document.querySelectorAll("#filtre button").forEach((knap) => {
  knap.addEventListener("click", filtrerProdukter);
});
document.querySelectorAll("#sortering button").forEach((knap) => {
  knap.addEventListener("click", sorterProdukter);
});
proevIgen.addEventListener("click", hentProdukter);
hentProdukter();

function hentProdukter() {
  status.textContent = "Henter produkter…";
  proevIgen.hidden = true;
  filtre.disabled = true;
  sortering.disabled = true;
  produktliste.innerHTML = "";
  // De senere filter-slides udvider listen fra 10 til fx 30 produkter.
  const parametre = new URLSearchParams({ limit: "30" });
  if (kategori) parametre.set("category", kategori);
  fetch(`https://kea-alt-del.dk/t7/api/products?${parametre}`)
    .then((response) => {
      if (!response.ok) throw new Error("Produkter kunne ikke hentes");
      return response.json();
    })
    .then((data) => {
      alleProdukter = data;
      filtre.disabled = false;
      sortering.disabled = false;
      opdaterUdsnit();
    })
    .catch(() => {
      status.textContent = "Produkterne kunne ikke hentes. Prøv igen.";
      proevIgen.hidden = false;
    });
}

function filtrerProdukter(event) {
  valgtGender = event.currentTarget.dataset.gender;
  document.querySelectorAll("#filtre button").forEach((knap) => {
    knap.setAttribute("aria-pressed", String(knap === event.currentTarget));
  });
  opdaterUdsnit();
}

function sorterProdukter(event) {
  valgtSort = event.currentTarget.dataset.sort;
  valgtRetning = event.currentTarget.dataset.direction;
  document.querySelectorAll("#sortering button").forEach((knap) => {
    knap.setAttribute("aria-pressed", String(knap === event.currentTarget));
  });
  opdaterUdsnit();
}

function opdaterUdsnit() {
  if (valgtGender === "Alle") {
    udsnit = [...alleProdukter];
  } else {
    udsnit = alleProdukter.filter((produkt) => produkt.gender === valgtGender);
  }
  // Sorter en kopi, så rækkefølgen i de oprindelige data bevares.
  if (valgtSort === "price") {
    if (valgtRetning === "asc") {
      udsnit = [...udsnit].sort((a, b) => a.price - b.price);
    } else {
      udsnit = [...udsnit].sort((a, b) => b.price - a.price);
    }
  } else if (valgtSort === "name") {
    if (valgtRetning === "asc") {
      udsnit = [...udsnit].sort((a, b) => a.productdisplayname.localeCompare(b.productdisplayname, "da"));
    } else {
      udsnit = [...udsnit].sort((a, b) => b.productdisplayname.localeCompare(a.productdisplayname, "da"));
    }
  }
  visProdukter();
}

function visProdukter() {
  let markup = "";
  udsnit.forEach((produkt) => {
    const parametre = new URLSearchParams({ id: produkt.id });
    if (kategori) parametre.set("category", kategori);
    markup += `
      <article class="produkt ${produkt.soldout ? "soldOut" : ""}">
        <a href="produktdetaljer.html?${tekst(parametre.toString())}">
          <img src="https://kea-alt-del.dk/t7/images/webp/640/${encodeURIComponent(produkt.id)}.webp" alt="${tekst(produkt.productdisplayname)}" loading="lazy">
          <h2>${tekst(produkt.productdisplayname)}</h2>
          <p>${tekst(produkt.brandname)}</p>
          ${produkt.soldout ? '<p class="udsolgt">Udsolgt</p>' : ""}
          ${prisMarkup(produkt)}
        </a>
      </article>`;
  });
  // Saml HTML i en streng og indsæt den én gang efter loopet, som i slidesene.
  produktliste.innerHTML = markup;
  status.textContent = udsnit.length ? `${udsnit.length} produkter vist.` : "Ingen produkter matcher dit filter.";
}
