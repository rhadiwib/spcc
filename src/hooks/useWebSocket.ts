import { useState, useEffect, useCallback, useRef } from 'react'
import { AISVesselData, PortOperationMetrics, CraneMonitoringData, WeatherData } from '@types/maritime'

interface WebSocketMessage {
  type: 'vessel_update' | 'port_metrics' | 'equipment_data' | 'weather_data' | 'alert'
  data: AISVesselData | PortOperationMetrics | CraneMonitoringData | WeatherData | any
  timestamp: string
}

export function useMaritimeWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return
    
    setConnectionStatus('connecting')
    const ws = new WebSocket(url)
    
    ws.onopen = () => {
      setIsConnected(true)
      setConnectionStatus('connected')
      console.log('Maritime WebSocket connected')
      
      // Clear reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
    
    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        setLastMessage(message)
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }
    
    ws.onclose = () => {
      setIsConnected(false)
      setConnectionStatus('disconnected')
      console.log('Maritime WebSocket disconnected')
      
      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect()
      }, 3000)
    }
    
    ws.onerror = (error) => {
      console.error('Maritime WebSocket error:', error)
    }
    
    wsRef.current = ws
  }, [url])
  
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    setIsConnected(false)
    setConnectionStatus('disconnected')
  }, [])
  
  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])
  
  useEffect(() => {
    connect()
    
    return () => {
      disconnect()
    }
  }, [connect, disconnect])
  
  return {
    isConnected,
    lastMessage,
    connectionStatus,
    sendMessage,
    connect,
    disconnect
  }
}