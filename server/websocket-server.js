const WebSocket = require('ws')
const { MaritimeDataGenerator } = require('./maritime-data-generator')

const wss = new WebSocket.Server({ port: 8080 })
const dataGenerator = new MaritimeDataGenerator()

console.log('Maritime WebSocket server running on ws://localhost:8080')

wss.on('connection', (ws) => {
  console.log('Client connected')
  
  // Send initial data
  ws.send(JSON.stringify({
    type: 'vessel_update',
    data: dataGenerator.generateAISData(25),
    timestamp: new Date().toISOString()
  }))
  
  // Send real-time updates every 5 seconds
  const interval = setInterval(() => {
    const messageTypes = ['vessel_update', 'port_metrics', 'equipment_data', 'weather_data']
    const randomType = messageTypes[Math.floor(Math.random() * messageTypes.length)]
    
    let data
    switch (randomType) {
      case 'vessel_update':
        data = dataGenerator.generateAISData(5)
        break
      case 'port_metrics':
        data = dataGenerator.generatePortMetrics()
        break
      case 'equipment_data':
        data = dataGenerator.generateEquipmentData(3)
        break
      case 'weather_data':
        data = dataGenerator.generateWeatherData()
        break
      default:
        data = {}
    }
    
    ws.send(JSON.stringify({
      type: randomType,
      data,
      timestamp: new Date().toISOString()
    }))
  }, 5000)
  
  ws.on('close', () => {
    console.log('Client disconnected')
    clearInterval(interval)
  })
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })
})