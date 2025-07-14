import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import { ErrorBoundary } from 'react-error-boundary'
import { useMaritimeWebSocket } from '@hooks/useWebSocket'
import { maritimeDataGenerator } from '@data/maritimeDataGenerator'
import Sidebar from '@components/Sidebar'
import LoadingSpinner from '@components/LoadingSpinner'
import ErrorFallback from '@components/ErrorFallback'

// Lazy load dashboard components
const Dashboard = lazy(() => import('@components/Dashboard'))
const PortMap = lazy(() => import('@components/PortMap'))
const AnalyticsDashboard = lazy(() => import('@components/AnalyticsDashboard'))
const EquipmentMonitoring = lazy(() => import('@components/EquipmentMonitoring'))

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

function App() {
  const { isConnected, lastMessage, connectionStatus } = useMaritimeWebSocket('ws://localhost:8080')
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Box sx={{ display: 'flex' }}>
            <Sidebar connectionStatus={connectionStatus} />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/port-map" element={<PortMap vessels={[]} center={[33.7362, -118.2632]} zoom={12} />} />
                  <Route path="/analytics" element={<AnalyticsDashboard portMetrics={[]} realtimeData={[]} />} />
                  <Route path="/equipment" element={<EquipmentMonitoring equipmentData={[]} historicalData={[]} />} />
                </Routes>
              </Suspense>
            </Box>
          </Box>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  )
}

export default App