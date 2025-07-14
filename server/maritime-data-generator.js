// Using ES module export syntax - the modern standard
export class MaritimeDataGenerator {
  constructor() {
    // List of realistic vessel names for our maritime simulation
    this.vesselNames = [
      'MAERSK EDINBURGH', 'EVER GIVEN', 'MSC OSCAR', 'OOCL HONG KONG',
      'COSCO SHIPPING UNIVERSE', 'MADRID MAERSK', 'HAPAG EXPRESS',
      'CMA CGM MARCO POLO', 'ATLANTIC SAIL', 'PACIFIC PIONEER'
    ]
    
    // Major port coordinates for realistic vessel positioning
    this.portCoordinates = {
      'LOS_ANGELES': { lat: 33.7362, lng: -118.2632 },
      'SINGAPORE': { lat: 1.2897, lng: 103.8517 },
      'HAMBURG': { lat: 53.5511, lng: 9.9937 },
      'ROTTERDAM': { lat: 51.8985, lng: 4.1250 },
      'SHANGHAI': { lat: 31.2304, lng: 121.4737 }
    }
  }
  
  // Generate realistic AIS vessel data for our maritime dashboard
  generateAISData(count = 50) {
    const vessels = []
    
    for (let i = 0; i < count; i++) {
      // Pick a random port as the base location for this vessel
      const port = Object.values(this.portCoordinates)[i % Object.values(this.portCoordinates).length]
      
      const vessel = {
        mmsi: 200000000 + Math.floor(Math.random() * 99999999), // Maritime Mobile Service Identity
        timestamp: new Date().toISOString(),
        position: {
          // Add some realistic scatter around the port coordinates
          longitude: port.lng + (Math.random() - 0.5) * 0.2,
          latitude: port.lat + (Math.random() - 0.5) * 0.2
        },
        navigation: {
          courseOverGround: Math.random() * 360,        // Direction in degrees
          speedOverGround: Math.random() * 25,          // Speed in knots
          heading: Math.floor(Math.random() * 360),     // Compass heading
          rateOfTurn: Math.floor(Math.random() * 255) - 128, // Rate of turn
          navigationStatus: Math.floor(Math.random() * 16)    // AIS navigation status
        },
        vesselInfo: {
          imo: 9000000 + Math.floor(Math.random() * 999999), // International Maritime Organization number
          name: this.vesselNames[i % this.vesselNames.length],
          callsign: `ABC${i.toString().padStart(3, '0')}`,
          type: this.getRandomVesselType(),
          dimensions: {
            length: 150 + Math.random() * 250,  // Length in meters
            width: 20 + Math.random() * 30,     // Width in meters
            draft: 5 + Math.random() * 10       // Draft in meters
          }
        },
        destination: Object.keys(this.portCoordinates)[Math.floor(Math.random() * Object.keys(this.portCoordinates).length)],
        eta: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().slice(5, 16).replace('T', ' ')
      }
      
      vessels.push(vessel)
    }
    
    return vessels
  }
  
  // Generate realistic port operation metrics
  generatePortMetrics() {
    return {
      timestamp: new Date().toISOString(),
      terminalId: 'TERM-001',
      vesselProductivity: 40 + Math.random() * 20,      // Moves per hour
      berthUtilization: 0.7 + Math.random() * 0.2,     // Percentage as decimal
      yardUtilization: 0.6 + Math.random() * 0.2,      // Percentage as decimal
      craneUtilization: 0.7 + Math.random() * 0.2,     // Percentage as decimal
      truckTurnTime: 20 + Math.random() * 25,           // Minutes
      gateMoves: 2000 + Math.random() * 1000,           // Daily gate moves
      dwellTime: 2 + Math.random() * 3,                 // Days
      vesselWaitingTime: 1 + Math.random() * 3          // Hours
    }
  }
  
  // Generate equipment monitoring data for port cranes
  generateEquipmentData(count = 10) {
    const equipment = []
    
    for (let i = 0; i < count; i++) {
      const healthScore = 0.5 + Math.random() * 0.5
      const alerts = []
      
      // Generate alerts based on equipment health score
      if (healthScore < 0.7) {
        alerts.push({
          type: 'critical',
          message: 'Equipment requires immediate maintenance',
          threshold: 0.7,
          currentValue: healthScore
        })
      } else if (healthScore < 0.85) {
        alerts.push({
          type: 'warning',
          message: 'Schedule maintenance soon',
          threshold: 0.85,
          currentValue: healthScore
        })
      }
      
      equipment.push({
        craneId: `QC-${(i + 1).toString().padStart(3, '0')}`, // Quay Crane identifier
        timestamp: new Date().toISOString(),
        location: {
          latitude: 33.7362 + (Math.random() - 0.5) * 0.01,
          longitude: -118.2632 + (Math.random() - 0.5) * 0.01,
          berth: `B-${i + 1}`
        },
        operational: {
          loadWeight: Math.random() * 50,                    // Tons
          boomAngle: 20 + Math.random() * 40,               // Degrees
          hookHeight: 10 + Math.random() * 40,              // Meters
          trolleyPosition: Math.random() * 30,              // Meters from origin
          spreaderStatus: Math.random() > 0.5 ? 'engaged' : 'disengaged'
        },
        sensors: {
          motorTemperature: 60 + Math.random() * 30,        // Celsius
          hydraulicPressure: 150 + Math.random() * 50,      // PSI
          vibrationLevel: Math.random() * 5,                // G-force
          powerConsumption: 100 + Math.random() * 100,      // kW
          windSpeed: Math.random() * 20                     // m/s
        },
        maintenance: {
          operatingHours: Math.random() * 2000,
          lastMaintenance: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          nextMaintenance: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          healthScore
        },
        alerts
      })
    }
    
    return equipment
  }
  
  // Generate realistic weather data for maritime operations
  generateWeatherData() {
    return {
      location: {
        latitude: 33.7362,   // Los Angeles Port coordinates
        longitude: -118.2632
      },
      timestamp: new Date().toISOString(),
      marineConditions: {
        waveHeight: 0.5 + Math.random() * 2.5,            // Meters
        waveDirection: Math.random() * 360,               // Degrees
        wavePeriod: 5 + Math.random() * 10,               // Seconds
        swellHeight: 0.3 + Math.random() * 1.7,           // Meters
        swellDirection: Math.random() * 360,              // Degrees
        swellPeriod: 8 + Math.random() * 12,              // Seconds
        windWaveHeight: 0.2 + Math.random() * 1.3,        // Meters
        windWaveDirection: Math.random() * 360,           // Degrees
        windWavePeriod: 4 + Math.random() * 8             // Seconds
      },
      oceanData: {
        seaSurfaceTemperature: 15 + Math.random() * 10,   // Celsius
        seaLevelHeight: -0.5 + Math.random(),             // Meters above mean sea level
        oceanCurrentVelocity: 0.1 + Math.random() * 1.9, // m/s
        oceanCurrentDirection: Math.random() * 360        // Degrees
      },
      atmospheric: {
        windSpeed: Math.random() * 25,                    // m/s
        windDirection: Math.random() * 360,               // Degrees
        airPressure: 1000 + Math.random() * 30,           // hPa
        visibility: 5000 + Math.random() * 10000,         // Meters
        precipitation: Math.random() * 10                 // mm/hour
      }
    }
  }
  
  // Helper method to get random vessel types
  getRandomVesselType() {
    const types = [30, 52, 60, 70, 80, 37] // Fishing, Tug, Passenger, Cargo, Tanker, Pleasure
    return types[Math.floor(Math.random() * types.length)]
  }
}