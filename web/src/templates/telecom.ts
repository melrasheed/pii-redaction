import type { TemplateSample } from './types';

export const telecomTemplates: TemplateSample[] = [
  {
    id: 'telecom-en-1',
    industry: 'telecom',
    language: 'en',
    title: 'Postpaid billing complaint with IMEI and MSISDN',
    description: 'Customer email to Ooredoo Qatar contesting roaming charges.',
    text: `From: peter.collins@example.com
To: care@ooredoo.qa
Subject: Disputed roaming charges on bill #OO-2026-554821 — please refund

Hello Ooredoo Care,

I am writing about my June bill on account 974-987456-001, which arrived today with QAR 3,847 in roaming data charges that I do not recognise.

Account holder: Peter James Collins
Qatar ID: 28591603327
Email: peter.collins@example.com
Postal address: Apartment 1404, Tower 18, Porto Arabia, The Pearl, Doha
Date of birth: 22 November 1981
Postpaid mobile (MSISDN): +974 3344 9911
Handset IMEI: 359487102773498
SIM ICCID: 8997440011223344556
Customer reference number: OOR-CIF-99873-A
Linked credit card on file: 5413 1234 5678 9012, expiry 04/30

According to my travel itinerary I was in Doha for the entire billing period (1–30 May 2026) and my passport (QA-CA9981201) has no exit stamps. There is no way I could have used data in Greece or Cyprus where the charges supposedly originated.

I would like:
1. A full reversal of QAR 3,847.
2. A signed statement confirming the IMEI 359487102773498 did not leave Qatar's network.
3. An investigation into whether my MSISDN was cloned.

Please call me back on +974 5587 2104 between 18:00 and 21:00 Doha time. Alternative contact: my wife Layla Collins on +974 5587 2105.

Best regards,
Peter J. Collins
CIF OOR-CIF-99873-A`,
  },
  {
    id: 'telecom-en-2',
    industry: 'telecom',
    language: 'en',
    title: 'SIM-swap fraud support ticket',
    description: 'Internal Vodafone Qatar support ticket dealing with a SIM-swap attempt.',
    text: `TICKET: VOD-QA-FRAUD-2026-118
PRIORITY: P1
OPENED: 17 Jun 2026 09:42 AST by agent Mariam Al-Naimi (mariam.alnaimi@vodafone.qa)

Subscriber: Ibrahim Hassan Al-Marri
Vodafone CIF: VFQA-CIF-7798421
National ID (QID): 28114502611
Primary MSISDN: +974 7700 1188
Secondary MSISDN: +974 3399 5520
Home address: Building 14, Street 88, Al Sadd, Doha
Email of record: ibrahim.almarri@example.qa
Date of birth: 4 January 1979

Issue: The subscriber phoned hotline 800 from +974 5566 4488 (NOT his number on file) at 08:31 AST claiming his handset (IMEI 868001054423998) was stolen and requested an emergency SIM replacement. The agent flagged the call after the caller failed to confirm the security question (mother's maiden name).

Approximately 11 minutes later a walk-in at the City Center Doha shop (POS-DOH-CC-04) presented a forged passport (purported number QA-DG7702011) requesting the same SIM replacement. Store agent Ahmed Rashed (vodafone-emp-66120) refused the swap.

Action taken:
 - Soft-locked MSISDN +974 7700 1188 at 09:39 AST.
 - Disabled M-Pesa wallet linked to that MSISDN (wallet ID VWM-998877-21).
 - Notified the subscriber on his alternate contact email ibrahim.almarri@example.qa and on landline +974 4467 1190.
 - Filed report with the Cyber Crime Investigation Department of MoI (ref: CCID-2026-04417).

Next step: SOC to pull all IP addresses used to access the My Vodafone app in the last 14 days (recent suspicious IP: 41.232.144.5 from Cairo, Egypt).`,
  },
  {
    id: 'telecom-ar-1',
    industry: 'telecom',
    language: 'ar',
    title: 'محادثة دعم فني — مشكلة فاتورة فايبر',
    description: 'محادثة دعم بين أحد مشتركي أوريدو قطر وموظف خدمة العملاء بخصوص فاتورة الفايبر المنزلي.',
    text: `سجل محادثة الدعم الفني — تطبيق Ooredoo qatar للمحادثة
رقم التذكرة: OO-CHAT-2026-77129
الوقت: 17 يونيو 2026، الساعة 11:08 صباحاً بتوقيت الدوحة

العميل: مرحباً، أنا فاطمة علي البوعينين، حسابي رقم 974-661177-002، رقم البريد الإلكتروني المسجل fatima.albuainain@example.qa، وأنا أتصل بكم بخصوص فاتورة الإنترنت المنزلي للفلة الواقعة في فيلا 24، شارع 412، منطقة الوكرة، الدوحة. الفاتورة لشهر مايو 2026 جاءت بمبلغ 1,840 ريال قطري وهذا غير صحيح إطلاقاً، حيث أن الباقة المتفق عليها بسعر 459 ريال قطري شهرياً.

الموظف: تحية طيبة سيدة فاطمة، أنا خالد المسلماني من خدمة العملاء (الرقم الوظيفي OOR-EMP-13420). شكراً لتواصلك معنا. هل يمكنك تزويدي برقم الهوية القطرية للتحقق؟

العميل: نعم، رقم الهوية 28987100221، وتاريخ ميلادي 19 سبتمبر 1989. رقم جوالي للتواصل +974 5544 9870، ورقم الهاتف الأرضي للمنزل +974 4498 2271.

الموظف: تم التحقق. أرى أن الفاتورة تحتوي على بند "مكالمات دولية" بمبلغ 1,381 ريال قطري إلى رقم في الفلبين هو +63 917 442 1108، تمت بتاريخ 28 مايو 2026 لمدة 9 ساعات و 17 دقيقة من نفس خط الفايبر المنزلي. عنوان IP الجلسة كان 89.211.44.182.

العميل: هذا غير ممكن إطلاقاً، لم أكن في المنزل ذلك الأسبوع، كنت في زيارة لوالدتي في الريان. ربما العاملة المنزلية استخدمت الخط دون إذني، اسمها روزماري سانتوس، رقم إقامتها 28999883310.

الموظف: مفهوم. سأرفع طلب تحقيق وأقوم بتجميد ميزة الاتصال الدولي مؤقتاً. سيصلك رمز التحقق عبر OTP على رقم +974 5544 9870 لتأكيد العملية. سنقوم بالرد خلال 48 ساعة عبر البريد الإلكتروني fatima.albuainain@example.qa.`,
  },
  {
    id: 'telecom-ar-2',
    industry: 'telecom',
    language: 'ar',
    title: 'طلب نقل خدمة وتركيب — عميل B2B',
    description: 'طلب من شركة قطرية لنقل خدمات الإنترنت وتركيب MPLS لمكتب جديد في برج لوسيل.',
    text: `طلب نقل خدمة B2B — فودافون قطر للأعمال
رقم الطلب: VFQ-B2B-MOVE-2026-3382
تاريخ الإصدار: 16 يونيو 2026
مدير الحساب: عبدالعزيز الكواري (abdulaziz.alkuwari@vodafone.qa، الرقم الوظيفي VFQA-AM-7714)

بيانات العميل (الشركة):
الاسم القانوني: شركة الخليج للخدمات اللوجستية ذ.م.م
السجل التجاري: 87654-09
الرقم الضريبي: 100211230098
عنوان المقر الحالي: مكتب 1803، برج البرزان، شارع كورنيش الدوحة
العنوان الجديد: مكتب 4502، برج لوسيل بلازا 3، لوسيل
ممثل الشركة المفوض: المهندس وليد حمد العطية، رقمه الشخصي 28663800221
هاتف العميل: +974 4498 7700
بريد العميل: walid.atiyah@gulf-logistics.example
رقم الموبايل للتأكيد: +974 5582 1144
بطاقة المصاريف: 4147 2099 4416 1273 صلاحية 06/28 رمز CVV 412 باسم WALID H AL-ATIYAH

تفاصيل الخدمات المطلوب نقلها:
1. وصلة ألياف بصرية MPLS بسرعة 500 ميجابت/ثانية بين الموقع الجديد ومراكز البيانات في QDC1 وQDC2، مع IP /29 ثابت من الكتلة 217.180.92.0/29.
2. أرقام الهاتف الأرضي الست: +974 4400 1100 إلى +974 4400 1105 مع تحويل الاتصالات.
3. سعة خط احتياطي LTE Backup عبر شريحة SIM للأعمال رقم 8997440099887766554.
4. اشتراك أمن المعلومات SOC المُدارة على بوابة security.vodafone.qa.

موعد التركيب المقترح: السبت 5 يوليو 2026 بين الساعة 09:00 و 13:00 بتوقيت الدوحة، شريطة إخلاء الموقع من قبل المقاول وتوفير وصول لفنيي فودافون عبر بوابة الزوار في الدور الأرضي (تأكيد دخول للأسماء: علي السيد، يوسف الباكر، عبدالله المهندي).`,
  },
];
