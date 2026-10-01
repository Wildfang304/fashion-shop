"use strict";
const kategorier = document.querySelector("#kategorier");
const status = document.querySelector("#status");
const proevIgen = document.querySelector("#proev-igen");
proevIgen.addEventListener("click", hentKategorier);
hentKategorier();

function hentKategorier() {
  status.textContent = "Henter kategorier…";
  proevIgen.hidden = true;
  kategorier.innerHTML = "";
  fetch("https://kea-alt-del.dk/t7/api/categories")
    .then((response) => {
      if (!response.ok) throw new Error("Kategorier kunne ikke hentes");
      return response.json();
    })
    .then((data) => {
      let markup = "";
      data.forEach((kategori) => {
        // Kategorien sendes videre som URL-parameter til produktlisten.
        markup += `<a href="productlist.html?category=${encodeURIComponent(kategori.category)}">${tekst(kategori.category)}</a>`;
      });
      kategorier.innerHTML = markup;
      status.textContent = data.length ? "" : "Ingen kategorier fundet.";
    })
    .catch(() => {
      status.textContent = "Kategorierne kunne ikke hentes. Prøv igen.";
      proevIgen.hidden = false;
    });
}
