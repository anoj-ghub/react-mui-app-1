/**
 * @fileoverview Compact Rules Evaluation Modal Component
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
  Collapse,
  IconButton,
  Button,
  Grid,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Divider
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  MonetizationOn as MonetizationOnIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  Shield as ShieldIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material'

/**
 * Mock data for testing rule evaluations (with some failing scenarios)
 */
const mockBusinessData = {
  account: {
    id: 'ACC-2025-001',
    balance: 8500, // Below 10k minimum threshold - WILL FAIL
    creditScore: 620, // Below 650 threshold - WILL FAIL
    accountAge: 24, // months
    transactionCount: 156,
    lastTransactionDate: '2025-08-12',
    riskScore: 0.35, // Above 0.25 threshold - WILL FAIL
    complianceScore: 0.92,
    kycStatus: 'VERIFIED',
    region: 'North America'
  },
  transactions: {
    monthlyVolume: 65000, // Above 50k threshold - WILL FAIL
    averageTransactionSize: 1250,
    largeTransactionCount: 3,
    dailyTransactionLimit: 50000,
    suspiciousActivityFlags: 0,
    internationalTransactions: 8, // Above 5 threshold - WILL FAIL
    failedTransactions: 1
  },
  compliance: {
    amlScore: 0.65, // Below 0.8 threshold - WILL FAIL
    sanctionsCheckStatus: 'CLEAR',
    pepStatus: 'NOT_IDENTIFIED',
    lastKycUpdate: '2023-12-15', // Over 365 days ago - WILL FAIL
    documentationComplete: false, // Missing docs - WILL FAIL
    regulatoryReporting: 'OVERDUE'
  },
  performance: {
    systemUptime: 99.85, // Below 99.9% threshold - WILL FAIL
    avgResponseTime: 350, // Above 200ms threshold - WILL FAIL
    errorRate: 0.002,
    throughput: 1500, // transactions per hour
    lastMaintenanceWindow: '2025-08-01'
  }
}

/**
 * Business rules configuration with evaluation logic (compact version)
 */
const businessRules = [
  {
    id: 'CREDIT_SCORE',
    title: 'Credit Score',
    description: 'Credit score validation',
    icon: TrendingUpIcon,
    evaluate: (data) => {
      const score = data.account.creditScore
      const threshold = 650
      return {
        passed: score >= threshold,
        severity: score < threshold ? 'error' : 'success',
        actualValue: score,
        expectedValue: `≥ ${threshold}`,
        details: `Credit score of ${score} ${score >= threshold ? 'meets' : 'falls below'} minimum requirement of ${threshold}`,
        recommendations: score < threshold ? [
          'Review credit history and payment patterns',
          'Consider credit enhancement programs'
        ] : [
          'Credit score meets requirements',
          'Continue monitoring for changes'
        ]
      }
    }
  },
  {
    id: 'ACCOUNT_BALANCE',
    title: 'Minimum Balance',
    description: 'Account balance requirement',
    icon: MonetizationOnIcon,
    evaluate: (data) => {
      const balance = data.account.balance
      const threshold = 10000
      return {
        passed: balance >= threshold,
        severity: balance >= threshold ? 'success' : 'error',
        actualValue: `$${balance.toLocaleString()}`,
        expectedValue: `≥ $${threshold.toLocaleString()}`,
        details: `Account balance of $${balance.toLocaleString()} ${balance >= threshold ? 'exceeds' : 'is below'} minimum requirement`,
        recommendations: balance < threshold ? [
          'Request additional funding',
          'Review account fee structure'
        ] : [
          'Balance requirements satisfied',
          'Monitor for significant withdrawals'
        ]
      }
    }
  },
  {
    id: 'TRANSACTION_VELOCITY',
    title: 'Transaction Velocity',
    description: 'Monthly volume limits',
    icon: SpeedIcon,
    evaluate: (data) => {
      const volume = data.transactions.monthlyVolume
      const threshold = 50000
      return {
        passed: volume <= threshold,
        severity: volume > threshold ? 'warning' : 'success',
        actualValue: `$${volume.toLocaleString()}`,
        expectedValue: `≤ $${threshold.toLocaleString()}`,
        details: `Monthly volume of $${volume.toLocaleString()} ${volume <= threshold ? 'is within' : 'exceeds'} normal thresholds`,
        recommendations: volume > threshold ? [
          'Review transaction patterns',
          'Verify business justification'
        ] : [
          'Transaction velocity normal',
          'Continue standard monitoring'
        ]
      }
    }
  },
  {
    id: 'AML_COMPLIANCE',
    title: 'AML Score',
    description: 'Anti-Money Laundering compliance',
    icon: ShieldIcon,
    evaluate: (data) => {
      const score = data.compliance.amlScore
      return {
        passed: score >= 0.8,
        severity: score >= 0.8 ? 'success' : score >= 0.6 ? 'warning' : 'error',
        actualValue: `${(score * 100).toFixed(1)}%`,
        expectedValue: '≥ 80%',
        details: `AML compliance score of ${(score * 100).toFixed(1)}% ${score >= 0.8 ? 'meets' : 'requires attention for'} regulatory standards`,
        recommendations: score < 0.8 ? [
          'Update customer due diligence',
          'Review transaction monitoring'
        ] : [
          'AML compliance acceptable',
          'Maintain current procedures'
        ]
      }
    }
  },
  {
    id: 'SYSTEM_PERFORMANCE',
    title: 'System Uptime',
    description: 'SLA requirements',
    icon: AssessmentIcon,
    evaluate: (data) => {
      const uptime = data.performance.systemUptime
      const threshold = 99.9
      return {
        passed: uptime >= threshold,
        severity: uptime >= threshold ? 'success' : uptime >= 99.5 ? 'warning' : 'error',
        actualValue: `${uptime}%`,
        expectedValue: `≥ ${threshold}%`,
        details: `System uptime of ${uptime}% ${uptime >= threshold ? 'meets' : 'falls short of'} SLA requirements`,
        recommendations: uptime < threshold ? [
          'Investigate system outages',
          'Review infrastructure capacity'
        ] : [
          'System performance meets SLA',
          'Continue monitoring'
        ]
      }
    }
  },
  {
    id: 'RISK_ASSESSMENT',
    title: 'Risk Score',
    description: 'Overall risk assessment',
    icon: AnalyticsIcon,
    evaluate: (data) => {
      const riskScore = data.account.riskScore
      const threshold = 0.25
      return {
        passed: riskScore <= threshold,
        severity: riskScore <= threshold ? 'success' : riskScore <= 0.5 ? 'warning' : 'error',
        actualValue: `${(riskScore * 100).toFixed(1)}%`,
        expectedValue: `≤ ${(threshold * 100).toFixed(1)}%`,
        details: `Overall risk score of ${(riskScore * 100).toFixed(1)}% ${riskScore <= threshold ? 'is within' : 'exceeds'} acceptable limits`,
        recommendations: riskScore > threshold ? [
          'Review risk factors',
          'Implement additional controls'
        ] : [
          'Risk profile acceptable',
          'Continue standard monitoring'
        ]
      }
    }
  }
]

/**
 * Compact Rules Evaluation Modal Component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal closes
 * @returns {JSX.Element} Rules evaluation modal
 */
function RulesEvaluationModal({ open, onClose }) {
  const [evaluatedRules, setEvaluatedRules] = useState([])
  const [expandedRule, setExpandedRule] = useState(null)
  const [loading, setLoading] = useState(true)

  // Evaluate all rules when modal opens
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

  const handleRuleClick = (ruleId) => {
    setExpandedRule(expandedRule === ruleId ? null : ruleId)
  }

  const getStatusColor = (severity) => {
    switch (severity) {
      case 'success': return '#34C759'
      case 'warning': return '#FF9500'
      case 'error': return '#FF3B30'
      default: return '#8E8E93'
    }
  }

  const getStatusIcon = (severity) => {
    switch (severity) {
      case 'success': return <CheckCircleIcon />
      case 'warning': return <WarningIcon />
      case 'error': return <ErrorIcon />
      default: return <InfoIcon />
    }
  }

  const passedRules = evaluatedRules.filter(rule => rule.result?.passed).length
  const failedRules = evaluatedRules.filter(rule => !rule.result?.passed).length
  const overallScore = evaluatedRules.length > 0 ? Math.round((passedRules / evaluatedRules.length) * 100) : 0

  if (loading) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
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
              Evaluating Business Rules...
            </Typography>
            <Box sx={{ width: '100%', maxWidth: 300, mb: 2 }}>
              <LinearProgress 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  backgroundColor: '#F2F2F7',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#007AFF',
                    borderRadius: 3
                  }
                }} 
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#8E8E93' }}>
              Analyzing compliance metrics...
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
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        borderBottom: '1px solid #F2F2F7'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1D1D1F' }}>
            Rules Evaluation
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Summary Section */}
        <Box sx={{ p: 3, backgroundColor: '#F9F9FB' }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: getStatusColor(overallScore >= 80 ? 'success' : overallScore >= 60 ? 'warning' : 'error') }}>
                  {overallScore}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#8E8E93' }}>Score</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#34C759' }}>
                  {passedRules}
                </Typography>
                <Typography variant="caption" sx={{ color: '#8E8E93' }}>Passed</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF3B30' }}>
                  {failedRules}
                </Typography>
                <Typography variant="caption" sx={{ color: '#8E8E93' }}>Failed</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Rules List */}
        <Box sx={{ maxHeight: '50vh', overflow: 'auto' }}>
          {evaluatedRules.map((rule, index) => {
            const IconComponent = rule.icon
            const isExpanded = expandedRule === rule.id
            
            return (
              <Box key={rule.id}>
                <Box 
                  sx={{ 
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#F9F9FB' },
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => handleRuleClick(rule.id)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ 
                      backgroundColor: getStatusColor(rule.result.severity),
                      mr: 2,
                      width: 32,
                      height: 32
                    }}>
                      <IconComponent sx={{ fontSize: 16, color: 'white' }} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                        {rule.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                        {rule.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={rule.result.passed ? 'PASS' : 'FAIL'}
                        size="small"
                        sx={{ 
                          backgroundColor: rule.result.passed 
                            ? 'rgba(52, 199, 89, 0.1)' 
                            : 'rgba(255, 59, 48, 0.1)',
                          color: rule.result.passed ? '#34C759' : '#FF3B30',
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }}
                      />
                      <IconButton size="small">
                        {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Expanded Details */}
                  <Collapse in={isExpanded} timeout={300}>
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #F2F2F7' }}>
                      {/* Evaluation Details */}
                      <Paper sx={{ 
                        p: 2, 
                        mb: 2, 
                        backgroundColor: '#F9F9FB',
                        borderRadius: 2
                      }}>
                        <Typography variant="body2" sx={{ mb: 1, color: '#3A3A3C' }}>
                          {rule.result.details}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                              Actual
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#1D1D1F' }}>
                              {rule.result.actualValue}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                              Expected
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#1D1D1F' }}>
                              {rule.result.expectedValue}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>

                      {/* Recommendations */}
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1D1D1F' }}>
                        Recommendations
                      </Typography>
                      <List dense sx={{ py: 0 }}>
                        {rule.result.recommendations.slice(0, 2).map((recommendation, recIndex) => (
                          <ListItem key={recIndex} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 20 }}>
                              <Box sx={{ 
                                width: 4, 
                                height: 4, 
                                borderRadius: '50%', 
                                backgroundColor: '#007AFF' 
                              }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={recommendation}
                              primaryTypographyProps={{
                                variant: 'caption',
                                sx: { color: '#3A3A3C' }
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Collapse>
                </Box>
                {index < evaluatedRules.length - 1 && <Divider />}
              </Box>
            )
          })}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #F2F2F7' }}>
        <Typography variant="caption" sx={{ color: '#8E8E93', flexGrow: 1 }}>
          Last evaluation: {new Date().toLocaleString()}
        </Typography>
        <Button onClick={onClose} variant="contained" sx={{ 
          backgroundColor: '#007AFF',
          '&:hover': { backgroundColor: '#0056CC' }
        }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RulesEvaluationModal
