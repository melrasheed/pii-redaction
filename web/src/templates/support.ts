import type { TemplateSample } from './types';

export const supportTemplates: TemplateSample[] = [
  {
    id: 'support-en-1',
    industry: 'support',
    language: 'en',
    title: 'Multi-turn chat — refund request',
    description: 'Live chat transcript from an e-commerce support session with a customer in Doha.',
    text: `CHAT TRANSCRIPT — souqi.qa support — session SQI-CHAT-2026-008471
Started: 17 Jun 2026 14:02 AST  Closed: 17 Jun 2026 14:31 AST
Agent: Yara Mansour (badge SQI-AG-209)  Customer queue: refunds-tier-2

[14:02] Customer (Hannah Lloyd): Hi, I need to return order #SQI-ORD-2026-44182. The dress arrived torn at the seam.
[14:02] Agent: Hello Hannah, I'm Yara. I'm sorry to hear that. Can you confirm your account email and the delivery postcode for verification?
[14:03] Customer: hannah.lloyd@example.com — postcode is 24011, the apartment is 1203 Tower 22, Porto Arabia, The Pearl, Doha.
[14:04] Agent: Thanks, verified. I can see the order was paid with Visa ending 4419, dispatched on 12 June by Aramex (waybill 9988 7711 4422) and delivered on 14 June at 11:47.
[14:05] Customer: That's right. The waybill was signed for by the building concierge, Mr. Ravi Kumar on +974 4400 2280.
[14:06] Agent: Understood. Could you upload one photo of the damage and one of the order slip to https://help.souqi.qa/upload/SQI-ORD-2026-44182 using your account email hannah.lloyd@example.com?
[14:11] Customer: Uploaded — two pictures.
[14:13] Agent: Approved. I have created RMA RMA-2026-117244. A driver from Aramex will collect from your address tomorrow between 11:00 and 14:00. They will phone +974 5544 2901 when 10 minutes away.
[14:14] Customer: Perfect. How will the refund be processed?
[14:15] Agent: Full refund of QAR 487.50 will be credited back to the Visa ending 4419 within 5–7 business days. You'll receive a confirmation email at hannah.lloyd@example.com and an SMS to +974 5544 2901 once the parcel is received at our Lusail warehouse.
[14:16] Customer: Great, thank you Yara. Could you also remove my saved card from the account? I plan to use a different card next time — 5413 8821 0099 2261 — actually no, I'll add it from the app. Please just remove the old one.
[14:17] Agent: Of course. Removing Visa ending 4419 now. Confirmation OTP sent to +974 5544 2901.
[14:21] Customer: OTP entered.
[14:22] Agent: Done. Anything else?
[14:23] Customer: All good, thanks!
[14:31] Agent: Closing the chat. Have a wonderful evening. — Yara`,
  },
  {
    id: 'support-en-2',
    industry: 'support',
    language: 'en',
    title: 'Escalation email — SaaS outage',
    description: 'Customer escalation referencing several admins, an Azure connection string, and a credit card.',
    text: `From: Daniel Park <daniel.park@northwind-traders.example>
To: support-priority@apex-saas.example
Cc: cto@northwind-traders.example
Date: 17 June 2026 09:18 AST
Subject: ESCALATION — 4-hour outage on tenant nw-prod-22, ticket APX-INC-2026-008912

Apex Support,

I am the Director of Engineering at Northwind Traders Qatar (Q.C.S.S.D., tower 2 Burj Doha, West Bay). Our Apex tenant nw-prod-22 has been throwing 5xx errors for 4 hours and we have just missed two SLA windows for shipment manifests heading to Hamad Port. This is a P1 escalation.

Affected:
 - Production database: pg-westeu-001.postgres.database.azure.com (connection string redacted in our own vault, but here is the env var content the on-call engineer pasted into Slack: Server=pg-westeu-001.postgres.database.azure.com;Database=northwind;User Id=apex-app@nwsql;Password=N0rth!Wind#2026;)
 - Storage account: nwprodlogs.blob.core.windows.net, SAS URL https://nwprodlogs.blob.core.windows.net/incident?sv=2024-08-04&ss=b&srt=co&sp=rwl&se=2026-06-18T00:00:00Z&sig=ZsXyW9Q%2BdummysignaturedoNotUseThis%3D
 - Subscription ID: 7d2f6c4a-1188-4421-b8a4-9012aabbccdd

Stakeholders I need on the bridge by 10:00 AST:
 - Daniel Park (me) — daniel.park@northwind-traders.example, +974 5577 6611
 - CTO: Mei-Ling Tan — mei.tan@northwind-traders.example, +974 5577 6612
 - Customer Success Manager assigned: Brendan O'Sullivan — brendan@apex-saas.example, +353 86 998 1144
 - On-call SRE from Apex (please page whoever is on rotation)

For chargeback purposes: corporate card on file is Visa 4147 4321 8821 1144, expiry 09/29, billed to billing@northwind-traders.example. Please open the SLA credit request now even before RCA so we can include it in this month's reconciliation.

Conference bridge: https://meet.northwind-traders.example/incident-2026-008912, dial-in +974 4498 0011 PIN 4218#.

I expect a written status update every 30 minutes until restoration. Thanks.

Daniel Park
Director of Engineering, Northwind Traders Qatar
Mobile +974 5577 6611`,
  },
  {
    id: 'support-ar-1',
    industry: 'support',
    language: 'ar',
    title: 'بريد شكوى عميل — تأخر توصيل طلب',
    description: 'بريد إلكتروني من عميل لشركة توصيل قطرية يشكو من تأخر وصول طلبه.',
    text: `إلى: care@talabat.qa
من: hessa.alkubaisi@example.qa
الموضوع: شكوى — تأخر الطلب رقم TAL-2026-441188 مع وجود رسوم غير صحيحة
التاريخ: 16 يونيو 2026 الساعة 22:14 بتوقيت الدوحة

تحية طيبة لفريق طلبات قطر،

اسمي حصة محمد الكبيسي، رقمي الشخصي 28114502244، عميلة لديكم منذ 2018 برقم CIF-TAL-77441، وأقيم في فيلا 22، شارع 84، منطقة الغرافة، الدوحة. أكتب إليكم لتقديم شكوى بخصوص الطلب رقم TAL-2026-441188 الذي قمت بطلبه اليوم في تمام الساعة 20:01 من مطعم "السلطان" في كتارا.

الطلب كان شاورما لحم بمبلغ 78 ريال قطري، تم دفعه ببطاقة الماستركارد المنتهية بالأرقام 8842 ورمز CVV 412. وعدتني الخريطة بوصول الطلب في غضون 35 دقيقة، إلا أنه لم يصل حتى الساعة 22:00، أي بعد ساعتين تقريباً. تواصلت مع السائق وهو السيد محمد إقبال على رقم +974 7700 2299 وادّعى أنه عالق في شارع حمد الكبير، رغم أن GPS التطبيق كان يظهره ثابتاً في موقف "اللاند مارك" منذ 45 دقيقة.

كما فوجئت اليوم بظهور رسم إضافي بمبلغ 27 ريال قطري بعنوان "رسوم خدمة ليلية" على عملية شراء أخرى بتاريخ 14 يونيو 2026 لطلبي رقم TAL-2026-440021، وهذا الرسم لم يكن مذكوراً في الفاتورة الأصلية المرسلة على بريدي hessa.alkubaisi@example.qa.

أرجو منكم:
1. استرداد قيمة الطلب اليوم بالكامل (78 ريال قطري) إلى نفس البطاقة، وإرسال OTP التأكيد على جوالي +974 5544 6611.
2. توضيح رسم الـ 27 ريال قطري وحذفه إن كان خطأً.
3. مراجعة أداء السائق محمد إقبال، فأنا متيقنة أن العنوان مسجل بدقة عبر الإحداثيات (25.3463، 51.4877) على تطبيقكم.

في حال عدم الرد خلال 48 ساعة سأضطر لرفع الأمر إلى وزارة التجارة والصناعة عبر البوابة الرسمية https://www.moci.gov.qa.

تحياتي،
حصة الكبيسي
الهاتف: +974 5544 6611، العمل: +974 4498 1190`,
  },
  {
    id: 'support-ar-2',
    industry: 'support',
    language: 'ar',
    title: 'محضر اتصال هاتفي مع وكيل خدمة عملاء — تذكرة طيران',
    description: 'محضر مكالمة بين موظف القطرية وعميل يستفسر عن تغيير حجز.',
    text: `محضر مكالمة هاتفية — مركز اتصال الخطوط الجوية القطرية
رقم المكالمة: QR-CALL-2026-117244
المدة: 9 دقائق و 42 ثانية
وكيل الخدمة: نور المهندي (الرقم الوظيفي QR-EMP-44218)، الفرع: مركز رأس بوفنطاس
الوقت: 17 يونيو 2026 الساعة 16:48 بتوقيت الدوحة

المتصل: السيد ميشيل دوبري، الجنسية الفرنسية
رقم جواز السفر: 21EX48217
رقم الميل الذهبي Privilege Club: QR-PC-887421199، المستوى البلاتيني
البريد الإلكتروني: michel.dubray@example.com
الهاتف: +33 6 22 11 88 47، الجوال أثناء وجوده في الدوحة: +974 5588 7766
العنوان في فرنسا: 12 rue de Lyon, 75012 Paris

سبب الاتصال: تعديل حجز رحلة QR-040 من باريس CDG إلى الدوحة DOH بتاريخ 28 يونيو 2026 على درجة رجال الأعمال، إلى تاريخ 30 يونيو 2026، رقم الحجز (PNR): X7QABC، رقم التذكرة الإلكترونية 157-2348001124-1.

ملاحظات الوكيل:
1. تم التحقق من العميل عبر إدخال رقم Privilege Club الكامل وآخر 4 أرقام من بطاقة الدفع المسجلة (American Express رقم 3782 822463 14199، صلاحية 03/30، رمز CID 7732).
2. توفر مقعد 4A على رحلة QR-038 الجديدة بتاريخ 30 يونيو 2026، تم تأكيد الحجز.
3. تم تطبيق رسم تغيير 350 يورو خصمت من نفس البطاقة AmEx، وأرسلت رسالة OTP إلى رقمه الفرنسي +33 6 22 11 88 47، تم إدخالها بنجاح.
4. تم إرسال التذكرة المحدثة إلى michel.dubray@example.com مع نسخة بصيغة PDF تحت رقم E-TICKET-44218-NEW.
5. طلب العميل تحديث عنوان الفواتير من فرنسا إلى عنوانه أثناء الإقامة في الدوحة: شقة 902، برج 8، فيفا بحرية، اللؤلؤة، الدوحة. تم تحديث الملف.

تم إنهاء المكالمة بشكل ودي، وأبدى العميل ارتياحه للخدمة. تذكرة المتابعة QR-FU-2026-118 ستفتح لمراجعة جودة الخدمة بعد 24 ساعة.`,
  },
];
