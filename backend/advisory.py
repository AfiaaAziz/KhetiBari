"""Shared disease metadata: English `ADVISORY` plus static Urdu `ADVISORY_UR` when MT is off."""

# Order must match checkpoint `class_names` (see training notebook Module 5).
CLASS_NAMES = ["Blight", "Common_Rust", "Gray_Leaf_Spot", "Healthy", "Non_Leaf"]

IMG_SIZE = 224

DISEASE_COLORS = {
    "Blight": "#e05c2a",
    "Common_Rust": "#c88a00",
    "Gray_Leaf_Spot": "#5a8a6a",
    "Healthy": "#3a7d44",
    "Non_Leaf": "#4a6572",
}

# Urdu display names — used when MT is off and for consistent UI copy
DISPLAY_NAME_UR = {
    "Blight": "جھلساؤ",
    "Common_Rust": "عام زنگ",
    "Gray_Leaf_Spot": "سرمئی پتوں کا داغ",
    "Healthy": "صحت مند",
    "Non_Leaf": "مکئی کا پتہ نہیں / غیر درست تصویر",
}

# English display overrides (default: title-case class key with underscores as spaces)
DISPLAY_NAME_EN = {
    "Non_Leaf": "Not a usable maize leaf photo",
}

ADVISORY = {
    "Blight": {
        "short": "Fungal disease causing brown necrotic spots on leaves.",
        "description": (
            "Blight is caused by Exserohilum turcicum fungus that creates elongated brown spots. "
            "Thrives in warm, humid conditions and spreads rapidly."
        ),
        "symptoms": [
            "Elongated brown/necrotic spots on leaves",
            "Spots may have yellow halos",
            "Leaves dry and die prematurely",
            "Grayish lesions in severe cases",
        ],
        "treatment": [
            "Apply fungicide containing mancozeb or chlorothalonil immediately",
            "Remove and destroy all infected plant debris",
            "Ensure proper plant spacing for air circulation",
            "Repeat treatment every 10-14 days if symptoms persist",
        ],
        "prevention": [
            "Use resistant corn varieties (e.g., H99, H95)",
            "Rotate crops — do not plant corn in same field for 2 years",
            "Avoid overhead irrigation",
            "Monitor fields every 3-4 days during humid weather",
        ],
    },
    "Common_Rust": {
        "short": "Fungal rust producing distinctive orange-brown pustules.",
        "description": (
            "Common Rust is caused by Puccinia sorghi fungus. Produces distinctive brick-red "
            "pustules on both leaf surfaces. Spreads rapidly in cool, humid conditions."
        ),
        "symptoms": [
            "Brown/rust-colored pustules on leaf surfaces",
            "Pustules appear on BOTH upper and lower leaf surfaces",
            "Yellowing of surrounding leaf tissue",
            "Leaves may tear around pustule clusters",
        ],
        "treatment": [
            "Apply fungicide with azoxystrobin or propiconazole",
            "Treat within 48 hours of first detection",
            "Repeat application after 7-10 days if needed",
            "Apply early morning before temperatures rise",
        ],
        "prevention": [
            "Plant resistant hybrids (e.g., Pioneer 33M54)",
            "Monitor fields during cool, humid weather (>70% humidity)",
            "Maintain field hygiene — remove crop debris",
            "Avoid planting in areas with poor air drainage",
        ],
    },
    "Gray_Leaf_Spot": {
        "short": "Fungal disease causing rectangular gray-tan leaf lesions.",
        "description": (
            "Gray Leaf Spot is caused by Cercospora zeae-maydis. Produces distinctive rectangular "
            "gray-tan lesions that run parallel to leaf veins. Major yield-reducing disease."
        ),
        "symptoms": [
            "Gray to tan rectangular lesions on leaves",
            "Lesions run parallel to leaf veins",
            "Lesions limited by leaf veins on sides",
            "Severe infection causes complete leaf blighting",
        ],
        "treatment": [
            "Apply strobilurin or triazole fungicides",
            "Begin treatment at FIRST sign of disease",
            "Consider fungicide rotation to prevent resistance",
            "Treat upper canopy where disease starts",
        ],
        "prevention": [
            "Rotate with non-host crops (soybean, wheat)",
            "Till crop residue to reduce overwintering inoculum",
            "Use resistant varieties when available",
            "Improve air drainage through row orientation",
        ],
    },
    "Healthy": {
        "short": "No disease detected. Your corn plant is healthy!",
        "description": (
            "Your corn plant appears healthy with no visible disease symptoms. Continue your "
            "current agricultural practices and maintain regular monitoring."
        ),
        "symptoms": [
            "No disease symptoms detected",
            "Leaves appear green and vibrant",
            "No unusual spots, lesions or discoloration",
        ],
        "treatment": [
            "No treatment required",
            "Continue standard agricultural practices",
            "Ensure proper fertilization schedule",
        ],
        "prevention": [
            "Continue regular field monitoring (every 5-7 days)",
            "Maintain proper irrigation and drainage",
            "Keep records of weather conditions",
            "Plan crop rotation for next season",
        ],
    },
    "Non_Leaf": {
        "short": "This does not look like a clear maize (corn) leaf photo for screening.",
        "description": (
            "The image was flagged as unlikely to show a usable maize leaf "
            "(e.g. cluttered background, object other than corn leaf, or frame too ambiguous). "
            "Disease probabilities from this crop are unreliable until you capture a clearer maize-leaf shot."
        ),
        "symptoms": [
            "Whole frame not dominated by a single corn leaf blade",
            "Blurry or very small leaf in frame",
            "Non-leaf clutter, soil, stems only, or wrong plant",
            "Extreme glare or silhouette with no lesion detail visible",
        ],
        "treatment": [
            "Retake photo: fill the frame mostly with ONE upper corn leaf surface in soft daylight",
            "Hold phone steady — avoid motion blur before retrying upload",
            "If unsure, scout the same plant again and isolate the leaf tip/mid-blade lesions you care about",
        ],
        "prevention": [
            "Centre one healthy or symptomatic blade in the preview before capture",
            "Avoid harsh shadows covering the lesion and avoid cluttered backgrounds when possible",
        ],
    },
}

# Offline Urdu advisory — used when Marian MT is disabled or unavailable so Urdu mode stays fully Urdu.
ADVISORY_UR = {
    "Blight": {
        "short": "فنجائی بیماری جو پتوں پر بھورے مردہ داغ بناتی ہے۔",
        "description": (
            "جھلساؤ کا سبب ایکسیروہیلم ترکیّوم نامی فنجس ہے جو پتوں پر لمبے بھورے داغ بناتا ہے۔ "
            "گرم و نم ماحول میں پھیلتا ہے اور تیزی سے پھیل سکتا ہے۔"
        ),
        "symptoms": [
            "پتوں پر لمبے بھورے/مردہ داغ",
            "داغوں کے گرد زرد ہالو ممکن",
            "پتے جلد خشک ہو کر مرجھا جاتے ہیں",
            "شدید صورت میں سرمئی نوعیت کے داغ",
        ],
        "treatment": [
            "فوری طور پر مینکوزب یا کلورتھالونائل والا فنجی سائڈ لگائیں",
            "تمام متاثرہ پودوں کے ملبے کو ہٹا کر ضائع کریں",
            "ہوا کی آمد و رفت کے لیے پودوں کے درمیان مناسب فاصلہ رکھیں",
            "اعراض جاری رہیں تو ہر ۱۰–۱۴ دن بعد علاج دہرائیں",
        ],
        "prevention": [
            "مقاوم ذراعی قسمیں استعمال کریں",
            "فصلوں کا چکر لگائیں — ایک ہی کھیت میں دو سال تک مکئی نہ لگائیں",
            "اوپر سے پانی دینے والے آبپاشی سے گریز کریں",
            "نم موسم میں ہر 3–4 دن بعد کھیت چیک کریں",
        ],
    },
    "Common_Rust": {
        "short": "فنجائی زنگ جس سے نمایاں نارنجی بھورے پھوڑے بنتے ہیں۔",
        "description": (
            "عام زنگ کا سبب پیوکینیا سورگی فنجس ہے۔ پتوں کی دونوں سطحوں پر اینٹ کے رنگ جیسے نارنجی "
            "پھوڑے بناتا ہے۔ ٹھنڈے، نم ماحول میں تیزی سے پھیلتا ہے۔"
        ),
        "symptoms": [
            "پتوں کی سطح پر بھورے/زنگ جیسے پھوڑے",
            "پھوڑے عموماً اوپری اور نچلی دونوں سطوح پر",
            "گرد و نواحی پتی سرخ پیلا پن",
            "پھوڑوں کے گرد پتے پھٹ سکتے ہیں",
        ],
        "treatment": [
            "ایزوکسی سٹروبن یا پروپیکونازول والا فنجی سائڈ لگائیں",
            "پہلی علامت کے 48 گھنٹے کے اندر علاج شروع کریں",
            "ضرورت ہو تو 7–10 دن بعد دوبارہ لگائیں",
            "درجہ حرارت بڑھنے سے پہلے صبح کے وقت سپری کریں",
        ],
        "prevention": [
            "مقاوم ہائبرڈ لگائیں",
            "ٹھنڈے نم موسم میں نگرانی کریں (نمی ۷۰٪ سے زائد)۔",
            "کھیت صاف رکھیں — فضلہ ہٹائیں",
            "ہوا کی نکاسی خراب جگہوں پر کاشت سے گریز کریں",
        ],
    },
    "Gray_Leaf_Spot": {
        "short": "فنجائی بیماری جس سے پتوں پر مستطیل سرمئی وسانولا داغ بنتے ہیں۔",
        "description": (
            "سرمئی پتے کے داغ کا سبب سرکوسپورا زی-میڈس ہے۔ رگوں کے متوازی لمبے مستطیل "
            "سرمئی تا بھورے داغ بناتا ہے۔ پیداوار پر اثر ڈالنے والی اہم بیماری ہے۔"
        ),
        "symptoms": [
            "پتوں پر سرمئی سے بھورے مستطیل داغ",
            "داغ رگوں کے ساتھ متوازی چلتے ہیں",
            "داغ بغلی حد پر اکثر رگوں تک محدود",
            "شدید متاثر ہونے پر پورا پتا جھلس سکتا ہے",
        ],
        "treatment": [
            "اسٹروبلورین یا ٹرائیا زول فنجی سائڈ لگائیں",
            "پہلی علامت پر ہی علاج شروع کریں",
            "مزاحمت روکنے کے لیے فنجی سائڈ بدل کر استعمال کریں",
            "جہاں بیماری شروع ہوتی ہے اوپری پودے کا حصہ علاج کریں",
        ],
        "prevention": [
            "غیر میزبان فصلوں (سویابین، گندم وغیرہ) کے ساتھ چکر",
            "بقیہ ملچ پلٹ کر سردی میں جراثیم کم کریں",
            "دستیاب ہوں تو مقاوم اقسام استعمال کریں",
            "قطار کی سمت سے ہوا کی نکاسی بہتر بنائیں",
        ],
    },
    "Healthy": {
        "short": "کوئی بیماری نہیں ملی۔ آپ کی فصل صحت مند ہے۔",
        "description": (
            "آپ کی مکئی کا پودا صحت مند نظر آتا ہے اور کوئی واضح بیماری نظر نہیں آتی۔ "
            "موجودہ زرعی طریق کار جاری رکھیں اور باقاعدگی سے نگرانی کرتے رہیں۔"
        ),
        "symptoms": [
            "کوئی بیماری کی علامت نہیں ملی",
            "پتے سبز اور تروتازہ نظر آتے ہیں",
            "غیر معمولی داغ، زخم یا رنگت کی تبدیلی نہیں",
        ],
        "treatment": [
            "کوئی علاج درکار نہیں",
            "معیاری زرعی طریقے جاری رکھیں",
            "کھاد کا مناسب وقت اور خوراک یقینی بنائیں",
        ],
        "prevention": [
            "کھیت کی باقاعدہ نگرانی کریں (ہر 5–7 دن)",
            "آبپاشی اور نکاسی درست رکھیں",
            "موسم کا ریکارڈ رکھیں",
            "اگلے سیزن کے لیے فصل کا چکر منصوبہ بنائیں",
        ],
    },
    "Non_Leaf": {
        "short": "یہ واضح مکئی کا پتہ نہیں لگتا جس پر اسکریننگ کی جا سکے۔",
        "description": (
            "اس تصویر کو مکئی کے قابل استعمال پتے کے طور پر قبول نہیں کیا گیا۔ "
            "پیچھے بہت رل مل، غیر ضروری اشیاء، یا غیر مکئی کا پودا نظر آ سکتا ہے۔ "
            "واضح مکئی کے پتے کی تصویر کے بغیر بیماری کے امکانات قابل بھروسہ نہیں ہیں۔"
        ),
        "symptoms": [
            "فرم زیادہ تر ایک مکئی کے پتے سے بھرا ہوا نہیں لگتا",
            "پتہ دھندلا ہے یا بہت چھوٹا نظر آتا ہے",
            "پس منظر کی رل مل، مٹی کا ڈھیل، یا دوسرا پودا زیادہ نمایاں ہے",
            "سخت چمک یا سایہ؛ داغ نظر ہی نہیں آرہے",
        ],
        "treatment": [
            "دوبارہ تصویر لیں — ایک بالائی سطح والے مکئی کے پتے کو کم روشنی میں مرکز میں لائیں",
            "موبائل ہلائے بغیر واضح فریم لیں",
            "ضرورت ہو تو ہی وہی پودا چیک کریں جس کے داغ دیکھنا ہیں",
        ],
        "prevention": [
            "اس سے پہلے ایک پتے کو پیش نظارے میں مرکز میں لائیں",
            "جہاں داغ دیکھ رہے ہیں وہاں سخت سایہ یا رل مل والے پس منظر سے گریز کریں",
        ],
    },
}
