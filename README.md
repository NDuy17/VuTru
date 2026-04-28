# 🌌 Hệ Mặt Trời - Solar System App

Một ứng dụng React Native về hệ mặt trời được xây dựng theo kiến trúc **Redux**, với animation quỹ đạo các hành tinh xoay quanh mặt trời.

## 📁 Cấu Trúc Dự Án

```
src/
├── redux/
│   ├── slices/
│   │   └── planetsSlice.js      # Redux slice chứa dữ liệu 9 hành tinh
│   └── store.js                  # Redux store configuration
├── components/
│   └── SolarSystem.js            # Component hệ mặt trời với animation
└── screens/
    ├── SolarSystemScreen.js      # Màn hình hiển thị hệ mặt trời
    ├── PlanetDetailScreen.js     # Màn hình chi tiết hành tinh
    └── UniverseScreen.js         # (Cũ - không sử dụng)
```

## ✨ Tính Năng Chính

- **9 Hành tinh**: Thủy Tinh, Kim Tinh, Trái Đất, Hỏa Tinh, Mộc Tinh, Thổ Tinh, Thiên Vương Tinh, Hải Vương Tinh + Mặt Trời
- **🌍 Animation Quỹ Đạo**: Các hành tinh xoay quanh mặt trời theo quỹ đạo thực tế
- **💫 Thông Tin Chi Tiết**:
  - **Khối lượng, đường kính, diện tích, thể tích**
  - **Khí hậu và nhiệt độ**
  - **Đặc biệt cho Trái Đất**: Các vùng địa lý với động vật, văn hóa, ẩm thực
- **Redux State Management**: Quản lý trạng thái hành tinh được chọn
- **Bottom Tab Navigation**: Dễ dàng chuyển đổi giữa hệ mặt trời và chi tiết

## 🚀 Cách Chạy Ứng Dụng

### 1. Cài đặt dependencies:
```bash
npm install
```

### 2. Chạy trên Expo:

**Chạy development server:**
```bash
npm start
```

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

**Web:**
```bash
npm run web
```

## 📚 Redux Architecture

### Store Structure:
```javascript
{
  planets: {
    planets: [
      {
        id: 0,
        name: 'Mặt Trời',
        emoji: '☀️',
        color: '#FFD700',
        isSun: true,
        orbitRadius: 0,
        orbitDuration: 0,
        selected: false
      },
      {
        id: 3,
        name: 'Trái Đất',
        emoji: '🌍',
        color: '#4BADE8',
        mass: '5.972 × 10²⁴ kg',
        diameter: '12,742 km',
        area: '510 triệu km²',
        volume: '1.083 tỷ km³',
        climate: 'Ôn đới với 4 mùa',
        temperature: '-89°C đến 54°C',
        regions: [...],
        orbitRadius: 220,
        orbitDuration: 15000,
        selected: false
      }
      // ... other planets
    ]
  }
}
```

### Redux Actions:
- `selectPlanet(id)`: Chọn một hành tinh
- `deselectPlanet()`: Bỏ chọn hành tinh hiện tại

## 🎨 Styling

Ứng dụng sử dụng React Native StyleSheet với:
- **Màu sắc cosmic**: Dark navy (#0a0e27) và cyan (#00d4ff)
- **Animation**: Animated API để xoay các hành tinh
- **Shadow effects**: Để tạo depth
- **Responsive design**: Tự động điều chỉnh cho các kích thước màn hình khác nhau

## 🔧 Công Nghệ Sử Dụng

- **React Native**: Framework xây dựng mobile app
- **Redux + @reduxjs/toolkit**: State management
- **React Redux**: Binding React với Redux
- **React Navigation**: Navigation giữa các screens
- **Animated API**: Animation xoay quanh
- **Expo**: Platform chạy React Native

## 📝 Hướng Sử Dụng

### Tab 1: 🌌 Hệ Mặt Trời
1. Xem 9 hành tinh xoay quanh mặt trời
2. Các hành tinh quay theo quỹ đạo của nó
3. Chạm vào hành tinh để xem chi tiết

### Tab 2: 📋 Chi Tiết
1. Hiển thị thông tin chi tiết hành tinh đã chọn
2. Xem khối lượng, diện tích, thể tích
3. Xem khí hậu và nhiệt độ
4. **Trái Đất đặc biệt**: Xem các vùng với động vật, văn hóa, ẩm thực
5. Bấm ✕ để bỏ chọn

## 🪐 Các Hành Tinh Có Sẵn

| ID | Hành tinh | Emoji | Loại | Quỹ đạo |
|-----|-----------|-------|------|---------|
| 0 | Mặt Trời | ☀️ | Sao | - |
| 1 | Thủy Tinh | ☿️ | Hành tinh | Gần nhất |
| 2 | Kim Tinh | ♀️ | Hành tinh | - |
| 3 | Trái Đất | 🌍 | Hành tinh | **🌍 Có vùng** |
| 4 | Hỏa Tinh | ♂️ | Hành tinh | - |
| 5 | Mộc Tinh | ♃ | Hành tinh | Khổng lồ |
| 6 | Thổ Tinh | ♄ | Hành tinh | Có vành đai |
| 7 | Thiên Vương Tinh | ♅ | Hành tinh | - |
| 8 | Hải Vương Tinh | ♆ | Hành tinh | Xa nhất |

## 🌍 Các Vùng Trái Đất

**Đông Nam Á**
- Động vật: Voi, Hổ, Khỉ, Chim Paramok
- Văn hóa: Chùa chiền, lễ hội truyền thống
- Ẩm thực: Phở, Pad Thai, Cơm Cà Ri, Bánh mì

**Châu Âu**
- Động vật: Gấu, Sói, Đại Bàng, Nai
- Văn hóa: Lâu đài, nhạc cổ điển
- Ẩm thực: Pizza, Pasta, Bánh mì Pháp, Bia

**Châu Phi**
- Động vật: Sư tử, Hươu cao cổ, Voi Châu Phi, Tê giác
- Văn hóa: Váy Afrika, lễ hội múa
- Ẩm thực: Tajine, Jollof Rice, Ugali, Injera

**Mỹ Latinh**
- Động vật: Sư tử núi, Báo, Lạc đà, Macaw
- Văn hóa: Carnival, Điêu khắc Aztec
- Ẩm thực: Tacos, Ceviche, Chili Con Carne, Chocolate

## 📦 Dependencies

- `react`: 19.1.0
- `react-native`: 0.81.5
- `redux`: Latest
- `react-redux`: Latest
- `@reduxjs/toolkit`: Latest
- `@react-navigation/native`: Latest
- `@react-navigation/bottom-tabs`: Latest
- `expo`: ~54.0.33
- `expo-status-bar`: ~3.0.9
- `react-dom`: 19.1.0
- `react-native-web`: ^0.21.0

## 🤝 Mở Rộng Ứng Dụng

Bạn có thể mở rộng bằng:
- Thêm more animation (zoom, fade, etc.)
- Thêm sound effects khi click hành tinh
- Lưu hành tinh yêu thích vào AsyncStorage
- Thêm camera để chụp ảnh mặt trời
- Tạo quiz về các hành tinh
- Thêm thông tin về các mặt trăng
- Tích hợp NASA API cho dữ liệu thực
