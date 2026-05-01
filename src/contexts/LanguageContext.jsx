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
  Bengali: {
    heroTitle: "আপনার ভয়েস।\nআপনার ক্ষমতা।",
    heroSubtitle: "ভোটারকোয়েস্ট 2026 - আল্ট্রা সংস্করণ। অবগত থাকুন, আপনার নথি যাচাই করুন এবং লাইভ ভোটদান ট্র্যাক করুন।",
    pulseTitle: "বর্তমান নির্বাচন পালস",
    turnoutTitle: "লাইভ ভোটদান",
    translateBtn: "ভাষা চয়ন করুন"
  },
  Tamil: {
    heroTitle: "உங்கள் குரல்.\nஉங்கள் சக்தி.",
    heroSubtitle: "வோட்டர்குவெஸ்ட் 2026 - அல்ட்ரா எடிஷன். தகவலறிந்து இருங்கள், ஆவணங்களை சரிபார்க்கவும்.",
    pulseTitle: "தற்போதைய தேர்தல் நாடித்துடிப்பு",
    turnoutTitle: "நேரடி வாக்குப்பதிவு",
    translateBtn: "மொழியைத் தேர்ந்தெடுக்கவும்"
  },
  Malayalam: {
    heroTitle: "നിങ്ങളുടെ ശബ്ദം.\nനിങ്ങളുടെ ശക്തി.",
    heroSubtitle: "വോട്ടർക്വസ്റ്റ് 2026 - അൾട്രാ എഡിഷൻ. വിവരങ്ങൾ അറിയുക, രേഖകൾ പരിശോധിക്കുക.",
    pulseTitle: "നിലവിലെ തിരഞ്ഞെടുപ്പ് പൾസ്",
    turnoutTitle: "തത്സമയ പോളിംഗ്",
    translateBtn: "ഭാഷ തിരഞ്ഞെടുക്കുക"
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
