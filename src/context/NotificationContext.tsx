import React, { createContext, useContext, useState, useEffect } from 'react';

export type NotificationType = 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR' | 'REWARD';
export type NotificationCategory = 'ALL' | 'ADMIN' | 'VERIFICATION' | 'ESCROW' | 'JOBS' | 'REFERRALS' | 'SYSTEM';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: 'ADMIN' | 'VERIFICATION' | 'ESCROW' | 'JOBS' | 'REFERRALS' | 'SYSTEM';
  timestamp: string;
  read: boolean;
  link?: string;
  action_label?: string;
  email_dispatched?: boolean;
  email_recipient?: string;
  role_target?: 'ALL' | 'CLIENT' | 'TALENT' | 'SCOUT' | 'ADMIN';
}

export interface DirectChatThread {
  id: string;
  name: string;
  role: string;
  avatar: string;
  type: string;
  preview: string;
  time: string;
  unread: boolean;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  showToast: (title: string, message: string, type?: NotificationType) => void;
  addAppNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  activeToast: { title: string; message: string; type: NotificationType } | null;
  clearToast: () => void;

  // Direct Message & Negotiations Read Count Management
  directChats: DirectChatThread[];
  unreadMessagesCount: number;
  markChatAsRead: (chatId: string) => void;
  markAllChatsAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Biometric Verification Ready',
      message: 'Your Tier 2 Sovereign Face & Document Verification is ready for review in your account.',
      type: 'INFO',
      category: 'VERIFICATION',
      timestamp: '5 minutes ago',
      read: false,
      link: '/verification',
      action_label: 'View Verification',
      email_dispatched: true,
      email_recipient: 'chidi@refeir.africa',
      role_target: 'ALL'
    },
    {
      id: 'notif-2',
      title: 'Escrow Milestone Funded ($1,200)',
      message: 'Client in London deposited $1,200 into the Refeir Escrow Vault for Milestone #1.',
      type: 'SUCCESS',
      category: 'ESCROW',
      timestamp: '1 hour ago',
      read: false,
      link: '/wallet',
      action_label: 'View Escrow Vault',
      email_dispatched: true,
      email_recipient: 'chidi@refeir.africa',
      role_target: 'TALENT'
    },
    {
      id: 'notif-3',
      title: '10% Referral Commission Locked',
      message: 'Scout Kwame referred an enterprise frontend engineer with guaranteed lifetime attribution.',
      type: 'REWARD',
      category: 'REFERRALS',
      timestamp: '3 hours ago',
      read: true,
      link: '/dashboard/scout',
      action_label: 'View Scout Earnings',
      email_dispatched: true,
      email_recipient: 'kwame@refeir.africa',
      role_target: 'SCOUT'
    },
    {
      id: 'notif-adm-1',
      title: 'Double-Entry Escrow Custody Funded',
      message: 'Client David Kamau funded ₦450,000 for project "Fintech Mobile App UI/UX Design System".',
      type: 'SUCCESS',
      category: 'ADMIN',
      timestamp: '2 mins ago',
      read: false,
      link: '/admin?tab=OVERVIEW',
      action_label: 'View in Admin Console',
      role_target: 'ADMIN'
    },
    {
      id: 'notif-adm-2',
      title: 'Dispute Claim Filed on Milestone #2',
      message: 'Talent Sharon Chebet requested arbitration for project "Custom AI NLP Model Pipeline" (KES 220,000).',
      type: 'WARNING',
      category: 'ADMIN',
      timestamp: '14 mins ago',
      read: false,
      link: '/admin?tab=DISPUTES',
      action_label: 'Review Dispute',
      role_target: 'ADMIN'
    },
    {
      id: 'notif-adm-3',
      title: 'High-Risk AML Flag Detected',
      message: 'Withdrawal anomaly flagged on Kenyan M-Pesa Gateway for unverified wallet address.',
      type: 'ERROR',
      category: 'ADMIN',
      timestamp: '32 mins ago',
      read: false,
      link: '/admin?tab=FRAUD',
      action_label: 'Inspect Flag',
      role_target: 'ADMIN'
    }
  ]);

  // Direct Messages Threads State with unread tracking
  const [directChats, setDirectChats] = useState<DirectChatThread[]>([
    {
      id: 'chat-1',
      name: 'Tariq Al-Mansoor',
      role: 'SCOUT',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      type: 'Referrer ↔ Talent Negotiation',
      preview: 'I have a Fintech client in Nairobi needing smart contracts. Would you agree to a 12% scout split?',
      time: '4m ago',
      unread: true
    },
    {
      id: 'chat-2',
      name: 'Apex Bank Digital Hub',
      role: 'CLIENT',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      type: 'Client Escrow Contract Milestone #2',
      preview: 'Reviewed the escrow deliverables. Releasing the $3,400 milestone payout now.',
      time: '18m ago',
      unread: true
    },
    {
      id: 'chat-3',
      name: 'Refeir Sovereign Arbitration Desk',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      type: 'Escrow Trust & Biometric Audit',
      preview: 'Your 4-factor biometric audit has been verified and registered on the pan-African trust rail.',
      time: '1h ago',
      unread: false
    }
  ]);

  const [activeToast, setActiveToast] = useState<{ title: string; message: string; type: NotificationType } | null>(null);

  const showToast = (title: string, message: string, type: NotificationType = 'SUCCESS') => {
    setActiveToast({ title, message, type });
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      category: 'SYSTEM',
      timestamp: 'Just now',
      read: false,
      email_dispatched: true,
      email_recipient: 'user@refeir.africa'
    };
    setNotifications(prev => [newNotif, ...prev]);

    setTimeout(() => {
      setActiveToast(null);
    }, 4500);
  };

  const addAppNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newEntry: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newEntry, ...prev]);
    setActiveToast({ title: notif.title, message: notif.message, type: notif.type });

    setTimeout(() => {
      setActiveToast(null);
    }, 4500);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Direct Message Read Count Operations
  const markChatAsRead = (chatId: string) => {
    setDirectChats(prev =>
      prev.map(chat => (chat.id === chatId ? { ...chat, unread: false } : chat))
    );
  };

  const markAllChatsAsRead = () => {
    setDirectChats(prev => prev.map(chat => ({ ...chat, unread: false })));
  };

  const clearToast = () => setActiveToast(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = directChats.filter(c => c.unread).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        showToast,
        addAppNotification,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
        activeToast,
        clearToast,
        directChats,
        unreadMessagesCount,
        markChatAsRead,
        markAllChatsAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
