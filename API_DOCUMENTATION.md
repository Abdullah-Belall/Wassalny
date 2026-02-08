# API Documentation — Wassalnii Backend

**Base URL:** `/api`  
**Content-Type:** `application/json`  
**Auth:** Protected endpoints use cookie `access_token` (JWT, httpOnly)

---

## 1. Users — `/api/users`

### 1.1 Register
| | |
|---|---|
| **Method** | `POST` |
| **Endpoint** | `/api/users/register` |
| **Auth** | ❌ لا يحتاج |

**Request Body:**
```json
{
  "type": "Driver" | "Passenger",
  "phone": "string (min 10 chars)",
  "password": "string (8-16 chars)"
}
```

**Response:** نفس شكل Login (يتم تسجيل الدخول تلقائياً)
```json
{
  "done": true,
  "user": {
    "id": "uuid",
    "index": 0,
    "phone": "string",
    "type": "Driver" | "Passenger",
    "created_at": "ISO date",
    "updated_at": "ISO date"
  }
}
```
+ يُضبط cookie: `access_token`

---

### 1.2 Login
| | |
|---|---|
| **Method** | `POST` |
| **Endpoint** | `/api/users/login` |
| **Auth** | ❌ لا يحتاج |

**Request Body:**
```json
{
  "phone": "string (min 10 chars)",
  "password": "string (8-16 chars)"
}
```

**Response:**
```json
{
  "done": true,
  "user": {
    "id": "uuid",
    "index": 0,
    "phone": "string",
    "type": "Driver" | "Passenger",
    "created_at": "ISO date",
    "updated_at": "ISO date"
  }
}
```
+ يُضبط cookie: `access_token`

---

### 1.3 Logout
| | |
|---|---|
| **Method** | `POST` |
| **Endpoint** | `/api/users/logout` |
| **Auth** | ✅ مطلوب (Cookie) |

**Request Body:** لا يوجد

**Response:**
```json
{
  "done": true
}
```

---

### 1.4 Get My Profile
| | |
|---|---|
| **Method** | `GET` |
| **Endpoint** | `/api/users/profile` |
| **Auth** | ✅ مطلوب |

**Request Body:** لا يوجد

**Response:**
```json
{
  "id": "uuid",
  "index": 0,
  "phone": "string",
  "type": "Driver" | "Passenger",
  "created_at": "ISO date",
  "updated_at": "ISO date"
}
```

---

### 1.5 Change Password (مع معرفة كلمة السر الحالية)
| | |
|---|---|
| **Method** | `PATCH` |
| **Endpoint** | `/api/users/password` |
| **Auth** | ✅ مطلوب |

**Request Body:**
```json
{
  "current_password": "string (8-16 chars)",
  "new_password": "string (8-16 chars)"
}
```

**Response:**
```json
{
  "done": true
}
```

---

### 1.6 Reset Password (نسيت كلمة السر)
| | |
|---|---|
| **Method** | `PATCH` |
| **Endpoint** | `/api/users/reset-password` |
| **Auth** | ❌ لا يحتاج |

**Request Body:**
```json
{
  "phone": "string (min 10 chars)",
  "new_password": "string (8-16 chars)"
}
```

**Response:**
```json
{
  "done": true
}
```

---

### 1.7 Get User Profile by ID
| | |
|---|---|
| **Method** | `GET` |
| **Endpoint** | `/api/users/:id/profile` |
| **Auth** | ✅ مطلوب |

**Path Params:** `id` — UUID المستخدم

**Request Body:** لا يوجد

**Response:**
```json
{
  "id": "uuid",
  "index": 0,
  "phone": "string",
  "type": "Driver" | "Passenger",
  "created_at": "ISO date",
  "updated_at": "ISO date"
}
```

---

## 2. Cars — `/api/cars`

### 2.1 Create Car
| | |
|---|---|
| **Method** | `POST` |
| **Endpoint** | `/api/cars` |
| **Auth** | ❌ (حسب تطبيقك قد تحتاج حماية لاحقاً) |

**Request Body:**
```json
{
  "images_json": "string (valid JSON)",
  "driver_id": "uuid",
  "car_type": "string",
  "color": "string",
  "licence": "string",
  "seats_count": 0
}
```

**Response:** كائن السيارة المُنشأة (مثل الـ entity)

---

### 2.2 Get All Cars
| | |
|---|---|
| **Method** | `GET` |
| **Endpoint** | `/api/cars` |
| **Auth** | ❌ |

**Request Body:** لا يوجد

**Response:** مصفوفة سيارات

---

### 2.3 Get Cars by User ID
| | |
|---|---|
| **Method** | `GET` |
| **Endpoint** | `/api/cars/user/:userId` |
| **Auth** | ❌ |

**Path Params:** `userId` — UUID السائق

**Request Body:** لا يوجد

**Response:** مصفوفة سيارات لهذا المستخدم

---

### 2.4 Get Car by ID
| | |
|---|---|
| **Method** | `GET` |
| **Endpoint** | `/api/cars/:id` |
| **Auth** | ❌ |

**Path Params:** `id` — UUID السيارة

**Request Body:** لا يوجد

**Response:** كائن السيارة

---

### 2.5 Update Car
| | |
|---|---|
| **Method** | `PATCH` |
| **Endpoint** | `/api/cars/:id` |
| **Auth** | ❌ |

**Path Params:** `id` — UUID السيارة

**Request Body:** (كل الحقول اختيارية — Partial)
```json
{
  "images_json": "string (optional)",
  "driver_id": "uuid (optional)",
  "car_type": "string (optional)",
  "color": "string (optional)",
  "licence": "string (optional)",
  "seats_count": 0
}
```

**Response:** كائن السيارة المُحدَّث

---

## 3. Travels — `/api/travels`

### 3.1 Create Travel
| | |
|---|---|
| **Method** | `POST` |
| **Endpoint** | `/api/travels` |
| **Auth** | ❌ |

**Request Body:**
```json
{
  "car_id": "uuid",
  "details": "string",
  "start_time": "ISO date string",
  "start_location": "string",
  "end_location": "string",
  "duration_by_minutes": 0,
  "available_seats": 0,
  "price_per_seat": 0
}
```

**Response:** كائن الرحلة المُنشأة

---

### 3.2 Get All Travels
| | |
|---|---|
| **Method** | `GET` |
| **Endpoint** | `/api/travels` |
| **Auth** | ❌ |

**Request Body:** لا يوجد

**Response:** مصفوفة رحلات

---

### 3.3 Search Travels
| | |
|---|---|
| **Method** | `GET` |
| **Endpoint** | `/api/travels/search` |
| **Auth** | ❌ |

**Query Params (كلها اختيارية):**
| Param | Type | Description |
|-------|------|-------------|
| `start_location` | string | نقطة الانطلاق |
| `end_location` | string | نقطة الوصول |
| `start_time_from` | ISO date string | من تاريخ/وقت |
| `start_time_to` | ISO date string | إلى تاريخ/وقت |

**Example:** `GET /api/travels/search?start_location=Cairo&end_location=Alex&start_time_from=2025-02-01`

**Request Body:** لا يوجد

**Response:** مصفوفة رحلات مطابقة للبحث

---

### 3.4 Get Travels by Driver
| | |
|---|---|
| **Method** | `GET` |
| **Endpoint** | `/api/travels/driver/:driverUserId` |
| **Auth** | ❌ |

**Path Params:** `driverUserId` — UUID السائق

**Request Body:** لا يوجد

**Response:** مصفوفة رحلات لهذا السائق

---

### 3.5 Get Travel by ID
| | |
|---|---|
| **Method** | `GET` |
| **Endpoint** | `/api/travels/:id` |
| **Auth** | ❌ |

**Path Params:** `id` — UUID الرحلة

**Request Body:** لا يوجد

**Response:** كائن الرحلة

---

### 3.6 Update Travel
| | |
|---|---|
| **Method** | `PATCH` |
| **Endpoint** | `/api/travels/:id` |
| **Auth** | ✅ (يُتحقق من أن المستخدم الحالي مسموح له) |

**Path Params:** `id` — UUID الرحلة (travel_id)

**Request Body:** (كل الحقول اختيارية)
```json
{
  "car_id": "uuid (optional)",
  "details": "string (optional)",
  "start_time": "ISO date (optional)",
  "start_location": "string (optional)",
  "end_location": "string (optional)",
  "duration_by_minutes": 0,
  "available_seats": 0,
  "price_per_seat": 0
}
```

**Response:** كائن الرحلة المُحدَّث

---

### 3.7 Update Travel Status
| | |
|---|---|
| **Method** | `PATCH` |
| **Endpoint** | `/api/travels/:id/status` |
| **Auth** | ✅ |

**Path Params:** `id` — UUID الرحلة

**Request Body:**
```json
{
  "status": "Started" | "In Progress" | "Accident" | "Malfunction" | "Finished" | "Cancelled"
}
```
(لا يُسمح بـ: Pending, Fully Booked, Booking)

**Response:** كائن الرحلة بعد تحديث الحالة

---

## 4. Travels Passengers — `/api/travels-passengers`

### 4.1 Create Booking (طلب ركوب)
| | |
|---|---|
| **Method** | `POST` |
| **Endpoint** | `/api/travels-passengers` |
| **Auth** | ✅ مطلوب |

**Request Body:**
```json
{
  "travel_id": "uuid",
  "passenger_id": "uuid",
  "deposit": 0
}
```

**Response:** كائن الحجز (travel_passenger)

---

### 4.2 Get My Passenger Travels
| | |
|---|---|
| **Method** | `GET` |
| **Endpoint** | `/api/travels-passengers/passenger/me` |
| **Auth** | ✅ مطلوب |

**Request Body:** لا يوجد

**Response:** مصفوفة رحلات الراكب الحالي

---

### 4.3 Get Booking Requests (للسائق)
| | |
|---|---|
| **Method** | `GET` |
| **Endpoint** | `/api/travels-passengers/booking-requests` |
| **Auth** | ✅ مطلوب |

**Request Body:** لا يوجد

**Response:** مصفوفة طلبات الحجز للمستخدم الحالي (سائق)

---

### 4.4 Passenger: Update Booking Status
| | |
|---|---|
| **Method** | `PATCH` |
| **Endpoint** | `/api/travels-passengers/:id/status` |
| **Auth** | ✅ مطلوب |

**Path Params:** `id` — UUID سجل الـ travel_passenger

**Request Body:**
```json
{
  "status": "Pending" | "Driver Accept" | "Driver Reject" | "Passenger Cancelled Before Pay" | "Paid" | "Passenger Cancelled After Pay" | "Started" | "In Progress" | "Accident" | "Malfunction" | "Finished"
}
```

**Response:** كائن الحجز المُحدَّث

---

### 4.5 Driver: Update Passenger Booking Status
| | |
|---|---|
| **Method** | `PATCH` |
| **Endpoint** | `/api/travels-passengers/:id/status/driver` |
| **Auth** | ✅ مطلوب |

**Path Params:** `id` — UUID سجل الـ travel_passenger

**Request Body:**
```json
{
  "status": "Pending" | "Driver Accept" | "Driver Reject" | ...
}
```

**Response:** كائن الحجز المُحدَّث

---

### 4.6 Pay to Confirm (تأكيد الدفع)
| | |
|---|---|
| **Method** | `PATCH` |
| **Endpoint** | `/api/travels-passengers/:id/pay-to-confirm` |
| **Auth** | ✅ مطلوب |

**Path Params:** `id` — UUID سجل الـ travel_passenger

**Request Body:** لا يوجد

**Response:** نتيجة العملية

---

### 4.7 Remove Passenger from Travel
| | |
|---|---|
| **Method** | `DELETE` |
| **Endpoint** | `/api/travels-passengers/:id` |
| **Auth** | ✅ مطلوب |

**Path Params:** `id` — UUID سجل الـ travel_passenger

**Request Body:** لا يوجد

**Response:** نتيجة الحذف

---

## 5. Images — `/api/images`

حالياً لا توجد endpoints معرّفة في الـ controller (فارغ).

---

## Enums مرجعية

### UserTypeEnum
- `Driver`
- `Passenger`

### TravelStatusEnum
- `Pending`, `Booking`, `Fully Booked`, `Started`, `In Progress`, `Accident`, `Malfunction`, `Finished`, `Cancelled`

### TravelPassengerStatusEnum
- `Pending`, `Driver Accept`, `Driver Reject`, `Passenger Cancelled Before Pay`, `Paid`, `Passenger Cancelled After Pay`, `Started`, `In Progress`, `Accident`, `Malfunction`, `Finished`

---

## ملاحظات عامة

- الـ **Auth** يعتمد على cookie باسم `access_token` (JWT). تأكد إرسال الطلبات مع `credentials: 'include'` إذا كنت من فرونت اند.
- الـ **Validation** يرفض أي حقل غير معرّف في الـ DTO (`forbidNonWhitelisted: true`).
- أي خطأ من السيرفر يُرجع بشكل نموذجي من Nest (مثل `NotFoundException`, `ForbiddenException`) مع رسالة مناسبة وكود HTTP مناسب.
