import { AISVesselData, VesselType, NavigationStatus, PortOperationMetrics, CraneMonitoringData, WeatherData } from '@types/maritime'

export class MaritimeDataGenerator {
  private vesselNames = [
    'MAERSK EDINBURGH', 'EVER GIVEN', 'MSC OSCAR', 'OOCL HONG KONG',
    'COSCO SHIPPING UNIVERSE', 'MADRID MAERSK', 'HAPAG EXPRESS',
    'CMA CGM MARCO POLO', 'ATLANTIC SAIL', 'PACIFIC PIONEER'
  ]
  
  private portCoordinates = {
    'LOS_ANGELES': { lat: 33.7362, lng: -118.2632 },
    'SINGAPORE': { lat: 1.2897, lng: 103.8517 },
    'HAMBURG': { lat: 53.5511, lng: 9.9937 },
    'ROTTERDAM': { lat: 51.8985, lng: 4.1250 },
    'SHANGHAI': { lat: 31.2304, lng: 121.4737 }
  }
  
  generateAISData(count: number = 50): AISVesselData[] {
    const vessels: AISVesselData[] = []
    
    for (let i = 0; i < count; i++) {
      const port = Object.values(this.portCoordinates)[i % Object.values(this.portCoordinates).length]
      
      const vessel: AISVesselData = {
        mmsi: 200000000 + Math.floor(Math.random() * 99999999),
        timestamp: new Date().toISOString(),
        position: {
          longitude: port.lng + (Math.random() - 0.5) * 0.2,
          latitude: port.lat + (Math.random() - 0.5) * 0.2
        },
        navigation: {
          courseOverGround: Math.random() * 360,
          speedOverGround: Math.random() * 25,
          heading: Math.floor(Math.random() * 360),
          rateOfTurn: Math.floor(Math.random() * 255) - 128,
          navigationStatus: Math.floor(Math.random() * 16) as NavigationStatus
        },
        vesselInfo: {
          imo: 9000000 + Math.floor(Math.random() * 999999),
          name: this.vesselNames[i % this.vesselNames.length],
          callsign: `ABC${i.toString().padStart(3, '0')}`,
          type: Object.values(VesselType)[Math.floor(Math.random() * Object.values(VesselType).length)] as VesselType,
          dimensions: {
            length: 150 + Math.random() * 250,
            width: 20 + Math.random() * 30,
            draft: 5 + Math.random() * 10
          }
        },
        destination: Object.keys(this.portCoordinates)[Math.floor(Math.random() * Object.keys(this.portCoordinates).length)],
        eta: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().slice(5, 16).replace('T', ' ')
      }
      
      vessels.push(vessel)
    }
    
    return vessels
  }
  
  generatePortMetrics(): PortOperationMetrics {
    return {
      timestamp: new Date().toISOString(),
      terminalId: 'TERM-001',
      vesselProductivity: 40 + Math.random() * 20,
      berthUtilization: 0.7 + Math.random() * 0.2,
      yardUtilization: 0.6 + Math.random() * 0.2,
      craneUtilization: 0.7 + Math.random() * 0.2,
      truckTurnTime: 20 + Math.random() * 25,
      gateMoves: 2000 + Math.random() * 1000,
      dwellTime: 2 + Math.random() * 3,
      vesselWaitingTime: 1 + Math.random() * 3
    }
  }
  
  generateEquipmentData(count: number = 10): CraneMonitoringData[] {
    const equipment: CraneMonitoringData[] = []
    
    for (let i = 0; i < count; i++) {
      const healthScore = 0.5 + Math.random() * 0.5
      const alerts = []
      
      // Generate alerts based on health score
      if (healthScore < 0.7) {
        alerts.push({
          type: 'critical' as const,
          message: 'Equipment requires immediate maintenance',
          threshold: 0.7,
          currentValue: healthScore
        })
      } else if (healthScore < 0.85) {
        alerts.push({
          type: 'warning' as const,
          message: 'Schedule maintenance soon',
          threshold: 0.85,
          currentValue: healthScore
        })
      }
      
      equipment.push({
        craneId: `QC-${(i + 1).toString().padStart(3, '0')}`,
        timestamp: new Date().toISOString(),
        location: {
          latitude: 33.7362 + (Math.random() - 0.5) * 0.01,
          longitude: -118.2632 + (Math.random() - 0.5) * 0.01,
          berth: `B-${i + 1}`
        },
        operational: {
          loadWeight: Math.random() * 50,
          boomAngle: 20 + Math.random() * 40,
          hookHeight: 10 + Math.random() * 40,
          trolleyPosition: Math.random() * 30,
          spreaderStatus: Math.random() > 0.5 ? 'engaged' : 'disengaged'
        },
        sensors: {
          motorTemperature: 60 + Math.random() * 30,
          hydraulicPressure: 150 + Math.random() * 50,
          vibrationLevel: Math.random() * 5,
          powerConsumption: 100 + Math.random() * 100,
          windSpeed: Math.random() * 20
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
  
  generateWeatherData(): WeatherData {
    return {
      location: {
        latitude: 33.7362,
        longitude: -118.2632
      },
      timestamp: new Date().toISOString(),
      marineConditions: {
        waveHeight: 0.5 + Math.random() * 2.5,
        waveDirection: Math.random() * 360,
        wavePeriod: 5 + Math.random() * 10,
        swellHeight: 0.3 + Math.random() * 1.7,
        swellDirection: Math.random() * 360,
        swellPeriod: 8 + Math.random() * 12,
        windWaveHeight: 0.2 + Math.random() * 1.3,
        windWaveDirection: Math.random() * 360,
        windWavePeriod: 4 + Math.random() * 8
      },
      oceanData: {
        seaSurfaceTemperature: 15 + Math.random() * 10,
        seaLevelHeight: -0.5 + Math.random(),
        oceanCurrentVelocity: 0.1 + Math.random() * 1.9,
        oceanCurrentDirection: Math.random() * 360
      },
      atmospheric: {
        windSpeed: Math.random() * 25,
        windDirection: Math.random() * 360,
        airPressure: 1000 + Math.random() * 30,
        visibility: 5000 + Math.random() * 10000,
        precipitation: Math.random() * 10
      }
    }
  }
  
  generateHistoricalData(days: number = 30): any[] {
    const data = []
    const now = new Date()
    
    for (let i = 0; i < days * 24; i++) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
      
      data.push({
        timestamp: timestamp.toISOString(),
        averageHealthScore: 0.7 + Math.random() * 0.3,
        powerConsumption: 120 + Math.random() * 40,
        vesselProductivity: 45 + Math.random() * 15,
        berthUtilization: 0.75 + Math.random() * 0.2,
        weather: {
          windSpeed: Math.random() * 20,
          waveHeight: 0.5 + Math.random() * 2,
          temperature: 18 + Math.random() * 8
        }
      })
    }
    
    return data.reverse()
  }
}

// Export singleton instance
export const maritimeDataGenerator = new MaritimeDataGenerator()