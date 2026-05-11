# VuTru Solar System

Ứng dụng Expo React Native mô phỏng hệ mặt trời với Redux Toolkit, dữ liệu hành tinh từ backend API, chế độ xem chi tiết hành tinh, mặt trăng và khám phá Trái Đất.

## Cấu trúc dự án

```text
.
├── App.js
├── index.js
├── app.json
├── package.json
├── .github/
│   └── workflows/
│       └── ci.yml
├── assets/
│   └── textures/
├── server/
│   ├── package.json
│   └── src/
└── src/
    ├── components/
    │   ├── CountriesList.js
    │   ├── EarthMapPanel.web.js
    │   ├── SolarSystem.js
    │   ├── SolarSystem3D.js
    │   ├── SolarSystem3D.web.js
    │   ├── common/
    │   │   ├── ErrorScreen.js
    │   │   └── LoadingScreen.js
    │   └── planets/
    │       ├── EarthDetails.js
    │       ├── JupiterDetails.js
    │       ├── MarsDetails.js
    │       ├── MercuryDetails.js
    │       ├── MoonDetails.js
    │       ├── NeptuneDetails.js
    │       ├── PlanetDetails.js
    │       ├── SaturnDetails.js
    │       ├── SunDetails.js
    │       ├── UranusDetails.js
    │       └── VenusDetails.js
    ├── constants/
    │   ├── continentImages.js
    │   └── index.js
    ├── data/
    │   ├── countries/
    │   ├── planets/
    │   └── textures.js
    ├── redux/
    │   ├── slices/
    │   │   └── planetsSlice.js
    │   └── store.js
    ├── screens/
    │   ├── CountriesScreen.js
    │   └── SolarSystemScreen.js
    └── services/
        └── planetsApi.js
```

## Tính năng chính

- Hiển thị hệ mặt trời với animation quỹ đạo và texture cục bộ.
- Redux Toolkit quản lý dữ liệu hành tinh, trạng thái chọn hành tinh, loading và error.
- `fetchPlanets` tải dữ liệu từ backend `/api/planets`.
- Màn hình loading và error có nút "Thử lại".
- Chế độ khám phá Trái Đất với hình SVG data URI cho 7 châu lục, hoạt động không cần internet.
- CI chạy trên Node.js 20 với `npm ci` và `npx expo export --platform web`.

## Chạy ứng dụng

```bash
npm install
npm start
```

Các lệnh khác:

```bash
npm run android
npm run ios
npm run web
```

## Backend API

Ứng dụng đọc dữ liệu hành tinh từ backend trong thư mục `server/`.

```bash
npm run server:install
npm run server:dev
```

API mặc định:

```text
http://localhost:5000/api/planets
```

Có thể override bằng biến môi trường Expo:

```bash
EXPO_PUBLIC_API_URL=http://<host>:5000
```

## Redux

Slice chính nằm tại `src/redux/slices/planetsSlice.js`.

State:

```js
{
  planets: [],
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: null
}
```

Actions:

- `fetchPlanets()`
- `selectPlanet(id)`
- `resetSelection()`
- `setError(message)`
- `clearError()`

## Build kiểm tra

```bash
npx expo export --platform web
```
