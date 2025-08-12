/**
 * @fileoverview Rules Evaluation Material Design 3 Modal Component
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
  Grid,
  Divider,
  Tooltip,
  Badge,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  useTheme
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  MonetizationOn as MonetizationOnIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  Shield as ShieldIcon,
  Analytics as AnalyticsIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Bolt as BoltIcon,
  Code as CodeIcon
} from '@mui/icons-material'

/**
 * Mock data for testing rule evaluations (with balanced pass/fail scenarios)
 */
const mockBusinessData = {
  account: {
    id: 'ACC-2025-001',
    balance: 15000,  // Increased to pass balance check
    creditScore: 720,  // Increased to pass credit check
    accountAge: 24,
    transactionCount: 156,
    lastTransactionDate: '2025-08-12',
    riskScore: 0.15,  // Reduced to pass risk assessment
    complianceScore: 0.92,
    kycStatus: 'VERIFIED',
    region: 'North America'
  },
  transactions: {
    monthlyVolume: 45000,  // Reduced to pass velocity check
    averageTransactionSize: 1250,
    largeTransactionCount: 3,
    dailyTransactionLimit: 50000,
    suspiciousActivityFlags: 0,
    internationalTransactions: 8,
    failedTransactions: 1
  },
  compliance: {
    amlScore: 0.85,  // Increased to pass AML check
    sanctionsCheckStatus: 'CLEAR',
    pepStatus: 'NOT_IDENTIFIED',
    lastKycUpdate: '2024-01-15',  // More recent to pass documentation check
    documentationComplete: true,  // Changed to true to pass
    regulatoryReporting: 'CURRENT'  // Changed to pass
  },
  performance: {
    systemUptime: 99.95,  // Increased to pass performance check
    avgResponseTime: 250,  // Improved to pass response time check
    errorRate: 0.001,  // Reduced to pass error rate check
    throughput: 1800,  // Increased to pass throughput check
    lastMaintenanceWindow: '2025-08-01'
  }
}

/**
 * Business rules with Material Design 3 styling approach
 */
const businessRules = [
  {
    id: 'CREDIT_SCORE',
    title: 'CREDIT_VALIDATION',
    subtitle: 'Account Credit Assessment Protocol',
    category: 'FINANCIAL_CONTROLS',
    severity: 'CRITICAL',
    icon: TrendingUpIcon,
    color: '#6750A4',
    evaluate: (data) => {
      const score = data.account.creditScore
      const threshold = 650
      return {
        passed: score >= threshold,
        severity: score < threshold ? 'error' : 'success',
        actualValue: score,
        expectedValue: `≥ ${threshold}`,
        statusCode: score >= threshold ? 'PASS_001' : 'FAIL_001',
        details: `Credit assessment returned score of ${score} against minimum threshold of ${threshold}`,
        systemLog: `[CREDIT_ENGINE] Score: ${score}, Threshold: ${threshold}, Result: ${score >= threshold ? 'PASS' : 'FAIL'}`,
        actions: score < threshold ? [
          'ESCALATE_TO_CREDIT_TEAM',
          'REQUEST_ADDITIONAL_DOCUMENTATION',
          'APPLY_RISK_MITIGATION_CONTROLS'
        ] : [
          'APPROVE_CREDIT_LIMIT',
          'CONTINUE_STANDARD_MONITORING'
        ]
      }
    }
  },
  {
    id: 'BALANCE_CHECK',
    title: 'BALANCE_VERIFICATION',
    subtitle: 'Minimum Balance Compliance Check',
    category: 'FINANCIAL_CONTROLS',
    severity: 'HIGH',
    icon: MonetizationOnIcon,
    color: '#625B71',
    evaluate: (data) => {
      const balance = data.account.balance
      const threshold = 10000
      return {
        passed: balance >= threshold,
        severity: balance >= threshold ? 'success' : 'error',
        actualValue: `$${balance.toLocaleString()}`,
        expectedValue: `≥ $${threshold.toLocaleString()}`,
        statusCode: balance >= threshold ? 'PASS_002' : 'FAIL_002',
        details: `Account balance verification shows $${balance.toLocaleString()} against required minimum of $${threshold.toLocaleString()}`,
        systemLog: `[BALANCE_ENGINE] Current: $${balance}, Required: $${threshold}, Status: ${balance >= threshold ? 'SUFFICIENT' : 'INSUFFICIENT'}`,
        actions: balance < threshold ? [
          'RESTRICT_ACCOUNT_OPERATIONS',
          'NOTIFY_ACCOUNT_MANAGER',
          'REQUEST_DEPOSIT_INSTRUCTIONS'
        ] : [
          'ENABLE_FULL_ACCOUNT_ACCESS',
          'MONITOR_BALANCE_TRENDS'
        ]
      }
    }
  },
  {
    id: 'AML_SCAN',
    title: 'AML_COMPLIANCE_SCAN',
    subtitle: 'Anti-Money Laundering Protocol',
    category: 'COMPLIANCE_ENGINE',
    severity: 'CRITICAL',
    icon: SecurityIcon,
    color: '#7D5260',
    evaluate: (data) => {
      const score = data.compliance.amlScore
      return {
        passed: score >= 0.8,
        severity: score >= 0.8 ? 'success' : score >= 0.6 ? 'warning' : 'error',
        actualValue: `${(score * 100).toFixed(1)}%`,
        expectedValue: '≥ 80.0%',
        statusCode: score >= 0.8 ? 'PASS_003' : score >= 0.6 ? 'WARN_003' : 'FAIL_003',
        details: `AML compliance engine returned confidence score of ${(score * 100).toFixed(1)}% against regulatory minimum of 80.0%`,
        systemLog: `[AML_ENGINE] Confidence: ${(score * 100).toFixed(1)}%, Threshold: 80.0%, Regulatory_Status: ${score >= 0.8 ? 'COMPLIANT' : 'NON_COMPLIANT'}`,
        actions: score < 0.8 ? [
          'TRIGGER_ENHANCED_DUE_DILIGENCE',
          'FLAG_FOR_MANUAL_REVIEW',
          'SUSPEND_HIGH_RISK_TRANSACTIONS'
        ] : [
          'MAINTAIN_STANDARD_MONITORING',
          'SCHEDULE_NEXT_REVIEW_CYCLE'
        ]
      }
    }
  },
  {
    id: 'RISK_ANALYZER',
    title: 'RISK_ASSESSMENT_ENGINE',
    subtitle: 'Comprehensive Risk Analysis',
    category: 'RISK_MANAGEMENT',
    severity: 'HIGH',
    icon: AnalyticsIcon,
    color: '#B3261E',
    evaluate: (data) => {
      const riskScore = data.account.riskScore
      const threshold = 0.25
      return {
        passed: riskScore <= threshold,
        severity: riskScore <= threshold ? 'success' : riskScore <= 0.5 ? 'warning' : 'error',
        actualValue: `${(riskScore * 100).toFixed(2)}%`,
        expectedValue: `≤ ${(threshold * 100).toFixed(2)}%`,
        statusCode: riskScore <= threshold ? 'PASS_004' : riskScore <= 0.5 ? 'WARN_004' : 'FAIL_004',
        details: `Risk assessment engine calculated overall risk score of ${(riskScore * 100).toFixed(2)}% against maximum threshold of ${(threshold * 100).toFixed(2)}%`,
        systemLog: `[RISK_ENGINE] Score: ${(riskScore * 100).toFixed(2)}%, Max_Threshold: ${(threshold * 100).toFixed(2)}%, Risk_Level: ${riskScore <= threshold ? 'LOW' : riskScore <= 0.5 ? 'MEDIUM' : 'HIGH'}`,
        actions: riskScore > threshold ? [
          'ACTIVATE_ENHANCED_MONITORING',
          'LIMIT_TRANSACTION_AMOUNTS',
          'REQUIRE_ADDITIONAL_APPROVALS'
        ] : [
          'MAINTAIN_STANDARD_CONTROLS',
          'CONTINUE_AUTOMATED_PROCESSING'
        ]
      }
    }
  },
  {
    id: 'VELOCITY_CHECK',
    title: 'TRANSACTION_VELOCITY_MONITOR',
    subtitle: 'High-Frequency Transaction Analysis',
    category: 'FRAUD_PREVENTION',
    severity: 'MEDIUM',
    icon: BoltIcon,
    color: '#8E4585',
    evaluate: (data) => {
      const volume = data.transactions.monthlyVolume
      const threshold = 50000
      return {
        passed: volume <= threshold,
        severity: volume > threshold ? 'warning' : 'success',
        actualValue: `$${volume.toLocaleString()}`,
        expectedValue: `≤ $${threshold.toLocaleString()}`,
        statusCode: volume <= threshold ? 'PASS_005' : 'WARN_005',
        details: `Transaction velocity monitor detected monthly volume of $${volume.toLocaleString()} against normal threshold of $${threshold.toLocaleString()}`,
        systemLog: `[VELOCITY_ENGINE] Monthly_Volume: $${volume}, Threshold: $${threshold}, Pattern: ${volume <= threshold ? 'NORMAL' : 'ELEVATED'}`,
        actions: volume > threshold ? [
          'ANALYZE_TRANSACTION_PATTERNS',
          'VERIFY_BUSINESS_JUSTIFICATION',
          'IMPLEMENT_VELOCITY_LIMITS'
        ] : [
          'CONTINUE_STANDARD_PROCESSING',
          'MAINTAIN_CURRENT_LIMITS'
        ]
      }
    }
  },
  {
    id: 'SYS_PERFORMANCE',
    title: 'SYSTEM_PERFORMANCE_MONITOR',
    subtitle: 'Infrastructure Availability Check',
    category: 'SYSTEM_OPERATIONS',
    severity: 'LOW',
    icon: MemoryIcon,
    color: '#316C58',
    evaluate: (data) => {
      const uptime = data.performance.systemUptime
      const threshold = 99.9
      return {
        passed: uptime >= threshold,
        severity: uptime >= threshold ? 'success' : uptime >= 99.5 ? 'warning' : 'error',
        actualValue: `${uptime}%`,
        expectedValue: `≥ ${threshold}%`,
        statusCode: uptime >= threshold ? 'PASS_006' : uptime >= 99.5 ? 'WARN_006' : 'FAIL_006',
        details: `System performance monitor reports ${uptime}% uptime against SLA requirement of ${threshold}%`,
        systemLog: `[SYS_MONITOR] Uptime: ${uptime}%, SLA_Requirement: ${threshold}%, Status: ${uptime >= threshold ? 'SLA_MET' : 'SLA_BREACH'}`,
        actions: uptime < threshold ? [
          'INVESTIGATE_SYSTEM_OUTAGES',
          'REVIEW_INFRASTRUCTURE_CAPACITY',
          'ESCALATE_TO_OPERATIONS_TEAM'
        ] : [
          'MAINTAIN_CURRENT_OPERATIONS',
          'CONTINUE_MONITORING'
        ]
      }
    }
  },
  {
    id: 'RESPONSE_TIME',
    title: 'RESPONSE_TIME_VALIDATION',
    subtitle: 'API Performance Metrics Check',
    category: 'SYSTEM_OPERATIONS',
    severity: 'MEDIUM',
    icon: SpeedIcon,
    color: '#2196F3',
    evaluate: (data) => {
      const responseTime = data.performance.avgResponseTime
      const threshold = 300
      return {
        passed: responseTime <= threshold,
        severity: responseTime <= threshold ? 'success' : responseTime <= 500 ? 'warning' : 'error',
        actualValue: `${responseTime}ms`,
        expectedValue: `≤ ${threshold}ms`,
        statusCode: responseTime <= threshold ? 'PASS_007' : responseTime <= 500 ? 'WARN_007' : 'FAIL_007',
        details: `API response time monitor shows average of ${responseTime}ms against performance target of ${threshold}ms`,
        systemLog: `[PERF_MONITOR] Avg_Response: ${responseTime}ms, Target: ${threshold}ms, Status: ${responseTime <= threshold ? 'OPTIMAL' : 'DEGRADED'}`,
        actions: responseTime > threshold ? [
          'OPTIMIZE_DATABASE_QUERIES',
          'REVIEW_CACHING_STRATEGY',
          'SCALE_INFRASTRUCTURE_RESOURCES'
        ] : [
          'MAINTAIN_CURRENT_CONFIGURATION',
          'CONTINUE_PERFORMANCE_MONITORING'
        ]
      }
    }
  },
  {
    id: 'ERROR_RATE',
    title: 'ERROR_RATE_THRESHOLD',
    subtitle: 'System Error Monitoring',
    category: 'SYSTEM_OPERATIONS',
    severity: 'HIGH',
    icon: SecurityIcon,
    color: '#FF5722',
    evaluate: (data) => {
      const errorRate = data.performance.errorRate
      const threshold = 0.005
      return {
        passed: errorRate <= threshold,
        severity: errorRate <= threshold ? 'success' : errorRate <= 0.01 ? 'warning' : 'error',
        actualValue: `${(errorRate * 100).toFixed(3)}%`,
        expectedValue: `≤ ${(threshold * 100).toFixed(3)}%`,
        statusCode: errorRate <= threshold ? 'PASS_008' : errorRate <= 0.01 ? 'WARN_008' : 'FAIL_008',
        details: `System error rate monitoring shows ${(errorRate * 100).toFixed(3)}% against maximum threshold of ${(threshold * 100).toFixed(3)}%`,
        systemLog: `[ERROR_MONITOR] Error_Rate: ${(errorRate * 100).toFixed(3)}%, Threshold: ${(threshold * 100).toFixed(3)}%, Status: ${errorRate <= threshold ? 'HEALTHY' : 'DEGRADED'}`,
        actions: errorRate > threshold ? [
          'INVESTIGATE_ERROR_PATTERNS',
          'REVIEW_EXCEPTION_HANDLING',
          'IMPLEMENT_CIRCUIT_BREAKERS'
        ] : [
          'MAINTAIN_ERROR_MONITORING',
          'CONTINUE_PROACTIVE_ALERTING'
        ]
      }
    }
  },
  {
    id: 'THROUGHPUT_CHECK',
    title: 'THROUGHPUT_CAPACITY_MONITOR',
    subtitle: 'Transaction Processing Rate',
    category: 'SYSTEM_OPERATIONS',
    severity: 'MEDIUM',
    icon: StorageIcon,
    color: '#9C27B0',
    evaluate: (data) => {
      const throughput = data.performance.throughput
      const threshold = 1200
      return {
        passed: throughput >= threshold,
        severity: throughput >= threshold ? 'success' : throughput >= 800 ? 'warning' : 'error',
        actualValue: `${throughput} TPS`,
        expectedValue: `≥ ${threshold} TPS`,
        statusCode: throughput >= threshold ? 'PASS_009' : throughput >= 800 ? 'WARN_009' : 'FAIL_009',
        details: `Transaction processing throughput shows ${throughput} transactions per second against minimum requirement of ${threshold} TPS`,
        systemLog: `[THROUGHPUT_MONITOR] Current: ${throughput} TPS, Required: ${threshold} TPS, Status: ${throughput >= threshold ? 'SUFFICIENT' : 'INSUFFICIENT'}`,
        actions: throughput < threshold ? [
          'SCALE_PROCESSING_CAPACITY',
          'OPTIMIZE_TRANSACTION_FLOW',
          'IMPLEMENT_LOAD_BALANCING'
        ] : [
          'MAINTAIN_CURRENT_CAPACITY',
          'MONITOR_PEAK_USAGE_PATTERNS'
        ]
      }
    }
  },
  {
    id: 'DOCUMENTATION_CHECK',
    title: 'DOCUMENTATION_COMPLIANCE',
    subtitle: 'KYC Documentation Validation',
    category: 'COMPLIANCE_ENGINE',
    severity: 'HIGH',
    icon: ShieldIcon,
    color: '#4CAF50',
    evaluate: (data) => {
      const documentationComplete = data.compliance.documentationComplete
      const lastUpdate = new Date(data.compliance.lastKycUpdate)
      const now = new Date()
      const daysSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24))
      const maxDays = 365
      
      return {
        passed: documentationComplete && daysSinceUpdate <= maxDays,
        severity: (documentationComplete && daysSinceUpdate <= maxDays) ? 'success' : daysSinceUpdate <= 400 ? 'warning' : 'error',
        actualValue: documentationComplete ? `Complete (${daysSinceUpdate} days old)` : 'Incomplete',
        expectedValue: `Complete & ≤ ${maxDays} days`,
        statusCode: (documentationComplete && daysSinceUpdate <= maxDays) ? 'PASS_010' : 'WARN_010',
        details: `KYC documentation status: ${documentationComplete ? 'Complete' : 'Incomplete'}, last updated ${daysSinceUpdate} days ago`,
        systemLog: `[KYC_MONITOR] Documentation: ${documentationComplete ? 'COMPLETE' : 'INCOMPLETE'}, Last_Update: ${daysSinceUpdate}_days_ago, Status: ${(documentationComplete && daysSinceUpdate <= maxDays) ? 'COMPLIANT' : 'NON_COMPLIANT'}`,
        actions: !(documentationComplete && daysSinceUpdate <= maxDays) ? [
          'REQUEST_UPDATED_DOCUMENTATION',
          'SCHEDULE_KYC_REVIEW',
          'NOTIFY_COMPLIANCE_TEAM'
        ] : [
          'MAINTAIN_DOCUMENTATION_CURRENT',
          'SCHEDULE_PERIODIC_REVIEW'
        ]
      }
    }
  }
]

/**
 * Material Design 3 Rules Evaluation Modal Component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal closes
 * @returns {JSX.Element} Rules evaluation modal with MD3 styling
 */
function RulesEvaluationMD3Modal({ open, onClose }) {
  const theme = useTheme()
  const [evaluatedRules, setEvaluatedRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedRule, setExpandedRule] = useState(null)

  // Theme-aware colors
  const isDark = theme.palette.mode === 'dark'
  const bgPrimary = isDark ? '#121212' : '#FAFAFA'
  const bgSecondary = isDark ? '#1F1F1F' : '#FFFFFF'
  const bgTertiary = isDark ? '#333333' : '#F5F5F5'
  const textPrimary = isDark ? '#FFFFFF' : '#1A1A1A'
  const textSecondary = isDark ? '#AAAAAA' : '#666666'
  const accentColor = isDark ? '#BB86FC' : '#6750A4'
  const terminalColor = isDark ? '#00FF00' : '#2E7D32'
  const borderColor = isDark ? '#333333' : '#E0E0E0'

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
      }, 1200)
    }
  }, [open])

  const getStatusColor = (severity) => {
    switch (severity) {
      case 'success': return '#4CAF50'
      case 'warning': return '#FF9800'
      case 'error': return '#F44336'
      default: return '#9E9E9E'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return '#D32F2F'
      case 'HIGH': return '#F57C00'
      case 'MEDIUM': return '#1976D2'
      case 'LOW': return '#388E3C'
      default: return '#757575'
    }
  }

  const getStatusIcon = (severity, passed) => {
    if (passed) {
      return <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 20 }} />
    } else if (severity === 'warning') {
      return <WarningIcon sx={{ color: '#FF9800', fontSize: 20 }} />
    } else {
      return <ErrorIcon sx={{ color: '#F44336', fontSize: 20 }} />
    }
  }

  const getOverallStats = () => {
    const passed = evaluatedRules.filter(rule => rule.result?.passed).length
    const failed = evaluatedRules.filter(rule => !rule.result?.passed).length
    const total = evaluatedRules.length
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
          sx: { 
            borderRadius: 3,
            backgroundColor: bgPrimary,
            color: textPrimary
          }
        }}
      >
        <DialogContent sx={{ backgroundColor: bgPrimary, color: textPrimary }}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 6,
            textAlign: 'center'
          }}>
            <CodeIcon sx={{ fontSize: 48, color: accentColor, mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 3, color: textPrimary, fontFamily: 'monospace', fontWeight: 700 }}>
              INITIALIZING RULE ENGINE...
            </Typography>
            <Box sx={{ width: '100%', maxWidth: 400, mb: 3 }}>
              <LinearProgress 
                sx={{ 
                  height: 4, 
                  borderRadius: 2,
                  backgroundColor: bgTertiary,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: accentColor
                  }
                }} 
              />
            </Box>
            <Typography variant="body2" sx={{ color: textSecondary, fontFamily: 'monospace' }}>
              LOADING BUSINESS_RULES.CONFIG
            </Typography>
            <Typography variant="body2" sx={{ color: textSecondary, fontFamily: 'monospace' }}>
              ANALYZING COMPLIANCE_DATA.JSON
            </Typography>
            <Typography variant="body2" sx={{ color: textSecondary, fontFamily: 'monospace' }}>
              EXECUTING VALIDATION_PROTOCOLS...
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
            backgroundColor: bgPrimary,
            color: textPrimary,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: bgSecondary,
          color: textPrimary,
          borderBottom: `2px solid ${borderColor}`,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 700, color: accentColor }}>
                RULE_ENGINE_DASHBOARD
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: textSecondary }}>
                v2.1.3 | BUILD_20250812 | STATUS_ACTIVE
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={`${stats.score}% COMPLIANCE`}
                sx={{ 
                  backgroundColor: stats.score >= 80 ? '#4CAF50' : stats.score >= 60 ? '#FF9800' : '#F44336',
                  color: '#FFFFFF',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  borderRadius: 2
                }}
              />
              <IconButton onClick={onClose} sx={{ color: textPrimary }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

      <DialogContent sx={{ backgroundColor: bgPrimary, p: 0 }}>
        {/* Command Bar */}
        <Box sx={{ 
          backgroundColor: bgSecondary, 
          p: 1.5, 
          borderBottom: `1px solid ${borderColor}`,
          fontFamily: 'monospace'
        }}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.7rem' }}>TOTAL_RULES</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AssessmentIcon sx={{ color: textPrimary, fontSize: 16 }} />
                <Typography variant="h5" sx={{ color: textPrimary, fontWeight: 700 }}>{stats.total}</Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.7rem' }}>PASSED</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CheckCircleIcon sx={{ color: '#4CAF50', fontSize: 16 }} />
                <Typography variant="h5" sx={{ color: '#4CAF50', fontWeight: 700 }}>{stats.passed}</Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.7rem' }}>FAILED</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ErrorIcon sx={{ color: '#F44336', fontSize: 16 }} />
                <Typography variant="h5" sx={{ color: '#F44336', fontWeight: 700 }}>{stats.failed}</Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.7rem' }}>COMPLIANCE_SCORE</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ShieldIcon sx={{ color: accentColor, fontSize: 16 }} />
                <Typography variant="h5" sx={{ color: accentColor, fontWeight: 700 }}>{stats.score}%</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Rules List */}
        <Box sx={{ maxHeight: '65vh', overflow: 'auto', backgroundColor: bgPrimary }}>
          {evaluatedRules.map((rule, index) => {
            const IconComponent = rule.icon
            const isExpanded = expandedRule === rule.id
            
            return (
              <Box key={rule.id}>
                <Paper sx={{ 
                  backgroundColor: bgSecondary,
                  borderRadius: 2,
                  border: `2px solid ${rule.color}`,
                  m: 1,
                  overflow: 'hidden'
                }}>
                  <Box 
                    sx={{ 
                      p: 1.5,
                      cursor: 'pointer',
                      backgroundColor: rule.color + '20',
                      borderBottom: '1px solid ' + rule.color
                    }}
                    onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getStatusIcon(rule.result.severity, rule.result.passed)}
                        </Box>
                        <Avatar sx={{ 
                          backgroundColor: rule.color,
                          width: 36,
                          height: 36,
                          borderRadius: 2
                        }}>
                          <IconComponent sx={{ color: '#FFFFFF', fontSize: 20 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ 
                            fontFamily: 'monospace', 
                            fontWeight: 700, 
                            color: textPrimary,
                            fontSize: '0.95rem',
                            lineHeight: 1.2
                          }}>
                            {rule.title}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: textSecondary, 
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            lineHeight: 1.1
                          }}>
                            {rule.subtitle}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                            <Chip 
                              label={rule.category}
                              size="small"
                              sx={{ 
                                backgroundColor: bgTertiary,
                                color: textPrimary,
                                fontFamily: 'monospace',
                                fontSize: '0.6rem',
                                height: 18,
                                borderRadius: 1
                              }}
                            />
                            <Chip 
                              label={rule.severity}
                              size="small"
                              sx={{ 
                                backgroundColor: getSeverityColor(rule.severity),
                                color: '#FFFFFF',
                                fontFamily: 'monospace',
                                fontSize: '0.6rem',
                                height: 18,
                                borderRadius: 1
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" sx={{ 
                            color: textSecondary, 
                            fontFamily: 'monospace',
                            fontSize: '0.7rem'
                          }}>
                            STATUS_CODE
                          </Typography>
                          <Typography variant="subtitle1" sx={{ 
                            color: getStatusColor(rule.result.severity),
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: '0.9rem'
                          }}>
                            {rule.result.statusCode}
                          </Typography>
                        </Box>
                        {getStatusIcon(rule.result.severity, rule.result.passed)}
                        <IconButton size="small" sx={{ color: textPrimary }}>
                          <ExpandMoreIcon sx={{ 
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                            fontSize: 20
                          }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <Box sx={{ backgroundColor: bgSecondary, p: 1.5 }}>
                      <Alert 
                        severity={rule.result.severity}
                        sx={{ 
                          mb: 1.5,
                          backgroundColor: getStatusColor(rule.result.severity) + '20',
                          color: textPrimary,
                          border: `1px solid ${getStatusColor(rule.result.severity)}`,
                          borderRadius: 2,
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                          '& .MuiAlert-message': { padding: '4px 0' }
                        }}
                      >
                        {rule.result.details}
                      </Alert>

                      <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
                        <Grid item xs={6}>
                          <Paper sx={{ 
                            p: 1.5, 
                            backgroundColor: bgTertiary,
                            borderRadius: 2,
                            border: `1px solid ${borderColor}`
                          }}>
                            <Typography variant="caption" sx={{ 
                              color: textSecondary, 
                              fontFamily: 'monospace',
                              fontSize: '0.7rem'
                            }}>
                              ACTUAL_VALUE
                            </Typography>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700, 
                              color: textPrimary,
                              fontFamily: 'monospace',
                              fontSize: '1rem'
                            }}>
                              {rule.result.actualValue}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper sx={{ 
                            p: 1.5, 
                            backgroundColor: bgTertiary,
                            borderRadius: 2,
                            border: `1px solid ${borderColor}`
                          }}>
                            <Typography variant="caption" sx={{ 
                              color: textSecondary, 
                              fontFamily: 'monospace',
                              fontSize: '0.7rem'
                            }}>
                              EXPECTED_VALUE
                            </Typography>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 700, 
                              color: textPrimary,
                              fontFamily: 'monospace',
                              fontSize: '1rem'
                            }}>
                              {rule.result.expectedValue}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>

                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="subtitle2" sx={{ 
                          mb: 0.5, 
                          fontFamily: 'monospace', 
                          color: accentColor,
                          fontWeight: 700,
                          fontSize: '0.8rem'
                        }}>
                          SYSTEM_LOG:
                        </Typography>
                        <Paper sx={{ 
                          p: 1.5, 
                          backgroundColor: isDark ? '#000000' : '#F8F8F8',
                          borderRadius: 2,
                          border: `1px solid ${borderColor}`
                        }}>
                          <Typography variant="body2" sx={{ 
                            fontFamily: 'monospace', 
                            color: terminalColor,
                            fontSize: '0.7rem'
                          }}>
                            {rule.result.systemLog}
                          </Typography>
                        </Paper>
                      </Box>

                      <Typography variant="subtitle2" sx={{ 
                        mb: 0.5, 
                        fontFamily: 'monospace', 
                        color: accentColor,
                        fontWeight: 700,
                        fontSize: '0.8rem'
                      }}>
                        RECOMMENDED_ACTIONS:
                      </Typography>
                      <List dense sx={{ backgroundColor: bgTertiary, borderRadius: 2, py: 0.5 }}>
                        {rule.result.actions.map((action, actionIndex) => (
                          <ListItem key={actionIndex} sx={{ py: 0.25, px: 1 }}>
                            <ListItemIcon sx={{ minWidth: 20 }}>
                              <Box sx={{ 
                                width: 4, 
                                height: 4, 
                                backgroundColor: accentColor,
                                borderRadius: 1
                              }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={action}
                              primaryTypographyProps={{
                                fontFamily: 'monospace',
                                fontSize: '0.75rem',
                                color: textPrimary
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Paper>
                {index < evaluatedRules.length - 1 && (
                  <Divider sx={{ borderColor: borderColor, mx: 1 }} />
                )}
              </Box>
            )
          })}
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        backgroundColor: bgSecondary, 
        borderTop: `2px solid ${borderColor}`,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        p: 2
      }}>
        <Typography variant="caption" sx={{ 
          color: textSecondary, 
          flexGrow: 1,
          fontFamily: 'monospace'
        }}>
          EXECUTION_TIME: {new Date().toLocaleTimeString()} | MODE: PRODUCTION | ENVIRONMENT: SECURE
        </Typography>
        <Button 
          onClick={onClose} 
          variant="contained" 
          sx={{ 
            backgroundColor: accentColor,
            color: isDark ? '#000000' : '#FFFFFF',
            fontFamily: 'monospace',
            fontWeight: 700,
            borderRadius: 2,
            '&:hover': { backgroundColor: isDark ? '#9965F4' : '#5A3A8A' }
          }}
        >
          TERMINATE_SESSION
        </Button>
      </DialogActions>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
          }
        `}
      </style>
    </Dialog>
  )
}

export default RulesEvaluationMD3Modal
