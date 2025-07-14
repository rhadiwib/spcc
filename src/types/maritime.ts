// AIS Vessel Data Types
export interface AISVesselData {
  mmsi: number
  timestamp: string
  position: {
    longitude: number
    latitude: number
  }
  navigation: {
    courseOverGround: number
    speedOverGround: number
    heading: number
    rateOfTurn: number
    navigationStatus: NavigationStatus
  }
  vesselInfo: {
    imo: number
    name: string
    callsign: string
    type: VesselType
    dimensions: {
      length: number
      width: number
      draft: number
    }
  }
  destination: string
  eta: string
}

export enum NavigationStatus {
  UnderWay = 0,
  AtAnchor = 1,
  NotUnderCommand = 2,
  RestrictedManeuverability = 3,
  ConstrainedByDraft = 4,
  Moored = 5,
  Aground = 6,
  EngagedInFishing = 7,
  UnderWayUsingSail = 8,
  Reserved = 9,
  Reserved2 = 10,
  Reserved3 = 11,
  Reserved4 = 12,
  Reserved5 = 13,
  AISSearchAndRescue = 14,
  Undefined = 15,
}

export enum VesselType {
  Fishing = 30,
  Tug = 52,
  Passenger = 60,
  Cargo = 70,
  Tanker = 80,
  Pleasure = 37,
}

// Port Operations Types
export interface PortOperationMetrics {
  timestamp: string
  terminalId: string
  vesselProductivity: number
  berthUtilization: number
  yardUtilization: number
  craneUtilization: number
  truckTurnTime: number
  gateMoves: number
  dwellTime: number
  vesselWaitingTime: number
}

// IoT Sensor Data Types
export interface CraneMonitoringData {
  craneId: string
  timestamp: string
  location: {
    latitude: number
    longitude: number
    berth: string
  }
  operational: {
    loadWeight: number
    boomAngle: number
    hookHeight: number
    trolleyPosition: number
    spreaderStatus: 'engaged' | 'disengaged'
  }
  sensors: {
    motorTemperature: number
    hydraulicPressure: number
    vibrationLevel: number
    powerConsumption: number
    windSpeed: number
  }
  maintenance: {
    operatingHours: number
    lastMaintenance: string
    nextMaintenance: string
    healthScore: number
  }
  alerts: Array<{
    type: 'warning' | 'critical' | 'info'
    message: string
    threshold: number
    currentValue: number
  }>
}

// Weather Data Types
export interface WeatherData {
  location: {
    latitude: number
    longitude: number
  }
  timestamp: string
  marineConditions: {
    waveHeight: number
    waveDirection: number
    wavePeriod: number
    swellHeight: number
    swellDirection: number
    swellPeriod: number
    windWaveHeight: number
    windWaveDirection: number
    windWavePeriod: number
  }
  oceanData: {
    seaSurfaceTemperature: number
    seaLevelHeight: number
    oceanCurrentVelocity: number
    oceanCurrentDirection: number
  }
  atmospheric: {
    windSpeed: number
    windDirection: number
    airPressure: number
    visibility: number
    precipitation: number
  }
}

// Dashboard State Types
export interface DashboardState {
  vessels: AISVesselData[]
  portMetrics: PortOperationMetrics
  equipment: CraneMonitoringData[]
  weather: WeatherData
  alerts: Alert[]
  isLoading: boolean
  error: string | null
  lastUpdate: string
}

export interface Alert {
  id: string
  type: 'info' | 'warning' | 'critical'
  title: string
  message: string
  timestamp: string
  acknowledged: boolean
  source: string
}