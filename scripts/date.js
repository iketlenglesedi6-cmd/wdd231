const yearSpan = document.querySelector("#currentyear");
const modifiedParagraph = document.querySelector("#lastModified");

if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}

if (modifiedParagraph) {
  modifiedParagraph.textContent = `Last Modified: ${document.lastModified}`;
}


