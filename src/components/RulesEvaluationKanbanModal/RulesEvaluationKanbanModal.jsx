/**
 * @fileoverview Rules Evaluation Kanban Board Modal Component
 * @author System
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
  Paper,
  Avatar,
  LinearProgress,
  Divider,
  Tooltip,
  Badge,
  Stack
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  MonetizationOn as MonetizationOnIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  Shield as ShieldIcon,
  Analytics as AnalyticsIcon,
  DragIndicator as DragIndicatorIcon
} from '@mui/icons-material'

/**
 * Mock data for testing rule evaluations (with some failing scenarios)
 */
const mockBusinessData = {
  account: {
    id: 'ACC-2025-001',
    balance: 8500,
    creditScore: 620,
    accountAge: 24,
    transactionCount: 156,
    lastTransactionDate: '2025-08-12',
    riskScore: 0.35,
    complianceScore: 0.92,
    kycStatus: 'VERIFIED',
    region: 'North America'
  },
  transactions: {
    monthlyVolume: 65000,
    averageTransactionSize: 1250,
    largeTransactionCount: 3,
    dailyTransactionLimit: 50000,
    suspiciousActivityFlags: 0,
    internationalTransactions: 8,
    failedTransactions: 1
  },
  compliance: {
    amlScore: 0.65,
    sanctionsCheckStatus: 'CLEAR',
    pepStatus: 'NOT_IDENTIFIED',
    lastKycUpdate: '2023-12-15',
    documentationComplete: false,
    regulatoryReporting: 'OVERDUE'
  },
  performance: {
    systemUptime: 99.85,
    avgResponseTime: 350,
    errorRate: 0.002,
    throughput: 1500,
    lastMaintenanceWindow: '2025-08-01'
  }
}

/**
 * Business rules for kanban board layout
 */
const businessRules = [
  {
    id: 'CREDIT_SCORE',
    title: 'Credit Score',
    category: 'Financial',
    priority: 'High',
    icon: TrendingUpIcon,
    evaluate: (data) => {
      const score = data.account.creditScore
      const threshold = 650
      return {
        passed: score >= threshold,
        severity: score < threshold ? 'error' : 'success',
        actualValue: score,
        expectedValue: `≥ ${threshold}`,
        details: `Credit score: ${score}`,
        impact: score < threshold ? 'Account approval blocked' : 'Requirements met'
      }
    }
  },
  {
    id: 'ACCOUNT_BALANCE',
    title: 'Account Balance',
    category: 'Financial',
    priority: 'High',
    icon: MonetizationOnIcon,
    evaluate: (data) => {
      const balance = data.account.balance
      const threshold = 10000
      return {
        passed: balance >= threshold,
        severity: balance >= threshold ? 'success' : 'error',
        actualValue: `$${balance.toLocaleString()}`,
        expectedValue: `≥ $${threshold.toLocaleString()}`,
        details: `Balance: $${balance.toLocaleString()}`,
        impact: balance < threshold ? 'Account restrictions apply' : 'Full access granted'
      }
    }
  },
  {
    id: 'RISK_ASSESSMENT',
    title: 'Risk Score',
    category: 'Risk',
    priority: 'Medium',
    icon: AnalyticsIcon,
    evaluate: (data) => {
      const riskScore = data.account.riskScore
      const threshold = 0.25
      return {
        passed: riskScore <= threshold,
        severity: riskScore <= threshold ? 'success' : riskScore <= 0.5 ? 'warning' : 'error',
        actualValue: `${(riskScore * 100).toFixed(1)}%`,
        expectedValue: `≤ ${(threshold * 100).toFixed(1)}%`,
        details: `Risk: ${(riskScore * 100).toFixed(1)}%`,
        impact: riskScore > threshold ? 'Enhanced monitoring required' : 'Standard monitoring'
      }
    }
  },
  {
    id: 'TRANSACTION_VELOCITY',
    title: 'Transaction Velocity',
    category: 'Risk',
    priority: 'Medium',
    icon: SpeedIcon,
    evaluate: (data) => {
      const volume = data.transactions.monthlyVolume
      const threshold = 50000
      return {
        passed: volume <= threshold,
        severity: volume > threshold ? 'warning' : 'success',
        actualValue: `$${volume.toLocaleString()}`,
        expectedValue: `≤ $${threshold.toLocaleString()}`,
        details: `Volume: $${volume.toLocaleString()}`,
        impact: volume > threshold ? 'Review required' : 'Within limits'
      }
    }
  },
  {
    id: 'AML_COMPLIANCE',
    title: 'AML Compliance',
    category: 'Compliance',
    priority: 'High',
    icon: ShieldIcon,
    evaluate: (data) => {
      const score = data.compliance.amlScore
      return {
        passed: score >= 0.8,
        severity: score >= 0.8 ? 'success' : score >= 0.6 ? 'warning' : 'error',
        actualValue: `${(score * 100).toFixed(1)}%`,
        expectedValue: '≥ 80%',
        details: `AML Score: ${(score * 100).toFixed(1)}%`,
        impact: score < 0.8 ? 'Compliance review needed' : 'Compliant'
      }
    }
  },
  {
    id: 'SYSTEM_PERFORMANCE',
    title: 'System Uptime',
    category: 'Performance',
    priority: 'Low',
    icon: AssessmentIcon,
    evaluate: (data) => {
      const uptime = data.performance.systemUptime
      const threshold = 99.9
      return {
        passed: uptime >= threshold,
        severity: uptime >= threshold ? 'success' : uptime >= 99.5 ? 'warning' : 'error',
        actualValue: `${uptime}%`,
        expectedValue: `≥ ${threshold}%`,
        details: `Uptime: ${uptime}%`,
        impact: uptime < threshold ? 'SLA breach' : 'SLA met'
      }
    }
  }
]

/**
 * Rules Evaluation Kanban Board Modal Component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal closes
 * @returns {JSX.Element} Rules evaluation kanban modal
 */
function RulesEvaluationKanbanModal({ open, onClose }) {
  const [evaluatedRules, setEvaluatedRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRule, setSelectedRule] = useState(null)

  useEffect(() => {
    if (open) {
      setLoading(true)
      setTimeout(() => {
        const results = businessRules.map(rule => ({
          ...rule,
          result: rule.evaluate(mockBusinessData)
        }))
        setEvaluatedRules(results)
        setLoading(false)
      }, 1000)
    }
  }, [open])

  const getStatusColor = (severity) => {
    switch (severity) {
      case 'success': return '#34C759'
      case 'warning': return '#FF9500'
      case 'error': return '#FF3B30'
      default: return '#8E8E93'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#FF3B30'
      case 'Medium': return '#FF9500'
      case 'Low': return '#34C759'
      default: return '#8E8E93'
    }
  }

  const getColumnRules = (status) => {
    switch (status) {
      case 'passed':
        return evaluatedRules.filter(rule => rule.result?.passed)
      case 'warning':
        return evaluatedRules.filter(rule => rule.result?.severity === 'warning')
      case 'failed':
        return evaluatedRules.filter(rule => rule.result?.severity === 'error')
      default:
        return []
    }
  }

  if (loading) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogContent>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4
          }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#1D1D1F', fontWeight: 600 }}>
              Loading Kanban Board...
            </Typography>
            <LinearProgress sx={{ width: '100%', maxWidth: 400, mb: 2 }} />
            <Typography variant="body2" sx={{ color: '#8E8E93' }}>
              Organizing rules by status...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 3,
          maxHeight: '90vh',
          height: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #F2F2F7' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1D1D1F' }}>
            Rules Evaluation Kanban Board
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, height: '100%', overflow: 'auto' }}>
        <Box sx={{ display: 'flex', gap: 3, height: '100%', minWidth: 1000 }}>
          {/* Passed Column */}
          <Paper sx={{ 
            flex: 1, 
            p: 2, 
            backgroundColor: '#F0FFF4',
            border: '2px solid #34C759',
            borderRadius: 2,
            minHeight: 400
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ color: '#34C759', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#34C759' }}>
                Passed
              </Typography>
              <Badge 
                badgeContent={getColumnRules('passed').length} 
                color="success" 
                sx={{ ml: 1 }}
              />
            </Box>
            <Stack spacing={2}>
              {getColumnRules('passed').map((rule) => {
                const IconComponent = rule.icon
                return (
                  <Card 
                    key={rule.id} 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                    onClick={() => setSelectedRule(rule)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ 
                          backgroundColor: getStatusColor(rule.result.severity),
                          width: 24,
                          height: 24,
                          mr: 1
                        }}>
                          <IconComponent sx={{ fontSize: 14, color: 'white' }} />
                        </Avatar>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, flexGrow: 1 }}>
                          {rule.title}
                        </Typography>
                        <DragIndicatorIcon sx={{ color: '#8E8E93', fontSize: 16 }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#8E8E93', display: 'block', mb: 1 }}>
                        {rule.category}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#1D1D1F', mb: 1 }}>
                        {rule.result.details}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip 
                          label={rule.priority}
                          size="small"
                          sx={{ 
                            backgroundColor: `${getPriorityColor(rule.priority)}20`,
                            color: getPriorityColor(rule.priority),
                            fontSize: '0.7rem'
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#34C759', fontWeight: 600 }}>
                          {rule.result.impact}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                )
              })}
            </Stack>
          </Paper>

          {/* Warning Column */}
          <Paper sx={{ 
            flex: 1, 
            p: 2, 
            backgroundColor: '#FFF8E1',
            border: '2px solid #FF9500',
            borderRadius: 2,
            minHeight: 400
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WarningIcon sx={{ color: '#FF9500', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#FF9500' }}>
                Warning
              </Typography>
              <Badge 
                badgeContent={getColumnRules('warning').length} 
                sx={{ 
                  ml: 1,
                  '& .MuiBadge-badge': { backgroundColor: '#FF9500', color: 'white' }
                }}
              />
            </Box>
            <Stack spacing={2}>
              {getColumnRules('warning').map((rule) => {
                const IconComponent = rule.icon
                return (
                  <Card 
                    key={rule.id} 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                    onClick={() => setSelectedRule(rule)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ 
                          backgroundColor: getStatusColor(rule.result.severity),
                          width: 24,
                          height: 24,
                          mr: 1
                        }}>
                          <IconComponent sx={{ fontSize: 14, color: 'white' }} />
                        </Avatar>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, flexGrow: 1 }}>
                          {rule.title}
                        </Typography>
                        <DragIndicatorIcon sx={{ color: '#8E8E93', fontSize: 16 }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#8E8E93', display: 'block', mb: 1 }}>
                        {rule.category}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#1D1D1F', mb: 1 }}>
                        {rule.result.details}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip 
                          label={rule.priority}
                          size="small"
                          sx={{ 
                            backgroundColor: `${getPriorityColor(rule.priority)}20`,
                            color: getPriorityColor(rule.priority),
                            fontSize: '0.7rem'
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#FF9500', fontWeight: 600 }}>
                          {rule.result.impact}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                )
              })}
            </Stack>
          </Paper>

          {/* Failed Column */}
          <Paper sx={{ 
            flex: 1, 
            p: 2, 
            backgroundColor: '#FFF5F5',
            border: '2px solid #FF3B30',
            borderRadius: 2,
            minHeight: 400
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ErrorIcon sx={{ color: '#FF3B30', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#FF3B30' }}>
                Failed
              </Typography>
              <Badge 
                badgeContent={getColumnRules('failed').length} 
                sx={{ 
                  ml: 1,
                  '& .MuiBadge-badge': { backgroundColor: '#FF3B30', color: 'white' }
                }}
              />
            </Box>
            <Stack spacing={2}>
              {getColumnRules('failed').map((rule) => {
                const IconComponent = rule.icon
                return (
                  <Card 
                    key={rule.id} 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                    onClick={() => setSelectedRule(rule)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ 
                          backgroundColor: getStatusColor(rule.result.severity),
                          width: 24,
                          height: 24,
                          mr: 1
                        }}>
                          <IconComponent sx={{ fontSize: 14, color: 'white' }} />
                        </Avatar>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, flexGrow: 1 }}>
                          {rule.title}
                        </Typography>
                        <DragIndicatorIcon sx={{ color: '#8E8E93', fontSize: 16 }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#8E8E93', display: 'block', mb: 1 }}>
                        {rule.category}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#1D1D1F', mb: 1 }}>
                        {rule.result.details}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip 
                          label={rule.priority}
                          size="small"
                          sx={{ 
                            backgroundColor: `${getPriorityColor(rule.priority)}20`,
                            color: getPriorityColor(rule.priority),
                            fontSize: '0.7rem'
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#FF3B30', fontWeight: 600 }}>
                          {rule.result.impact}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                )
              })}
            </Stack>
          </Paper>
        </Box>

        {/* Rule Detail Popup */}
        {selectedRule && (
          <Dialog
            open={!!selectedRule}
            onClose={() => setSelectedRule(null)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ backgroundColor: getStatusColor(selectedRule.result.severity) }}>
                  <selectedRule.icon sx={{ color: 'white' }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {selectedRule.title}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Evaluation Result
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#3A3A3C' }}>
                    {selectedRule.result.details}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Paper sx={{ p: 2, flex: 1 }}>
                    <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                      Actual
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {selectedRule.result.actualValue}
                    </Typography>
                  </Paper>
                  <Paper sx={{ p: 2, flex: 1 }}>
                    <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                      Expected
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {selectedRule.result.expectedValue}
                    </Typography>
                  </Paper>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Business Impact
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#3A3A3C' }}>
                    {selectedRule.result.impact}
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedRule(null)}>Close</Button>
            </DialogActions>
          </Dialog>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #F2F2F7' }}>
        <Typography variant="caption" sx={{ color: '#8E8E93', flexGrow: 1 }}>
          Kanban Board View • Drag and drop style layout
        </Typography>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RulesEvaluationKanbanModal
