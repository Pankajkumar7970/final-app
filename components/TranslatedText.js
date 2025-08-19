// components/TranslatedText.js
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { useLanguage } from "../contexts/LanguageContext";

const TranslatedText = ({ children, style }) => {
  const { translateText, lang } = useLanguage();
  const [translated, setTranslated] = useState(children);

  useEffect(() => {
    let mounted = true;
    if (children) {
      translateText(children).then((res) => {
        if (mounted) setTranslated(res);
      });
    }
    return () => (mounted = false);
  }, [lang, children]);

  return <Text style={style}>{translated}</Text>;
};

export default TranslatedText;
