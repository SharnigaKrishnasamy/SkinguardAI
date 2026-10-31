// Curated, brand-free care guidance. Text is { en, ta }.
const g = (en, ta) => ({ en, ta });

export const COMMON_SAFETY = [
  g('Patch test first: put a small amount on your inner forearm and wait 24 hours before using it on the affected skin.',
    'முதலில் பேட்ச் சோதனை: சிறிதளவு உள் முன்கையில் தடவி, பாதிக்கப்பட்ட தோலில் பயன்படுத்தும் முன் 24 மணி நேரம் காத்திருங்கள்.'),
  g('Add one new product at a time, so you can tell what causes a reaction.',
    'ஒரு நேரத்தில் ஒரே ஒரு புதிய பொருளைச் சேர்க்கவும்; எதனால் எதிர்வினை வருகிறது என்று தெரியும்.'),
  g('Stop and see a doctor if you get burning, swelling, blistering, or the rash spreads.',
    'எரிச்சல், வீக்கம், கொப்புளங்கள் ஏற்பட்டாலோ தடிப்பு பரவினாலோ நிறுத்திவிட்டு மருத்துவரைப் பாருங்கள்.'),
  g('These are product types and ingredients, not brand recommendations. A pharmacist can help you choose.',
    'இவை பொருள் வகைகள் மற்றும் மூலப்பொருட்கள் மட்டுமே, பிராண்ட் பரிந்துரைகள் அல்ல. தேர்வு செய்ய மருந்தாளர் உதவலாம்.')
];

export const FOOD_LINK = {
  url: 'https://www.nin.res.in/dietaryguidelines/pdfjs/locale/DGI24thJune2024fin.pdf',
  label: g('ICMR-NIN Dietary Guidelines for Indians (general healthy eating, not a treatment)',
           'இந்தியர்களுக்கான ICMR-NIN உணவு வழிகாட்டுதல்கள் (பொது ஆரோக்கிய உணவு, சிகிச்சை அல்ல)')
};

const GUIDES = {
  acne: {
    title: g('Acne care routine', 'முகப்பரு பராமரிப்பு வழக்கம்'),
    routine: [
      { title: g('Morning', 'காலை'), steps: [
        g('Wash with a gentle, soap-free cleanser.', 'மென்மையான, சோப்பு இல்லாத கிளென்சரால் முகம் கழுவுங்கள்.'),
        g('Apply an oil-free (non-comedogenic) moisturiser.', 'எண்ணெய் இல்லாத (non-comedogenic) மாய்ஸ்சரைசரைத் தடவுங்கள்.'),
        g('Finish with an oil-free broad-spectrum sunscreen, SPF 30 or higher.', 'இறுதியாக எண்ணெய் இல்லாத, SPF 30 அல்லது அதற்கு மேற்பட்ட சன்ஸ்கிரீன் தடவுங்கள்.')
      ]},
      { title: g('Night', 'இரவு'), steps: [
        g('Wash with the same gentle cleanser.', 'அதே மென்மையான கிளென்சரால் கழுவுங்கள்.'),
        g('Apply ONE acne treatment on clean, dry skin. Start with a low strength, every other night.', 'சுத்தமான, உலர்ந்த தோலில் ஒரே ஒரு முகப்பரு சிகிச்சைப் பொருளைத் தடவுங்கள். குறைந்த வீரியத்தில், ஒருநாள் விட்டு ஒருநாள் தொடங்குங்கள்.'),
        g('Follow with a light moisturiser.', 'பிறகு இலகுவான மாய்ஸ்சரைசர் தடவுங்கள்.')
      ]}
    ],
    look: [g('Benzoyl peroxide', 'பென்சாயில் பெராக்சைடு'), g('Salicylic acid', 'சாலிசிலிக் அமிலம்'), g('Azelaic acid', 'அசெலாயிக் அமிலம்'), g('Oil-free / non-comedogenic', 'எண்ணெய் இல்லாதது / non-comedogenic')],
    avoid: [
      g('Picking or squeezing spots (it causes dark marks and scars).', 'பருக்களைக் கிள்ளுவது அல்லது அழுத்துவது (கருமையான தழும்புகள் ஏற்படும்).'),
      g('Harsh scrubs, and washing more than twice a day.', 'கடினமான ஸ்க்ரப்கள், தினம் இருமுறைக்கு மேல் கழுவுதல்.'),
      g('Heavy oils and thick creams on the face.', 'முகத்தில் கனமான எண்ணெய்கள் மற்றும் அடர்த்தியான கிரீம்கள்.')
    ],
    food: g('Some research links high-sugar diets with acne, but the evidence is limited. A balanced diet with vegetables, fruit, whole grains and enough water is a safe choice.',
            'சில ஆய்வுகள் அதிக சர்க்கரை உணவுகளை முகப்பருவுடன் தொடர்புபடுத்துகின்றன, ஆனால் ஆதாரம் குறைவு. காய்கறிகள், பழங்கள், முழு தானியங்கள் மற்றும் போதுமான தண்ணீருடன் சமநிலையான உணவு பாதுகாப்பான தேர்வு.')
  },

  eczema: {
    title: g('Eczema and dry-skin care routine', 'எக்ஸிமா மற்றும் வறண்ட தோல் பராமரிப்பு வழக்கம்'),
    routine: [
      { title: g('Daily', 'தினசரி'), steps: [
        g('Bathe in lukewarm (not hot) water for 10 minutes or less, using a soap-free wash.', 'சோப்பு இல்லாத வாஷ் பயன்படுத்தி, சூடான நீரில் அல்ல, வெதுவெதுப்பான நீரில் 10 நிமிடங்களுக்குள் குளியுங்கள்.'),
        g('Pat dry gently, then apply a fragrance-free emollient (cream or ointment) while the skin is still slightly damp.', 'மெதுவாகத் துடைத்து, தோல் சற்று ஈரமாக இருக்கும்போதே வாசனையற்ற எமோலியண்ட் (கிரீம் அல்லது ஆயின்ட்மென்ட்) தடவுங்கள்.'),
        g('Reapply emollient several times a day, especially on dry patches.', 'நாள் முழுவதும் பலமுறை, குறிப்பாக வறண்ட இடங்களில், மீண்டும் தடவுங்கள்.'),
        g('Keep nails short and wear soft cotton clothing.', 'நகங்களைக் குட்டையாக வைத்து மென்மையான பருத்தி ஆடைகளை அணியுங்கள்.'),
        g('Outdoors, use a fragrance-free sunscreen (SPF 30+) on exposed skin.', 'வெளியே செல்லும்போது திறந்த தோலில் வாசனையற்ற சன்ஸ்கிரீன் (SPF 30+) தடவுங்கள்.')
      ]}
    ],
    look: [g('Ceramides', 'செராமைடுகள்'), g('Glycerin', 'கிளிசரின்'), g('White soft paraffin / petrolatum', 'வெள்ளை மென்மையான பாரஃபின் / பெட்ரோலேட்டம்'), g('Colloidal oatmeal', 'கொலாய்டல் ஓட்மீல்'), g('Fragrance-free', 'வாசனையற்றது')],
    avoid: [
      g('Perfumed soaps, bubble baths and strong detergents.', 'வாசனை சோப்புகள், பபுள் பாத் மற்றும் வலுவான டிடர்ஜென்ட்கள்.'),
      g('Very hot showers and rubbing the skin dry.', 'மிகச் சூடான நீர் குளியல், தோலை அழுத்தித் துடைத்தல்.'),
      g('Scratching (it makes the rash worse).', 'சொறிதல் (தடிப்பை மோசமாக்கும்).')
    ],
    food: g('Food only matters if a doctor has confirmed a food allergy. Do not cut out foods on your own, especially for children, as it can cause nutrient gaps.',
            'மருத்துவர் உணவு ஒவ்வாமையை உறுதிப்படுத்தினால் மட்டுமே உணவு முக்கியம். குறிப்பாக குழந்தைகளுக்கு, நீங்களாகவே உணவுகளை நிறுத்த வேண்டாம்; ஊட்டச்சத்துக் குறைபாடு ஏற்படலாம்.')
  },

  pigment: {
    title: g('Dark marks (pigmentation) care routine', 'கருமையான தழும்புகள் (நிறமி) பராமரிப்பு வழக்கம்'),
    routine: [
      { title: g('Morning', 'காலை'), steps: [
        g('Wash with a gentle cleanser.', 'மென்மையான கிளென்சரால் கழுவுங்கள்.'),
        g('Optional: apply azelaic acid or niacinamide.', 'விருப்பம்: அசெலாயிக் அமிலம் அல்லது நியாசினமைடு தடவுங்கள்.'),
        g('Apply a moisturiser.', 'மாய்ஸ்சரைசர் தடவுங்கள்.'),
        g('Finish with broad-spectrum sunscreen SPF 30+. A tinted one with iron oxides helps with melasma. Reapply every 2 to 3 hours outdoors.', 'இறுதியாக SPF 30+ பரந்த-நிறமாலை சன்ஸ்கிரீன் தடவுங்கள். மெலாஸ்மாவுக்கு அயர்ன் ஆக்சைடு கலந்த நிறமுள்ள சன்ஸ்கிரீன் உதவும். வெளியில் 2 முதல் 3 மணி நேரத்திற்கு ஒருமுறை மீண்டும் தடவுங்கள்.')
      ]},
      { title: g('Night', 'இரவு'), steps: [
        g('Wash, then optionally apply azelaic acid or niacinamide.', 'கழுவிய பின் விருப்பமாக அசெலாயிக் அமிலம் அல்லது நியாசினமைடு தடவுங்கள்.'),
        g('Finish with a moisturiser.', 'இறுதியாக மாய்ஸ்சரைசர் தடவுங்கள்.')
      ]}
    ],
    look: [g('Broad-spectrum SPF 30+', 'SPF 30+ பரந்த-நிறமாலை சன்ஸ்கிரீன்'), g('Iron-oxide tinted sunscreen', 'அயர்ன் ஆக்சைடு நிற சன்ஸ்கிரீன்'), g('Azelaic acid', 'அசெலாயிக் அமிலம்'), g('Niacinamide', 'நியாசினமைடு')],
    avoid: [
      g('Picking or scrubbing the marks.', 'தழும்புகளைக் கிள்ளுவது அல்லது தேய்ப்பது.'),
      g('Unlabelled "fairness" or "whitening" creams, and steroid creams without a prescription.', 'லேபிள் இல்லாத "சிவப்பழகு" அல்லது "வெண்மை" கிரீம்கள், மருந்துச்சீட்டு இல்லாத ஸ்டீராய்டு கிரீம்கள்.'),
      g('Strong lighteners such as hydroquinone unless a dermatologist prescribes them.', 'தோல் மருத்துவர் பரிந்துரைக்காமல் ஹைட்ரோகுயினோன் போன்ற வலுவான நிறம் குறைக்கும் பொருட்கள்.')
    ],
    food: g('No food has been proven to remove dark marks. Daily sun protection matters most. Treat the original problem (such as acne or eczema) so new marks do not form. Marks usually fade over months.',
            'எந்த உணவும் கருமையான தழும்புகளை நீக்கும் என நிரூபிக்கப்படவில்லை. தினசரி வெயில் பாதுகாப்பே மிக முக்கியம். புதிய தழும்புகள் உருவாகாமல் இருக்க முதன்மைப் பிரச்சினையை (முகப்பரு, எக்ஸிமா போன்றவை) குணப்படுத்துங்கள். தழும்புகள் பொதுவாக சில மாதங்களில் மங்கும்.')
  },

  fungal: {
    title: g('Fungal skin infection care routine', 'பூஞ்சை தோல் தொற்று பராமரிப்பு வழக்கம்'),
    routine: [
      { title: g('Daily', 'தினசரி'), steps: [
        g('Wash the area and dry it completely, especially skin folds and between the toes.', 'பாதிக்கப்பட்ட பகுதியைக் கழுவி, குறிப்பாக தோல் மடிப்புகள் மற்றும் கால் விரல்களுக்கு இடையே முழுமையாக உலர்த்துங்கள்.'),
        g('Ask a pharmacist about an antifungal cream and use it for as long as the leaflet says, even after it looks better.', 'மருந்தாளரிடம் பூஞ்சை எதிர்ப்பு கிரீம் பற்றி கேட்டு, சரியாகத் தெரிந்தாலும் துண்டுப்பிரசுரம் சொல்லும் காலம் வரை பயன்படுத்துங்கள்.'),
        g('Wear loose cotton clothes and change damp socks and clothes quickly.', 'தளர்வான பருத்தி ஆடைகளை அணிந்து, ஈரமான சாக்ஸ் மற்றும் உடைகளை உடனே மாற்றுங்கள்.'),
        g('Do not share towels, combs or footwear.', 'துண்டுகள், சீப்புகள், காலணிகளைப் பகிர வேண்டாம்.')
      ]}
    ],
    look: [g('Clotrimazole', 'க்ளோட்ரிமாசோல்'), g('Terbinafine', 'டெர்பினாஃபின்'), g('Miconazole', 'மைக்கோனசோல்')],
    avoid: [
      g('Steroid or "combination" creams without a prescription (they can make fungus worse).', 'மருந்துச்சீட்டு இல்லாத ஸ்டீராய்டு அல்லது "கலவை" கிரீம்கள் (பூஞ்சையை மோசமாக்கலாம்).'),
      g('Scratching and sharing personal items.', 'சொறிதல், தனிப்பட்ட பொருட்களைப் பகிர்தல்.'),
      g('Staying in sweaty clothes.', 'வியர்வை உடைகளிலேயே இருப்பது.')
    ],
    food: g('No special diet is needed. If you have diabetes, keeping blood sugar well controlled helps prevent repeat infections.',
            'சிறப்பு உணவு தேவையில்லை. உங்களுக்கு நீரிழிவு இருந்தால், இரத்த சர்க்கரையை நன்கு கட்டுப்படுத்துவது மீண்டும் தொற்று வராமல் தடுக்க உதவும்.')
  },

  psoriasis: {
    title: g('Psoriasis care routine', 'சொரியாசிஸ் பராமரிப்பு வழக்கம்'),
    routine: [
      { title: g('Daily', 'தினசரி'), steps: [
        g('Bathe briefly in lukewarm water with a gentle, soap-free wash.', 'வெதுவெதுப்பான நீரில் மென்மையான, சோப்பு இல்லாத வாஷுடன் சிறிது நேரம் குளியுங்கள்.'),
        g('Apply a thick, fragrance-free emollient every day, especially right after bathing, to soften scale.', 'செதில்களை மென்மையாக்க, தினமும், குறிப்பாக குளித்த உடன், அடர்த்தியான வாசனையற்ற எமோலியண்ட் தடவுங்கள்.'),
        g('Do not pick or scratch plaques. Skin injury can trigger new patches.', 'தடிப்புகளைக் கிள்ளவோ சொறியவோ வேண்டாம். தோல் காயம் புதிய திட்டுகளை உருவாக்கலாம்.'),
        g('Ask a doctor or pharmacist before using scale-softening products with salicylic acid or tar.', 'சாலிசிலிக் அமிலம் அல்லது தார் உள்ள பொருட்களைப் பயன்படுத்தும் முன் மருத்துவர் அல்லது மருந்தாளரிடம் கேளுங்கள்.')
      ]}
    ],
    look: [g('Thick fragrance-free emollient', 'அடர்த்தியான வாசனையற்ற எமோலியண்ட்'), g('Salicylic acid for scale (doctor or pharmacist guided)', 'செதிலுக்கு சாலிசிலிக் அமிலம் (மருத்துவர்/மருந்தாளர் வழிகாட்டுதலுடன்)')],
    avoid: [
      g('Picking scales.', 'செதில்களைக் கிள்ளுவது.'),
      g('Harsh scrubs and hot water.', 'கடினமான ஸ்க்ரப்கள், சூடான நீர்.'),
      g('Smoking and heavy alcohol, which can worsen psoriasis.', 'புகைப்பிடித்தல் மற்றும் அதிக மது (சொரியாசிஸை மோசமாக்கலாம்).')
    ],
    food: g('A healthy weight and limiting alcohol can help. No special diet has been proven to treat psoriasis.',
            'ஆரோக்கியமான எடையும் மதுவைக் குறைப்பதும் உதவலாம். சொரியாசிஸை குணப்படுத்தும் சிறப்பு உணவு எதுவும் நிரூபிக்கப்படவில்லை.')
  },

  seborrhoeic: {
    title: g('Seborrhoeic dermatitis / dandruff care routine', 'செபொரிக் டெர்மடைடிஸ் / பொடுகு பராமரிப்பு வழக்கம்'),
    routine: [
      { title: g('Daily', 'தினசரி'), steps: [
        g('Use an anti-dandruff shampoo 2 to 3 times a week and leave it on for a few minutes before rinsing.', 'வாரம் 2 முதல் 3 முறை பொடுகு எதிர்ப்பு ஷாம்பூ பயன்படுத்தி, கழுவும் முன் சில நிமிடங்கள் வைத்திருங்கள்.'),
        g('On the face, wash gently and use a light fragrance-free moisturiser.', 'முகத்தில் மெதுவாகக் கழுவி, இலகுவான வாசனையற்ற மாய்ஸ்சரைசர் பயன்படுத்துங்கள்.'),
        g('Avoid scratching the scalp.', 'தலைத்தோலைச் சொறிவதைத் தவிருங்கள்.')
      ]}
    ],
    look: [g('Ketoconazole', 'கீட்டோகோனசோல்'), g('Zinc pyrithione', 'ஜிங்க் பைரிதியோன்'), g('Selenium sulfide', 'செலினியம் சல்பைடு')],
    avoid: [
      g('Heavy hair oils and styling products on flaky skin.', 'செதில் தோலில் கனமான எண்ணெய்கள் மற்றும் ஸ்டைலிங் பொருட்கள்.'),
      g('Harsh scrubbing.', 'கடினமாகத் தேய்ப்பது.'),
      g('Stopping the shampoo as soon as it clears, since it often returns.', 'சரியானவுடன் ஷாம்பூவை நிறுத்துவது (அடிக்கடி மீண்டும் வரும்).')
    ],
    food: g('No special diet is proven to help. Regular sleep and managing stress may reduce flare-ups.',
            'உதவும் சிறப்பு உணவு எதுவும் நிரூபிக்கப்படவில்லை. முறையான தூக்கமும் மன அழுத்த மேலாண்மையும் மீண்டும் வருவதைக் குறைக்கலாம்.')
  },

  rosacea: {
    title: g('Rosacea care routine', 'ரோசேஷியா பராமரிப்பு வழக்கம்'),
    routine: [
      { title: g('Morning', 'காலை'), steps: [
        g('Wash gently with a fragrance-free, soap-free cleanser.', 'வாசனையற்ற, சோப்பு இல்லாத கிளென்சரால் மெதுவாகக் கழுவுங்கள்.'),
        g('Apply a fragrance-free moisturiser.', 'வாசனையற்ற மாய்ஸ்சரைசர் தடவுங்கள்.'),
        g('Apply a mineral sunscreen, SPF 30+ (sun is a common trigger).', 'மினரல் சன்ஸ்கிரீன் SPF 30+ தடவுங்கள் (வெயில் பொதுவான தூண்டுதல்).')
      ]},
      { title: g('Night', 'இரவு'), steps: [
        g('Wash gently, then apply a moisturiser.', 'மெதுவாகக் கழுவி, மாய்ஸ்சரைசர் தடவுங்கள்.')
      ]}
    ],
    look: [g('Mineral sunscreen (zinc oxide / titanium dioxide)', 'மினரல் சன்ஸ்கிரீன் (ஜிங்க் ஆக்சைடு / டைட்டானியம் டை ஆக்சைடு)'), g('Fragrance-free, soap-free products', 'வாசனையற்ற, சோப்பு இல்லாத பொருட்கள்'), g('Azelaic acid (doctor guided)', 'அசெலாயிக் அமிலம் (மருத்துவர் வழிகாட்டுதலுடன்)')],
    avoid: [
      g('Hot drinks, alcohol and spicy food if they trigger flushing.', 'முகம் சிவந்தால், சூடான பானங்கள், மது மற்றும் காரமான உணவு.'),
      g('Hot showers and extreme heat or cold.', 'சூடான நீர் குளியல், அதிக வெப்பம் அல்லது குளிர்.'),
      g('Scrubs, alcohol-based toners and fragranced products.', 'ஸ்க்ரப்கள், ஆல்கஹால் அடிப்படையிலான டோனர்கள், வாசனைப் பொருட்கள்.')
    ],
    food: g('Triggers differ from person to person. Keep a short diary of foods and situations that cause flushing, and avoid only the ones that clearly affect you.',
            'தூண்டுதல்கள் ஒவ்வொருவருக்கும் மாறுபடும். முகம் சிவக்கக் காரணமான உணவுகள், சூழ்நிலைகளை குறித்து வைத்து, உங்களை தெளிவாகப் பாதிப்பவற்றை மட்டும் தவிருங்கள்.')
  },

  general: {
    title: g('General skin-care routine', 'பொது சருமப் பராமரிப்பு வழக்கம்'),
    routine: [
      { title: g('Daily', 'தினசரி'), steps: [
        g('Cleanse gently with a soap-free cleanser.', 'சோப்பு இல்லாத கிளென்சரால் மெதுவாகச் சுத்தம் செய்யுங்கள்.'),
        g('Apply a fragrance-free moisturiser.', 'வாசனையற்ற மாய்ஸ்சரைசர் தடவுங்கள்.'),
        g('Use sunscreen SPF 30+ on exposed skin.', 'திறந்த தோலில் SPF 30+ சன்ஸ்கிரீன் பயன்படுத்துங்கள்.'),
        g('Keep the area clean and dry, and do not scratch or pick.', 'பகுதியை சுத்தமாகவும் உலர்வாகவும் வைத்து, சொறியவோ கிள்ளவோ வேண்டாம்.'),
        g('Take a photo once a week to see whether it is improving.', 'குணமாகிறதா என்று பார்க்க வாரம் ஒருமுறை புகைப்படம் எடுங்கள்.')
      ]}
    ],
    look: [g('Fragrance-free', 'வாசனையற்றது'), g('Soap-free cleanser', 'சோப்பு இல்லாத கிளென்சர்'), g('Broad-spectrum SPF 30+', 'SPF 30+ பரந்த-நிறமாலை')],
    avoid: [
      g('Trying many new products at once.', 'ஒரே நேரத்தில் பல புதிய பொருட்களை முயற்சிப்பது.'),
      g('Steroid creams without a prescription.', 'மருந்துச்சீட்டு இல்லாத ஸ்டீராய்டு கிரீம்கள்.'),
      g('Scratching or picking.', 'சொறிதல் அல்லது கிள்ளுதல்.')
    ],
    food: g('No special diet is needed for most skin problems. A balanced diet with vegetables, fruit, whole grains and enough water supports overall health.',
            'பெரும்பாலான தோல் பிரச்சினைகளுக்கு சிறப்பு உணவு தேவையில்லை. காய்கறிகள், பழங்கள், முழு தானியங்கள் மற்றும் போதுமான தண்ணீருடன் சமநிலையான உணவு ஒட்டுமொத்த ஆரோக்கியத்துக்கு உதவும்.')
  }
};

export const DOCTOR_FIRST = g(
  'This kind of condition usually needs medical treatment, such as antibiotics or prescription medicine. Creams and home routines are not a substitute, so please see a doctor.',
  'இந்த வகை நிலைக்கு பொதுவாக ஆன்டிபயாடிக் அல்லது மருந்துச்சீட்டு மருந்துகள் போன்ற மருத்துவ சிகிச்சை தேவை. கிரீம்கள் மற்றும் வீட்டு வழக்கங்கள் அதற்கு மாற்று அல்ல; தயவுசெய்து மருத்துவரைப் பாருங்கள்.'
);

const DOCTOR_RE = /cellulitis|impetigo|scabies|shingles|zoster|herpes|melanoma|carcinoma|skin cancer|malignan|abscess|boil|lupus|urticaria|hives|angioedema|necrotiz/;

export function getCareGuide(condition = '', urgency = 'low') {
  const c = String(condition).toLowerCase();
  if (String(urgency).toLowerCase() === 'high' || DOCTOR_RE.test(c)) return { key: 'doctor', guide: null };
  const pick = (key) => ({ key, guide: GUIDES[key] });
  if (/pigment|melasma|dark spot|chloasma/.test(c)) return pick('pigment');
  if (/tinea|ringworm|fung|athlete|candid|dermatophyt/.test(c)) return pick('fungal');
  if (/psoria/.test(c)) return pick('psoriasis');
  if (/seborrh|dandruff/.test(c)) return pick('seborrhoeic');
  if (/rosacea/.test(c)) return pick('rosacea');
  if (/eczema|atopic|dermatitis|xerosis|dry skin/.test(c)) return pick('eczema');
  if (/acne|pimple|comedo/.test(c)) return pick('acne');
  return pick('general');
}
