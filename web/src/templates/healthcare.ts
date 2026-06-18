import type { TemplateSample } from './types';

export const healthcareTemplates: TemplateSample[] = [
  {
    id: 'healthcare-en-1',
    industry: 'healthcare',
    language: 'en',
    title: 'Patient discharge summary — Hamad Medical',
    description: 'Discharge summary after an appendectomy. Recommend domain=phi for this sample.',
    text: `HAMAD MEDICAL CORPORATION — DISCHARGE SUMMARY
Patient: Mohammed Saif Al-Subaie
Medical record number (MRN): HMC-998211
Qatar ID: 28665411098
Date of birth: 14 May 1996 (age 30)
Sex: Male
Nationality: Qatari
Address: Villa 14, Street 615, Old Airport, Doha
Mobile: +974 5577 1908
Next of kin: Aisha Al-Subaie (mother) — +974 5577 1909
Insurance: Daman Premium, policy P-DM-77441192, group GP-HMC-00012

Admission date: 12 June 2026, 23:14 AST
Discharge date: 15 June 2026, 11:30 AST
Attending physician: Dr. Khalid Al-Mohannadi, MD (license MD-QA-22189), DEA n/a
Surgeon: Dr. Ahmed Yassin, MBBS (license MD-QA-22091)

Chief complaint: Acute right lower quadrant abdominal pain.
History of present illness: 30-year-old Qatari male presented to the ED with 14 hours of progressive RLQ pain, nausea, fever 38.6°C. WBC 14.2 k/µL, CRP 88 mg/L. CT abdomen confirmed acute appendicitis without perforation.
Procedure: Laparoscopic appendectomy under general anaesthesia, 13 Jun 2026 02:10 AST. Estimated blood loss <50 mL. No intra-op complications.
Post-op course: Pain controlled with paracetamol 1 g q6h + tramadol 50 mg PRN. Mobilised day 1, tolerated diet day 1.

Discharge medications:
 - Amoxicillin/clavulanate 875/125 mg PO BID × 5 days
 - Paracetamol 1 g PO q6h PRN
 - Pantoprazole 40 mg PO daily × 7 days

Follow-up: Surgical outpatient clinic with Dr. Yassin on 22 June 2026 at 10:00.
Return to work / school: 22 June 2026.
Emergency contact: HMC ED on +974 4439 5555 if signs of infection.`,
  },
  {
    id: 'healthcare-en-2',
    industry: 'healthcare',
    language: 'en',
    title: 'Telemedicine consultation note',
    description: 'Telemedicine note from a private clinic visit via video call.',
    text: `TELEMEDICINE NOTE — DOHA CLINIC GROUP — VIDEO CONSULTATION
Date: 17 June 2026, 16:20 AST
Provider: Dr. Layla Hassan, MBChB (medical license MD-QA-31188), DEA n/a
Patient: Olivia Marie Walsh
Date of birth: 8 February 1990 (age 36)
Nationality: Irish
Passport: P3398211
Qatar resident permit: 39214500871
Email: olivia.walsh@example.com
Mobile: +974 5598 4421
Address while in Qatar: Apartment 902, Tower 12, Viva Bahriya, The Pearl, Doha
Employer: WeillCornell Qatar (research associate, badge WCMQ-1190)
Insurance: Bupa Global Premium, member 887-2099-44, group BG-QA-014

Chief complaint: 3-week history of intermittent palpitations and lightheadedness after caffeine intake.
History: Patient reports palpitations 2–3x/week, lasting < 2 minutes, no syncope, no chest pain. No family history of sudden cardiac death. She has been using a Fitbit Sense (serial FB-SE-228841) which logged 8 episodes of HR > 140 bpm at rest in the last 14 days. ECG done at Aspetar two weeks ago was reportedly normal (we do not have the file).

Assessment: Likely caffeine-related sinus tachycardia, low pre-test probability of arrhythmia, but warrants 24-hour Holter to exclude paroxysmal SVT.

Plan:
 1. 24-hour Holter at Doha Clinic main branch on Saturday 21 June 2026 at 09:00 (appointment ID DCG-APT-552901).
 2. Reduce caffeine to ≤ 1 cup/day for 4 weeks.
 3. Repeat consultation in 14 days. Patient consents to share Holter results via the patient portal at portal.dohaclinic.qa using sign-in olivia.walsh@example.com.

Telemedicine session ID: DCG-TEL-2026-44218. Session encrypted end-to-end. Patient consent confirmed verbally and via DocuSign envelope DSE-66120-998.`,
  },
  {
    id: 'healthcare-ar-1',
    industry: 'healthcare',
    language: 'ar',
    title: 'تقرير حالة مريض — قسم الطوارئ',
    description: 'تقرير قبول لمريضة في قسم طوارئ مستشفى السدّ، يحتوي بيانات صحية ومعرفات شخصية.',
    text: `مؤسسة حمد الطبية — مستشفى الوكرة — قسم الطوارئ
تقرير قبول مبدئي
رقم الملف الطبي MRN: HMC-V-114421
الرقم الشخصي: 29984501322
الاسم الكامل: عائشة محمد آل بوحامد
تاريخ الميلاد: 12 أبريل 2001 (العمر 25 سنة)
الجنسية: قطرية
العنوان: شارع 11، منطقة الوكرة الجنوبية، الدوحة
الهاتف: +974 7700 4422
البريد الإلكتروني: aisha.bouhamed@example.qa
شركة التأمين: شركة الضمان الصحي القطرية، رقم البوليصة PD-QA-3399871، المجموعة GP-WAQ-09
ولي الأمر / المرافق: السيد محمد بن جابر آل بوحامد (الأب)، رقمه الشخصي 26988710022، جواله +974 7700 4423

تاريخ القبول: 17 يونيو 2026، الساعة 21:48 بتوقيت الدوحة
الطبيب المناوب: د. فاطمة الكواري، رخصة مزاولة المهنة MD-QA-44182

الشكوى الرئيسية: ألم في الجانب الأيمن من البطن منذ 6 ساعات يصاحبه قيء وحرارة 38.2 درجة مئوية. لا توجد إصابات حديثة، ولا تناولت أدوية في آخر 12 ساعة. لديها حساسية معروفة من البنسلين.

الفحوصات الأولية:
- تعداد دم كامل CBC: كريات بيضاء 13.4 ألف/ميكرولتر
- تحليل بول: لا يوجد دم أو صديد
- موجات صوتية على البطن: التهاب حاد في المرارة، حصى متعددة بحجم 4-7 ملم
- ضغط الدم: 118/76 ملم زئبق، النبض 102 نبضة/دقيقة، التشبع SpO2: 99%

الخطة: حجز في الجناح B الغرفة 312 لمراقبة 24 ساعة، إعطاء سيتروبيم 1 غرام وريدياً كل 12 ساعة، استشارة جراحة عامة صباح غد بإشراف د. سعد الهاجري (رخصة MD-QA-22091). تم إبلاغ والدها على رقم +974 7700 4423 وأعطى موافقته على الإجراءات. الموعد المتابعة في عيادة الجراحة العامة يوم الأحد 21 يونيو 2026 الساعة 09:30 في فرع الوكرة، عيادة OP-WAQ-A14.`,
  },
  {
    id: 'healthcare-ar-2',
    industry: 'healthcare',
    language: 'ar',
    title: 'وصفة طبية إلكترونية — صيدلية الميرة',
    description: 'وصفة طبية تشمل تفاصيل العميل وشركة التأمين والأدوية المصروفة.',
    text: `وصفة طبية إلكترونية — صيدلية الميرة — فرع الوكرة الرئيسي
الرقم المرجعي للوصفة: RX-AM-2026-998421
تاريخ الإصدار: 16 يونيو 2026، الساعة 13:42 بتوقيت الدوحة
الطبيب الواصف: د. عبدالرحمن السليطي (رخصة مزاولة MD-QA-30041، DEA لا ينطبق)
العيادة: عيادة الذخيرة الطبية، مبنى 7، شارع 22، الذخيرة، الدوحة، هاتف +974 4413 8800

بيانات المريض:
الاسم: عبدالله ناصر الهيدوس
تاريخ الميلاد: 9 يناير 1972 (العمر 54 سنة)
الجنس: ذكر
الرقم الشخصي QID: 27214500098
العنوان: فيلا 8، شارع 311، الذخيرة، الدوحة
الهاتف: +974 5588 9900
البريد الإلكتروني: a.alhaidous@example.qa
شركة التأمين الصحي: السيف للتأمين الصحي، رقم البوليصة SI-22091-887، المجموعة GP-RP-005، نسبة المشاركة 20%

التشخيص الرئيسي: ارتفاع ضغط الدم الأساسي (ICD-10: I10) مع ارتفاع كوليسترول الدم.

الأدوية الموصوفة:
1. أملوديبين 5 ملغ، قرص واحد فموياً مرة واحدة يومياً عند الصباح، لمدة 30 يوماً.
2. أتورفاستاتين 20 ملغ، قرص واحد فموياً مرة واحدة يومياً عند المساء، لمدة 30 يوماً.
3. الأسبرين 81 ملغ، قرص واحد فموياً مرة واحدة يومياً مع الطعام، لمدة 30 يوماً.

تعليمات إضافية: متابعة قراءات ضغط الدم منزلياً والتسجيل في تطبيق "نعومي" المرتبط بـ MRN الخاص بالمريض في مؤسسة حمد الطبية HMC-AH-22118. تم تحويل بيانات الفاتورة إلى البطاقة الائتمانية الفيزا 4716 9912 3344 5566 بصلاحية 08/29 ورمز CVV 221 باسم ABDULLAH N AL HAIDOUS. سيستلم المريض رسالة OTP على رقم +974 5588 9900 لتأكيد الاستلام عند البوابة 4 في الميرة الوكرة.`,
  },
];
