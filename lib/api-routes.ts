// This file outlines the API routes structure for the backend

// Safety monitoring endpoints
export const safetyRoutes = {
  // Get safety incidents
  getIncidents: "/api/safety/incidents",

  // Report new safety incident
  reportIncident: "/api/safety/incidents",

  // Get safety compliance by zone
  getZoneCompliance: "/api/safety/zones",

  // Get PPE compliance data
  getPPECompliance: "/api/safety/ppe-compliance",

  // Get safety score
  getSafetyScore: "/api/safety/score",
}

// Inventory management endpoints
export const inventoryRoutes = {
  // Get all materials
  getMaterials: "/api/inventory/materials",

  // Get specific material
  getMaterial: (id: string) => `/api/inventory/materials/${id}`,

  // Update material stock
  updateStock: "/api/inventory/stock",

  // Get pending deliveries
  getDeliveries: "/api/inventory/deliveries",

  // Create new order
  createOrder: "/api/inventory/orders",
}

// Digital twin endpoints
export const digitalTwinRoutes = {
  // Get BIM model data
  getBIMModel: "/api/digital-twin/model",

  // Get site progress data
  getSiteProgress: "/api/digital-twin/progress",

  // Get weather data
  getWeather: "/api/digital-twin/weather",

  // Get alerts
  getAlerts: "/api/digital-twin/alerts",
}

// User management endpoints
export const userRoutes = {
  // Authenticate user
  login: "/api/auth/login",

  // Register new user
  register: "/api/auth/register",

  // Get user profile
  getProfile: "/api/users/profile",

  // Update user profile
  updateProfile: "/api/users/profile",
}

