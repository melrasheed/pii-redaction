import type { TemplateSample } from './types';

export const governmentTemplates: TemplateSample[] = [
  {
    id: 'government-en-1',
    industry: 'government',
    language: 'en',
    title: 'Residence permit renewal application',
    description: 'Renewal application submitted via the Metrash 2 portal to the Ministry of Interior.',
    text: `MINISTRY OF INTERIOR — GENERAL DIRECTORATE OF PASSPORTS — STATE OF QATAR
Form: Renewal of Residence Permit (RP) for non-Qatari
Reference: MOI-RP-RNW-2026-998421
Submitted via: Metrash 2 (https://portal.moi.gov.qa)

Applicant:
  Full name (Latin): Anjali Devi Subramanian
  Full name (Arabic): أنجالي ديفي سوبرامانيان
  Nationality: Indian
  Passport number: K7714082Z, issued 14 Mar 2022 Bengaluru, expires 13 Mar 2032
  Indian Aadhaar number (for sponsor verification only): 2233 4455 6677
  PAN: ABCPS1234K
  Qatar ID (current): 39288700421
  Date of birth: 8 February 1982
  Gender: Female

Sponsor (Kafeel) — Employer:
  Legal name: Doha Diagnostics Holding W.L.L.
  CR number: 91182-04
  Tax ID: 100211234599
  Authorised representative: Mr. Khalid Al-Mannai, QID 26887400118
  Sponsor email: hr.govt@dohadiagnostics.example
  Sponsor phone: +974 4413 9982

Residence in Qatar:
  Address: Apartment 902, Tower 12, Viva Bahriya, The Pearl, Doha
  Mobile: +974 5598 4421
  Email: anjali.s@example.com

Family members included in renewal:
 - Spouse: Vikram Subramanian, passport L4421188Z, current QID 39288700422
 - Child 1: Aarav Subramanian, DoB 14 May 2014, passport M3398210
 - Child 2: Anika Subramanian, DoB 22 September 2018, passport M3398211

Supporting documents uploaded:
 1. Salary certificate showing QAR 45,000/month, stamped by Doha Diagnostics HR.
 2. Tenancy contract registered with Baladiya number BLD-2026-44882.
 3. Health insurance certificate from Bupa Global, member 887-2099-44.
 4. School enrolment letters for Aarav (Doha British School, ID DBS-22118) and Anika (Sherborne Qatar, ID SQ-44199).

Application fee: QAR 1,500 paid via Naps wallet card 4716 8911 2233 4455, OTP confirmed via +974 5598 4421.`,
  },
  {
    id: 'government-en-2',
    industry: 'government',
    language: 'en',
    title: 'Public service complaint to Hukoomi',
    description: 'A complaint submitted to the central Hukoomi portal about a delayed driving licence renewal.',
    text: `HUKOOMI CITIZEN COMPLAINT PORTAL — COMPLAINT TICKET HUK-COMP-2026-118772
Submitted: 17 Jun 2026 18:11 AST
Routing: Ministry of Interior — Traffic Department

Complainant:
  Full name: Adam Patrick Murphy
  Nationality: Irish
  Passport: P3398211
  Qatar resident permit: 39214500871
  Date of birth: 17 March 1985
  Address: Apartment 1812, Tower 22, Porto Arabia, The Pearl, Doha
  Mobile: +974 5599 8842
  Email: adam.murphy@example.com
  Employer of record: WeillCornell Qatar (badge WCMQ-1190)

Subject of complaint:
  My Qatari driving licence (number DL-22-991188) was due for renewal on 25 May 2026. I paid the renewal fee of QAR 250 on 27 April 2026 via my Visa card 4147 4321 9988 2261 (the OTP confirmation came to +974 5599 8842 at 10:43 AST). The transaction reference is MOI-PAY-99887-2026.

  Despite paying on time and submitting all documents at the Madinat Khalifa traffic department on 4 May 2026, I have not received my updated licence card. When I drove to QNB West Bay on 14 June 2026 the security guard refused to validate my parking because my licence had expired. I had to call my colleague Mariam Sayed (mobile +974 5544 1190) to pick me up.

  Today I called the MoI hotline 109 from +974 5599 8842 at 11:24 AST and was told the licence is "ready for collection at Madinat Khalifa" with no SMS or email notification ever sent to me. This is the third year in a row this has happened.

Requested resolution:
 1. Apologetic statement of acknowledgement within 7 days.
 2. Courier delivery of the new licence to my address above at MoI's expense.
 3. A waiver on the next renewal fee in 2027.

I will be available for follow-up on +974 5599 8842 or by email at adam.murphy@example.com.`,
  },
  {
    id: 'government-ar-1',
    industry: 'government',
    language: 'ar',
    title: 'طلب استخراج وثيقة عائلية — وزارة الداخلية',
    description: 'طلب رسمي عبر بوابة مطراش لإصدار وثيقة قيد عائلي مع المرفقات الكاملة.',
    text: `وزارة الداخلية — الإدارة العامة للأحوال المدنية — دولة قطر
نموذج طلب إصدار وثيقة قيد عائلي
الرقم المرجعي: MOI-CIVIL-2026-9982144
قُدِّم عبر تطبيق مطراش 2 بتاريخ: 15 يونيو 2026 الساعة 09:47 بتوقيت الدوحة

بيانات مقدم الطلب (رب الأسرة):
الاسم الرباعي: سعد بن جاسم بن محمد آل ثاني
الرقم الشخصي القطري (QID): 26891700031
تاريخ الميلاد: 22 أغسطس 1968
رقم جواز السفر القطري: QA-DH8821011، تاريخ الانتهاء 03/2031
العنوان: فيلا 4، شارع 311، منطقة الخليج الغربي، الدوحة
الهاتف المحمول: +974 5511 2244 (رقم استلام OTP)
البريد الإلكتروني: saad.althani@example.qa
المهنة: مدير عام، وزارة الطاقة والشؤون البلدية
رقم الحساب البنكي لاسترداد رسوم زائدة إن وجد:
رقم الآيبان: QA48 QNBA 0000 0000 0007 7889 1100، بنك قطر الوطني

أفراد الأسرة المطلوب إدراجهم في الوثيقة:
1. الزوجة: مريم عبدالله الكبيسي، الرقم الشخصي 27184200099، تاريخ الميلاد 11 يناير 1972
2. الابن: جاسم سعد آل ثاني، الرقم الشخصي 30214500078، تاريخ الميلاد 14 أبريل 2002
3. الابنة: شيخة سعد آل ثاني، الرقم الشخصي 31299800077، تاريخ الميلاد 8 ديسمبر 2005
4. الابنة: نورة سعد آل ثاني، الرقم الشخصي 32104200088، تاريخ الميلاد 22 سبتمبر 2010

الغرض من الوثيقة: لتقديمها إلى السفارة الفرنسية في الدوحة لاستخراج تأشيرة شينغن سياحية للأسرة.

الرسوم: تم سداد مبلغ 30 ريال قطري عبر بطاقة "ناباس" المنتهية بـ 7799، رقم العملية NAPS-2026-441188، وتأكيد OTP وصل إلى رقم +974 5511 2244 في تمام الساعة 09:48.

ملاحظات: لدى مقدم الطلب توكيل عام رقم TAW-2024-0017844 صادر من كاتب العدل لزوجته للتصرف في الشؤون الإدارية، مرفق صورة PDF بحجم 412 كيلوبايت. سيتم التواصل عبر مطراش لتأكيد الاستلام، والوثيقة جاهزة للاستلام بعد 24 ساعة عمل من المركز الرئيسي في منطقة لقطيفية أو إلكترونياً عبر https://portal.moi.gov.qa/civil-doc/9982144.`,
  },
  {
    id: 'government-ar-2',
    industry: 'government',
    language: 'ar',
    title: 'طلب خدمة بلدية — تصريح بناء فلة',
    description: 'طلب تصريح بناء فلة سكنية مقدّم لبلدية الوكرة عبر بوابة الخدمات الحكومية.',
    text: `بلدية الوكرة — قسم تراخيص البناء — دولة قطر
نموذج طلب تصريح بناء فلة سكنية
الرقم المرجعي: BLD-WAQ-PER-2026-44218
التاريخ: 14 يونيو 2026

بيانات المالك:
الاسم الكامل: علي محمد الهاجري
الرقم الشخصي القطري (QID): 27991504411
تاريخ الميلاد: 19 يونيو 1975
العنوان الحالي: فيلا 18، شارع 92، الوكرة، الدوحة
الهاتف: +974 5577 6633 (رقم استلام OTP)
هاتف العمل: +974 4498 7711
البريد الإلكتروني: ali.alhajri@example.qa
الجنسية: قطري
الراتب الشهري المعتمد لإثبات الملاءة المالية: 65,000 ريال قطري

بيانات قطعة الأرض:
رقم القطعة: 998477 - منطقة 90 (الوكرة الجنوبية)
المساحة: 720 متراً مربعاً
استعمال الأرض: سكني خاص — درجة A
رقم سند الملكية: TD-WAQ-2024-77441
رقم العقد المسجل في كاتب العدل: NTR-2024-22118

بيانات الاستشاري المعتمد:
المكتب: مكتب الرفاع للاستشارات الهندسية
السجل التجاري: 49872-02
الرقم الضريبي: 100200099877
المهندس المعتمد: المهندس فهد سعد العنزي، رقم القيد بنقابة المهندسين QSE-EM-22189
الهاتف: +974 4498 0099
البريد: fahad.alanezi@alrefaa-eng.example

بيانات المقاول المرشح:
الشركة: مؤسسة الرواد للبناء
السجل التجاري: 36281-09
المدير المسؤول: السيد ياسر الكبيسي، رقمه الشخصي 28114600221، جواله +974 5588 4422
الحساب البنكي لتحويل دفعات المشروع:
رقم الآيبان: QA39 DOHA 0000 0000 0011 2233 4455، بنك الدوحة

تفاصيل المشروع: بناء فلة دورين + ملحق خادم + مسبح، الارتفاع الإجمالي 9.5 متر، عدد الغرف 6، مع نظام رش حريق وكاميرات مراقبة. تم سداد رسوم الفحص الأولي 1,200 ريال قطري عبر بطاقة ميزة المنتهية بـ 4422، وأكدت العملية برمز OTP أرسل إلى +974 5577 6633 في تمام الساعة 11:24.`,
  },
];
