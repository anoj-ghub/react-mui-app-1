/**
 * @fileoverview Rules Evaluation Timeline Modal Component
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
  Collapse,
  Alert,
  Stack,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  TrendingUp as TrendingUpIcon,
  MonetizationOn as MonetizationOnIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  Shield as ShieldIcon,
  Analytics as AnalyticsIcon,
  Schedule as ScheduleIcon,
  CheckCircleOutline as CheckCircleOutlineIcon
} from '@mui/icons-material'

/**
 * Mock data for testing rule evaluations
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
 * Business rules with execution order
 */
const businessRules = [
  {
    id: 'CREDIT_SCORE',
    title: 'Credit Score Validation',
    description: 'Account credit score assessment',
    icon: TrendingUpIcon,
    order: 1,
    executionTime: '0.2s',
    evaluate: (data) => {
      const score = data.account.creditScore
      const threshold = 650
      return {
        passed: score >= threshold,
        severity: score < threshold ? 'error' : 'success',
        actualValue: score,
        expectedValue: `≥ ${threshold}`,
        details: `Credit score of ${score} ${score >= threshold ? 'meets' : 'falls below'} the minimum requirement of ${threshold}`,
        recommendation: score < threshold ? 'Review credit enhancement options' : 'Credit requirements satisfied'
      }
    }
  },
  {
    id: 'ACCOUNT_BALANCE',
    title: 'Balance Verification',
    description: 'Minimum balance requirement check',
    icon: MonetizationOnIcon,
    order: 2,
    executionTime: '0.1s',
    evaluate: (data) => {
      const balance = data.account.balance
      const threshold = 10000
      return {
        passed: balance >= threshold,
        severity: balance >= threshold ? 'success' : 'error',
        actualValue: `$${balance.toLocaleString()}`,
        expectedValue: `≥ $${threshold.toLocaleString()}`,
        details: `Account balance of $${balance.toLocaleString()} ${balance >= threshold ? 'exceeds' : 'is below'} minimum requirement`,
        recommendation: balance < threshold ? 'Request additional funding' : 'Balance requirements met'
      }
    }
  },
  {
    id: 'AML_COMPLIANCE',
    title: 'AML Compliance Check',
    description: 'Anti-Money Laundering verification',
    icon: ShieldIcon,
    order: 3,
    executionTime: '0.8s',
    evaluate: (data) => {
      const score = data.compliance.amlScore
      return {
        passed: score >= 0.8,
        severity: score >= 0.8 ? 'success' : score >= 0.6 ? 'warning' : 'error',
        actualValue: `${(score * 100).toFixed(1)}%`,
        expectedValue: '≥ 80%',
        details: `AML compliance score of ${(score * 100).toFixed(1)}% ${score >= 0.8 ? 'meets' : 'requires attention for'} regulatory standards`,
        recommendation: score < 0.8 ? 'Update customer due diligence documentation' : 'AML compliance acceptable'
      }
    }
  },
  {
    id: 'RISK_ASSESSMENT',
    title: 'Risk Score Analysis',
    description: 'Comprehensive risk evaluation',
    icon: AnalyticsIcon,
    order: 4,
    executionTime: '0.5s',
    evaluate: (data) => {
      const riskScore = data.account.riskScore
      const threshold = 0.25
      return {
        passed: riskScore <= threshold,
        severity: riskScore <= threshold ? 'success' : riskScore <= 0.5 ? 'warning' : 'error',
        actualValue: `${(riskScore * 100).toFixed(1)}%`,
        expectedValue: `≤ ${(threshold * 100).toFixed(1)}%`,
        details: `Overall risk score of ${(riskScore * 100).toFixed(1)}% ${riskScore <= threshold ? 'is within' : 'exceeds'} acceptable limits`,
        recommendation: riskScore > threshold ? 'Implement additional monitoring controls' : 'Risk profile acceptable'
      }
    }
  },
  {
    id: 'TRANSACTION_VELOCITY',
    title: 'Transaction Monitoring',
    description: 'Volume and velocity analysis',
    icon: SpeedIcon,
    order: 5,
    executionTime: '0.3s',
    evaluate: (data) => {
      const volume = data.transactions.monthlyVolume
      const threshold = 50000
      return {
        passed: volume <= threshold,
        severity: volume > threshold ? 'warning' : 'success',
        actualValue: `$${volume.toLocaleString()}`,
        expectedValue: `≤ $${threshold.toLocaleString()}`,
        details: `Monthly volume of $${volume.toLocaleString()} ${volume <= threshold ? 'is within' : 'exceeds'} normal thresholds`,
        recommendation: volume > threshold ? 'Review transaction patterns for anomalies' : 'Transaction velocity within normal range'
      }
    }
  },
  {
    id: 'SYSTEM_PERFORMANCE',
    title: 'Performance Validation',
    description: 'System availability check',
    icon: AssessmentIcon,
    order: 6,
    executionTime: '0.1s',
    evaluate: (data) => {
      const uptime = data.performance.systemUptime
      const threshold = 99.9
      return {
        passed: uptime >= threshold,
        severity: uptime >= threshold ? 'success' : uptime >= 99.5 ? 'warning' : 'error',
        actualValue: `${uptime}%`,
        expectedValue: `≥ ${threshold}%`,
        details: `System uptime of ${uptime}% ${uptime >= threshold ? 'meets' : 'falls short of'} SLA requirements`,
        recommendation: uptime < threshold ? 'Investigate recent system outages' : 'System performance meets SLA'
      }
    }
  }
]

/**
 * Rules Evaluation Timeline Modal Component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal closes
 * @returns {JSX.Element} Rules evaluation timeline modal
 */
function RulesEvaluationTimelineModal({ open, onClose }) {
  const [evaluatedRules, setEvaluatedRules] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [expandedRule, setExpandedRule] = useState(null)

  useEffect(() => {
    if (open) {
      setLoading(true)
      setCurrentStep(0)
      setEvaluatedRules([])
      
      // Simulate step-by-step evaluation
      const evaluateRules = async () => {
        const results = []
        
        for (let i = 0; i < businessRules.length; i++) {
          setCurrentStep(i + 1)
          
          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 800))
          
          const rule = businessRules[i]
          const result = {
            ...rule,
            result: rule.evaluate(mockBusinessData)
          }
          
          results.push(result)
          setEvaluatedRules([...results])
        }
        
        setLoading(false)
      }
      
      evaluateRules()
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

  const getStatusIcon = (severity) => {
    switch (severity) {
      case 'success': return <CheckCircleIcon />
      case 'warning': return <WarningIcon />
      case 'error': return <ErrorIcon />
      default: return <CheckCircleOutlineIcon />
    }
  }

  const overallStats = evaluatedRules.length > 0 ? {
    passed: evaluatedRules.filter(rule => rule.result?.passed).length,
    failed: evaluatedRules.filter(rule => !rule.result?.passed).length,
    total: evaluatedRules.length
  } : { passed: 0, failed: 0, total: 0 }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
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
            Rules Evaluation Timeline
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!loading && (
              <Chip 
                label={`${overallStats.passed}/${overallStats.total} Passed`}
                sx={{ 
                  backgroundColor: overallStats.passed === overallStats.total ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                  color: overallStats.passed === overallStats.total ? '#34C759' : '#FF3B30',
                  fontWeight: 600
                }}
              />
            )}
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, height: '100%', overflow: 'auto' }}>
        {loading && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1D1D1F' }}>
              Executing Rules Evaluation Pipeline
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <CircularProgress size={20} sx={{ mr: 2 }} />
              <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                Step {currentStep} of {businessRules.length}: Processing {businessRules[currentStep - 1]?.title || 'Initializing...'}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(currentStep / businessRules.length) * 100}
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
        )}

        {evaluatedRules.length > 0 && (
          <Box sx={{ p: 3 }}>
            <Stepper activeStep={evaluatedRules.length} orientation="vertical">
              {businessRules.map((rule, index) => {
                const evaluatedRule = evaluatedRules.find(r => r.id === rule.id)
                const IconComponent = rule.icon
                const isExpanded = expandedRule === rule.id
                const isCompleted = !!evaluatedRule
                const isProcessing = currentStep === index + 1 && loading
                
                return (
                  <Step key={rule.id} completed={isCompleted}>
                    <StepLabel 
                      StepIconComponent={() => (
                        <Box sx={{ position: 'relative' }}>
                          {isProcessing ? (
                            <Avatar sx={{ 
                              backgroundColor: '#007AFF',
                              width: 40,
                              height: 40,
                              animation: 'pulse 1.5s infinite'
                            }}>
                              <CircularProgress size={20} sx={{ color: 'white' }} />
                            </Avatar>
                          ) : (
                            <Avatar sx={{ 
                              backgroundColor: isCompleted ? getStatusColor(evaluatedRule.result.severity) : '#E5E5EA',
                              width: 40,
                              height: 40
                            }}>
                              {isCompleted ? (
                                <IconComponent sx={{ fontSize: 20, color: 'white' }} />
                              ) : (
                                <ScheduleIcon sx={{ fontSize: 20, color: '#8E8E93' }} />
                              )}
                            </Avatar>
                          )}
                          <Box sx={{ 
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}>
                            <Typography variant="caption" sx={{ 
                              backgroundColor: 'white',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              border: '1px solid #E5E5EA',
                              fontSize: '0.7rem',
                              color: '#8E8E93'
                            }}>
                              {rule.executionTime}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F' }}>
                            {rule.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                            Step {rule.order} • {rule.description}
                          </Typography>
                        </Box>
                        {isCompleted && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label={evaluatedRule.result.passed ? 'PASS' : 'FAIL'}
                              size="small"
                              sx={{
                                backgroundColor: evaluatedRule.result.passed ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                                color: evaluatedRule.result.passed ? '#34C759' : '#FF3B30',
                                fontWeight: 600
                              }}
                            />
                            <IconButton 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedRule(isExpanded ? null : rule.id)
                              }}
                            >
                              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    </StepLabel>
                    <StepContent>
                      <Card 
                        sx={{ 
                          cursor: isCompleted ? 'pointer' : 'default',
                          opacity: isCompleted ? 1 : 0.5,
                          transition: 'all 0.2s',
                          ml: 2,
                          mb: 2
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          {isCompleted && (
                            <>
                              <Typography variant="body2" sx={{ color: '#1D1D1F', fontWeight: 500, mb: 1 }}>
                                Result: {evaluatedRule.result.actualValue}
                              </Typography>
                              
                              <Collapse in={isExpanded} timeout={300}>
                                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #F2F2F7' }}>
                                  <Alert 
                                    severity={evaluatedRule.result.severity}
                                    sx={{ mb: 2 }}
                                  >
                                    {evaluatedRule.result.details}
                                  </Alert>
                                  
                                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                    <Paper sx={{ p: 1, flex: 1 }}>
                                      <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                                        Actual Value
                                      </Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {evaluatedRule.result.actualValue}
                                      </Typography>
                                    </Paper>
                                    <Paper sx={{ p: 1, flex: 1 }}>
                                      <Typography variant="caption" sx={{ color: '#8E8E93' }}>
                                        Expected Value
                                      </Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {evaluatedRule.result.expectedValue}
                                      </Typography>
                                    </Paper>
                                  </Box>
                                  
                                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                    Recommendation:
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#3A3A3C' }}>
                                    {evaluatedRule.result.recommendation}
                                  </Typography>
                                </Box>
                              </Collapse>
                            </>
                          )}
                          
                          {isProcessing && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <CircularProgress size={16} />
                              <Typography variant="body2" sx={{ color: '#007AFF' }}>
                                Evaluating {rule.title}...
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </StepContent>
                  </Step>
                )
              })}
            </Stepper>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #F2F2F7' }}>
        <Typography variant="caption" sx={{ color: '#8E8E93', flexGrow: 1 }}>
          Timeline View • Step-by-step evaluation process
        </Typography>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RulesEvaluationTimelineModal
