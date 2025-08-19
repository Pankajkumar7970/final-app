// LanguageContext.js
import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en"); // default language
  const [cache, setCache] = useState({}); // store already translated texts

  const translateText = async (text) => {
    const key = `${lang}-${text}`;
    if (cache[key]) return cache[key];

    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(
          text
        )}`
      );
      const data = await res.json();
      const translated = data[0][0][0];
      setCache((prev) => ({ ...prev, [key]: translated }));
      return translated;
    } catch (error) {
      console.error("Translation error:", error);
      return text; // fallback
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, translateText }}>
      {children}
    </LanguageContext.Provider>
  );
};
