import React, { useMemo } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Grid, Card, CardContent, Typography, Box } from '@mui/material'
import { PortOperationMetrics } from '@types/maritime'

interface AnalyticsDashboardProps {
  portMetrics: PortOperationMetrics[]
  realtimeData: any[]
}

const KPICard: React.FC<{ title: string; value: number | string; unit?: string; trend?: number }> = ({ 
  title, 
  value, 
  unit, 
  trend 
}) => (
  <Card>
    <CardContent>
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
      <Typography variant="h4" component="p">
        {typeof value === 'number' ? value.toFixed(1) : value}
        {unit && <span style={{ fontSize: '0.7em', marginLeft: '4px' }}>{unit}</span>}
      </Typography>
      {trend !== undefined && (
        <Typography 
          variant="body2" 
          color={trend > 0 ? 'success.main' : 'error.main'}
        >
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
        </Typography>
      )}
    </CardContent>
  </Card>
)

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ portMetrics, realtimeData }) => {
  const latestMetrics = useMemo(() => {
    return portMetrics[portMetrics.length - 1]
  }, [portMetrics])
  
  const chartData = useMemo(() => {
    return portMetrics.map(metric => ({
      timestamp: new Date(metric.timestamp).toLocaleTimeString(),
      vesselProductivity: metric.vesselProductivity,
      berthUtilization: metric.berthUtilization * 100,
      yardUtilization: metric.yardUtilization * 100,
      craneUtilization: metric.craneUtilization * 100,
      truckTurnTime: metric.truckTurnTime,
      gateMoves: metric.gateMoves,
      dwellTime: metric.dwellTime,
    }))
  }, [portMetrics])
  
  const utilizationData = useMemo(() => {
    if (!latestMetrics) return []
    
    return [
      { name: 'Berth', value: latestMetrics.berthUtilization * 100 },
      { name: 'Yard', value: latestMetrics.yardUtilization * 100 },
      { name: 'Crane', value: latestMetrics.craneUtilization * 100 },
    ]
  }, [latestMetrics])
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28']
  
  if (!latestMetrics) {
    return <div>Loading analytics...</div>
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* KPI Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <KPICard 
            title="Vessel Productivity" 
            value={latestMetrics.vesselProductivity} 
            unit="moves/hr"
            trend={2.5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard 
            title="Berth Utilization" 
            value={latestMetrics.berthUtilization * 100} 
            unit="%"
            trend={-1.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard 
            title="Truck Turn Time" 
            value={latestMetrics.truckTurnTime} 
            unit="min"
            trend={-3.8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard 
            title="Gate Moves" 
            value={latestMetrics.gateMoves} 
            unit="daily"
            trend={5.2}
          />
        </Grid>
        
        {/* Time Series Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Port Performance Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="vesselProductivity" 
                    stroke="#8884d8" 
                    name="Vessel Productivity"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="berthUtilization" 
                    stroke="#82ca9d" 
                    name="Berth Utilization %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="truckTurnTime" 
                    stroke="#ffc658" 
                    name="Truck Turn Time"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Utilization Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Utilization
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={utilizationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {utilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Equipment Status Bar Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Equipment Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.slice(-10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="craneUtilization" fill="#8884d8" name="Crane Utilization %" />
                  <Bar dataKey="gateMoves" fill="#82ca9d" name="Gate Moves" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AnalyticsDashboard