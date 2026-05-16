export type Lang = "en" | "ur";

/** UI strings — mirror product tone from legacy app */
export const STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_services: "Services",
    nav_diseases: "Diseases",
    nav_guide: "Field guide",
    nav_analyze: "Analyze",
    lang_toggle: "اردو",

    footer_tagline: "Corn leaf screening · EfficientNet-B0 · Grad-CAM · DistilBART",
    footer_rights: "© 2026 KhetiBari · Research prototype — verify in the field with an agronomist.",

    home_eyebrow: "Field-ready diagnostics",
    home_head_a: "Structured screening",
    home_head_b: "for corn leaf disease",
    home_lead:
      "Upload a clear leaf photo. Get calibrated probabilities, an explainability overlay, agronomic advisory, optional spoken guidance — built like a production agritech workflow.",
    home_cta_primary: "Open analyzer",
    home_cta_secondary: "Browse diseases",

    stat_acc: "Reported accuracy",
    stat_cls: "Classes",
    stat_imgs: "Training images",
    stat_time: "Typical inference",

    steps_title: "How it works",
    steps_sub: "Four steps — same pipeline as your research prototype.",
    s1_h: "Capture",
    s1_p: "Single leaf, natural light, minimal blur — fills most of the frame.",
    s2_h: "Screen",
    s2_p: "EfficientNet-B0 softmax outputs per-class probabilities.",
    s3_h: "Explain",
    s3_p: "Grad-CAM highlights regions that influenced the decision.",
    s4_h: "Act",
    s4_p: "Treatment & prevention lists plus optional summary & audio.",

    band_h: "From imagery to actionable advisory.",
    band_p: "Use KhetiBari as a triage layer — not a substitute for extension services.",

    about_title: "About KhetiBari",
    about_eyebrow: "About this website",
    about_subtitle:
      "KhetiBari is a simple web tool for screening corn (maize) leaves from a clear photo — turning what you see in the field into plain-language guidance you can act on or discuss with an expert.",
    about_para_1:
      "Here you can upload a leaf image, see how sure the system is about the finding, and read structured advice: typical symptoms, care suggestions, and prevention. Pages work in English or Urdu so growers, students, and extension teams can share one workflow.",
    about_para_2:
      "The analyzer works with four outcomes that match our disease library: Northern Leaf Blight, Common Rust, Gray Leaf Spot, and healthy tissue. Think of it as an early triage step — what might deserve a closer look — not a replacement for your agronomist, lab tests, or approved crop-protection labels.",
    about_para_3:
      "This site is built to stay transparent: show confidence, show why the model looked at certain leaf regions when possible, and remind you to verify anything serious in real conditions. Use it alongside local scouting and professional advice.",
    about_capabilities_title: "What you'll find here",
    about_cap_1_title: "Leaf analysis",
    about_cap_1_body:
      "Upload a picture, get a suggested condition with a confidence readout, and an on-image explanation so you can sanity-check the result before passing it on.",
    about_cap_2_title: "Disease reference",
    about_cap_2_body:
      "Open the Diseases section for the same categories the analyzer uses — symptoms, management ideas, and prevention — handy for teaching, demos, or field discussions.",
    about_cap_3_title: "English & Urdu",
    about_cap_3_body:
      "Toggle the site and reports between English and Urdu so outreach matches the language your audience is comfortable with.",
    about_trust_title: "Use it responsibly",
    about_trust_body:
      "KhetiBari supports decisions; it does not replace certified agronomic services, product labels, or in-person diagnosis. When stakes are high or the image is unclear, rely on qualified experts and local extension.",
    about_cta_title: "Start on the site",
    about_cta_body:
      "Open the analyzer with a good leaf photo, browse disease reference cards, or read the field guide for photo tips and how to read results.",

    services_title: "What we ship",
    services_s1_h: "Probability diagnostics",
    services_s1_p: "Transparent scores across Northern Leaf Blight, Common Rust, Gray Leaf Spot, and Healthy.",
    services_s2_h: "Explainability overlays",
    services_s2_p: "Grad-CAM overlays communicate model focus to agronomists and reviewers.",
    services_s3_h: "Operational checklist",
    services_s3_p: "Structured symptom · treatment · prevention lists grounded in advisory dictionaries.",
    services_s4_h: "Accessibility layer",
    services_s4_p: "DistilBART executive summaries plus Urdu / English speech synthesis where supported.",

    diseases_title: "Target diseases",
    diseases_sub: "Reference cards synced with backend advisory payloads.",
    diseases_timeout_h: "Still translating — or request timed out",
    diseases_timeout_p:
      "The Diseases page builds Urdu with Marian on the API; first boot can take several minutes on CPU. When your API terminal shows “Urdu disease reference cache ready”, refresh this page. For English-only (faster cards), run the API with KHETIBARI_DISABLE_MT=1.",

    guide_eyebrow: "Practical tips",
    guide_title: "Field guide — better photos, clearer answers",
    guide_lead:
      "KhetiBari is built around maize leaf images. Small changes in how you capture a leaf can make the difference between a helpful hint and an uncertain readout.",
    guide_photo_h: "Taking a photo the model can use",
    guide_photo_li_1:
      "Fill most of the frame with one leaf, upper side facing the camera, in soft daylight. Try to keep harsh shadow off the lesions or yellow halos you care about.",
    guide_photo_li_2:
      "Hold the phone steady — motion blur is the most common reason the app says the image is not confident enough.",
    guide_photo_li_3:
      "If the leaf is torn, mud-covered, or far from the crop you are worried about, the guess may not match your field reality — take another, cleaner shot when you can.",
    guide_scores_h: "What confidence and rejections mean",
    guide_scores_p:
      "You will see a confidence percentage. If the picture is fuzzy or two diseases look equally likely, the tool may refuse a single label. That is deliberate: pushing a random guess would be worse than asking for a sharper photo or a second sample.",
    guide_four_h: "Four outcomes, one reference section",
    guide_four_p:
      "The analyzer maps to Northern Leaf Blight, Common Rust, Gray Leaf Spot, or Healthy — the same four themes as the Diseases page. When you need more detail on symptoms or field hygiene, open those cards next to your result.",
    guide_remember_h: "Field reality",
    guide_remember_p:
      "Hybrid, moisture, temperature, and growth stage all change how symptoms look. Use this site as a first look during scouting, then lean on local extension, resistance traits, and spray programmes when plots are at risk.",

    analyze_title: "Analyzer",
    analyze_sub: "Upload JPG / PNG · English or Urdu advisory surface",
    analyze_drop: "Drag & drop leaf image",
    analyze_pick: "Browse files",
    analyze_run: "Run analysis",
    analyze_busy: "Running model…",
    analyze_uploaded: "Uploaded leaf",
    analyze_heatmap: "Grad-CAM overlay",
    analyze_heatmap_hint: "Warm hues indicate stronger attribution toward the predicted class.",
    analyze_diag: "Diagnosis",
    analyze_probs: "Class probabilities",
    analyze_probs_hint: "Highest soft-max wins — narrow margins trigger rejection guards.",
    analyze_adv: "Field advisory",
    analyze_sym: "Symptoms",
    analyze_tx: "Treatment",
    analyze_prev: "Prevention",
    analyze_summary: "Executive summary",
    analyze_listen: "Listen",
    analyze_listen_hint: "Generate spoken guidance from the report text.",
    analyze_audio_btn: "Generate audio",
    analyze_report: "Full diagnosis report",
    analyze_api_down: "Could not reach the API.",

    err_backend_title: "Backend API is not running",
    err_backend_intro:
      "The website forwards requests to FastAPI at http://127.0.0.1:8000. Your terminal shows connection refused — start the API server, then refresh.",
    err_backend_terminal: "Run in a separate terminal",
    err_backend_cmd:
      "cd backend\r\npython -m venv .venv\r\n.venv\\Scripts\\activate\r\npip install -r requirements.txt\r\nuvicorn main:app --reload --host 127.0.0.1 --port 8000",

    warn_model_title: "Model weights missing or failed to load",
    warn_model_intro:
      "Place new.pth at the project root (or under models/), or use models/best_corn_model.pth. You can also set KHETIBARI_MODEL_PATH to the full path of your .pth file.",

    reject_low_h: "Image not confident enough",
    reject_low_p:
      "The classifier is uncertain — upload a closer maize leaf photo with clearer venation / lesions.",
    reject_amb_h: "Ambiguous framing",
    reject_amb_p:
      "Top classes are too close — usually motion blur, shadows, or non-leaf clutter.",

    healthy_label: "Healthy — no disease detected",
    disease_label: "Condition",

    lang_en_short: "EN",
  },
  ur: {
    nav_home: "ہوم",
    nav_about: "ہمارے بارے میں",
    nav_services: "خدمات",
    nav_diseases: "بیماریاں",
    nav_guide: "میدانی گائیڈ",
    nav_analyze: "تجزیہ",
    lang_toggle: "English",

    footer_tagline: "مکئی کے پتے کی اسکریننگ · EfficientNet-B0 · Grad-CAM · DistilBART",
    footer_rights:
      "© ۲۰۲۶ کھیتی باڑی · تحقیقی نمونہ — حتمی فیصلے کے لیے ماہر زراعت سے تصدیق کریں۔",

    home_eyebrow: "کھیت کے لیے تشخیص",
    home_head_a: "ترتیب وار اسکریننگ",
    home_head_b: "مکئی کے پتے کی بیماریوں کے لیے",
    home_lead:
      "پتے کی واضح تصویر اپلوڈ کریں۔ شرح امکان، وضاحتی اوورلے، زرعی مشورہ، اور اختیاری آوازی رہنمائی — پیشہ ورانہ ورک فلو کی طرح۔",
    home_cta_primary: "تجزیہ کھولیں",
    home_cta_secondary: "بیماریاں دیکھیں",

    stat_acc: "اطلاع شدہ درستگی",
    stat_cls: "اقسام",
    stat_imgs: "تربیتی تصاویر",
    stat_time: "عام طور پر وقت",

    steps_title: "یہ کیسے چلتا ہے",
    steps_sub: "چار مراحل — وہی پائپ لائن جو آپ کے تحقیقی ماڈل میں ہے۔",
    s1_h: "تصویر",
    s1_p: "ایک پتا، قدرتی روشنی، کم دھندلاپن — زیادہ تر فریم پر۔",
    s2_h: "اسکرین",
    s2_p: "EfficientNet-B0 سے ہر زمرے کا امکان۔",
    s3_h: "وضاحت",
    s3_p: "Grad-CAM وہ حصے دکھاتا ہے جو فیصلے پر اثر ڈالتے ہیں۔",
    s4_h: "اقدام",
    s4_p: "علاج اور احتیاط کی فہرستیں، خلاصہ اور آڈیو۔",

    band_h: "تصویر سے عملی مشورے تک۔",
    band_p: "کھیتی باڑی کو پہلا قدم استعمال کریں — توسیعی خدمات کا متبادل نہیں۔",

    about_title: "کھیتی باڑی — یہ ویب سائٹ",
    about_eyebrow: "اس ویب سائٹ کے بارے میں",
    about_subtitle:
      "کھیتی باڑی ایک سادہ ویب ٹول ہے جو مکئی کے پتے کی واضح تصویر سے عام پتی والی بیماریوں کی پہلی جانچ میں مدد کرتا ہے — میدان میں دیکھی بات کو عام فہم مشورے تک لانا، ماہر سے بات کرنے کے لیے۔",
    about_para_1:
      "یہاں آپ پتی کی تصویر اپلوڈ کر سکتے ہیں، نظام کی یقین دہانی دیکھ سکتے ہیں، اور ترتیب وار مشورہ پڑھ سکتے ہیں: علامات، دیکھ بھال کے تجاویز، اور احتیاط۔ صفحات انگریزی اور اردو دونوں میں ہیں تاکہ کاشت کار، طلباء، اور توسیعی ٹیم ایک ہی ورک فلو استعمال کریں۔",
    about_para_2:
      "تجزیہ چار نتائج پر کام کرتا ہے جو ہماری بیماری لائبریری سے ملتے ہیں: Northern Leaf Blight، Common Rust، Gray Leaf Spot، اور صحت مند پتا۔ اسے پہلے قدم کی جانچ سمجھیں — کیا قریب سے دیکھنا چاہیے — نہ کہ ماہر زراعت، لیبارٹری، یا منظور شدہ سپری مستقل مشورے کی جگہ۔",
    about_para_3:
      "یہ سائٹ شفاف رہنے کے لیے بنائی گئی ہے: اعتماد دکھانا، ممکن ہو تو تصویر پر وضاحت، اور کسی بھی سنگین صورت میں میدان میں تصدیق کی یاد دہانی۔ اسے مقامی معائنے اور پیشہ ورانہ رہنمائی کے ساتھ استعمال کریں۔",
    about_capabilities_title: "یہاں آپ کو کیا ملے گا",
    about_cap_1_title: "پتی کا تجزیہ",
    about_cap_1_body:
      "تصویر اپلوڈ کریں، ممکنہ حالت اور یقین کی سطح ملے گی، اور تصویر پر ایک وضاحتی حصہ تاکہ آپ نتیجہ آگے بھیجنے سے پہلے خود جائزہ لے سکیں۔",
    about_cap_2_title: "بیماریوں کا حوالہ",
    about_cap_2_body:
      "بیماریاں سیکشن کھولیں — وہی اقسام جو تجزیہ استعمال کرتا ہے: علامات، انتظام کے نکات، احتیاط؛ تعلیم، ڈیمو، یا کھیت میں گفتگو کے لیے مفید۔",
    about_cap_3_title: "دو زبانیں",
    about_cap_3_body:
      "انگریزی اور اردو میں سائٹ اور رپورٹ بدلیں تاکہ رابطہ اسی زبان میں ہو جس میں آپ کی کمیونٹی آرام محسوس کرے۔",
    about_trust_title: "ذمہ دار استعمال",
    about_trust_body:
      "کھیتی باڑی فیصلوں میں مدد دیتی ہے؛ سرٹیفائیڈ زرعی خدمات، مصنوعات کے لیبل، یا ذاتی تشخیص کی جگہ نہیں لیتی۔ خطرہ زیادہ ہو یا تصویر غیر واضح ہو تو ماہرین اور مقامی توسیع پر بھروسہ کریں۔",
    about_cta_title: "سائٹ سے شروع کریں",
    about_cta_body:
      "اچھی پتی کی تصویر سے تجزیہ کھولیں، بیماری کارڈز دیکھیں، یا تصویر اور نتائج سمجھنے کے لیے میدانی گائیڈ پڑھیں۔",

    services_title: "خدمات",
    services_s1_h: "شرح امکان",
    services_s1_p: "علامات کی شفاف اسکورنگ۔",
    services_s2_h: "اوورلے وضاحت",
    services_s2_p: "ماہر زراعت کے لیے Grad-CAM۔",
    services_s3_h: "آپریشنل چیک لسٹ",
    services_s3_p: "علامات · علاج · احتیاط کی ترتیب۔",
    services_s4_h: "رسائی",
    services_s4_p: "خلاصہ اور اردو / انگریزی آواز جہاں دستیاب ہو۔",

    diseases_title: "بیماریوں کا خلاصہ",
    diseases_sub: "کارڈز بیک اینڈ مشورے سے مطابقت رکھتے ہیں۔",
    diseases_timeout_h: "انتظار — یا وقت ختم",
    diseases_timeout_p:
      "یہ صفحہ API پر Marian سے اردو بناتی ہے؛ پہلی بار CPU پر کئی منٹ لگ سکتے ہیں۔ جب ٹرمینل میں ’Urdu disease reference cache ready‘ آ جائے تو صفحہ ریفریش کریں۔ صرف انگریزی کے لیے API کو KHETIBARI_DISABLE_MT=1 کے ساتھ چلائیں۔",

    guide_eyebrow: "عملی نکات",
    guide_title: "میدانی گائیڈ — بہتر تصویر، واضح جواب",
    guide_lead:
      "کھیتی باڑی مکئی کے پتے کی تصویر پر مرکوز ہے۔ تھوڑی سی احتیاط سے لی گئی تصویر مددگار اشارہ دے سکتی ہے، اور غیر واضح تصویر نتائج کو مبہم چھوڑ دیتی ہے۔",
    guide_photo_h: "ایسی تصویر جو ماڈل استعمال کر سکے",
    guide_photo_li_1:
      "فریم کا زیادہ حصہ ایک پتے پہ رکھیں، اوپر والا رخ کیمرے کی طرف، نرم روشنی میں؛ سایہ علامات یا زرد ہالو پر نہ پڑے۔",
    guide_photo_li_2:
      "موبائل سیدھا تھامیں — حرکت کی وجہ سے دھندلاپن سب سے عام وجہ ہے کہ نظام کم یقین کہے۔",
    guide_photo_li_3:
      "اگر پتا پھٹا، کیچڑ آلود، یا دراصل جس فصل پر فکر ہے اس سے دور ہو، تو اندازہ میدان سے میل نہ کھائے — ممکن ہو تو دوبارہ صاف تصویر لیں۔",
    guide_scores_h: "اعتماد اور ''مسترد'' کا مطلب",
    guide_scores_p:
      "آپ کو شرح اعتماد نظر آئے گی۔ اگر تصویر دھندلی ہو یا دو بیماریاں برابر لگیں تو ایک ہی لیبل دینے سے انکار ہو سکتا ہے — یہ جان بوجھ کر ہے: بے بنیاد اندازہ تھوپنے سے بہتر ہے کہ واضح تصویر یا دوسرا نمونہ مانگا جائے۔",
    guide_four_h: "چار نتائج، ایک حوالہ",
    guide_four_p:
      "تجزیہ Northern Leaf Blight، Common Rust، Gray Leaf Spot، یا صحت مند پتے پر مشکل ہے — بیماریوں والے صفحے کے ساتھ ہی۔ علامات یا احتیاط کی مزید تفصیل کے لیے اُسی وقت کارڈ کھولیں۔",
    guide_remember_h: "میدان کی حقیقت",
    guide_remember_p:
      "ہائبرڈ، نمی، درجہ حرارت، اور نشوونما کا مرحلہ علامات بدل دیتا ہے۔ اسے معائنے میں پہلا قدم سمجھیں؛ خطرے پر مقامی توسیع، مزاحمت، اور منظور شدہ پروگرام پر بھروسہ کریں۔",

    analyze_title: "تجزیہ",
    analyze_sub: "JPG / PNG · اردو یا انگریزی مشورہ",
    analyze_drop: "تصویر یہاں چھوڑیں",
    analyze_pick: "فائل منتخب کریں",
    analyze_run: "تجزیہ چلائیں",
    analyze_busy: "ماڈل چل رہا ہے…",
    analyze_uploaded: "اپلوڈ شدہ پتہ",
    analyze_heatmap: "Grad-CAM اوورلے",
    analyze_heatmap_hint: "گرم رنگ زیادہ اثر والے حصوں کو ظاہر کرتے ہیں۔",
    analyze_diag: "تشخیص",
    analyze_probs: "امکانات",
    analyze_probs_hint: "سب سے زیادہ شرح منتخب — قریب قریب امکان مسترد کر دیتے ہیں۔",
    analyze_adv: "میدانی مشورہ",
    analyze_sym: "علامات",
    analyze_tx: "علاج",
    analyze_prev: "احتیاط",
    analyze_summary: "خلاصہ",
    analyze_listen: "سنیں",
    analyze_listen_hint: "رپورٹ سے آوازی رہنمائی۔",
    analyze_audio_btn: "آڈیو بنائیں",
    analyze_report: "مکمل رپورٹ",
    analyze_api_down: "سرور تک رسائی نہیں ہو سکی۔",

    err_backend_title: "بیک اینڈ API نہیں چل رہا",
    err_backend_intro:
      "ویب سائٹ درخواستیں http://127.0.0.1:8000 پر بھیجتی ہے۔ ٹرمینل میں connection refused ہے — پہلے FastAPI سرور چلائیں، پھر صفحہ ریفریش کریں۔",
    err_backend_terminal: "الگ ٹرمینل میں چلائیں",
    err_backend_cmd:
      "cd backend\r\npython -m venv .venv\r\n.venv\\Scripts\\activate\r\npip install -r requirements.txt\r\nuvicorn main:app --reload --host 127.0.0.1 --port 8000",

    warn_model_title: "ماڈل فائل نہیں ملی یا لوڈ نہیں ہوا",
    warn_model_intro:
      "new.pth کو پروجیکٹ روٹ پر رکھیں (یا models/ میں)، یا models/best_corn_model.pth استعمال کریں؛ یا KHETIBARI_MODEL_PATH سے مکمل راستہ دیں۔",

    reject_low_h: "اس تصویر پر اعتماد کم ہے",
    reject_low_p: "قریب تر، واضح مکئی کا پتہ اپلوڈ کریں۔",
    reject_amb_h: "غیر واضح تصویر",
    reject_amb_p: "اعلیٰ کلاسیں بہت قریب ہیں — عموماً دھندلاپن یا سایہ۔",

    healthy_label: "صحت مند — کوئی بیماری نہیں ملی",
    disease_label: "حالت",

    lang_en_short: "EN",
  },
};
