/**
 * getSuggestions(material, color)
 * 
 * Rule-based AI logic for furniture harmony recommendations.
 * Uses strict rules for Material and Color and merges results.
 */
function getSuggestions(material, color) {
  let suggestions = [];

  // Normalize inputs for robust matching
  const mat = material?.toLowerCase().trim();
  const clr = color?.toLowerCase().trim();

  // Material Rules
  if (mat === "wood") {
    suggestions.push("Wooden Chair", "Wooden Table", "Wooden Shelf");
  } else if (mat === "metal") {
    suggestions.push("Metal Rack", "Steel Chair", "Iron Table");
  } else if (mat === "glass") {
    suggestions.push("Glass Table", "Modern Stand");
  }

  // Color Rules
  if (clr === "white") {
    suggestions.push("Minimal Sofa", "Glass Table");
  } else if (clr === "brown") {
    suggestions.push("Classic Wooden Set", "Rustic Chair");
  } else if (clr === "black") {
    suggestions.push("Modern Sofa", "Luxury Table");
  }

  // Combination Logic: Merge results and remove duplicates
  const finalSuggestions = [...new Set(suggestions)];

  return finalSuggestions;
}

module.exports = { getSuggestions };
