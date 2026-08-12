'use client';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { theme } from '@/theme/theme';
import { HelpProvider } from '@/components/HelpProvider';
import { HelpDialog } from '@/components/HelpDialog';
import { WelcomeDialog } from '@/components/WelcomeDialog';
import { AssistantProvider } from '@/components/AssistantProvider';
import { AssistantDrawer } from '@/components/AssistantDrawer';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <HelpProvider>
          <AssistantProvider>
            {children}
            <WelcomeDialog />
            <HelpDialog />
            <AssistantDrawer />
          </AssistantProvider>
        </HelpProvider>
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
