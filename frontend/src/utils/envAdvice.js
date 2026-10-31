// UV / humidity / temperature -> skin-care tips (EN + TA). Pure function, easy to test.
export const uvLevel = (uv) => {
  if (uv >= 11) return 'extreme';
  if (uv >= 8) return 'veryhigh';
  if (uv >= 6) return 'high';
  if (uv >= 3) return 'moderate';
  return 'low';
};

export const UV_LABEL = {
  low: { en: 'Low', ta: 'குறைவு', color: '#16a34a' },
  moderate: { en: 'Moderate', ta: 'மிதமானது', color: '#ca8a04' },
  high: { en: 'High', ta: 'அதிகம்', color: '#ea580c' },
  veryhigh: { en: 'Very high', ta: 'மிக அதிகம்', color: '#dc2626' },
  extreme: { en: 'Extreme', ta: 'அபாயகரமான அளவு', color: '#7c3aed' }
};

const UV_TIP = {
  low: {
    en: 'UV is low. Sunscreen is optional for short outings.',
    ta: 'UV குறைவாக உள்ளது. சிறிது நேர வெளிப்புற பயணத்திற்கு சன்ஸ்கிரீன் விருப்பத்திற்குரியது.'
  },
  moderate: {
    en: 'Use SPF 30+ sunscreen if you will be outside for long.',
    ta: 'நீண்ட நேரம் வெளியே இருந்தால் SPF 30+ சன்ஸ்கிரீன் பயன்படுத்துங்கள்.'
  },
  high: {
    en: 'Use SPF 30+ sunscreen and a hat, and avoid strong midday sun (11am to 4pm).',
    ta: 'SPF 30+ சன்ஸ்கிரீன் பயன்படுத்தி தொப்பி அணியுங்கள்; மதியம் 11 முதல் 4 மணி வரை கடும் வெயிலைத் தவிருங்கள்.'
  },
  veryhigh: {
    en: 'Use SPF 50+ sunscreen, reapply every 2 hours, and stay in shade from 10am to 4pm.',
    ta: 'SPF 50+ சன்ஸ்கிரீன் பயன்படுத்தி 2 மணி நேரத்திற்கு ஒருமுறை மீண்டும் தடவுங்கள்; காலை 10 முதல் மாலை 4 மணி வரை நிழலில் இருங்கள்.'
  },
  extreme: {
    en: 'Extreme UV. Use SPF 50+, cover up, reapply every 2 hours, and avoid going out in the middle of the day if you can.',
    ta: 'UV மிக ஆபத்தான அளவில் உள்ளது. SPF 50+ பயன்படுத்தி உடலை மூடிக்கொள்ளுங்கள்; 2 மணி நேரத்திற்கு ஒருமுறை மீண்டும் தடவுங்கள்; முடிந்தால் நடுப்பகலில் வெளியே செல்வதைத் தவிருங்கள்.'
  }
};

export function buildAdvice({ uv, humidity, temp, condition = '' }) {
  const level = uvLevel(uv ?? 0);
  const tips = [UV_TIP[level]];

  if (humidity != null && humidity < 30) {
    tips.push({
      en: 'The air is dry. Apply a fragrance-free moisturiser right after bathing.',
      ta: 'காற்று வறண்டுள்ளது. குளித்த உடன் வாசனையற்ற மாய்ஸ்சரைசர் தடவுங்கள்.'
    });
  }
  if (humidity != null && temp != null && humidity > 70 && temp >= 28) {
    tips.push({
      en: 'Hot and humid. Sweat can worsen fungal infections and heat rash, so keep skin folds dry and change damp clothes quickly.',
      ta: 'வெப்பமும் ஈரப்பதமும் அதிகம். வியர்வை பூஞ்சை தொற்று மற்றும் வெப்பத் தடிப்பை அதிகரிக்கலாம்; தோல் மடிப்புகளை உலர வைத்து ஈரமான உடைகளை உடனே மாற்றுங்கள்.'
    });
  } else if (temp != null && temp >= 33) {
    tips.push({
      en: 'It is very hot. Drink plenty of water and rinse sweat off gently, since sweat can aggravate acne.',
      ta: 'வெப்பம் அதிகம். நிறைய தண்ணீர் குடியுங்கள்; வியர்வை முகப்பருவை அதிகரிக்கலாம், எனவே மெதுவாகக் கழுவுங்கள்.'
    });
  }

  const c = String(condition).toLowerCase();
  if (/pigment|melasma|dark spot/.test(c)) {
    tips.push({
      en: 'For your result: sun exposure darkens marks, so daily sunscreen is the most important step.',
      ta: 'உங்கள் முடிவுக்கு: வெயில் கருமையான தழும்புகளை அதிகரிக்கும்; தினசரி சன்ஸ்கிரீன் மிக முக்கியம்.'
    });
  }
  if (/acne|folliculitis/.test(c)) {
    tips.push({
      en: 'For your result: choose an oil-free (non-comedogenic) sunscreen.',
      ta: 'உங்கள் முடிவுக்கு: எண்ணெய் இல்லாத (non-comedogenic) சன்ஸ்கிரீனைத் தேர்ந்தெடுங்கள்.'
    });
  }
  if (/eczema|dermatitis/.test(c)) {
    tips.push({
      en: 'For your result: use a fragrance-free moisturiser and avoid very hot showers.',
      ta: 'உங்கள் முடிவுக்கு: வாசனையற்ற மாய்ஸ்சரைசரைப் பயன்படுத்தி, மிகச் சூடான நீரில் குளிப்பதைத் தவிருங்கள்.'
    });
  }
  if (/tinea|ringworm|fung|athlete/.test(c)) {
    tips.push({
      en: 'For your result: keep the area dry and change damp clothes quickly.',
      ta: 'உங்கள் முடிவுக்கு: பாதிக்கப்பட்ட பகுதியை உலர்வாக வைத்து, ஈரமான உடைகளை உடனே மாற்றுங்கள்.'
    });
  }
  return { level, tips };
}
