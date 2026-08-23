import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useMarketplace } from './context/MarketplaceContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileNav } from './components/common/MobileNav';
import { ToastContainer } from './components/common/Toast';

// Pages
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { RegionalPage } from './pages/RegionalPage';
import { CountriesPage } from './pages/CountriesPage';
import { TalentProfilePage } from './pages/TalentProfilePage';
import { ScoutProfilePage } from './pages/ScoutProfilePage';
import { JobBoardPage } from './pages/JobBoardPage';
import { ScoutDashboard } from './pages/ScoutDashboard';
import { TalentDashboard } from './pages/TalentDashboard';
import { ClientDashboard } from './pages/ClientDashboard';
import { ProjectWorkspace } from './pages/ProjectWorkspace';
import { ReferralLandingPage } from './pages/ReferralLandingPage';
import { WalletPage } from './pages/WalletPage';
import { MessagesPage } from './pages/MessagesPage';
import { DisputesPage } from './pages/DisputesPage';
import { VerificationPage } from './pages/VerificationPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { CrossBorderDemoTour } from './pages/CrossBorderDemoTour';
import { PricingPage } from './pages/PricingPage';
import { BusinessPage } from './pages/BusinessPage';
import { WhyRefeirPage } from './pages/WhyRefeirPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { TrustSafetyPage } from './pages/TrustSafetyPage';
import { PayProtectionPage } from './pages/PayProtectionPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { HelpPage } from './pages/HelpPage';
import { PartnershipsPage } from './pages/PartnershipsPage';
import { InvestorsPage } from './pages/InvestorsPage';
import { SuccessStoriesPage } from './pages/SuccessStoriesPage';
import { AffiliatePage } from './pages/AffiliatePage';
import { ScoutsPage } from './pages/ScoutsPage';
import { ReleaseNotesPage } from './pages/ReleaseNotesPage';
import { FreeToolsPage } from './pages/FreeToolsPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ImpactPage } from './pages/ImpactPage';
import { AgenciesPage } from './pages/AgenciesPage';
import { ProjectCatalogPage } from './pages/ProjectCatalogPage';
import { CommunityHubPage } from './pages/CommunityHubPage';
import { AuthGateWall } from './components/common/AuthGateWall';
import { RoleOnboardingGate } from './components/common/RoleOnboardingGate';
import { ProfileSwitchGate } from './components/common/ProfileSwitchGate';

import { TalentProfile, Service, ScoutProfile } from './types';
import { SEED_TALENT } from './data/seedTalent';
import { SEED_SCOUTS } from './data/seedScouts';

export const App: React.FC = () => {
  const { talentList, servicesList, projectsList, createProjectFromService } = useMarketplace();
  const { currentUser, login, switchRole } = useAuth();

  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');

  // Selected entities for deep view
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null);
  const [selectedScout, setSelectedScout] = useState<ScoutProfile | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Sync with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Parse query params from path
  const getQueryParam = (path: string, key: string): string => {
    try {
      const url = new URL(path, 'http://x');
      return url.searchParams.get(key) || '';
    } catch {
      return '';
    }
  };

  // Base path without query string
  const basePath = currentPath.split('?')[0];

  const handleSelectTalent = (talent: TalentProfile) => {
    setSelectedTalent(talent);
    navigate(`/talent/${talent.id}`);
  };

  const handleSelectService = (service: Service) => {
    const t = talentList.find(item => item.id === service.talent_id);
    if (t) {
      setSelectedTalent(t);
      navigate(`/talent/${t.id}`);
    }
  };

  const handleHire = (talent: TalentProfile, service?: Service, referral?: any) => {
    if (!currentUser) {
      login('david.kamau@twigalogistics.co.ke');
    } else if (currentUser.active_role !== 'CLIENT') {
      switchRole('CLIENT');
    }
    const clientName = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'David Kamau';
    const proj = createProjectFromService(
      talent,
      service,
      referral,
      clientName
    );
    setSelectedProjectId(proj.id);
    navigate(`/projects/${proj.id}`);
  };

  // Router logic
  const renderCurrentPage = () => {
    // 1. Referral Link Landing Page (/r/:code)
    if (basePath.startsWith('/r/')) {
      const code = basePath.replace('/r/', '');
      return (
        <ReferralLandingPage
          referralCode={code}
          onNavigate={navigate}
          onHire={handleHire}
        />
      );
    }

    // 2. Regional Hub (/africa/:region)
    if (basePath.startsWith('/africa/')) {
      const regionSlug = basePath.replace('/africa/', '');
      return (
        <RegionalPage
          regionSlug={regionSlug}
          onNavigate={navigate}
          onSelectTalent={handleSelectTalent}
          onSelectService={handleSelectService}
        />
      );
    }

    // 3. Country Hub (/countries/:countryId)
    if (basePath.startsWith('/countries/')) {
      const countryId = basePath.replace('/countries/', '');
      return (
        <CountriesPage
          countryId={countryId}
          onNavigate={navigate}
          onSelectTalent={handleSelectTalent}
          onSelectService={handleSelectService}
        />
      );
    }
    if (basePath === '/countries') {
      return (
        <CountriesPage
          onNavigate={navigate}
          onSelectTalent={handleSelectTalent}
          onSelectService={handleSelectService}
        />
      );
    }

    // 4. Talent Profile (/talent/:id)
    if (basePath.startsWith('/talent/')) {
      const talentId = basePath.replace('/talent/', '');
      const talent = talentList.find(t => t.id === talentId) || selectedTalent || SEED_TALENT[0];
      return (
        <TalentProfilePage
          talent={talent}
          onBack={() => navigate('/marketplace')}
          onNavigate={navigate}
          onHire={handleHire}
        />
      );
    }

    // 5. Scout Profile (/scout/:id)
    if (basePath.startsWith('/scout/')) {
      const scoutId = basePath.replace('/scout/', '');
      const scout = SEED_SCOUTS.find(s => s.id === scoutId) || selectedScout || SEED_SCOUTS[0];
      return (
        <ScoutProfilePage
          scout={scout}
          onBack={() => navigate('/marketplace')}
          onNavigate={navigate}
          onSelectTalent={handleSelectTalent}
        />
      );
    }

    // 6. Project Workspace (/projects/:id)
    if (basePath.startsWith('/projects/')) {
      if (!currentUser) {
        return <AuthGateWall pageName="Project Workspace & Escrow Custody" onNavigate={navigate} />;
      }
      const pId = basePath.replace('/projects/', '') || selectedProjectId || projectsList[0]?.id;
      return (
        <ProjectWorkspace
          projectId={pId}
          onBack={() => navigate('/dashboard/client')}
          onNavigate={navigate}
        />
      );
    }

    // 7. Core Route Switcher
    switch (basePath) {
      case '/marketplace':
        return (
          <MarketplacePage
            onNavigate={navigate}
            onSelectTalent={handleSelectTalent}
            onSelectService={handleSelectService}
            initialCategory={getQueryParam(currentPath, 'category')}
            initialType={getQueryParam(currentPath, 'type')}
          />
        );
      case '/jobs':
        return <JobBoardPage onNavigate={navigate} />;
      case '/dashboard':
        if (!currentUser) {
          return <AuthGateWall pageName="Refeir Dashboard Workspace" onNavigate={navigate} />;
        }
        if (currentUser.active_role === 'CLIENT') {
          if (!currentUser.client_onboarding_completed) {
            return <RoleOnboardingGate targetRole="CLIENT" onNavigate={navigate} />;
          }
          return (
            <ClientDashboard
              onNavigate={navigate}
              onOpenProject={id => {
                setSelectedProjectId(id);
                navigate(`/projects/${id}`);
              }}
            />
          );
        }
        if (currentUser.active_role === 'TALENT') {
          if (!currentUser.talent_onboarding_completed) {
            return <RoleOnboardingGate targetRole="TALENT" onNavigate={navigate} />;
          }
          return (
            <TalentDashboard
              onNavigate={navigate}
              onOpenProject={id => {
                setSelectedProjectId(id);
                navigate(`/projects/${id}`);
              }}
            />
          );
        }
        if (currentUser.active_role === 'ADMIN') {
          return <AdminPortalPage onNavigate={navigate} />;
        }
        if (!currentUser.scout_onboarding_completed) {
          return <RoleOnboardingGate targetRole="SCOUT" onNavigate={navigate} />;
        }
        return <ScoutDashboard onNavigate={navigate} />;
      case '/dashboard/scout':
        if (!currentUser) {
          return <AuthGateWall pageName="Scout Network Dashboard" roleRequired="Scout" onNavigate={navigate} />;
        }
        if (currentUser.active_role !== 'SCOUT' && currentUser.active_role !== 'ADMIN') {
          return (
            <ProfileSwitchGate
              targetRole="SCOUT"
              currentRole={currentUser.active_role}
              onNavigate={navigate}
              onSwitch={() => switchRole('SCOUT')}
            />
          );
        }
        if (!currentUser.scout_onboarding_completed) {
          return <RoleOnboardingGate targetRole="SCOUT" onNavigate={navigate} />;
        }
        return <ScoutDashboard onNavigate={navigate} />;
      case '/dashboard/talent':
        if (!currentUser) {
          return <AuthGateWall pageName="Talent Workspace & Contracts" roleRequired="Talent" onNavigate={navigate} />;
        }
        if (currentUser.active_role !== 'TALENT' && currentUser.active_role !== 'ADMIN') {
          return (
            <ProfileSwitchGate
              targetRole="TALENT"
              currentRole={currentUser.active_role}
              onNavigate={navigate}
              onSwitch={() => switchRole('TALENT')}
            />
          );
        }
        if (!currentUser.talent_onboarding_completed) {
          return <RoleOnboardingGate targetRole="TALENT" onNavigate={navigate} />;
        }
        return (
          <TalentDashboard
            onNavigate={navigate}
            onOpenProject={id => {
              setSelectedProjectId(id);
              navigate(`/projects/${id}`);
            }}
          />
        );
      case '/dashboard/client':
        if (!currentUser) {
          return <AuthGateWall pageName="Client Project & Escrow Dashboard" roleRequired="Client" onNavigate={navigate} />;
        }
        if (currentUser.active_role !== 'CLIENT' && currentUser.active_role !== 'ADMIN') {
          return (
            <ProfileSwitchGate
              targetRole="CLIENT"
              currentRole={currentUser.active_role}
              onNavigate={navigate}
              onSwitch={() => switchRole('CLIENT')}
            />
          );
        }
        if (!currentUser.client_onboarding_completed) {
          return <RoleOnboardingGate targetRole="CLIENT" onNavigate={navigate} />;
        }
        return (
          <ClientDashboard
            onNavigate={navigate}
            onOpenProject={id => {
              setSelectedProjectId(id);
              navigate(`/projects/${id}`);
            }}
          />
        );
      case '/wallet':
        if (!currentUser) {
          return <AuthGateWall pageName="Multi-Currency Cross-Border Wallet" onNavigate={navigate} />;
        }
        return <WalletPage onNavigate={navigate} />;
      case '/messages':
        if (!currentUser) {
          return <AuthGateWall pageName="Encrypted Project Communications" onNavigate={navigate} />;
        }
        return <MessagesPage initialThreadId={getQueryParam(currentPath, 'thread') || undefined} />;
      case '/disputes':
        if (!currentUser) {
          return <AuthGateWall pageName="Dispute Mediation & Arbitration" onNavigate={navigate} />;
        }
        return <DisputesPage onNavigate={navigate} />;
      case '/verification':
        if (!currentUser) {
          return <AuthGateWall pageName="Identity & Tier-2 KYC Verification" onNavigate={navigate} />;
        }
        return <VerificationPage />;
      case '/profile':
      case '/account/profile':
        if (!currentUser) {
          return <AuthGateWall pageName="My Profile" onNavigate={navigate} />;
        }
        return <ProfileSettingsPage onNavigate={navigate} />;
      case '/settings':
      case '/account-settings':
        if (!currentUser) {
          return <AuthGateWall pageName="Account Settings" onNavigate={navigate} />;
        }
        return <AccountSettingsPage onNavigate={navigate} />;
      case '/admin-login':
        return <AdminLoginPage onNavigate={navigate} />;
      case '/admin':
        // Guard: only ADMIN role can access
        if (!currentUser || !currentUser.roles.includes('ADMIN')) {
          return <AdminLoginPage onNavigate={navigate} />;
        }
        if (currentUser.active_role !== 'ADMIN') {
          return (
            <ProfileSwitchGate
              targetRole="ADMIN"
              currentRole={currentUser.active_role}
              onNavigate={navigate}
              onSwitch={() => switchRole('ADMIN')}
            />
          );
        }
        return <AdminPortalPage onNavigate={navigate} />;
      case '/admin-portal':
        if (!currentUser || !currentUser.roles.includes('ADMIN')) {
          return <AdminLoginPage onNavigate={navigate} />;
        }
        if (currentUser.active_role !== 'ADMIN') {
          return (
            <ProfileSwitchGate
              targetRole="ADMIN"
              currentRole={currentUser.active_role}
              onNavigate={navigate}
              onSwitch={() => switchRole('ADMIN')}
            />
          );
        }
        return <AdminPortalPage onNavigate={navigate} />;
      case '/pricing':
        return <PricingPage onNavigate={navigate} />;
      case '/business':
        return <BusinessPage onNavigate={navigate} />;
      case '/why-refeir':
        return <WhyRefeirPage onNavigate={navigate} />;
      case '/demo-tour':
        return <CrossBorderDemoTour onNavigate={navigate} />;

      // Legal & Trust
      case '/privacy':
        return <PrivacyPage onNavigate={navigate} />;
      case '/terms':
        return <TermsPage onNavigate={navigate} />;
      case '/trust':
        return <TrustSafetyPage onNavigate={navigate} />;
      case '/protection':
        return <PayProtectionPage onNavigate={navigate} />;

      // Company
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/contact':
        return <ContactPage onNavigate={navigate} />;
      case '/investors':
        return <InvestorsPage onNavigate={navigate} />;
      case '/partnerships':
        return <PartnershipsPage onNavigate={navigate} />;

      // Resources
      case '/community':
      case '/community-hub':
        return <CommunityHubPage onNavigate={navigate} />;
      case '/blog':
        return <BlogPage onNavigate={navigate} />;
      case '/help':
        return <HelpPage onNavigate={navigate} />;
      case '/success-stories':
        return <SuccessStoriesPage onNavigate={navigate} />;
      case '/reviews':
        return <ReviewsPage onNavigate={navigate} />;
      case '/affiliates':
        return <AffiliatePage onNavigate={navigate} />;
      case '/scouts':
        return <ScoutsPage onNavigate={navigate} />;
      case '/release-notes':
        return <ReleaseNotesPage onNavigate={navigate} />;
      case '/tools':
        return <FreeToolsPage onNavigate={navigate} />;
      case '/catalog':
      case '/project-catalog':
        return (
          <ProjectCatalogPage
            onNavigate={navigate}
            onSelectService={handleSelectService}
            onSelectTalent={handleSelectTalent}
          />
        );
      case '/agencies':
      case '/hire-agency':
        return <AgenciesPage onNavigate={navigate} />;
      case '/enterprise':
        return <BusinessPage onNavigate={navigate} />;
      case '/impact':
        return <ImpactPage onNavigate={navigate} />;

      case '/':
      default:
        return (
          <HomePage
            onNavigate={navigate}
            onSelectTalent={handleSelectTalent}
            onSelectService={handleSelectService}
          />
        );
    }
  };

  // Pages that render full-screen without header/footer chrome
  const isChromelessPage = currentPath === '/admin-login' || 
    (currentPath === '/admin' && (!currentUser || !currentUser.roles.includes('ADMIN')));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--rf-navy)' }}>
      {/* Global Navigation Header */}
      {!isChromelessPage && <Header onNavigate={navigate} currentPath={currentPath} />}

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: isChromelessPage ? 0 : '4rem' }}>
        {renderCurrentPage()}
      </main>

      {/* Global Footer */}
      {!isChromelessPage && <Footer onNavigate={navigate} />}

      {/* Mobile Bottom Navigation */}
      {!isChromelessPage && <MobileNav onNavigate={navigate} currentPath={currentPath} />}

      {/* Global Toast Notifications Container */}
      <ToastContainer />
    </div>
  );
};
