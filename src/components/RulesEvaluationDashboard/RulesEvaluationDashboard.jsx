/**
 * @fileoverview Interactive Rules Evaluation Dashboard Component
 * @author System
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'
import {
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
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fade,
  LinearProgress
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
 * Business rules configuration with evaluation logic
 */
const businessRules = [
  {
    id: 'CREDIT_SCORE',
    title: 'Credit Score Validation',
    description: 'Account credit score must meet minimum threshold',
    category: 'Risk Management',
    icon: TrendingUpIcon,
    threshold: 650,
    evaluate: (data) => {
      const score = data.account.creditScore
      const threshold = 650
      return {
        passed: score >= threshold,
        severity: score < threshold ? 'error' : 'success',
        actualValue: score,
        expectedValue: `≥ ${threshold}`,
        details: `Credit score of ${score} ${score >= threshold ? 'meets' : 'falls below'} the minimum requirement of ${threshold}`,
        recommendations: score < threshold ? [
          'Review credit history and payment patterns',
          'Consider credit enhancement programs',
          'Implement additional risk controls'
        ] : [
          'Credit score meets requirements',
          'Continue monitoring for changes',
          'Maintain current risk profile'
        ]
      }
    }
  },
  {
    id: 'ACCOUNT_BALANCE',
    title: 'Minimum Balance Requirement',
    description: 'Account must maintain minimum balance threshold',
    category: 'Financial Controls',
    icon: MonetizationOnIcon,
    threshold: 10000,
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
          'Request additional funding or deposits',
          'Review account fee structure',
          'Consider account type upgrade'
        ] : [
          'Balance requirements satisfied',
          'Monitor for significant withdrawals',
          'Optimize interest earning opportunities'
        ]
      }
    }
  },
  {
    id: 'TRANSACTION_VELOCITY',
    title: 'Transaction Velocity Check',
    description: 'Monthly transaction volume within acceptable limits',
    category: 'Fraud Prevention',
    icon: SpeedIcon,
    threshold: 50000,
    evaluate: (data) => {
      const volume = data.transactions.monthlyVolume
      const limit = data.transactions.dailyTransactionLimit * 30
      const threshold = 50000
      return {
        passed: volume <= threshold,
        severity: volume > threshold ? 'warning' : 'success',
        actualValue: `$${volume.toLocaleString()}`,
        expectedValue: `≤ $${threshold.toLocaleString()}`,
        details: `Monthly volume of $${volume.toLocaleString()} ${volume <= threshold ? 'is within' : 'exceeds'} normal thresholds`,
        recommendations: volume > threshold ? [
          'Review transaction patterns for anomalies',
          'Verify business justification for high volume',
          'Consider enhanced monitoring controls'
        ] : [
          'Transaction velocity within normal range',
          'Continue standard monitoring',
          'No additional controls required'
        ]
      }
    }
  },
  {
    id: 'AML_COMPLIANCE',
    title: 'Anti-Money Laundering Score',
    description: 'AML risk score must be below acceptable threshold',
    category: 'Compliance',
    icon: ShieldIcon,
    threshold: 0.3,
    evaluate: (data) => {
      const score = data.compliance.amlScore
      const threshold = 0.3
      return {
        passed: score >= 0.8,
        severity: score >= 0.8 ? 'success' : score >= 0.6 ? 'warning' : 'error',
        actualValue: `${(score * 100).toFixed(1)}%`,
        expectedValue: '≥ 80%',
        details: `AML compliance score of ${(score * 100).toFixed(1)}% ${score >= 0.8 ? 'meets' : 'requires attention for'} regulatory standards`,
        recommendations: score < 0.8 ? [
          'Update customer due diligence documentation',
          'Review transaction monitoring alerts',
          'Consider enhanced screening procedures'
        ] : [
          'AML compliance score acceptable',
          'Maintain current monitoring procedures',
          'Schedule next review cycle'
        ]
      }
    }
  },
  {
    id: 'SYSTEM_PERFORMANCE',
    title: 'System Uptime Requirement',
    description: 'System availability must meet SLA requirements',
    category: 'Technical Performance',
    icon: AssessmentIcon,
    threshold: 99.9,
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
          'Investigate recent system outages',
          'Review infrastructure capacity',
          'Implement redundancy improvements'
        ] : [
          'System performance meets SLA',
          'Continue proactive monitoring',
          'Plan capacity for growth'
        ]
      }
    }
  },
  {
    id: 'KYC_STATUS',
    title: 'Know Your Customer Verification',
    description: 'Customer identity verification must be current',
    category: 'Identity Verification',
    icon: SecurityIcon,
    evaluate: (data) => {
      const status = data.account.kycStatus
      const lastUpdate = new Date(data.compliance.lastKycUpdate)
      const daysSinceUpdate = Math.floor((new Date() - lastUpdate) / (1000 * 60 * 60 * 24))
      const isRecent = daysSinceUpdate <= 365
      
      return {
        passed: status === 'VERIFIED' && isRecent,
        severity: status === 'VERIFIED' && isRecent ? 'success' : 'error',
        actualValue: `${status} (${daysSinceUpdate} days ago)`,
        expectedValue: 'VERIFIED (< 365 days)',
        details: `KYC status is ${status.toLowerCase()} with last update ${daysSinceUpdate} days ago`,
        recommendations: !(status === 'VERIFIED' && isRecent) ? [
          'Initiate KYC refresh process',
          'Request updated documentation',
          'Schedule customer verification call'
        ] : [
          'KYC verification current and valid',
          'Monitor for upcoming renewal',
          'Maintain documentation records'
        ]
      }
    }
  },
  {
    id: 'RISK_ASSESSMENT',
    title: 'Overall Risk Score',
    description: 'Comprehensive risk assessment within acceptable range',
    category: 'Risk Management',
    icon: AnalyticsIcon,
    threshold: 0.25,
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
          'Review all risk factors contributing to score',
          'Implement additional monitoring controls',
          'Consider account restrictions if necessary'
        ] : [
          'Risk profile within acceptable range',
          'Continue standard risk monitoring',
          'Regular risk assessment updates'
        ]
      }
    }
  },
  {
    id: 'RESPONSE_TIME',
    title: 'System Response Time',
    description: 'API response times must meet performance standards',
    category: 'Technical Performance',
    icon: SpeedIcon,
    threshold: 200,
    evaluate: (data) => {
      const responseTime = data.performance.avgResponseTime
      const threshold = 200
      return {
        passed: responseTime <= threshold,
        severity: responseTime <= threshold ? 'success' : responseTime <= 500 ? 'warning' : 'error',
        actualValue: `${responseTime}ms`,
        expectedValue: `≤ ${threshold}ms`,
        details: `Average response time of ${responseTime}ms ${responseTime <= threshold ? 'meets' : 'exceeds'} performance standards`,
        recommendations: responseTime > threshold ? [
          'Optimize database queries and indexes',
          'Review application performance bottlenecks',
          'Consider caching strategies'
        ] : [
          'Response times within acceptable range',
          'Monitor for performance degradation',
          'Plan for traffic growth scenarios'
        ]
      }
    }
  },
  {
    id: 'INTERNATIONAL_TRANSACTIONS',
    title: 'International Transaction Monitoring',
    description: 'Cross-border transactions require enhanced scrutiny',
    category: 'Fraud Prevention',
    icon: GroupIcon,
    threshold: 5,
    evaluate: (data) => {
      const intlTransactions = data.transactions.internationalTransactions
      const threshold = 5
      return {
        passed: intlTransactions <= threshold,
        severity: intlTransactions <= threshold ? 'success' : 'warning',
        actualValue: intlTransactions,
        expectedValue: `≤ ${threshold} per month`,
        details: `${intlTransactions} international transactions ${intlTransactions <= threshold ? 'within' : 'above'} monitoring threshold`,
        recommendations: intlTransactions > threshold ? [
          'Review international transaction patterns',
          'Verify business purpose for cross-border activity',
          'Enhanced due diligence on counterparties'
        ] : [
          'International activity within normal range',
          'Continue standard monitoring',
          'No additional controls required'
        ]
      }
    }
  },
  {
    id: 'DOCUMENTATION_COMPLETENESS',
    title: 'Documentation Completeness',
    description: 'All required customer documentation must be complete',
    category: 'Compliance',
    icon: InfoIcon,
    evaluate: (data) => {
      const isComplete = data.compliance.documentationComplete
      const reportingStatus = data.compliance.regulatoryReporting
      
      return {
        passed: isComplete && reportingStatus === 'UP_TO_DATE',
        severity: isComplete && reportingStatus === 'UP_TO_DATE' ? 'success' : 'error',
        actualValue: `${isComplete ? 'Complete' : 'Incomplete'} (${reportingStatus})`,
        expectedValue: 'Complete (UP_TO_DATE)',
        details: `Documentation is ${isComplete ? 'complete' : 'incomplete'} with regulatory reporting ${reportingStatus.toLowerCase()}`,
        recommendations: !(isComplete && reportingStatus === 'UP_TO_DATE') ? [
          'Collect missing documentation',
          'Update regulatory reporting status',
          'Schedule compliance review'
        ] : [
          'All documentation requirements met',
          'Maintain current documentation',
          'Monitor for regulatory updates'
        ]
      }
    }
  }
]

/**
 * Interactive Rules Evaluation Dashboard Component
 * 
 * Features:
 * - Color-coded rule evaluation results
 * - Expandable sections with detailed explanations
 * - Apple-inspired design with smooth animations
 * - Mock data for comprehensive testing
 * 
 * @component
 * @returns {JSX.Element} Rules evaluation dashboard
 */
function RulesEvaluationDashboard() {
  const [evaluatedRules, setEvaluatedRules] = useState([])
  const [expandedRule, setExpandedRule] = useState(null)
  const [loading, setLoading] = useState(true)

  // Evaluate all rules when component mounts
  useEffect(() => {
    setLoading(true)
    // Simulate evaluation delay for realistic UX
    setTimeout(() => {
      const evaluated = businessRules.map(rule => ({
        ...rule,
        result: rule.evaluate(mockBusinessData)
      }))
      setEvaluatedRules(evaluated)
      setLoading(false)
    }, 1500)
  }, [])

  // Handle rule expansion/collapse
  const handleRuleClick = (ruleId) => {
    setExpandedRule(expandedRule === ruleId ? null : ruleId)
  }

  // Get status color based on rule result
  const getStatusColor = (severity) => {
    switch (severity) {
      case 'success': return '#34C759' // Apple Green
      case 'warning': return '#FF9500' // Apple Orange
      case 'error': return '#FF3B30' // Apple Red
      default: return '#8E8E93' // Apple Gray
    }
  }

  // Get status icon based on severity
  const getStatusIcon = (severity) => {
    switch (severity) {
      case 'success': return <CheckCircleIcon />
      case 'warning': return <WarningIcon />
      case 'error': return <ErrorIcon />
      default: return <InfoIcon />
    }
  }

  // Calculate overall compliance score
  const overallScore = evaluatedRules.length > 0 
    ? Math.round((evaluatedRules.filter(rule => rule.result.passed).length / evaluatedRules.length) * 100)
    : 0

  const passedRules = evaluatedRules.filter(rule => rule.result.passed).length
  const failedRules = evaluatedRules.filter(rule => !rule.result.passed).length

  if (loading) {
    return (
      <Box sx={{ 
        p: 4, 
        maxWidth: 1200, 
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <Typography variant="h5" sx={{ mb: 3, color: '#1D1D1F', fontWeight: 600 }}>
          Evaluating Business Rules...
        </Typography>
        <Box sx={{ width: '100%', maxWidth: 400, mb: 2 }}>
          <LinearProgress 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: '#F2F2F7',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#007AFF',
                borderRadius: 4
              }
            }} 
          />
        </Box>
        <Typography variant="body2" sx={{ color: '#8E8E93' }}>
          Analyzing compliance and performance metrics...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto', backgroundColor: '#F2F2F7', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            color: '#1D1D1F', 
            mb: 1,
            fontSize: { xs: '2rem', md: '3rem' }
          }}
        >
          Rules Evaluation Dashboard
        </Typography>
        <Typography variant="h6" sx={{ color: '#8E8E93', fontWeight: 400 }}>
          Real-time compliance and performance monitoring
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 3, 
            border: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)'
          }}>
            <CardContent sx={{ textAlign: 'center', color: 'white' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {overallScore}%
              </Typography>
              <Typography variant="body1">Overall Compliance Score</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 3, 
            border: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            backgroundColor: 'white'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: '#34C759' }}>
                {passedRules}
              </Typography>
              <Typography variant="body1" sx={{ color: '#8E8E93' }}>Rules Passed</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 3, 
            border: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            backgroundColor: 'white'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: '#FF3B30' }}>
                {failedRules}
              </Typography>
              <Typography variant="body1" sx={{ color: '#8E8E93' }}>Issues Found</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Rules List */}
      <Grid container spacing={3}>
        {evaluatedRules.map((rule) => {
          const IconComponent = rule.icon
          const isExpanded = expandedRule === rule.id
          
          return (
            <Grid item xs={12} md={6} key={rule.id}>
              <Card 
                sx={{ 
                  borderRadius: 3, 
                  border: 'none',
                  boxShadow: isExpanded 
                    ? '0 8px 40px rgba(0,0,0,0.12)' 
                    : '0 4px 20px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
                  backgroundColor: 'white',
                  '&:hover': {
                    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)'
                  }
                }}
                onClick={() => handleRuleClick(rule.id)}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Rule Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ 
                      backgroundColor: getStatusColor(rule.result.severity),
                      mr: 2,
                      width: 48,
                      height: 48
                    }}>
                      <IconComponent sx={{ color: 'white' }} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 0.5 }}>
                        {rule.title}
                      </Typography>
                      <Chip 
                        label={rule.category}
                        size="small"
                        sx={{ 
                          backgroundColor: '#F2F2F7',
                          color: '#8E8E93',
                          border: 'none',
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: getStatusColor(rule.result.severity),
                        mr: 1
                      }}>
                        {getStatusIcon(rule.result.severity)}
                      </Box>
                      <IconButton size="small">
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Rule Summary */}
                  <Typography variant="body2" sx={{ color: '#8E8E93', mb: 2 }}>
                    {rule.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#1D1D1F' }}>
                      Result: {rule.result.actualValue}
                    </Typography>
                    <Chip 
                      label={rule.result.passed ? 'PASSED' : 'FAILED'}
                      size="small"
                      sx={{ 
                        backgroundColor: rule.result.passed 
                          ? 'rgba(52, 199, 89, 0.1)' 
                          : 'rgba(255, 59, 48, 0.1)',
                        color: rule.result.passed ? '#34C759' : '#FF3B30',
                        fontWeight: 600,
                        border: 'none'
                      }}
                    />
                  </Box>

                  {/* Expanded Details */}
                  <Collapse in={isExpanded} timeout={300}>
                    <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #F2F2F7' }}>
                      {/* Close Button */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation()
                            setExpandedRule(null)
                          }}
                          sx={{ 
                            backgroundColor: '#F2F2F7',
                            '&:hover': { backgroundColor: '#E5E5EA' }
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Evaluation Details */}
                      <Paper sx={{ 
                        p: 2, 
                        mb: 3, 
                        backgroundColor: '#F9F9FB',
                        borderRadius: 2,
                        border: 'none'
                      }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1D1D1F' }}>
                          Evaluation Details
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: '#3A3A3C' }}>
                          {rule.result.details}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                              Actual Value
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#1D1D1F' }}>
                              {rule.result.actualValue}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                              Expected Value
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#1D1D1F' }}>
                              {rule.result.expectedValue}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>

                      {/* Recommendations */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#1D1D1F' }}>
                          Recommendations
                        </Typography>
                        <List dense>
                          {rule.result.recommendations.map((recommendation, index) => (
                            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <Box sx={{ 
                                  width: 6, 
                                  height: 6, 
                                  borderRadius: '50%', 
                                  backgroundColor: '#007AFF' 
                                }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={recommendation}
                                primaryTypographyProps={{
                                  variant: 'body2',
                                  sx: { color: '#3A3A3C' }
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Footer */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#8E8E93' }}>
          Last evaluation: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Box>
  )
}

export default RulesEvaluationDashboard
