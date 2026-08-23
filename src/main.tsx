import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { I18nProvider } from './context/I18nContext';
import { NotificationProvider } from './context/NotificationContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { ThemeProvider } from './context/ThemeContext';
import { App } from './App';

// Import CSS Design System
import './styles/index.css';
import './styles/components.css';
import './styles/layouts.css';
import './styles/utilities.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <NotificationProvider>
            <MarketplaceProvider>
              <App />
            </MarketplaceProvider>
          </NotificationProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  </React.StrictMode>
);
