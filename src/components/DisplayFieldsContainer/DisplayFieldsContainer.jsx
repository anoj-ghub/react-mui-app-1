/**
 * @fileoverview Display-only fields container with beautiful MUI styling
 * @author System
 * @version 1.0.0
 */

import React from 'react'
import {
  Paper,
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme
} from '@mui/material'
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  AccountBalance as AccountIcon,
  CreditCard as CardIcon,
  Security as SecurityIcon,
  Language as LanguageIcon
} from '@mui/icons-material'

/**
 * Display-only fields container component with beautiful styling
 * 
 * Features:
 * - 10 professionally styled display fields
 * - Responsive grid layout
 * - Icon integration for visual appeal
 * - Hover effects and animations
 * - Dark mode support
 * - Card-based design with shadows
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.data] - Data object containing field values
 * @param {boolean} [props.darkMode=false] - Dark mode theme flag
 * @returns {JSX.Element} Display fields container component
 */
const DisplayFieldsContainer = ({ 
  data = {}, 
  darkMode = false 
}) => {
  const theme = useTheme()

  // Default data with sample values
  const defaultData = {
    fullName: 'John Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY, USA',
    department: 'Engineering',
    joinDate: '2023-01-15',
    accountNumber: 'ACC-2024-001234',
    cardType: 'Premium Business',
    securityLevel: 'Level 3 - High',
    language: 'English (US)'
  }

  // Merge provided data with defaults
  const displayData = { ...defaultData, ...data }

  // Field configuration with icons and styling
  const fields = [
    {
      key: 'fullName',
      label: 'Full Name',
      value: displayData.fullName,
      icon: PersonIcon,
      color: 'primary',
      type: 'text'
    },
    {
      key: 'email',
      label: 'Email Address',
      value: displayData.email,
      icon: EmailIcon,
      color: 'info',
      type: 'email'
    },
    {
      key: 'phone',
      label: 'Phone Number',
      value: displayData.phone,
      icon: PhoneIcon,
      color: 'success',
      type: 'text'
    },
    {
      key: 'location',
      label: 'Location',
      value: displayData.location,
      icon: LocationIcon,
      color: 'warning',
      type: 'text'
    },
    {
      key: 'department',
      label: 'Department',
      value: displayData.department,
      icon: WorkIcon,
      color: 'secondary',
      type: 'chip'
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      value: displayData.joinDate,
      icon: CalendarIcon,
      color: 'primary',
      type: 'date'
    },
    {
      key: 'accountNumber',
      label: 'Account Number',
      value: displayData.accountNumber,
      icon: AccountIcon,
      color: 'info',
      type: 'text'
    },
    {
      key: 'cardType',
      label: 'Card Type',
      value: displayData.cardType,
      icon: CardIcon,
      color: 'success',
      type: 'chip'
    },
    {
      key: 'securityLevel',
      label: 'Security Level',
      value: displayData.securityLevel,
      icon: SecurityIcon,
      color: 'error',
      type: 'chip'
    },
    {
      key: 'language',
      label: 'Language',
      value: displayData.language,
      icon: LanguageIcon,
      color: 'warning',
      type: 'text'
    }
  ]

  /**
   * Renders the value based on its type
   * @param {Object} field - Field configuration object
   * @returns {JSX.Element} Rendered field value
   */
  const renderFieldValue = (field) => {
    switch (field.type) {
      case 'chip':
        return (
          <Chip
            label={field.value}
            color={field.color}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.8rem',
              height: 28,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              }
            }}
          />
        )
      case 'date':
        return (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: 'text.primary',
              fontSize: '0.9rem'
            }}
          >
            {new Date(field.value).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        )
      case 'email':
        return (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: 'primary.main',
              fontSize: '0.9rem',
              textDecoration: 'underline',
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.dark',
              }
            }}
          >
            {field.value}
          </Typography>
        )
      default:
        return (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: 'text.primary',
              fontSize: '0.9rem'
            }}
          >
            {field.value}
          </Typography>
        )
    }
  }

  return (
    <Paper
      elevation={6}
      sx={{
        p: 3,
        borderRadius: 3,
        background: darkMode
          ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
          : 'linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)',
        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        boxShadow: darkMode
          ? '0 8px 32px rgba(0,0,0,0.3)'
          : '0 8px 32px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: darkMode
            ? '0 12px 40px rgba(0,0,0,0.4)'
            : '0 12px 40px rgba(0,0,0,0.15)',
        }
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            textAlign: 'center'
          }}
        >
          Profile Information
        </Typography>
        <Divider
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            height: 2,
            borderRadius: 1
          }}
        />
      </Box>

      {/* Fields Grid */}
      <Grid container spacing={3}>
        {fields.map((field, index) => {
          const IconComponent = field.icon
          
          return (
            <Grid item xs={12} sm={6} md={4} key={field.key}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: darkMode
                      ? '0 8px 25px rgba(0,0,0,0.3)'
                      : '0 8px 25px rgba(0,0,0,0.1)',
                    border: `1px solid ${theme.palette[field.color].main}`,
                  }
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  {/* Icon and Label Row */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1.5,
                      gap: 1
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: `${field.color}.main`,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <IconComponent sx={{ fontSize: '1.1rem', color: 'white' }} />
                    </Avatar>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: 'text.secondary',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5
                      }}
                    >
                      {field.label}
                    </Typography>
                  </Box>

                  {/* Value Display */}
                  <Box
                    sx={{
                      minHeight: 40,
                      display: 'flex',
                      alignItems: 'center',
                      ml: 5
                    }}
                  >
                    {renderFieldValue(field)}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Footer */}
      <Box
        sx={{
          mt: 3,
          pt: 2,
          borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontStyle: 'italic',
            fontSize: '0.75rem'
          }}
        >
          Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </Typography>
      </Box>
    </Paper>
  )
}

export default DisplayFieldsContainer
