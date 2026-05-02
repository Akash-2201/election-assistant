import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      sidebar: {
        global_pulse: "Global Pulse",
        live_news: "Live News",
        election_process: "Election Process",
        eligibility_check: "Eligibility Check",
        id_scanner: "ID Scanner",
        rumor_check: "Rumor Check",
        accessibility: "Accessibility"
      },
      header: {
        ai_assistant: "AI Assistant",
        dashboard: "Dashboard",
        satellite: "Satellite Intel"
      },
      roadmap: {
        title: "The Voter Journey",
        subtitle: "Your step-by-step guide to May 2026",
        ask_expert: "Ask AI Expert",
        battle_ready: "You are Battle Ready",
        protocol_incomplete: "Protocol Incomplete",
        readiness_check: "Readiness Check",
        verified: "Official Protocol Verified",
        readiness_desc: "Verify your battlefield status",
        ready_badge: "Democratic mandate authorized for May 2026",
        incomplete_badge: "Complete all checks to verify status",
        stages: {
          reg: { title: "Registration", desc: "The foundation of your democratic right.", details: "Ensure your name is in the Electoral Roll. Use Form 6 for new registrations." },
          res: { title: "Research", desc: "Know your candidates and manifestos.", details: "Dive into the backgrounds and assets of your local candidates." },
          prep: { title: "Preparation", desc: "Get your documents in order.", details: "Download your QR-based Voter Information Slip." },
          poll: { title: "Polling", desc: "Cast your vote at the booth.", details: "Aadhaar and 11 other IDs are valid if EPIC is missing." },
          post: { title: "Post-Poll", desc: "Securing the democratic mandate.", details: "EVMs are sealed and transported to secure Strongrooms." },
          count: { title: "Counting", desc: "The moment of results.", details: "Counting agents supervise the unsealing and counting of EVMs." }
        },
        readiness: {
          registered: "Registered on Electoral Roll?",
          id_ready: "Identity Documents Ready?",
          booth_located: "Polling Booth Located?"
        }
      },
      news: {
        title: "Live News",
        subtitle: "Regional Intelligence",
        satellite_intel: "Satellite Intelligence",
        loading: "Loading Regional Data...",
        syncing: "Syncing with {{country}} Pulse",
        voterquest_insight: "VoterQuest Analysis Insight",
        sentiment_matrix: "Regional Sentiment Matrix",
        broadcasters: "Live Broadcasters"
      },
      scanner: {
        title: "Voter ID Scanner",
        subtitle: "Instant AI Verification",
        scan_btn: "Scan Identity Document",
        processing: "Analyzing Biometric Data...",
        eligible: "Eligible to Vote",
        ineligible: "Ineligible",
        details: {
          name: "Name",
          dob: "DOB",
          address: "Address",
          age: "Calculated Age"
        }
      },
      rumor: {
        title: "Rumor Check",
        subtitle: "Fact-Checking Authority",
        input_placeholder: "Paste rumor text here...",
        check_btn: "Verify Protocol",
        analyzing: "Scanning Global Databases...",
        result_title: "Verification Result"
      },
      eligibility: {
        title: "Eligibility Check",
        subtitle: "Step {{current}} of {{total}}",
        no_country: "Select a country on the map to check eligibility status.",
        yes: "YES, I AM",
        no: "NO",
        success_title: "You are Eligible!",
        success_desc: "Based on 2026 protocols, you meet the primary requirements to vote in {{country}}.",
        ask_ai: "Ask Legal AI Expert",
        reset: "Check Again",
        questions: {
          citizenship: "Are you a citizen of {{country}}?",
          citizenship_desc: "You must be a legal citizen of {{country}} to register for voting under the {{law}}.",
          age: "Are you 18 years of age or older?",
          age_desc: "The minimum voting age in {{country}} is 18 years as of the qualifying date.",
          roll: "Are you registered in the electoral roll?",
          roll_desc: "Your name must appear in the official voter list of your constituency."
        }
      }
    }
  },
  hi: {
    translation: {
      sidebar: {
        global_pulse: "ग्लोबल पल्स",
        live_news: "लाइव न्यूज़",
        election_process: "चुनाव प्रक्रिया",
        eligibility_check: "पात्रता जांच",
        id_scanner: "आईडी स्कैनर",
        rumor_check: "अफवाह जांच",
        accessibility: "सुगमता"
      },
      header: {
        ai_assistant: "एआई सहायक",
        dashboard: "डैशबोर्ड",
        satellite: "सैटेलाइट इंटेलिजेंस"
      },
      roadmap: {
        title: "मतदाता यात्रा",
        subtitle: "मई 2026 के लिए आपका चरण-दर-चरण मार्गदर्शक",
        ask_expert: "एआई विशेषज्ञ से पूछें",
        battle_ready: "आप तैयार हैं",
        protocol_incomplete: "प्रोटोकॉल अधूरा",
        readiness_check: "तैयारी की जांच",
        verified: "आधिकारिक प्रोटोकॉल सत्यापित",
        readiness_desc: "अपनी तैयारी की स्थिति जांचें",
        ready_badge: "मई 2026 के लिए लोकतांत्रिक जनादेश अधिकृत",
        incomplete_badge: "स्थिति सत्यापित करने के लिए सभी जांच पूरी करें",
        stages: {
          reg: { title: "पंजीकरण", desc: "आपके लोकतांत्रिक अधिकार की नींव।", details: "मतदाता सूची में अपना नाम सुनिश्चित करें। नए पंजीकरण के लिए फॉर्म 6 का उपयोग करें।" },
          res: { title: "अनुसंधान", desc: "अपने उम्मीदवारों और घोषणापत्रों को जानें।", details: "अपने स्थानीय उम्मीदवारों की पृष्ठभूमि और संपत्तियों की जांच करें।" },
          prep: { title: "तैयारी", desc: "अपने दस्तावेज़ व्यवस्थित करें।", details: "अपना क्यूआर-आधारित मतदाता सूचना पर्ची डाउनलोड करें।" },
          poll: { title: "मतदान", desc: "बूथ पर अपना वोट डालें।", details: "यदि पहचान पत्र गायब है तो आधार और 11 अन्य आईडी मान्य हैं।" },
          post: { title: "मतदान के बाद", desc: "लोकतांत्रिक जनादेश को सुरक्षित करना।", details: "ईवीएम को सील कर सुरक्षित स्ट्रांगरूम में ले जाया जाता है।" },
          count: { title: "मतगणना", desc: "परिणामों का क्षण।", details: "मतगणना एजेंट ईवीएम को खोलने और गणना की निगरानी करते हैं।" }
        },
        readiness: {
          registered: "मतदाता सूची में पंजीकृत?",
          id_ready: "पहचान दस्तावेज तैयार?",
          booth_located: "मतदान केंद्र का पता चला?"
        }
      },
      news: {
        title: "लाइव न्यूज़",
        subtitle: "क्षेत्रीय खुफिया जानकारी",
        satellite_intel: "सैटेलाइट इंटेलिजेंस",
        loading: "क्षेत्रीय डेटा लोड हो रहा है...",
        syncing: "{{country}} पल्स के साथ सिंक हो रहा है",
        voterquest_insight: "वोटरक्वेस्ट विश्लेषण अंतर्दृष्टि",
        sentiment_matrix: "क्षेत्रीय भावना मैट्रिक्स",
        broadcasters: "लाइव ब्रॉडकास्टर्स"
      },
      scanner: {
        title: "मतदाता आईडी स्कैनर",
        subtitle: "त्वरित एआई सत्यापन",
        scan_btn: "पहचान पत्र स्कैन करें",
        processing: "बायोमेट्रिक डेटा का विश्लेषण...",
        eligible: "मतदान के लिए पात्र",
        ineligible: "अपात्र",
        details: {
          name: "नाम",
          dob: "जन्म तिथि",
          address: "पता",
          age: "अनुमानित आयु"
        }
      },
      rumor: {
        title: "अफवाह जांच",
        subtitle: "तथ्य-जांच प्राधिकरण",
        input_placeholder: "यहां अफवाह का टेक्स्ट पेस्ट करें...",
        check_btn: "प्रोटोकॉल सत्यापित करें",
        analyzing: "वैश्विक डेटाबेस स्कैन किया जा रहा है...",
        result_title: "सत्यापन परिणाम"
      },
      eligibility: {
        title: "पात्रता जांच",
        subtitle: "चरण {{current}} का {{total}}",
        no_country: "पात्रता स्थिति जांचने के लिए मानचित्र पर एक देश चुनें।",
        yes: "हाँ, मैं हूँ",
        no: "नहीं",
        success_title: "आप पात्र हैं!",
        success_desc: "2026 प्रोटोकॉल के आधार पर, आप {{country}} में मतदान करने की प्राथमिक आवश्यकताओं को पूरा करते हैं।",
        ask_ai: "कानूनी एआई विशेषज्ञ से पूछें",
        reset: "फिर से जांचें",
        questions: {
          citizenship: "क्या आप {{country}} के नागरिक हैं?",
          citizenship_desc: "{{law}} के तहत मतदान के लिए पंजीकरण करने के लिए आपको {{country}} का कानूनी नागरिक होना चाहिए।",
          age: "क्या आपकी आयु 18 वर्ष या उससे अधिक है?",
          age_desc: "{{country}} में मतदान की न्यूनतम आयु योग्यता तिथि के अनुसार 18 वर्ष है।",
          roll: "क्या आप मतदाता सूची में पंजीकृत हैं?",
          roll_desc: "आपका नाम आपके निर्वाचन क्षेत्र की आधिकारिक मतदाता सूची में होना चाहिए।"
        }
      }
    }
  },
  pt: {
    translation: {
      sidebar: {
        global_pulse: "Pulso Global",
        live_news: "Notícias ao Vivo",
        election_process: "Processo Eleitoral",
        eligibility_check: "Verificação de Elegibilidade",
        id_scanner: "Scanner de ID",
        rumor_check: "Verificação de Rumores",
        accessibility: "Acessibilidade"
      },
      header: {
        ai_assistant: "Assistente AI",
        dashboard: "Painel de Controle",
        satellite: "Intel Satelital"
      },
      roadmap: {
        title: "A Jornada do Eleitor",
        subtitle: "Seu guia passo a passo para maio de 2026",
        ask_expert: "Perguntar ao Especialista AI",
        battle_ready: "Você está Pronto",
        protocol_incomplete: "Protocolo Incompleto",
        readiness_check: "Verificação de Prontidão",
        verified: "Protocolo Oficial Verificado",
        readiness_desc: "Verifique seu status de preparação",
        ready_badge: "Mandato democrático autorizado para maio de 2026",
        incomplete_badge: "Complete todas as verificações para validar o status",
        stages: {
          reg: { title: "Registro", desc: "A base do seu direito democrático.", details: "Certifique-se de que seu nome está no Rolo Eleitoral. Use o Formulário 6 para novos registros." },
          res: { title: "Pesquisa", desc: "Conheça seus candidatos e manifestos.", details: "Mergulhe nos antecedentes e bens de seus candidatos locais." },
          prep: { title: "Preparação", desc: "Organize seus documentos.", details: "Baixe seu comprovante de informações do eleitor com QR Code." },
          poll: { title: "Votação", desc: "Vote na seção eleitoral.", details: "O CPF e outros 11 IDs são válidos se o Título de Eleitor estiver ausente." },
          post: { title: "Pós-Votação", desc: "Protegendo o mandato democrático.", details: "As urnas eletrônicas são seladas e transportadas para salas seguras." },
          count: { title: "Apuração", desc: "O momento dos resultados.", details: "Agentes de apuração supervisionam a abertura e contagem das urnas." }
        },
        readiness: {
          registered: "Registrado no Rolo Eleitoral?",
          id_ready: "Documentos de Identidade Prontos?",
          booth_located: "Local de Votação Localizado?"
        }
      },
      news: {
        title: "Notícias ao Vivo",
        subtitle: "Inteligência Regional",
        satellite_intel: "Inteligência Satelital",
        loading: "Carregando Dados Regionais...",
        syncing: "Sincronizando com o Pulso de {{country}}",
        voterquest_insight: "Insight de Análise VoterQuest",
        sentiment_matrix: "Matriz de Sentimento Regional",
        broadcasters: "Transmissores ao Vivo"
      },
      scanner: {
        title: "Scanner de ID de Eleitor",
        subtitle: "Verificação AI Instantânea",
        scan_btn: "Escanear Documento de Identidade",
        processing: "Analisando Dados Biométricos...",
        eligible: "Elegível para Votar",
        ineligible: "Inelegível",
        details: {
          name: "Nome",
          dob: "Data de Nascimento",
          address: "Endereço",
          age: "Idade Calculada"
        }
      },
      rumor: {
        title: "Verificação de Rumores",
        subtitle: "Autoridade de Verificação de Fatos",
        input_placeholder: "Cole o texto do rumor aqui...",
        check_btn: "Verificar Protocolo",
        analyzing: "Escaneando Bancos de Dados Globais...",
        result_title: "Resultado da Verificação"
      },
      eligibility: {
        title: "Verificação de Elegibilidade",
        subtitle: "Passo {{current}} de {{total}}",
        no_country: "Selecione um país no mapa para verificar o status de elegibilidade.",
        yes: "SIM, EU SOU",
        no: "NÃO",
        success_title: "Você é Elegível!",
        success_desc: "Com base nos protocolos de 2026, você cumpre os requisitos principais para votar em {{country}}.",
        ask_ai: "Perguntar ao Especialista Jurídico AI",
        reset: "Verificar Novamente",
        questions: {
          citizenship: "Você é cidadão de {{country}}?",
          citizenship_desc: "Você deve ser um cidadão legal de {{country}} para se registrar para votar sob a {{law}}.",
          age: "Você tem 18 anos de idade ou mais?",
          age_desc: "A idade mínima para votar em {{country}} é 18 anos na data de qualificação.",
          roll: "Você está registrado no rastro eleitoral?",
          roll_desc: "Seu nome deve aparecer na lista oficial de eleitores de sua zona eleitoral."
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
