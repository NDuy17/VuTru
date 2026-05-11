/**
 * @fileoverview Global constants for the VuTru Solar System application
 * Centralized definitions for colors, sizes, animations, and UI strings
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

/** Primary background color */
export const COLORS = {
  BACKGROUND: '#0a0e27',
  PRIMARY_CYAN: '#00d4ff',
  SECONDARY_CYAN: '#9fd6ff',
  WARNING_ORANGE: '#ffc266',
  SUCCESS_GREEN: '#00ff00',
  ERROR_RED: '#ff4444',
  TEXT_MUTED: '#666666',
  BORDER_DARK: '#1a1a2e',
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const FONT_SIZES = {
  HEADING_LARGE: 24,
  HEADING: 20,
  SUBHEADING: 16,
  BODY: 14,
  CAPTION: 12,
  TINY: 10,
};

export const FONT_WEIGHTS = {
  BOLD: 'bold',
  SEMIBOLD: '600',
  NORMAL: 'normal',
  LIGHT: '300',
};

// ============================================================================
// SPACING
// ============================================================================

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
  XXL: 32,
};

// ============================================================================
// PLANET & CELESTIAL SIZING
// ============================================================================

export const PLANET_SIZING = {
  MIN_VISUAL_SIZE: 18,
  MAX_VISUAL_SIZE: 110,
  SIZE_SCALE_FACTOR: 0.52,
  MIN_MOON_SIZE: 5,
  MOON_RATIO_FACTOR: 0.72,
  MAX_MOON_RATIO: 0.2,
  SUN_GLOW_SCALE: 1.8,
  SUN_GLOW_OFFSET: 0.4,
};

// ============================================================================
// ANIMATION & INTERACTION
// ============================================================================

export const ANIMATION = {
  // Frame rates (FPS)
  SYSTEM_VIEW_FPS: 10,
  FOCUSED_VIEW_FPS: 25,
  DEFAULT_DURATION: 300,
  
  // Pan/rotation sensitivity
  ROTATION_SENSITIVITY_SINGLE: 0.006,
  ROTATION_SENSITIVITY_FOCUSED: 0.004,
  ROTATION_FOCUSED_PLANET: 0.02,
  ZOOM_SENSITIVITY: 0.003,
  
  // Rotation boundaries
  ROTATION_MIN_X: -Math.PI / 2.5,
  ROTATION_MAX_X: Math.PI / 2.5,
  ROTATION_MIN_ZOOM: 0.1,
  ROTATION_MAX_ZOOM: 10,
  
  // Default rotation state
  DEFAULT_ROTATION_X: 0.4,
  DEFAULT_ROTATION_Y: 1.2,
  DEFAULT_ZOOM: 0.6,
};

// ============================================================================
// STATUS STRINGS
// ============================================================================

export const FETCH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
};

// ============================================================================
// UI MESSAGES
// ============================================================================

export const MESSAGES = {
  LOADING_DATA: 'Đang tải dữ liệu từ MongoDB...',
  SOLAR_SYSTEM_TITLE: 'Hệ Mặt Trời',
  API_ERROR: 'Không kết nối được API MongoDB, đang dùng dữ liệu local.',
  DEFAULT_ERROR: 'Lỗi không xác định',
  RETRY: 'Thử lại',
  CLOSE: 'Đóng',
  ERROR_LOADING_PLANETS: 'Lỗi khi tải dữ liệu hành tinh',
};

// ============================================================================
// PLANET NAMES
// ============================================================================

export const PLANET_NAMES = {
  ENGLISH: {
    SUN: 'sun',
    MERCURY: 'mercury',
    VENUS: 'venus',
    EARTH: 'earth',
    MARS: 'mars',
    JUPITER: 'jupiter',
    SATURN: 'saturn',
    URANUS: 'uranus',
    NEPTUNE: 'neptune',
    MOON: 'moon',
  },
  VIETNAMESE: {
    SUN: 'Mặt Trời',
    MERCURY: 'Thủy Tinh',
    VENUS: 'Kim Tinh',
    EARTH: 'Trái Đất',
    MARS: 'Hỏa Tinh',
    JUPITER: 'Mộc Tinh',
    SATURN: 'Thổ Tinh',
    URANUS: 'Thiên Vương Tinh',
    NEPTUNE: 'Hải Vương Tinh',
    MOON: 'Mặt Trăng',
  },
};

// ============================================================================
// EXTERNAL RESOURCES
// ============================================================================

export const RESOURCES = {
  EARTH_CONTINENTS_MAP: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Equirectangular_projection_world_map_without_borders.svg/2560px-Equirectangular_projection_world_map_without_borders.svg.png',
  EARTH_COUNTRIES_MAP: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/World_location_map_%28equirectangular_180%29.svg/2560px-World_location_map_%28equirectangular_180%29.svg.png',
  ASIA_MAP: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Asia_location_map.svg/1024px-Asia_location_map.svg.png',
  EUROPE_MAP: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Europe_location_map.svg/1024px-Europe_location_map.svg.png',
};

// ============================================================================
// REGEX PATTERNS
// ============================================================================

export const PATTERNS = {
  DIGITS_ONLY: /[^0-9]/g,
};

// ============================================================================
// TIMINGS
// ============================================================================

export const TIMINGS = {
  INTERACTION_DEBOUNCE: 150,
  ANIMATION_FRAME_RATE: 1000 / 60, // 60 FPS reference
  DEFAULT_DURATION: 300,
};

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_URLS = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000',
  PLANETS: '/api/planets',
};

// ============================================================================
// ORBIT RADII
// ============================================================================

export const ORBIT_RADII = {
  MERCURY: 40,
  VENUS: 60,
  EARTH: 80,
  MARS: 100,
  JUPITER: 140,
  SATURN: 180,
  URANUS: 220,
  NEPTUNE: 260,
};

