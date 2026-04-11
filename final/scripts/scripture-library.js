export function getSourceLabel(source) {
  if (source === "Bible") {
    return "Bible";
  }

  if (source === "D&C") {
    return "Doctrine & Covenants";
  }

  return "Book of Mormon";
}

export async function loadScriptureLibrary() {
  const response = await fetch("data/scriptures.json");

  if (!response.ok) {
    throw new Error(`Failed to load scripture data: ${response.status}`);
  }

  return response.json();
}
