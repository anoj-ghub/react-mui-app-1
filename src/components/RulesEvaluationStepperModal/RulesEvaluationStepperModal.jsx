/**
 * @fileoverview Rules Evaluation Stepper Modal Component
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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Divider,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Stack,
  Badge
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
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
  Analytics as AnalyticsIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon
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
 * Business rules configuration organized by categories
 */
const ruleCategories = [
  {
    id: 'financial',
    name: 'Financial Controls',
    description: 'Balance and credit assessments',
    icon: MonetizationOnIcon,
    color: '#34C759',
    rules: [
      {
        id: 'CREDIT_SCORE',
        title: 'Credit Score Validation',
        description: 'Credit score must meet minimum threshold',
        icon: TrendingUpIcon,
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
              'Continue monitoring for changes'
            ]
          }
        }
      },
      {
        id: 'ACCOUNT_BALANCE',
        title: 'Minimum Balance Requirement',
        description: 'Account must maintain minimum balance',
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
              'Review account fee structure',
              'Consider account type upgrade'
            ] : [
              'Balance requirements satisfied',
              'Monitor for significant withdrawals'
            ]
          }
        }
      }
    ]
  },
  {
    id: 'risk',
    name: 'Risk Management',
    description: 'Risk assessment and monitoring',
    icon: AnalyticsIcon,
    color: '#FF9500',
    rules: [
      {
        id: 'RISK_ASSESSMENT',
        title: 'Overall Risk Score',
        description: 'Comprehensive risk assessment',
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
              'Review all risk factors',
              'Implement additional monitoring',
              'Consider account restrictions'
            ] : [
              'Risk profile acceptable',
              'Continue standard monitoring'
            ]
          }
        }
      },
      {
        id: 'TRANSACTION_VELOCITY',
        title: 'Transaction Velocity Check',
        description: 'Monthly transaction volume limits',
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
              'Verify business justification',
              'Enhanced monitoring controls'
            ] : [
              'Transaction velocity normal',
              'Continue standard monitoring'
            ]
          }
        }
      }
    ]
  },
  {
    id: 'compliance',
    name: 'Compliance',
    description: 'Regulatory and legal requirements',
    icon: ShieldIcon,
    color: '#007AFF',
    rules: [
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
              'Review transaction monitoring',
              'Enhanced screening procedures'
            ] : [
              'AML compliance acceptable',
              'Maintain current procedures'
            ]
          }
        }
      }
    ]
  },
  {
    id: 'performance',
    name: 'Technical Performance',
    description: 'System performance and availability',
    icon: AssessmentIcon,
    color: '#FF3B30',
    rules: [
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
              'Review infrastructure capacity',
              'Implement redundancy improvements'
            ] : [
              'System performance meets SLA',
              'Continue monitoring'
            ]
          }
        }
      }
    ]
  }
]

/**
 * Rules Evaluation Stepper Modal Component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal closes
 * @returns {JSX.Element} Rules evaluation stepper modal
 */
function RulesEvaluationStepperModal({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0)
  const [evaluatedCategories, setEvaluatedCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)

  // Evaluate all rules when modal opens
  useEffect(() => {
    if (open) {
      setLoading(true)
      setActiveStep(0)
      setTimeout(() => {
        const results = ruleCategories.map(category => ({
          ...category,
          rules: category.rules.map(rule => ({
            ...rule,
            result: rule.evaluate(mockBusinessData)
          }))
        }))
        setEvaluatedCategories(results)
        setLoading(false)
      }, 1500)
    }
  }, [open])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
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

  const getAllRules = () => {
    return evaluatedCategories.flatMap(category => category.rules)
  }

  const getOverallStats = () => {
    const allRules = getAllRules()
    const passed = allRules.filter(rule => rule.result?.passed).length
    const failed = allRules.filter(rule => !rule.result?.passed).length
    const total = allRules.length
    const score = total > 0 ? Math.round((passed / total) * 100) : 0
    return { passed, failed, total, score }
  }

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
            py: 6
          }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#1D1D1F', fontWeight: 600 }}>
              Initializing Rules Evaluation...
            </Typography>
            <Box sx={{ width: '100%', maxWidth: 400, mb: 3 }}>
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
            <Typography variant="body2" sx={{ color: '#8E8E93', textAlign: 'center' }}>
              Analyzing business rules across financial, risk, compliance, and performance categories...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  const stats = getOverallStats()

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 3,
          maxHeight: '90vh',
          height: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        borderBottom: '1px solid #F2F2F7'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1D1D1F' }}>
            Rules Evaluation Wizard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={`${stats.score}% Overall Score`}
              sx={{ 
                backgroundColor: stats.score >= 80 ? 'rgba(52, 199, 89, 0.1)' : stats.score >= 60 ? 'rgba(255, 149, 0, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                color: stats.score >= 80 ? '#34C759' : stats.score >= 60 ? '#FF9500' : '#FF3B30',
                fontWeight: 600
              }}
            />
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Tab Navigation */}
        <Box sx={{ borderBottom: '1px solid #F2F2F7' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ px: 3 }}
          >
            <Tab label="Step-by-Step" />
            <Tab label="Category Overview" />
            <Tab label="Summary Report" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {/* Step-by-Step Tab */}
          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {evaluatedCategories.map((category, index) => {
                  const CategoryIcon = category.icon
                  const categoryPassed = category.rules.filter(rule => rule.result.passed).length
                  const categoryTotal = category.rules.length
                  
                  return (
                    <Step key={category.id}>
                      <StepLabel 
                        StepIconComponent={() => (
                          <Avatar sx={{ 
                            backgroundColor: category.color,
                            width: 32,
                            height: 32
                          }}>
                            <CategoryIcon sx={{ fontSize: 18, color: 'white' }} />
                          </Avatar>
                        )}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {category.name}
                          </Typography>
                          <Chip 
                            label={`${categoryPassed}/${categoryTotal} passed`}
                            size="small"
                            sx={{
                              backgroundColor: categoryPassed === categoryTotal ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                              color: categoryPassed === categoryTotal ? '#34C759' : '#FF3B30'
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                          {category.description}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Box sx={{ ml: 2 }}>
                          {category.rules.map((rule) => {
                            const RuleIcon = rule.icon
                            return (
                              <Accordion key={rule.id} sx={{ mb: 1, boxShadow: 'none', border: '1px solid #F2F2F7' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                    <Avatar sx={{ 
                                      backgroundColor: getStatusColor(rule.result.severity),
                                      width: 28,
                                      height: 28
                                    }}>
                                      <RuleIcon sx={{ fontSize: 14, color: 'white' }} />
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {rule.title}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                                        {rule.description}
                                      </Typography>
                                    </Box>
                                    <Chip 
                                      label={rule.result.passed ? 'PASS' : 'FAIL'}
                                      size="small"
                                      sx={{
                                        backgroundColor: rule.result.passed ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                                        color: rule.result.passed ? '#34C759' : '#FF3B30',
                                        fontWeight: 600
                                      }}
                                    />
                                  </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <Alert 
                                    severity={rule.result.severity}
                                    sx={{ mb: 2 }}
                                  >
                                    {rule.result.details}
                                  </Alert>
                                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                    <Paper sx={{ p: 1, flex: 1 }}>
                                      <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                                        Actual Value
                                      </Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {rule.result.actualValue}
                                      </Typography>
                                    </Paper>
                                    <Paper sx={{ p: 1, flex: 1 }}>
                                      <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                                        Expected Value
                                      </Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {rule.result.expectedValue}
                                      </Typography>
                                    </Paper>
                                  </Box>
                                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                    Recommendations:
                                  </Typography>
                                  <List dense>
                                    {rule.result.recommendations.map((rec, recIndex) => (
                                      <ListItem key={recIndex} sx={{ px: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 20 }}>
                                          <Box sx={{ 
                                            width: 4, 
                                            height: 4, 
                                            borderRadius: '50%', 
                                            backgroundColor: '#007AFF' 
                                          }} />
                                        </ListItemIcon>
                                        <ListItemText 
                                          primary={rec}
                                          primaryTypographyProps={{ variant: 'caption' }}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                </AccordionDetails>
                              </Accordion>
                            )
                          })}
                          <Box sx={{ mt: 2, mb: 1 }}>
                            <Button
                              variant="contained"
                              onClick={handleNext}
                              sx={{ mr: 1 }}
                              disabled={index === evaluatedCategories.length - 1}
                            >
                              {index === evaluatedCategories.length - 1 ? 'Finish' : 'Next Category'}
                            </Button>
                            <Button
                              disabled={index === 0}
                              onClick={handleBack}
                              sx={{ mr: 1 }}
                            >
                              Back
                            </Button>
                          </Box>
                        </Box>
                      </StepContent>
                    </Step>
                  )
                })}
              </Stepper>
              {activeStep === evaluatedCategories.length && (
                <Paper sx={{ p: 3, mt: 3, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    All categories evaluated!
                  </Typography>
                  <Button onClick={handleReset} sx={{ mr: 1 }}>
                    Reset
                  </Button>
                </Paper>
              )}
            </Box>
          )}

          {/* Category Overview Tab */}
          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                {evaluatedCategories.map((category) => {
                  const CategoryIcon = category.icon
                  const categoryPassed = category.rules.filter(rule => rule.result.passed).length
                  const categoryTotal = category.rules.length
                  
                  return (
                    <Card key={category.id} sx={{ borderRadius: 3, border: `2px solid ${category.color}20` }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ 
                            backgroundColor: category.color,
                            mr: 2,
                            width: 48,
                            height: 48
                          }}>
                            <CategoryIcon sx={{ color: 'white' }} />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {category.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                              {category.description}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h4" sx={{ 
                            fontWeight: 700, 
                            color: categoryPassed === categoryTotal ? '#34C759' : '#FF3B30'
                          }}>
                            {categoryPassed}/{categoryTotal}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                            Rules Passed
                          </Typography>
                        </Box>

                        <Stack spacing={1}>
                          {category.rules.map((rule) => (
                            <Box key={rule.id} sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              p: 1,
                              borderRadius: 1,
                              backgroundColor: '#F9F9FB'
                            }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {rule.title}
                              </Typography>
                              <Box sx={{ color: getStatusColor(rule.result.severity) }}>
                                {getStatusIcon(rule.result.severity)}
                              </Box>
                            </Box>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  )
                })}
              </Box>
            </Box>
          )}

          {/* Summary Report Tab */}
          {tabValue === 2 && (
            <Box sx={{ p: 3 }}>
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#F9F9FB' }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                  Executive Summary
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, mb: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#007AFF' }}>
                      {stats.score}%
                    </Typography>
                    <Typography variant="caption">Overall Score</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#34C759' }}>
                      {stats.passed}
                    </Typography>
                    <Typography variant="caption">Rules Passed</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#FF3B30' }}>
                      {stats.failed}
                    </Typography>
                    <Typography variant="caption">Rules Failed</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#8E8E93' }}>
                      {stats.total}
                    </Typography>
                    <Typography variant="caption">Total Rules</Typography>
                  </Box>
                </Box>
              </Paper>

              {stats.failed > 0 && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Action Required: {stats.failed} rule{stats.failed > 1 ? 's' : ''} failed evaluation
                  </Typography>
                  <Typography variant="body2">
                    Please review the failed rules and implement the recommended corrective actions.
                  </Typography>
                </Alert>
              )}

              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Category Breakdown
              </Typography>
              {evaluatedCategories.map((category) => {
                const categoryPassed = category.rules.filter(rule => rule.result.passed).length
                const categoryTotal = category.rules.length
                const categoryScore = Math.round((categoryPassed / categoryTotal) * 100)
                
                return (
                  <Box key={category.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                        {categoryScore}% ({categoryPassed}/{categoryTotal})
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={categoryScore}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#F2F2F7',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: category.color,
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                )
              })}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #F2F2F7' }}>
        <Typography variant="caption" sx={{ color: '#8E8E93', flexGrow: 1 }}>
          Last evaluation: {new Date().toLocaleString()}
        </Typography>
        <Button 
          onClick={() => window.location.reload()} 
          startIcon={<RefreshIcon />}
          sx={{ mr: 1 }}
        >
          Re-evaluate
        </Button>
        <Button 
          onClick={onClose} 
          variant="contained" 
          sx={{ 
            backgroundColor: '#007AFF',
            '&:hover': { backgroundColor: '#0056CC' }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RulesEvaluationStepperModal
