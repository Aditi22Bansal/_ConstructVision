// This file outlines the MongoDB schema structure for the application

// Safety incident schema
export interface SafetyIncident {
  id: string
  type: string
  zone: string
  timestamp: Date
  worker?: string
  description: string
  severity: "high" | "medium" | "low"
  status: "Pending" | "Investigating" | "Resolved"
  images?: string[]
  resolvedBy?: string
  resolvedAt?: Date
  location: {
    x: number
    y: number
    z: number
  }
}

// Construction zone schema
export interface ConstructionZone {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "planned"
  safetyScore: number
  workers: string[]
  supervisors: string[]
  startDate: Date
  endDate?: Date
  location: {
    coordinates: number[][]
    type: "Polygon"
  }
}

// Material inventory schema
export interface Material {
  id: string
  name: string
  description: string
  quantity: number
  unit: string
  threshold: number
  supplier: string
  lastDelivery?: Date
  nextDelivery?: Date
  location: string
  price: number
  category: string
}

// Material order schema
export interface MaterialOrder {
  id: string
  materials: {
    materialId: string
    quantity: number
    unitPrice: number
  }[]
  supplier: string
  orderDate: Date
  expectedDelivery: Date
  status: "pending" | "shipped" | "delivered" | "cancelled"
  totalPrice: number
  orderedBy: string
  deliveryAddress: string
  notes?: string
}

// Worker schema
export interface Worker {
  id: string
  name: string
  role: string
  contactInfo: {
    phone: string
    email: string
  }
  certifications: string[]
  assignedZone: string
  status: "active" | "inactive"
  ppeCompliance: {
    helmet: boolean
    vest: boolean
    boots: boolean
    gloves: boolean
  }
  startDate: Date
}

// Weather data schema
export interface WeatherData {
  timestamp: Date
  temperature: number
  conditions: string
  windSpeed: number
  precipitation: number
  humidity: number
  pressure: number
  alerts?: {
    type: string
    severity: string
    description: string
    expires: Date
  }[]
}

// Site progress schema
export interface SiteProgress {
  date: Date
  overallProgress: number
  zoneProgress: {
    zoneId: string
    progress: number
    milestone?: string
  }[]
  notes: string
  updatedBy: string
  images?: string[]
}

// User schema
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "supervisor" | "worker"
  permissions: string[]
  lastLogin?: Date
  createdAt: Date
}

