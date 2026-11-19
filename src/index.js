function displayTranslation(response) {
  new Typewriter("#translation", {
    strings: [response.data.answer],
    autoStart: true,
    delay: 15,
    cursor: "",
  });
}

function generateTranslation(event) {
  event.preventDefault();

  const instructionsInput = document.querySelector("#user-instructions");
  const sourceLanguage = document.querySelector("#source-language").value;
  const targetLanguage = document.querySelector("#target-language").value;
  const translationElement = document.querySelector("#translation");
  const text = instructionsInput.value.trim();
  const apiKey = window.SHECODES_API_KEY;
  if (!apiKey) {
    translationElement.classList.remove("hidden");
    translationElement.textContent =
      "Translation is not configured. Add your SheCodes API key before using the translator.";
    return;
  }
  const sourceInstruction =
    sourceLanguage === "auto" ?
      "Detect the source language automatically."
    : `The source language is ${sourceLanguage}.`;
  const context =
    "You are an accurate professional translator. Preserve the original meaning, tone, names, and cultural context. Return only the translated text, with no labels or explanations.";
  const prompt = `Translate this text into ${targetLanguage}. ${sourceInstruction}\n\nText: ${text}`;
  const apiUrl = `https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(prompt)}&context=${encodeURIComponent(context)}&key=${apiKey}`;

  translationElement.classList.remove("hidden");
  translationElement.innerHTML =
    '<div class="generating">⌛ Translating…</div>';

  axios
    .get(apiUrl)
    .then(displayTranslation)
    .catch(() => {
      translationElement.textContent =
        "Sorry, the translation could not be completed. Please try again.";
    });
}

function swapLanguages() {
  const sourceLanguage = document.querySelector("#source-language");
  const targetLanguage = document.querySelector("#target-language");

  if (sourceLanguage.value === "auto") {
    sourceLanguage.value = targetLanguage.value;
  } else {
    const previousSource = sourceLanguage.value;
    sourceLanguage.value = targetLanguage.value;
    targetLanguage.value = previousSource;
  }

  const instructionsInput = document.querySelector("#user-instructions");
  const translationElement = document.querySelector("#translation");
  if (!translationElement.classList.contains("hidden")) {
    instructionsInput.value = translationElement.textContent.trim();
  }
}

const translatorForm = document.querySelector("#translator-form");
translatorForm.addEventListener("submit", generateTranslation);
document
  .querySelector("#swap-languages")
  .addEventListener("click", swapLanguages);
