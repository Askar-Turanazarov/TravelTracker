// ===================== Auth =====================
export interface User {
  id: string
  email: string
  display_name: string
  role: 'traveler' | 'admin'
  created_at?: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  expires_in: number // 900
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  display_name: string
}

// ===================== Reference =====================
export interface CountryReference {
  code: string // "FR"
  name_en: string
  name_ru: string
  region: string // "Europe"
}

export interface CityReference {
  id: number
  name: string
  latitude: number
  longitude: number
}

// ===================== Visited =====================
export interface VisitedCountry {
  id: string
  country_code: string
  name_en: string
  added_at: string
}

export interface VisitedCity {
  id: string
  city_id: number
  name: string
  country_code: string
  latitude: number
  longitude: number
  visit_date: string | null // "YYYY-MM-DD"
  note: string | null
  created_at: string
  updated_at: string
}

export interface AddVisitedCityPayload {
  city_id: number
  visit_date?: string | null
  note?: string | null
}

export interface UpdateVisitedCityPayload {
  visit_date?: string | null
  note?: string | null
}

// ===================== Dashboard =====================
export interface RegionBreakdown {
  region: string
  count: number
}

export interface LatestVisit {
  city_name: string
  country_code: string
  visit_date: string | null
}

export interface DashboardStats {
  total_countries_visited: number
  total_cities_visited: number
  world_percentage: number
  countries_by_region: RegionBreakdown[]
  latest_visits: LatestVisit[]
}

// ===================== Admin =====================
export interface AdminUser {
  id: string
  email: string
  display_name: string
  countries_count: number
  cities_count: number
  created_at: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

// ===================== API Response =====================
export interface ApiError {
  error: {
    code: string
    message: string
    details: any
  }
}