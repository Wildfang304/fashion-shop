"use strict";

// Tekst fra API'et skal vises som tekst, også inde i vores HTML-strenge.
function tekst(value) {
  return String(value ?? "").replace(/[&<>"']/g, (tegn) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[tegn]);
}

function prisMarkup(produkt) {
  const pris = Number(produkt.price);
  const rabat = Number(produkt.discount);
  const normalpris = pris.toLocaleString("da-DK", { style: "currency", currency: "DKK" });
  // Ternary operator: vis tilbudspris og procent, ellers kun normalprisen.
  return rabat > 0
    ? `<p class="tilbud">-${rabat}%</p>
       <p><del>${normalpris}</del> <strong>${(pris * (1 - rabat / 100)).toLocaleString("da-DK", { style: "currency", currency: "DKK" })}</strong></p>`
    : `<p>${normalpris}</p>`;
}
