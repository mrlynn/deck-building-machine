'use client';

import { createTheme } from '@mui/material/styles';
import { layoutTokens } from './tokens';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: layoutTokens.text, contrastText: '#FFFFFF' },
    secondary: { main: layoutTokens.textSecondary },
    success: { main: layoutTokens.accent },
    warning: { main: '#D97706' },
    error: { main: '#DC2626' },
    background: {
      default: layoutTokens.bg,
      paper: '#FFFFFF',
    },
    text: {
      primary: layoutTokens.text,
      secondary: layoutTokens.textSecondary,
    },
    divider: layoutTokens.border,
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h5: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: layoutTokens.bg },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 999,
          variants: [
            {
              props: { variant: 'contained', color: 'primary' },
              style: {
                backgroundColor: layoutTokens.text,
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#2a2820' },
              },
            },
            {
              props: { variant: 'outlined' },
              style: {
                borderColor: layoutTokens.border,
                color: layoutTokens.text,
              },
            },
          ],
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: { backgroundColor: 'transparent' },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          '&.Mui-completed': { color: layoutTokens.accent },
          '&.Mui-active': { color: layoutTokens.text },
        },
      },
    },
  },
});
