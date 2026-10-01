"use strict";
const produkt = document.querySelector("#produktdetaljer");
const status = document.querySelector("#status");
const proevIgen = document.querySelector("#proev-igen");
const parametre = new URLSearchParams(window.location.search);
const id = parametre.get("id");
const kategori = parametre.get("category");
if (kategori) {
  document.querySelector("#tilbage").href = `productlist.html?category=${encodeURIComponent(kategori)}`;
}
proevIgen.addEventListener("click", hentProdukt);
if (id && /^\d+$/.test(id)) {
  hentProdukt();
} else {
  status.textContent = "Vælg et produkt fra produktlisten. Produktets id mangler eller er ugyldigt.";
}

function hentProdukt() {
  status.textContent = "Henter produkt…";
  proevIgen.hidden = true;
  produkt.innerHTML = "";
  fetch(`https://kea-alt-del.dk/t7/api/products/${encodeURIComponent(id)}`)
    .then((response) => {
      if (!response.ok) throw new Error("Produktet kunne ikke hentes");
      return response.json();
    })
    .then((data) => {
      if (!data || !data.id) throw new Error("Produktet findes ikke");
      // Ét objekt fra API'et: detaljesiden bruger ikke forEach.
      produkt.innerHTML = `
        <article class="produkt ${data.soldout ? "soldOut" : ""}">
          <h1>${tekst(data.productdisplayname)}</h1>
          <img src="https://kea-alt-del.dk/t7/images/webp/640/${encodeURIComponent(data.id)}.webp" alt="${tekst(data.productdisplayname)}">
          <p>${tekst(data.brandname)} · ${tekst(data.articletype)}</p>
          <p>Kategori: ${tekst(data.category)}</p>
          <p>Køn: ${tekst(data.gender)}</p>
          ${data.soldout ? '<p class="udsolgt">Udsolgt</p>' : ""}
          ${prisMarkup(data)}
        </article>`;
      document.title = data.productdisplayname;
      status.textContent = "";
    })
    .catch(() => {
      status.textContent = "Produktet kunne ikke hentes. Prøv igen eller vælg et andet produkt.";
      proevIgen.hidden = false;
    });
}
