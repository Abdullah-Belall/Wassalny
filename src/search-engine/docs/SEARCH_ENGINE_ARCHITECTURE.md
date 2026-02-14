# Search Engine – آلية العمل (Architecture)

## نظرة عامة

الـ **Search Engine** خدمة موحّدة للبحث والفلترة في كل الـ entities في النظام. بدل ما كل module يعمل endpoints بحث خاصة بيه، الـ client يرسل طلب واحد لـ `POST /search-engine` ويحدّد الـ **entity** اللي عايز يبحث فيها والـ **query** (شروط الفلترة).

---

## مكونات الطلب (Request)

| الحقل | النوع | الوصف |
|--------|------|--------|
| `entity` | string | اسم الـ entity: `travels` \| `cars` \| `reviews` \| `users` \| `travels_passengers` \| `images` |
| `query` | string (JSON) | مصفوفة من شروط البحث (انظر الصيغة تحت) |
| `add_select` | string (JSON, optional) | مصفوفة أعمدة إضافية تُضاف للـ select |
| `order_by_column` | string (optional) | عمود للترتيب (مثال: `travel.start_time`) |
| `order_by_order` | `'ASC' \| 'DESC'` (optional) | اتجاه الترتيب |

---

## صيغة الـ Query

الـ `query` عبارة عن **JSON string** لمصفوفة عناصر، كل عنصر يمثّل شرط فلترة واحد:

```json
[
  {
    "column": "travel.status",
    "condition": "= :status",
    "key": "status",
    "value": "pending"
  },
  {
    "column": "car.seats_count",
    "condition": ">= :seats_count",
    "key": "seats_count",
    "value": 4
  }
]
```

- **column**: العمود في الـ query (يستخدم الـ **alias** اللي مذكور في docs الـ entities، مثل `travel.status`, `car.seats_count`).
- **condition**: تعبير SQL للشرط مع placeholder مثل `= :key` أو `LIKE :key` أو `IN (:...key)`.
- **key**: اسم الـ parameter (يُربط مع `value`).
- **value**: القيمة (string, number, boolean, أو array للـ IN).

**ملاحظات:**

- أي عنصر ناقص فيه `column` أو `condition` أو `key` أو `value === undefined` أو `value === '%%'` يتم تجاهله.
- الـ **column** لازم يكون بالـ alias الصحيح (مثلاً `travel.id` وليس جدول الـ DB مباشرة). راجع ملف **SEARCH_ENGINE_ENTITIES_KEYS.md** لكل entity والـ keys/aliases المتاحة.

---

## آلية التنفيذ (Flow)

1. **استقبال الطلب**: الـ controller يستقبل الـ body ويستدعي `searchEngine(entity, query, add_select, order_by)`.
2. **تحويل الـ query**: تحويل الـ `query` من JSON string إلى مصفوفة وعناصرها هي الشروط.
3. **الحصول على الـ QueryBuilder**: استدعاء `getQB(entity)`:
   - لو الـ entity معروفة، يتم إرجاع **QueryBuilder** جاهز مع كل الـ **leftJoin** المطلوبة لهذه الـ entity (علاقاتها مع الـ cars, users, images, إلخ).
   - لو الـ entity غير معروفة، يرجع `null` ويُرمى `BadRequestException('Not found Entity')`.
4. **تطبيق الشروط**: لكل شرط في الـ `filteredQueries` يتم استدعاء `qb.andWhere(column + condition, { [key]: value })`.
5. **تطبيق الـ add_select**: لو وُجد `add_select`، يتم parse الـ JSON وإضافة الأعمدة المطلوبة للـ select.
6. **الترتيب**: لو وُجد `order_by.column`، يتم الترتيب حسب `length(column::text)` ثم حسب `column::text` بالاتجاه المحدد.
7. **تنفيذ الاستعلام**: `qb.getManyAndCount()` ثم إرجاع `{ data, total }`.

بهذا الشكل الـ Search Engine يدعم البحث في **أي entity** مع **علاقاتها (joins)** بدون تكرار كود البحث في كل module، والـ client يتحكم في الـ entity والـ filters والـ order من مكان واحد.

---

## الـ Entities المدعومة

- `travels`
- `cars`
- `reviews`
- `users`
- `travels_passengers`
- `images`

للتفاصيل: أسماء الـ aliases (keys) والأعمدة المتاحة لكل entity راجع **SEARCH_ENGINE_ENTITIES_KEYS.md**.
