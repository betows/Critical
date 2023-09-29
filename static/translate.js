// translate.js
import axios from "axios";
const LIBRE_TRANSLATE_API_URL = "https://libretranslate.com/translate";

export async function translateText(text, targetLang = "pt") {
  try {
    const response = await axios.post(LIBRE_TRANSLATE_API_URL, {
      q: text,
      source: "en",
      target: targetLang
    });
    return response.data.translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return text;  // Return original text if translation fails
  }
}
