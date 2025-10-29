# قائمة جميع API Endpoints

## ✅ تم الربط بقاعدة البيانات

### 📦 Inventory (المخزون)

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/inventory/topology` | GET | الحصول على هيكل المستودعات والأصناف |
| `/api/inventory/grn` | POST | إنشاء محضر استلام بضاعة |
| `/api/inventory/transfer` | POST | نقل مخزون بين المستودعات |
| `/api/inventory/stock-summary` | GET | تقرير ملخص المخزون |
| `/api/inventory/movements` | GET | سجل حركات المخزون |

### 🛒 Purchasing (المشتريات)

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/purchasing/suppliers` | GET | جلب جميع الموردين |
| `/api/purchasing/suppliers` | POST | إضافة مورد جديد |
| `/api/purchasing/suppliers/:id` | PUT | تحديث بيانات مورد |
| `/api/purchasing/orders` | GET | جلب أوامر الشراء |
| `/api/purchasing/orders` | POST | إنشاء أمر شراء جديد |
| `/api/purchasing/orders/:id/status` | PATCH | تحديث حالة أمر الشراء |

### 🏭 Production (الإنتاج)

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/production/recipes` | GET | جلب جميع الوصفات |
| `/api/production/recipes` | POST | إضافة وصفة جديدة |
| `/api/production/orders` | GET | جلب أوامر الإنتاج |
| `/api/production/orders` | POST | إنشاء أمر إنتاج |
| `/api/production/orders/:id/complete` | POST | إتمام أمر الإنتاج |

### 🏨 Minibar (المينيبار/الفندق)

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/minibar/rooms` | GET | جلب جميع الغرف |
| `/api/minibar/rooms` | POST | إضافة/تحديث غرفة |
| `/api/minibar/folio/:roomId` | GET | جلب فاتورة الغرفة |
| `/api/minibar/folio` | POST | إنشاء فاتورة جديدة |
| `/api/minibar/folio/charge` | POST | إضافة مصروف للفاتورة |
| `/api/minibar/folio/:id/close` | POST | إغلاق الفاتورة (الخروج) |

### 🍽️ Dine-In (الصالة)

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/dinein/areas` | GET | جلب مناطق الطاولات |
| `/api/dinein/areas` | POST | إضافة منطقة جديدة |
| `/api/dinein/tables` | GET | جلب جميع الطاولات |
| `/api/dinein/tables` | POST | إضافة/تحديث طاولة |
| `/api/dinein/tables/:id/status` | PATCH | تحديث حالة الطاولة |
| `/api/dinein/orders` | POST | إنشاء طلب للطاولة |
| `/api/dinein/orders/:orderId/complete` | POST | إتمام طلب الطاولة |

### 🚗 Delivery (التوصيل)

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/delivery/drivers` | GET | جلب جميع السائقين |
| `/api/delivery/drivers` | POST | إضافة سائق جديد |
| `/api/delivery/drivers/:id` | PUT | تحديث بيانات سائق |
| `/api/delivery/orders` | GET | جلب طلبات التوصيل |
| `/api/delivery/orders` | POST | إنشاء طلب توصيل |
| `/api/delivery/orders/:id/assign` | PATCH | تعيين سائق للطلب |
| `/api/delivery/orders/:id/status` | PATCH | تحديث حالة التوصيل |

### 🧾 E-Invoice (الفواتير الإلكترونية)

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/einvoice/invoices` | GET | جلب جميع الفواتير |
| `/api/einvoice/invoices/:id` | GET | جلب فاتورة محددة |
| `/api/einvoice/invoices` | POST | إنشاء فاتورة جديدة |
| `/api/einvoice/invoices/:id/submit` | POST | إرسال للهيئة (ZATCA) |
| `/api/einvoice/stats` | GET | إحصائيات الفواتير |

### 💰 POS (نقاط البيع)

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/pos/sale` | POST | إنشاء عملية بيع |

### 📊 Reports (التقارير المتقدمة)

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/reports/sales` | GET | تقرير المبيعات |
| `/api/reports/inventory-valuation` | GET | تقييم المخزون |
| `/api/reports/best-selling` | GET | الأصناف الأكثر مبيعاً |
| `/api/reports/purchase-orders` | GET | تقرير أوامر الشراء |
| `/api/reports/delivery-performance` | GET | أداء التوصيل |

### 👥 Users (المستخدمون)

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/users` | GET | جلب جميع المستخدمين |
| `/api/users/:id` | GET | جلب مستخدم محدد |
| `/api/users` | POST | إضافة مستخدم جديد |
| `/api/users/:id` | PUT | تحديث بيانات مستخدم |
| `/api/users/:id` | DELETE | حذف مستخدم (تعطيل) |
| `/api/users/:id/change-password` | POST | تغيير كلمة المرور |
| `/api/users/:id/activity` | GET | سجل نشاط المستخدم |

### ⚙️ Settings (الإعدادات)

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/api/settings` | GET | جلب جميع الإعدادات |
| `/api/settings/:key` | GET | جلب إعداد محدد |
| `/api/settings/:key` | PUT | تحديث إعداد |
| `/api/settings` | POST | تحديث إعدادات متعددة |
| `/api/settings/initialize` | POST | تهيئة الإعدادات الافتراضية |

## 📁 ملفات الـ Routes المنشأة

### Server Routes
- ✅ `server/routes/grn.ts` - محاضر استلام البضائع
- ✅ `server/routes/transfer.ts` - نقل المخزون
- ✅ `server/routes/pos.ts` - نقاط البيع
- ✅ `server/routes/inventory.ts` - هيكل المخزون
- ✅ `server/routes/reports.ts` - التقارير الأساسية
- ✅ `server/routes/settings.ts` - الإعدادات
- ✅ `server/routes/purchasing.ts` - **جديد** المشتريات
- ✅ `server/routes/production.ts` - **جديد** الإنتاج
- ✅ `server/routes/minibar.ts` - **جديد** المينيبار
- ✅ `server/routes/dinein.ts` - **جديد** الصالة
- ✅ `server/routes/delivery.ts` - **جديد** التوصيل
- ✅ `server/routes/einvoice.ts` - **جديد** الفواتير
- ✅ `server/routes/reports-advanced.ts` - **جديد** التقارير المتقدمة
- ✅ `server/routes/users.ts` - **جديد** المستخدمون

### Client Pages (الصفحات الأمامية)

#### ✅ مربوط بقاعدة البيانات
1. `client/pages/Settings.tsx` - متصل بـ `/api/settings`
2. `client/pages/GoodsReceipt.tsx` - متصل بـ `/api/inventory/grn`
3. `client/pages/StockTransfer.tsx` - متصل بـ `/api/inventory/transfer`
4. `client/pages/POSSale.tsx` - متصل بـ `/api/pos/sale`
5. `client/pages/StockRecords.tsx` - متصل بـ `/api/inventory/movements`
6. `client/pages/InventoryReports.tsx` - متصل بـ `/api/inventory/stock-summary`
7. `client/pages/Purchasing.tsx` - **محدّث** متصل بـ `/api/purchasing/*`

#### ⏳ يحتاج إلى تحديث الصفحة الأمامية
8. `client/pages/Production.tsx` - API جاهز، يحتاج تحديث الصفحة
9. `client/pages/Minibar.tsx` - API جاهز، يحتاج تحديث الصفحة
10. `client/pages/DineIn.tsx` - API جاهز، يحتاج تحديث الصفحة
11. `client/pages/Delivery.tsx` - API جاهز، يحتاج تحديث الصفحة
12. `client/pages/EInvoice.tsx` - API جاهز، يحتاج تحديث الصفحة
13. `client/pages/Reports.tsx` - API جاهز، يحتاج تحديث الصفحة
14. `client/pages/UsersRoles.tsx` - API جاهز، يحتاج تحديث الصفحة
15. `client/pages/POS.tsx` - API جاهز (pos/sale)، قد يحتاج تحسينات

## 📊 إحصائيات

- **إجمالي API Endpoints:** 57+ endpoint
- **ملفات Routes الجديدة:** 8 ملفات
- **الصفحات المربوطة:** 7 من 15 (47%)
- **الصفحات المتبقية:** 8 صفحات تحتاج تحديث Frontend فقط

## 🔄 الخطوات التالية

1. ✅ **تم إنشاء جميع API endpoints**
2. ✅ **تم تسجيل جميع الـ routes في server/index.ts**
3. ✅ **تم تحديث صفحة Purchasing**
4. ⏳ **تحديث باقي الصفحات الأمامية (7 صفحات)**
5. ⏳ **إضافة بيانات تجريبية في قاعدة البيانات للاختبار**
6. ⏳ **اختبار جميع العمليات (CRUD)**

## 💡 ملاحظات مهمة

- جميع الـ APIs تستخدم Prisma للتعامل مع قاعدة البيانات
- جميع العمليات المعقدة تستخدم Transactions لضمان سلامة البيانات
- تم تضمين error handling في جميع الـ endpoints
- المستخدمون: تم استخدام hash بسيط للباسوورد (يُنصح باستخدام bcrypt في الإنتاج)
- الفواتير الإلكترونية: الربط مع ZATCA معد لكن يحتاج implementation فعلي
