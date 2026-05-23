# ROOMIFY Frontend

ROOMIFY is an online PG, hostel, and room booking web application. This frontend is built with React and connects to the ROOMIFY backend API for authentication, room listings, bookings, admin room management, image uploads, and dealer verification.

## Features
<img width="1920" height="1080" alt="Screenshot (39)" src="https://github.com/user-attachments/assets/a4907bc4-20ca-4c7e-9d26-d846c488ad93" />
<img width="1903" height="912" alt="Screenshot 2026-05-23 161455" src="https://github.com/user-attachments/assets/1d1275e5-3a19-43b0-b23e-c7728cb12b43" />

- User registration and login
- JWT-based authentication
- Room listing page
- Search and filter rooms by location, category, and price
- Room details page
- Auto price calculation based on check-in and check-out dates
- Booking system
- My bookings page
- Admin dashboard
- Add room form
- Edit room details
- Multiple room image upload
- Verified dealer details

## Tech Stack

- React
- Vite
- React Router DOM
- Axios
- CSS / Inline Styling
- Cloudinary image support through backend upload flow

## Folder Structure

```txt
frontend/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── RoomCard.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── RoomDetails.jsx
│   │   ├── MyBookings.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AddRoom.jsx
│   │   └── EditRoom.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
└── README.md
```

## Installation

```bash
cd frontend
npm install
```

## Run Frontend

```bash
npm run dev
```

Frontend will run at:

```txt
http://localhost:5173
```

## Environment Variables

If you are uploading images directly from frontend to Cloudinary, create a `.env` file in the frontend folder:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

If image upload is handled by backend, frontend Cloudinary env variables are not required.

After changing `.env`, restart frontend:

```bash
npm run dev
```

## API Configuration

The API base URL is configured in:

```txt
src/services/api.js
```

Example:

```js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
```

## Authentication Flow

1. User logs in.
2. Backend returns JWT token.
3. Token is saved in localStorage.
4. Axios sends token automatically with protected API requests.
5. Protected pages and booking routes work only for logged-in users.

## Booking Flow

1. User opens room details page.
2. User selects check-in and check-out dates.
3. Total days are calculated automatically.
4. Total price is calculated using:

```txt
total days × room price
```

5. If user is not logged in, they are redirected to login.
6. After login, user returns to the same room page.

## Admin Features

Admin can:

- View all bookings
- View all rooms
- Add rooms
- Edit room details
- Delete rooms
- Add verified dealer details
- Upload multiple room images

## Important Notes

- Make sure backend is running before using the frontend.
- Make sure the backend URL in `api.js` is correct.
- If booking shows "No token provided", login again and check localStorage.
- If images do not show, check whether room data contains `image` or `images` fields.

## Build for Production

```bash
npm run build
```

## Deployment

Recommended frontend deployment:

- Vercel
- Netlify

Before deployment, update API base URL in `api.js` to the deployed backend URL.
