/*
 * ShopListing AI
 * Current mode: browser-only demo draft.
 *
 * To make this use a real open-weight model, connect a Hugging Face Inference
 * Provider / dedicated endpoint here. Do not put a private API token in a
 * public frontend file. Use a small backend/serverless function to protect it.
 */

const form = document.querySelector("#listing-form");
const generateButton = document.querySelector("#generate");
const emptyState = document.querySelector("#empty-state");
const result = document.querySelector("#result");
const statusText = document.querySelector("#status");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const product = document.querySelector("#product").value.trim();
  const audience = document.querySelector("#audience").value.trim() || "everyday shoppers";
  const features = document.querySelector("#features").value.trim();
  const price = document.querySelector("#price").value.trim();
  const platform = document.querySelector("#platform").value;
  const tone = document.querySelector("#tone").value;

  if (!product) return;

  generateButton.disabled = true;
  generateButton.textContent = "Creating draft…";

  // Demo fallback: this is a template, NOT an AI-generated response.
  const featureList = features
    ? features.split(/,|\n/).map((item) => item.trim()).filter(Boolean)
    : ["thoughtfully designed", "made for everyday use"];

  const title = `${product} | ${featureList.slice(0, 2).join(" • ")}`;
  const priceSentence = price ? ` Available for ${price}.` : "";
  const description = `Meet ${product}, made for ${audience}. ${featureList.join(", ")}. Designed to make a useful addition to your everyday routine or a thoughtful gift.${priceSentence}\n\nShop with confidence and message us if you have any questions about this product.`;
  const tagWords = `${product} ${featureList.join(" ")} ${platform}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
  const tags = [...new Set(tagWords)].slice(0, 8).map((word) => `#${word}`).join("  ");

  document.querySelector("#title-output").textContent = title;
  document.querySelector("#description-output").textContent = description;
  document.querySelector("#tags-output").textContent = tags;
  emptyState.classList.add("hidden");
  result.classList.remove("hidden");
  statusText.textContent = `Demo draft created for ${platform}. Tone preference: ${tone}. This version uses templates, not an AI model.`;
  generateButton.disabled = false;
  generateButton.innerHTML = "<span>✦</span> Generate listing";
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = document.getElementById(button.dataset.copy).textContent;
    await navigator.clipboard.writeText(text);
    button.textContent = "Copied!";
    setTimeout(() => { button.textContent = "Copy"; }, 1200);
  });
});

document.querySelector("#copy-all").addEventListener("click", async () => {
  const fullListing = `TITLE\n${document.querySelector("#title-output").textContent}\n\nDESCRIPTION\n${document.querySelector("#description-output").textContent}\n\nTAGS\n${document.querySelector("#tags-output").textContent}`;
  await navigator.clipboard.writeText(fullListing);
  const button = document.querySelector("#copy-all");
  button.textContent = "Copied to clipboard!";
  setTimeout(() => { button.textContent = "Copy full listing"; }, 1200);
});
