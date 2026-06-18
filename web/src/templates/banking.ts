import type { TemplateSample } from './types';

export const bankingTemplates: TemplateSample[] = [
  {
    id: 'banking-en-1',
    industry: 'banking',
    language: 'en',
    title: 'KYC onboarding form — premium account',
    description: 'Branch-side KYC capture for a new premium account opening at QNB Lusail.',
    text: `KYC ONBOARDING — QNB PRIVATE BANKING
Branch: QNB Lusail, Marina District, Doha
Officer: Khalid Al-Mansoori (employee #QNB-44218)

Applicant full legal name: Sara Hussain Al-Kuwari
Date of birth: 14 March 1986
Qatar ID (QID): 28634500712
Passport: QA-AA8821443, issued 02 Feb 2022, expires 02 Feb 2032
Nationality: Qatari
Permanent address: Villa 18, Street 921, West Bay Lagoon, Doha
Email: sara.alkuwari@example.qa
Mobile: +974 5512 9007 (WhatsApp), alt: +974 3398 1144
Employer: Qatar Petroleum, position: Senior Geologist
Annual gross income: QAR 1,420,000

Source of funds: salary plus rental income from two villas in The Pearl (Porto Arabia tower 18).
Initial deposit: QAR 850,000 wired from existing QNB account IBAN QA29 QNBA 0000 0000 0089 1144 7799.
Beneficiary IBAN to be linked: QA82 QNBA 0000 0000 0017 7755 4321.
Card requested: Visa Signature, embossing name "SARA H AL-KUWARI", CVV to be issued.
Online banking username preference: sara.alkuwari
Risk rating: Low (PEP screening clean as of 14 Jun 2026).

Acknowledged by applicant on 14 June 2026 via in-branch e-signature pad device QNB-PAD-002.
Customer reachable for OTP at +974 5512 9007 between 09:00 and 18:00 AST.`,
  },
  {
    id: 'banking-en-2',
    industry: 'banking',
    language: 'en',
    title: 'Wire transfer instruction with SWIFT and IBAN',
    description: 'Customer-emailed wire instruction with multiple financial identifiers.',
    text: `Subject: Outgoing wire — purchase of equipment from supplier in Italy

Dear QIIB International Operations,

Please execute an outgoing wire on behalf of our company account.

Remitter:
  Name: Gulf Energy Solutions WLL
  Account holder: Mr. Ahmed Yousef Al-Thani
  Account no.: 0019-887765-002
  IBAN: QA67 QIIB 0000 0000 0019 8877 6500
  Address: Tower 4, Floor 22, West Bay, Doha 22222, Qatar
  Tel: +974 4012 6680, Mobile: +974 5599 1207
  Email: a.althani@gulfenergy-qa.example

Beneficiary:
  Name: Officine Meccaniche Brescia S.p.A.
  Address: Via Industriale 47, 25128 Brescia, Italy
  IBAN: IT60 X054 2811 1010 0000 0123 456
  Bank: Intesa Sanpaolo S.p.A., Milan
  SWIFT/BIC: BCITITMM
  Amount: EUR 412,500.00
  Charges: OUR
  Value date: 18 June 2026

Reason for payment: Purchase order PO-2026-1144 for 3x compressor units.
Card used to pay correspondent fees: 4539 1488 0343 6467, exp 11/29, CVV 318, holder AHMED Y AL THANI.

Please confirm on +974 5599 1207 or by email to ops.lead@gulfenergy-qa.example.

Kind regards,
Ahmed Y. Al-Thani
CFO, Gulf Energy Solutions WLL`,
  },
  {
    id: 'banking-ar-1',
    industry: 'banking',
    language: 'ar',
    title: 'نموذج فتح حساب توفير — العميل اعتيادي',
    description: 'نموذج "اعرف عميلك" لفتح حساب توفير في بنك قطر الإسلامي الدولي.',
    text: `نموذج فتح حساب توفير — بنك قطر الإسلامي الدولي (QIIB) — فرع الدفنة، الدوحة
الموظف المسؤول: محمد عبدالله السويدي، الرقم الوظيفي QIIB-22091

البيانات الشخصية لمقدم الطلب:
الاسم الكامل: نورة سعد المهندي
تاريخ الميلاد: 7 يوليو 1992
الرقم الشخصي القطري (QID): 29274501338
الجنسية: قطرية
العنوان: فيلا رقم 12، شارع 304، منطقة لوسيل، الدوحة 22112
البريد الإلكتروني: noura.almuhannadi@example.qa
الهاتف المحمول: +974 5544 7799
هاتف العمل: +974 4498 1122
جهة العمل: وزارة الصحة العامة — مسمى وظيفي: ممرضة أولى
الراتب الشهري الصافي: 24,500 ريال قطري

تفاصيل الحساب:
نوع الحساب المطلوب: حساب توفير بالريال القطري
المبلغ المودع نقداً عند الافتتاح: 7,500 ريال قطري
رقم الحساب الجديد: 0027-557811-003
رقم الآيبان IBAN: QA15 QIIB 0000 0000 0027 5578 1100
بطاقة الصراف الآلي المطلوبة: بطاقة "ميزة" للسحب اليومي بسقف 5,000 ريال قطري
رقم الجوال لاستلام رمز التحقق (OTP): +974 5544 7799

أفادت العميلة بأن مصدر الدخل الأساسي هو الراتب الحكومي، وأنها لا تمارس أي نشاط تجاري آخر. تم التحقق من الهوية بواسطة بطاقة الرقم الشخصي الأصلية، وتمت مطابقة الصورة عبر منصة "مطراش 2". وقعت العميلة على إقرار غسل الأموال بتاريخ 14 يونيو 2026 إلكترونياً عبر الجهاز QIIB-PAD-014.`,
  },
  {
    id: 'banking-ar-2',
    industry: 'banking',
    language: 'ar',
    title: 'بريد شكوى عميل — احتيال بطاقة ائتمانية',
    description: 'بريد عميل يبلّغ عن عمليات احتيال على بطاقته الائتمانية في بنك قطر الوطني.',
    text: `إلى: قسم بطاقات الائتمان — بنك قطر الوطني (QNB)
الموضوع: شكوى عاجلة — عمليات شراء مشبوهة على بطاقتي الفيزا

السادة الأفاضل،

أنا المدعو فيصل ناصر العطية، رقمي الشخصي القطري 28987604421، أعمل مديراً تنفيذياً في شركة أوريدو قطر، وأقيم في فيلا رقم 7، شارع 18، منطقة الدفنة، الدوحة.

أكتب إليكم بخصوص بطاقتي الائتمانية فيزا انفينيت رقم 4716 8829 1140 6633، تاريخ الانتهاء 09/29، المرتبطة بحسابي رقم 0001-991188-007، الآيبان QA73 QNBA 0000 0000 0001 9911 8800.

بتاريخ 16 يونيو 2026 بين الساعة 02:14 والساعة 02:47 صباحاً (بتوقيت الدوحة) ظهرت في تطبيق QNB Mobile ثلاث عمليات شراء مشبوهة من موقع "luxury-watches-eu.example" بمبالغ 4,200 و 6,750 و 11,300 ريال قطري على التوالي، يبدو أنها تمت من عنوان IP خارج قطر (IP: 185.220.101.42). أنا متأكد أنني لم أقم بهذه العمليات، وكانت البطاقة بحوزتي طوال الليل في منزلي.

أرجو منكم بشكل فوري:
1. تجميد البطاقة وإصدار بطاقة بديلة باسم "FAISAL N AL-ATIYAH" مع الرقم السري الجديد إلى عنواني المسجل.
2. فتح بلاغ احتيال رسمي وإعادة المبالغ المتنازع عليها وفقاً لسياسة شاركبك (Chargeback) الخاصة بفيزا.
3. مراجعة جميع العمليات منذ تاريخ 10 يونيو 2026.

يمكن التواصل معي على الجوال +974 3377 8810 أو البريد الإلكتروني faisal.atiya@example.qa، وأنا متفرغ غداً بعد الساعة 14:00. شاكراً لكم تعاونكم.

تحياتي،
فيصل ناصر العطية
الرقم العضوي في QNB: CIF-447712909`,
  },
];
