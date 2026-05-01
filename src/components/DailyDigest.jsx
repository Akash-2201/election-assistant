import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const PULSE_DATA = {
  English: [
    "Voter turnout surges in West Bengal Phase-II by noon.",
    "Election Commission announces new guidelines for senior citizens.",
    "Major parties rally in the south ahead of the final phase."
  ],
  Hindi: [
    "दोपहर तक पश्चिम बंगाल के दूसरे चरण में मतदान बढ़ा।",
    "चुनाव आयोग ने वरिष्ठ नागरिकों के लिए नए दिशानिर्देशों की घोषणा की।",
    "अंतिम चरण से पहले दक्षिण में प्रमुख दलों की रैली।"
  ],
  Bengali: [
    "দুপুর পর্যন্ত পশ্চিমবঙ্গ দ্বিতীয় দফায় ভোটারদের উপস্থিতি বেড়েছে।",
    "নির্বাচন কমিশন প্রবীণ নাগরিকদের জন্য নতুন নির্দেশিকা ঘোষণা করেছে।",
    "চূড়ান্ত পর্বের আগে দক্ষিণে বড় দলগুলোর সমাবেশ।"
  ],
  Tamil: [
    "மேற்கு வங்காளம் இரண்டாம் கட்ட வாக்குப்பதிவு நண்பகலில் அதிகரிப்பு.",
    "மூத்த குடிமக்களுக்கான புதிய வழிகாட்டுதல்களை தேர்தல் ஆணையம் அறிவித்துள்ளது.",
    "இறுதி கட்டத்திற்கு முன்னதாக தெற்கில் முக்கிய கட்சிகள் பேரணி."
  ],
  Malayalam: [
    "പശ്ചിമ ബംഗാൾ രണ്ടാം ഘട്ട പോളിംഗ് ഉച്ചയോടെ വർദ്ധിച്ചു.",
    "മുതിർന്ന പൗരന്മാർക്കായി തിരഞ്ഞെടുപ്പ് കമ്മീഷൻ പുതിയ മാർഗ്ഗനിർദ്ദേശങ്ങൾ പ്രഖ്യാപിച്ചു.",
    "അവസാന ഘട്ടത്തിന് മുന്നോടിയായി തെക്ക് പ്രധാന പാർട്ടികളുടെ റാലി."
  ]
};

export default function DailyDigest() {
  const { language, t } = useLanguage();
  const headlines = PULSE_DATA[language] || PULSE_DATA['English'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 md:p-8 border border-brand-500/20 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-[50px] rounded-full pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-brand-500/20 p-2 rounded-xl text-brand-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold">{t('pulseTitle')}</h2>
      </div>

      <ul className="space-y-4">
        {headlines.map((headline, idx) => (
          <motion.li 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            <p className="text-slate-300 whitespace-pre-line">{headline}</p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
