import React, { useState, useEffect } from 'react';
import { PioneersPage } from './pages/PioneersPage';
import { AboutPage } from './pages/AboutPage';
import { DivisionsPage } from './pages/DivisionsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { RewardsPage } from './pages/RewardsPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { SubmitTaskPage } from './pages/SubmitTaskPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { StoryPage } from './pages/StoryPage';
import { SquadTasksPage } from './pages/SquadTasksPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { AuthPage } from './pages/AuthPage';
import { CompleteProfilePage } from './pages/CompleteProfilePage';
import { PioneersNav } from './components/PioneersNav';
import { PioneersFooter } from './components/PioneersFooter';
import { StatusLookupModal } from './components/StatusLookupModal';
import { ContributorAuthModal } from './components/ContributorAuthModal';
import { ThemeProvider } from './context/ThemeContext';

export const App: React.FC = () => {
  // Normalize initial pathname
  const getInitialPath = (): string => {
    const p = window.location.pathname.toLowerCase().replace(/\/$/, '');
    return p === '' ? '/' : p;
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath());
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const [authPrefillApp, setAuthPrefillApp] = useState('');
  const [authPrefillPioneerId, setAuthPrefillPioneerId] = useState('');
  const [authPrefillCode, setAuthPrefillCode] = useState('');

  // Handle global auth modal open event
  useEffect(() => {
    const handleOpenAuth = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab?: 'signin' | 'signup'; appNumber?: string; pioneerId?: string; acceptanceCode?: string }>;
      if (customEvent.detail) {
        if (customEvent.detail.tab) setAuthModalTab(customEvent.detail.tab);
        if (customEvent.detail.appNumber) setAuthPrefillApp(customEvent.detail.appNumber);
        if (customEvent.detail.pioneerId) setAuthPrefillPioneerId(customEvent.detail.pioneerId);
        if (customEvent.detail.acceptanceCode) setAuthPrefillCode(customEvent.detail.acceptanceCode);
      }
      setAuthModalOpen(true);
    };

    window.addEventListener('refeir-open-auth', handleOpenAuth);

    const handleOpenStatus = () => {
      setStatusModalOpen(true);
    };
    window.addEventListener('refeir-open-status', handleOpenStatus);

    return () => {
      window.removeEventListener('refeir-open-auth', handleOpenAuth);
      window.removeEventListener('refeir-open-status', handleOpenStatus);
    };
  }, []);

  // Listen to browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const p = getInitialPath();
      setCurrentPath(p);

      // Handle hash scrolling if present
      if (window.location.hash) {
        const id = window.location.hash.replace('#', '');
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Universal Navigation Handler
  const handleNavigate = (target: string) => {
    // External links
    if (target.startsWith('http://') || target.startsWith('https://')) {
      window.open(target, '_blank', 'noopener,noreferrer');
      return;
    }

    // Hash link on same page
    if (target.startsWith('#')) {
      const id = target.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    // Hash link targeting home page (e.g. '/#apply' or '/#divisions')
    if (target.startsWith('/#')) {
      const id = target.replace('/#', '');
      if (currentPath === '/') {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.history.pushState({}, '', target);
        setCurrentPath('/');
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
      return;
    }

    // Standard page routes
    const cleanPath = target.toLowerCase().replace(/\/$/, '') || '/';
    if (cleanPath !== currentPath) {
      window.history.pushState({}, '', cleanPath);
      setCurrentPath(cleanPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Render active page component
  const renderPageContent = () => {
    const route = currentPath.split('?')[0].split('#')[0].toLowerCase().replace(/\/$/, '') || '/';
    switch (route) {
      case '/about':
        return (
          <>
            <PioneersNav currentPath={currentPath} onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <AboutPage onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <PioneersFooter onNavigate={handleNavigate} />
          </>
        );

      case '/divisions':
        return (
          <>
            <PioneersNav currentPath={currentPath} onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <DivisionsPage onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <PioneersFooter onNavigate={handleNavigate} />
          </>
        );

      case '/rewards':
      case '/contributor-ladder':
        return (
          <>
            <PioneersNav currentPath={currentPath} onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <RewardsPage onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <PioneersFooter onNavigate={handleNavigate} />
          </>
        );

      case '/how-it-works':
        return (
          <>
            <PioneersNav currentPath={currentPath} onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <HowItWorksPage onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <PioneersFooter onNavigate={handleNavigate} />
          </>
        );

      case '/faq':
        return (
          <>
            <PioneersNav currentPath={currentPath} onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <FAQPage onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <PioneersFooter onNavigate={handleNavigate} />
          </>
        );

      case '/contact':
        return (
          <>
            <PioneersNav currentPath={currentPath} onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <ContactPage onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <PioneersFooter onNavigate={handleNavigate} />
          </>
        );

      case '/submit-task':
      case '/proof-of-work':
      case '/report-task':
        return (
          <>
            <PioneersNav currentPath={currentPath} onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <SubmitTaskPage onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <PioneersFooter onNavigate={handleNavigate} />
          </>
        );

      case '/privacy':
        return (
          <>
            <PioneersNav currentPath={currentPath} onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <PrivacyPage onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <PioneersFooter onNavigate={handleNavigate} />
          </>
        );

      case '/terms':
        return (
          <>
            <PioneersNav currentPath={currentPath} onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <TermsPage onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <PioneersFooter onNavigate={handleNavigate} />
          </>
        );

      case '/story':
      case '/our-story':
      case '/history':
      case '/founder':
        return (
          <>
            <PioneersNav currentPath={currentPath} onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <StoryPage onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <PioneersFooter onNavigate={handleNavigate} />
          </>
        );

      case '/tasks':
      case '/missions':
      case '/daily-tasks':
      case '/squad-tasks':
      case '/bounties':
        return (
          <>
            <PioneersNav currentPath={currentPath} onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <SquadTasksPage onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <PioneersFooter onNavigate={handleNavigate} />
          </>
        );

      case '/admin':
      case '/admissions-portal':
        return <AdminPortalPage onNavigate={handleNavigate} />;

      case '/signin':
      case '/sign-in':
      case '/login':
        return (
          <>
            <PioneersNav currentPath={currentPath} onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <AuthPage
              initialTab="signin"
              onNavigate={handleNavigate}
              onOpenStatus={() => setStatusModalOpen(true)}
            />
            <PioneersFooter onNavigate={handleNavigate} />
          </>
        );

      case '/signup':
      case '/sign-up':
      case '/activate':
      case '/register':
        return (
          <>
            <PioneersNav currentPath={currentPath} onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <AuthPage
              initialTab="signup"
              prefilledAppNumber={authPrefillApp}
              prefilledPioneerId={authPrefillPioneerId}
              prefilledAcceptanceCode={authPrefillCode}
              onNavigate={handleNavigate}
              onOpenStatus={() => setStatusModalOpen(true)}
            />
            <PioneersFooter onNavigate={handleNavigate} />
          </>
        );

      case '/complete-profile':
      case '/profile':
        return (
          <>
            <PioneersNav currentPath={currentPath} onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <CompleteProfilePage onNavigate={handleNavigate} onOpenStatus={() => setStatusModalOpen(true)} />
            <PioneersFooter onNavigate={handleNavigate} />
          </>
        );

      case '/':
      default:
        return <PioneersPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider>
      <StatusLookupModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onActivateAccount={(appNum, code, pioneerId) => {
          setStatusModalOpen(false);
          setAuthPrefillApp(appNum);
          setAuthPrefillCode(code);
          setAuthPrefillPioneerId(pioneerId || '');
          handleNavigate('/signup');
        }}
      />
      <ContributorAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
        prefilledAppNumber={authPrefillApp}
        prefilledPioneerId={authPrefillPioneerId}
        prefilledAcceptanceCode={authPrefillCode}
        onOpenStatus={() => {
          setAuthModalOpen(false);
          setStatusModalOpen(true);
        }}
      />
      {renderPageContent()}
    </ThemeProvider>
  );
};