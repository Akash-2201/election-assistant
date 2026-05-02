import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const DICTIONARY = {
  English: {
    heroTitle: "Your Voice.\nYour Power.",
    heroSubtitle: "VoterQuest 2026 - Ultra Edition. Stay informed, verify your documents, and track live turnouts.",
    pulseTitle: "Current Election Pulse",
    turnoutTitle: "Live Turnout",
    translateBtn: "Choose Language"
  },
  Hindi: {
    heroTitle: "आपकी आवाज़।\nआपकी शक्ति।",
    heroSubtitle: "वोटरक्वेस्ट 2026 - अल्ट्रा संस्करण। सूचित रहें, अपने दस्तावेजों को सत्यापित करें, और लाइव मतदान को ट्रैक करें।",
    pulseTitle: "वर्तमान चुनाव पल्स",
    turnoutTitle: "लाइव मतदान",
    translateBtn: "भाषा चुनें"
  },
  Spanish: {
    heroTitle: "Tu Voz.\nTu Poder.",
    heroSubtitle: "VoterQuest 2026 - Edición Ultra. Mantente informado, verifica tus documentos y rastrea la participación en vivo.",
    pulseTitle: "Pulso Electoral Actual",
    turnoutTitle: "Participación en Vivo",
    translateBtn: "Elegir Idioma"
  },
  Portuguese: {
    heroTitle: "Sua Voz.\nSeu Poder.",
    heroSubtitle: "VoterQuest 2026 - Edição Ultra. Mantenha-se informado, verifique seus documentos e acompanhe a participação ao vivo.",
    pulseTitle: "Pulso Eleitoral Atual",
    turnoutTitle: "Participação ao Vivo",
    translateBtn: "Escolher Idioma"
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('English');

  const t = (key) => {
    return DICTIONARY[language]?.[key] || DICTIONARY['English'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: Object.keys(DICTIONARY) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
