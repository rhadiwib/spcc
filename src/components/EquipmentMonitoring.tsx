import React, { useMemo } from 'react'
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Alert, 
  Chip, 
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import { 
  Warning, 
  CheckCircle, 
  Error, 
  Build, 
  Timeline 
} from '@mui/icons-material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CraneMonitoringData } from '@types/maritime'

interface EquipmentMonitoringProps {
  equipmentData: CraneMonitoringData[]
  historicalData: any[]
}

const HealthScoreIndicator: React.FC<{ score: number }> = ({ score }) => {
  const getColor = (score: number) => {
    if (score >= 0.8) return 'success'
    if (score >= 0.6) return 'warning'
    return 'error'
  }
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={score * 100} 
            color={getColor(score)}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">
            {`${Math.round(score * 100)}%`}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

const EquipmentCard: React.FC<{ equipment: CraneMonitoringData }> = ({ equipment }) => {
  const statusColor = useMemo(() => {
    if (equipment.alerts.some(alert => alert.type === 'critical')) return 'error'
    if (equipment.alerts.some(alert => alert.type === 'warning')) return 'warning'
    return 'success'
  }, [equipment.alerts])
  
  const getStatusIcon = () => {
    switch (statusColor) {
      case 'error': return <Error color="error" />
      case 'warning': return <Warning color="warning" />
      default: return <CheckCircle color="success" />
    }
  }
  
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {getStatusIcon()}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {equipment.craneId}
          </Typography>
          <Chip 
            label={equipment.location.berth}
            size="small"
            sx={{ ml: 'auto' }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Health Score
        </Typography>
        <HealthScoreIndicator score={equipment.maintenance.healthScore} />
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <Typography variant="caption">Load Weight</Typography>
            <Typography variant="h6">{equipment.operational.loadWeight.toFixed(1)} tons</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption">Power Consumption</Typography>
            <Typography variant="h6">{equipment.sensors.powerConsumption.toFixed(1)} kW</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption">Motor Temperature</Typography>
            <Typography variant="h6">{equipment.sensors.motorTemperature.toFixed(1)}°C</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption">Operating Hours</Typography>
            <Typography variant="h6">{equipment.maintenance.operatingHours.toFixed(1)} hrs</Typography>
          </Grid>
        </Grid>
        
        {equipment.alerts.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Active Alerts
            </Typography>
            {equipment.alerts.map((alert, index) => (
              <Alert 
                key={index} 
                severity={alert.type === 'critical' ? 'error' : alert.type}
                sx={{ mb: 1 }}
              >
                {alert.message}
              </Alert>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

const EquipmentMonitoring: React.FC<EquipmentMonitoringProps> = ({ 
  equipmentData, 
  historicalData 
}) => {
  const summaryStats = useMemo(() => {
    const totalEquipment = equipmentData.length
    const healthyEquipment = equipmentData.filter(eq => eq.maintenance.healthScore > 0.8).length
    const warningEquipment = equipmentData.filter(eq => 
      eq.maintenance.healthScore <= 0.8 && eq.maintenance.healthScore > 0.6
    ).length
    const criticalEquipment = equipmentData.filter(eq => eq.maintenance.healthScore <= 0.6).length
    
    return {
      total: totalEquipment,
      healthy: healthyEquipment,
      warning: warningEquipment,
      critical: criticalEquipment
    }
  }, [equipmentData])
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Equipment</Typography>
              <Typography variant="h4">{summaryStats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Healthy</Typography>
              <Typography variant="h4" color="success.main">
                {summaryStats.healthy}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Warning</Typography>
              <Typography variant="h4" color="warning.main">
                {summaryStats.warning}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Critical</Typography>
              <Typography variant="h4" color="error.main">
                {summaryStats.critical}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Equipment Cards */}
        {equipmentData.map(equipment => (
          <Grid item xs={12} md={6} lg={4} key={equipment.craneId}>
            <EquipmentCard equipment={equipment} />
          </Grid>
        ))}
        
        {/* Historical Performance Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Equipment Performance History
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="averageHealthScore" 
                    stroke="#8884d8" 
                    name="Average Health Score"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="powerConsumption" 
                    stroke="#82ca9d" 
                    name="Power Consumption"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default EquipmentMonitoring