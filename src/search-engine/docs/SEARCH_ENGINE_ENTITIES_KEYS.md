# Search Engine – Entity Keys & Aliases

كل entity لها **alias** رئيسي وعلاقات (joins) بأسماء ثابتة. في الـ **query** تستخدم هذه الأسماء في حقل **column** (مثال: `travel.id`, `car.seats_count`).

---

## 1. travels entity

| Relation path | Alias (key) |
|---------------|-------------|
| (root) | `travel` |
| travel.car | `car` |
| travel.car.images | `images` |
| travel.car.driver | `driver` |
| travel.car.driver.user | `driver_user` |
| travel.reviews | `reviews` |
| travel.travel_passengers | `travel_passengers` |
| travel_passengers.passenger | `passenger` |
| passenger.user | `passenger_user` |

**أمثلة أعمدة:** `travel.id`, `travel.status`, `travel.start_time`, `travel.start_location`, `travel.end_location`, `travel.details`, `travel.available_seats`, `travel.price_per_seat`, `travel.duration_by_minutes`, `travel.created_at`, `travel.updated_at`, `car.id`, `car.seats_count`, `car.car_type`, `car.color`, `car.licence`, `driver_user.id`, `driver_user.phone`, `driver_user.user_name`, إلخ.

---

## 2. cars entity

| Relation path | Alias (key) |
|---------------|-------------|
| (root) | `car` |
| car.images | `images` |
| car.driver | `driver` |
| car.driver.user | `driver_user` |
| car.travels | `travels` |

**أمثلة أعمدة:** `car.id`, `car.seats_count`, `car.car_type`, `car.color`, `car.licence`, `car.created_at`, `car.updated_at`, `driver_user.id`, `driver_user.phone`, `driver_user.user_name`, `images.id`, `images.image_url`, إلخ.

---

## 3. reviews entity

| Relation path | Alias (key) |
|---------------|-------------|
| (root) | `review` |
| review.travel | `travel` |
| travel.car | `car` |
| car.driver | `driver` |
| car.driver.user | `driver_user` |

**أمثلة أعمدة:** `review.id`, `review.index`, `review.review`, `review.rate`, `review.type`, `review.created_at`, `review.updated_at`, `travel.id`, `travel.status`, `car.id`, `driver_user.id`, إلخ.

---

## 4. users entity

| Relation path | Alias (key) |
|---------------|-------------|
| (root) | `user` |
| user.driver_ext | `driver_ext` |
| user.passenger_ext | `passenger_ext` |

**أمثلة أعمدة:** `user.id`, `user.index`, `user.user_name`, `user.avatar`, `user.phone`, `user.type`, `user.created_at`, `user.updated_at`, `driver_ext.id`, `passenger_ext.id`, إلخ.

---

## 5. travels_passengers entity

| Relation path | Alias (key) |
|---------------|-------------|
| (root) | `travel_passenger` |
| travel_passenger.travel | `travel` |
| travel_passenger.passenger | `passenger` |
| passenger.user | `passenger_user` |
| travel.car | `car` |
| car.driver | `driver` |
| car.driver.user | `driver_user` |

**أمثلة أعمدة:** `travel_passenger.id`, `travel_passenger.status`, `travel_passenger.total_price`, `travel_passenger.deposit`, `travel_passenger.start_time`, `travel_passenger.start_location`, `travel_passenger.end_location`, `travel.id`, `passenger_user.id`, `passenger_user.phone`, `car.id`, `driver_user.id`, إلخ.

---

## 6. images entity

| Relation path | Alias (key) |
|---------------|-------------|
| (root) | `image` |
| image.car | `car` |
| car.driver | `driver` |
| car.driver.user | `driver_user` |

**أمثلة أعمدة:** `image.id`, `image.image_url`, `image.created_at`, `image.updated_at`, `car.id`, `car.seats_count`, `car.car_type`, `driver_user.id`, إلخ.

---

## ملاحظة

- الـ **column** في الـ query لازم يبدأ بـ **alias** صحيح (مثل `travel.status` وليس اسم الجدول في DB).
- الـ **value** في الـ query يربط بالـ **key**؛ الـ **key** يفضل يكون نفس اسم العمود أو اسم واضح للـ parameter (مثل `status`, `seats_count`).
