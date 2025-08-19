import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { useLanguage } from "../contexts/LanguageContext";

const TranslatedText = ({ children, style }) => {
  const { translateText, lang } = useLanguage();
  const [translated, setTranslated] = useState(children);

  useEffect(() => {
    let mounted = true;

    // If it's not a string, skip translation
    if (typeof children !== "string") {
      setTranslated(children);
      return;
    }

    if (children) {
      translateText(children).then((res) => {
        if (mounted) {
          // 🔑 Remove unwanted commas/whitespace
          const cleanResult = res.replace(/^,|,$/g, "").trim();
          setTranslated(cleanResult);
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [lang, children]);

  return <Text style={style}>{translated}</Text>;
};

export default TranslatedText;