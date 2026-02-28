# API Documentation — Selected Endpoints

Base URL: `/api`

All endpoints that require authentication expect the user to be logged in (cookie: `access_token`).  
Responses use standard HTTP status codes.

---

## 1. Users

### 1.1 Update Profile

**`PATCH /api/users/profile`**

Updates the authenticated user's profile. All body fields are optional; send only the fields you want to change.

**Authentication:** Required (`AuthGuard`)

**Request Body:** `UpdateProfileDto`

| Field                | Type   | Required | Validation       | Description                  |
| -------------------- | ------ | -------- | ---------------- | ---------------------------- |
| `user_name`          | string | No       | -                | Display name                 |
| `image_id`           | string | No       | -                | Avatar/image ID              |
| `ssn`                | string | No       | Exactly 14 chars | National ID (SSN)            |
| `driving_license_id` | string | No       | -                | Driving license ID (drivers) |

**Example Request:**

```json
{
  "user_name": "أحمد محمد",
  "image_id": "uuid-here",
  "ssn": "12345678901234",
  "driving_license_id": "license-uuid"
}
```

**Success Response:** `200 OK`

Returns the updated user object (password excluded).

**Error Responses:**

| Status | Description    |
| ------ | -------------- |
| `401`  | Unauthorized   |
| `404`  | User not found |

---

## 2. Travels Passengers

### 2.1 Create Booking (Request to Join Travel)

**`POST /api/travels-passengers`**

Creates a new travel-passenger record (booking request). If the same passenger already has a record for this travel, it will reset/update to Pending instead of creating a duplicate.

**Authentication:** Required (`AuthGuard`)

**Request Body:** `CreateTravelsPassengerDto`

| Field          | Type   | Required | Description                |
| -------------- | ------ | -------- | -------------------------- |
| `travel_id`    | UUID   | Yes      | ID of the travel           |
| `passenger_id` | UUID   | Yes      | ID of the passenger (user) |
| `deposit`      | number | Yes      | Deposit amount             |
| `seats`        | number | Yes      | Number of seats to book    |

**Example Request:**

```json
{
  "travel_id": "550e8400-e29b-41d4-a716-446655440000",
  "passenger_id": "550e8400-e29b-41d4-a716-446655440001",
  "deposit": 0,
  "seats": 2
}
```

**Success Response:** `201 Created` (or appropriate success body from service)

**Error Responses:**

| Status | Description                                                     |
| ------ | --------------------------------------------------------------- |
| `401`  | Unauthorized                                                    |
| `404`  | Travel not found / Passenger not found                          |
| `400`  | Travel not in BOOKING/PENDING; no seats left; validation errors |

---

### 2.2 Driver Update Passenger Status

**`PATCH /api/travels-passengers/:travel_id/status/driver`**

Allows the driver of the travel to accept or reject a passenger's booking request. Only applicable when the travel-passenger status is **Pending**.

**Authentication:** Required (`AuthGuard`)

**Path Parameters:**

| Parameter   | Type | Description      |
| ----------- | ---- | ---------------- |
| `travel_id` | UUID | ID of the travel |

**Request Body:** `DriverUpdateStatusDto`

| Field          | Type | Required | Description                                 |
| -------------- | ---- | -------- | ------------------------------------------- |
| `passenger_id` | UUID | Yes      | ID of the passenger (user) to accept/reject |
| `status`       | enum | Yes      | `"Driver Accept"` or `"Driver Reject"` only |

**Allowed `status` values for this endpoint:**

- `TravelPassengerStatusEnum.DRIVER_ACCEPT` → `"Driver Accept"`
- `TravelPassengerStatusEnum.DRIVER_REJECT` → `"Driver Reject"`

**Example Request:**

```json
{
  "passenger_id": "550e8400-e29b-41d4-a716-446655440001",
  "status": "Driver Accept"
}
```

**Success Response:** `200 OK`

```json
{
  "done": true
}
```

**Business Logic (summary):**

- Validates that `status` is either **Driver Accept** or **Driver Reject**.
- Finds the travel-passenger by `travel_id` and `passenger_id`.
- Ensures current status is **Pending**.
- Ensures the authenticated user is the driver of the travel (via travel → car → driver → user).
- Updates the travel-passenger status.
- If total accepted seats ≥ travel's `available_seats`, updates the travel status to **Fully Booked**.

**Error Responses:**

| Status | Description                                                       |
| ------ | ----------------------------------------------------------------- |
| `400`  | Status is not Driver Accept/Reject; current status is not Pending |
| `401`  | Unauthorized                                                      |
| `404`  | Travel passenger not found                                        |
| `403`  | User is not the driver of this travel                             |

---

## 3. Reviews

### 3.1 Get Reviews for a Travel

**`GET /api/reviews/:travel_id`**

Returns all reviews for a given travel that the current user is allowed to see:

- **Driver:** reviews of the travels they drive (travel → car → driver → user).
- **Passenger:** reviews of the travels they participated in (travel → travel_passengers → passenger → user).

**Authentication:** Required (`AuthGuard`)

**Path Parameters:**

| Parameter   | Type | Description      |
| ----------- | ---- | ---------------- |
| `travel_id` | UUID | ID of the travel |

**Success Response:** `200 OK`

```json
{
  "reviews": [
    /* array of ReviewEntity */
  ],
  "total": 5
}
```

**Error Responses:**

| Status | Description    |
| ------ | -------------- |
| `401`  | Unauthorized   |
| `404`  | User not found |

---

### 3.2 Create Review

**`POST /api/reviews`**

Creates a new review for a travel. Rules:

- **Driver:** can only review **passengers**; `passenger_id` is **required**.
- **Passenger:** can only review **driver** or **car**; `passenger_id` must **not** be sent.
- Passenger must have been in the travel; driver must own the travel.
- One review per (travel, type) for passengers reviewing driver/car.

**Authentication:** Required (`AuthGuard`)

**Request Body:** `CreateReviewDto`

| Field          | Type   | Required    | Validation | Description                                            |
| -------------- | ------ | ----------- | ---------- | ------------------------------------------------------ |
| `travel_id`    | UUID   | Yes         | -          | ID of the travel                                       |
| `review`       | string | Yes         | -          | Review text                                            |
| `rate`         | number | Yes         | 1–5        | Rating (1 to 5)                                        |
| `type`         | enum   | Yes         | See below  | `"Driver"` \| `"Passenger"` \| `"Car"`                 |
| `passenger_id` | UUID   | Conditional | -          | Required when type is `"Passenger"` (driver reviewing) |

**`type` enum (`ReviewTypeEnum`):**

- `"Driver"` — passenger reviews the driver
- `"Passenger"` — driver reviews a passenger
- `"Car"` — passenger reviews the car

**Example Request (passenger reviewing driver):**

```json
{
  "travel_id": "550e8400-e29b-41d4-a716-446655440000",
  "review": "رحلة مريحة وسائق منظم.",
  "rate": 5,
  "type": "Driver"
}
```

**Example Request (driver reviewing passenger):**

```json
{
  "travel_id": "550e8400-e29b-41d4-a716-446655440000",
  "review": "مسافر ملتزم وودود.",
  "rate": 4,
  "type": "Passenger",
  "passenger_id": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Success Response:** `201 Created` (or `200` with body)

```json
{
  "done": true,
  "review": {
    /* saved ReviewEntity */
  }
}
```

**Error Responses:**

| Status | Description                                                                                                           |
| ------ | --------------------------------------------------------------------------------------------------------------------- |
| `400`  | Invalid type for role; passenger_id missing (driver) or sent (passenger); user not in travel; passenger not in travel |
| `401`  | Unauthorized; not driver of travel / not passenger of travel                                                          |
| `404`  | User / travel not found                                                                                               |
| `409`  | Already reviewed this type for this travel (e.g. passenger already reviewed driver/car)                               |

---

### 3.3 Update Review

**`PATCH /api/reviews/:id`**

Updates an existing review. Only `review` text and/or `rate` can be updated (partial update). Authorization:

- **Driver:** can update only **passenger** reviews for travels they drive.
- **Passenger:** can update only **driver** or **car** reviews for travels they were in.

**Authentication:** Required (`AuthGuard`)

**Path Parameters:**

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `id`      | UUID | Review ID   |

**Request Body:** `UpdateReviewDto` (all fields optional; partial of CreateReviewDto)

| Field    | Type   | Required | Validation | Description     |
| -------- | ------ | -------- | ---------- | --------------- |
| `review` | string | No       | -          | New review text |
| `rate`   | number | No       | 1–5        | New rating      |

**Example Request:**

```json
{
  "review": "تقييم محدث: الرحلة كانت ممتازة.",
  "rate": 5
}
```

**Success Response:** `200 OK`

```json
{
  "done": true,
  "review": {
    /* updated ReviewEntity */
  }
}
```

**Error Responses:**

| Status | Description                                                          |
| ------ | -------------------------------------------------------------------- |
| `400`  | Invalid user type                                                    |
| `401`  | Unauthorized; not allowed to update this review (wrong type or role) |
| `404`  | User / review not found                                              |

---

## Summary Table

| Method | Endpoint                                           | Auth | Description                    |
| ------ | -------------------------------------------------- | ---- | ------------------------------ |
| PATCH  | `/api/users/profile`                               | Yes  | Update current user profile    |
| POST   | `/api/travels-passengers`                          | Yes  | Create booking request         |
| PATCH  | `/api/travels-passengers/:travel_id/status/driver` | Yes  | Driver accept/reject passenger |
| GET    | `/api/reviews/:travel_id`                          | Yes  | Get reviews for a travel       |
| POST   | `/api/reviews`                                     | Yes  | Create a review                |
| PATCH  | `/api/reviews/:id`                                 | Yes  | Update a review                |
