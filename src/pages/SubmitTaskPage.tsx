import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  X, CheckCircle2, ArrowRight, FileText,
  Link as LinkIcon, Award, Zap,
  Eye, RefreshCw, User, LogIn,
  LogOut, ExternalLink, Key, Search, Mail, Briefcase, Globe,
  AlertTriangle, Clock
} from 'lucide-react';
import {
  RF_DEEP_GREEN,
  RF_DARK_GREEN,
  RF_FOREST_DARK,
  RF_GREEN,
  RF_LEAF_GREEN,
  RF_MINT_ACCENT,
  RF_GOLD_YELLOW,
  RF_ORANGE
} from '../constants/brand';
import {
  saveTaskSubmission,
  getTaskSubmissions,
  ScreenshotAttachment,
  TaskSubmissionRecord
} from '../lib/taskSubmissions';
import {
  getCurrentContributor,
  signOutContributor,
  ContributorProfile,
  getContributorActivityStatus,
  INACTIVITY_LIMIT_DAYS
} from '../lib/contributorAuth';

interface SubmitTaskPageProps {
  onNavigate: (path: string) => void;
  onOpenStatus: () => void;
}

const DIVISIONS_LIST = [
  { id: 'TECHNOLOGY', name: 'Technology & Architecture' },
  { id: 'DESIGN', name: 'Product, UI/UX & Brand Design' },
  { id: 'GROWTH', name: 'Growth, Marketing & Referrals' },
  { id: 'COMMUNITY', name: 'Community, Regional & Campus Chapters' },
  { id: 'OPERATIONS', name: 'Operations, Quality & Governance' },
  { id: 'BUSINESS', name: 'Business Development & Strategic Partnerships' },
  { id: 'GENERAL', name: 'Cross-Functional / General Mission' }
];

const TASK_CATEGORIES = [
  'Social Media Post Sharing & Amplification (X, LinkedIn, Facebook, etc.)',
  'Social Media Engagement: Liking & Commenting',
  'Software Engineering, Bug Fix or Smart Contract',
  'UI/UX Design, Mockups or Brand Graphics',
  'Community Moderation, Growth Loop or Referral Drive',
  'Campus Workshop, Meetup or Physical Event',
  'Technical Documentation, Article or Whitepaper',
  'QA Testing, Bug Bounty or Audit Report',
  'Strategic Partnership or Pilot Client Lead'
];

export const SubmitTaskPage: React.FC<SubmitTaskPageProps> = ({ onNavigate, onOpenStatus }) => {
  // Contributor Session & History State
  const [contributor, setContributor] = useState<ContributorProfile | null>(getCurrentContributor());
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');
  const [myTasks, setMyTasks] = useState<TaskSubmissionRecord[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState(() => contributor?.full_name || '');
  const [email, setEmail] = useState(() => contributor?.email || '');
  const [applicationNumber, setApplicationNumber] = useState(() => contributor?.application_number || '');
  const [pioneerId, setPioneerId] = useState(() => contributor?.pioneer_id || '');
  const [division, setDivision] = useState(() => contributor?.division || 'TECHNOLOGY');
  const [targetLevel, setTargetLevel] = useState<'LEVEL_2' | 'LEVEL_3' | 'LEVEL_4' | 'LEVEL_5'>('LEVEL_2');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState(TASK_CATEGORIES[0]);
  const [taskDescription, setTaskDescription] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [additionalUrl, setAdditionalUrl] = useState('');
  const [agreeAuthentic, setAgreeAuthentic] = useState(false);

  // Screenshots state
  const [screenshots, setScreenshots] = useState<ScreenshotAttachment[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<{
    referenceId: string;
    taskTitle: string;
    targetLevel: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activityStatus = useMemo(() => {
    if (!contributor) return null;
    return getContributorActivityStatus(contributor, myTasks);
  }, [contributor, myTasks]);

  // Synchronize contributor auth changes
  useEffect(() => {
    const syncContributor = () => {
      const user = getCurrentContributor();
      setContributor(user);
      if (user) {
        setFullName(user.full_name);
        setEmail(user.email);
        if (user.application_number) setApplicationNumber(user.application_number);
        if (user.pioneer_id) setPioneerId(user.pioneer_id);
        if (user.division) setDivision(user.division);
      }
    };

    syncContributor();
    window.addEventListener('refeir-auth-change', syncContributor);
    return () => window.removeEventListener('refeir-auth-change', syncContributor);
  }, []);

  // Fetch past missions submitted by this contributor
  useEffect(() => {
    const fetchUserTasks = async () => {
      const targetEmail = (contributor?.email || email).trim().toLowerCase();
      if (!targetEmail) {
        setMyTasks([]);
        return;
      }
      setLoadingTasks(true);
      try {
        const allTasks = await getTaskSubmissions();
        const filtered = allTasks.filter(t => t.email.toLowerCase() === targetEmail);
        setMyTasks(filtered);
      } catch (err) {
        console.warn('Failed to load user missions:', err);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchUserTasks();
  }, [contributor, email, submittedRecord]);

  // Compress image on canvas to keep localStorage light & prevent performance bottleneck
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            resolve(dataUrl);
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => reject(new Error('Failed to load image for compression'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsCompressing(true);
    setErrorMessage('');

    try {
      const newScreenshots: ScreenshotAttachment[] = [];
      const remainingSlots = 5 - screenshots.length;
      const countToProcess = Math.min(files.length, remainingSlots);

      if (files.length > remainingSlots) {
        setErrorMessage(`Only up to 5 screenshots are allowed. Added the first ${remainingSlots}.`);
      }

      for (let i = 0; i < countToProcess; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        const dataUrl = await compressImage(file);
        newScreenshots.push({
          id: `scr-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          data_url: dataUrl,
          size: file.size,
          caption: ''
        });
      }

      setScreenshots(prev => [...prev, ...newScreenshots]);
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not process some image files. Please verify the images and try again.');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveScreenshot = (id: string) => {
    setScreenshots(prev => prev.filter(item => item.id !== id));
  };

  const handleCaptionChange = (id: string, caption: string) => {
    setScreenshots(prev => prev.map(item => item.id === id ? { ...item, caption } : item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please provide your Full Name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid registered Email address.');
      return;
    }
    if (!applicationNumber.trim()) {
      setErrorMessage('Please provide your official Application ID (e.g. RP-2026-492019). Both Application ID and Pioneer ID are required.');
      return;
    }
    if (!pioneerId.trim()) {
      setErrorMessage('Please provide your assigned Pioneer ID (e.g. RP-045). Both Application ID and Pioneer ID are required.');
      return;
    }
    if (!taskTitle.trim()) {
      setErrorMessage('Please provide a descriptive Task / Mission Title.');
      return;
    }
    if (!taskDescription.trim() || taskDescription.trim().length < 25) {
      setErrorMessage('Please provide a detailed description of what you accomplished (at least 25 characters).');
      return;
    }
    if (!agreeAuthentic) {
      setErrorMessage('Please check the authenticity declaration to confirm this is your own work.');
      return;
    }

    setSubmitting(true);

    try {
      const saved = await saveTaskSubmission({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        application_number: applicationNumber.trim().toUpperCase(),
        pioneer_id: pioneerId.trim().toUpperCase(),
        division,
        target_level: targetLevel,
        task_title: taskTitle.trim(),
        task_category: taskCategory,
        task_description: taskDescription.trim(),
        deliverable_url: deliverableUrl.trim() || undefined,
        additional_url: additionalUrl.trim() || undefined,
        screenshots
      });

      setSubmittedRecord({
        referenceId: saved.reference_id,
        taskTitle: saved.task_title,
        targetLevel: saved.target_level
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'An error occurred while submitting your task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setDeliverableUrl('');
    setAdditionalUrl('');
    setScreenshots([]);
    setAgreeAuthentic(false);
    setSubmittedRecord(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${RF_FOREST_DARK} 0%, ${RF_DEEP_GREEN} 50%, ${RF_FOREST_DARK} 100%)`,
      color: '#FFFFFF',
      fontFamily: 'Plus Jakarta Sans, Manrope, sans-serif',
      paddingTop: 88,
      paddingBottom: 90
    }}>
      <div className="rp-submittask-container">

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 24, flexWrap: 'wrap' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => onNavigate('/')}>Home</span>
          <span style={{ opacity: 0.35 }}>/</span>
          <span style={{ cursor: 'pointer' }} onClick={() => onNavigate('/rewards')}>Rewards Ladder</span>
          <span style={{ opacity: 0.35 }}>/</span>
          <span style={{ color: RF_MINT_ACCENT, fontWeight: 600 }}>Submit Task</span>
        </div>

        {/* ─── SUCCESS VIEW ────────────────────────────────────────────────────────── */}
        {submittedRecord ? (
          <div style={{
            background: 'rgba(15, 46, 30, 0.9)',
            border: `1.5px solid ${RF_MINT_ACCENT}55`,
            borderRadius: 24,
            padding: 'clamp(28px, 5vw, 48px) clamp(18px, 4vw, 36px)',
            textAlign: 'center',
            boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 40px ${RF_MINT_ACCENT}15`
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: `${RF_LEAF_GREEN}20`,
              border: `2px solid ${RF_LEAF_GREEN}`, display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 20px', color: RF_MINT_ACCENT
            }}>
              <CheckCircle2 size={36} />
            </div>

            <div style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: 100,
              background: 'rgba(24, 252, 92, 0.12)', border: `1px solid ${RF_LEAF_GREEN}44`,
              color: RF_MINT_ACCENT, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: 12
            }}>
              Proof Queued for Verification
            </div>

            <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, color: '#FFFFFF', marginBottom: 10, lineHeight: 1.25 }}>
              Task Submitted!
            </h1>

            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', maxWidth: 540, margin: '0 auto 24px', lineHeight: 1.55 }}>
              Thank you, <strong style={{ color: '#FFFFFF' }}>{fullName}</strong>. Your submission reference code:
            </p>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(7, 24, 15, 0.8)', padding: '10px 20px', borderRadius: 12,
              border: `1px solid ${RF_LEAF_GREEN}66`, color: RF_MINT_ACCENT,
              fontSize: 'clamp(16px, 3.5vw, 20px)', fontWeight: 800, letterSpacing: '0.05em', marginBottom: 28
            }}>
              {submittedRecord.referenceId}
            </div>

            {/* Submission Detail Summary Card */}
            <div style={{
              background: 'rgba(7, 24, 15, 0.6)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: '18px 20px', maxWidth: 600, margin: '0 auto 28px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                <div>
                  <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', display: 'block' }}>Target Rank</span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: RF_GOLD_YELLOW }}>
                    {submittedRecord.targetLevel === 'LEVEL_2' && 'Level 2: Pioneer'}
                    {submittedRecord.targetLevel === 'LEVEL_3' && 'Level 3: Builder'}
                    {submittedRecord.targetLevel === 'LEVEL_4' && 'Level 4: Lead'}
                    {submittedRecord.targetLevel === 'LEVEL_5' && 'Level 5: Core Team'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', display: 'block' }}>Attachments</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: '#FFFFFF' }}>
                    {screenshots.length} Uploaded
                  </span>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', display: 'block' }}>Task Title</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>{submittedRecord.taskTitle}</span>
                </div>
              </div>

              <div style={{
                marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)',
                fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.45
              }}>
                ⚡ <strong>What's next:</strong> Reviews run weekly. Once approved, your ladder status and badge credentials automatically update.
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
              <button
                onClick={resetForm}
                style={{
                  background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                  padding: '11px 22px', borderRadius: 100, fontSize: 13.5, fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = RF_MINT_ACCENT)}
                onMouseLeave={e => (e.currentTarget.style.background = RF_LEAF_GREEN)}
              >
                <RefreshCw size={15} /> Submit Another
              </button>

              <button
                onClick={() => onNavigate('/rewards')}
                style={{
                  background: 'rgba(255,255,255,0.06)', color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.2)', padding: '11px 20px',
                  borderRadius: 100, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              >
                View Ladder <ArrowRight size={15} />
              </button>

              <button
                onClick={onOpenStatus}
                style={{
                  background: 'none', color: RF_MINT_ACCENT, border: 'none',
                  padding: '11px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'underline'
                }}
              >
                Check Status
              </button>
            </div>
          </div>
        ) : (
          /* ─── FORM VIEW ────────────────────────────────────────────────────────── */
          <div>
            {/* Header */}
            <div className="rp-submittask-header">
              <div style={{
                display: 'inline-block',
                padding: '4px 14px', borderRadius: 100,
                background: 'rgba(24, 252, 92, 0.08)', border: `1px solid ${RF_LEAF_GREEN}44`,
                color: RF_MINT_ACCENT, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', marginBottom: 12
              }}>
                PROOF OF WORK &amp; ADVANCEMENT
              </div>

              <h1 style={{
                fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800,
                color: '#FFFFFF', lineHeight: 1.22, marginBottom: 12,
                fontFamily: 'Plus Jakarta Sans, sans-serif'
              }}>
                Report Completed Task &amp; Evidence
              </h1>

              <p style={{
                fontSize: 14.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6,
                maxWidth: 640, margin: '0 auto'
              }}>
                Report your squad missions, bugs fixed, or milestones with proof to advance on the <strong>Contributor Ladder</strong>.
              </p>
            </div>

            {/* Contributor Profile Bar */}
            {contributor && (
              <div
                className="rp-banner-card rp-contributor-bar"
                style={{
                  background: 'rgba(24, 252, 92, 0.08)',
                  border: `1px solid ${RF_LEAF_GREEN}55`,
                  borderRadius: 16,
                  padding: '14px 18px',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 14,
                  boxSizing: 'border-box'
                }}
              >
                <div
                  className="rp-banner-content rp-contributor-bar-left"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    minWidth: 0,
                    flex: '1 1 auto'
                  }}
                >
                  <div
                    className="rp-banner-avatar rp-contributor-bar-avatar"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${RF_LEAF_GREEN} 0%, ${RF_MINT_ACCENT} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: RF_DEEP_GREEN,
                      fontWeight: 800,
                      fontSize: 15,
                      flexShrink: 0,
                      overflow: 'hidden',
                      boxShadow: `0 2px 8px ${RF_LEAF_GREEN}33`
                    }}
                  >
                    {contributor.avatar_url ? (
                      <img src={contributor.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      contributor.full_name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div
                    className="rp-banner-body rp-contributor-bar-info"
                    style={{
                      minWidth: 0,
                      flex: '1 1 auto'
                    }}
                  >
                    <div
                      className="rp-banner-contributor-header rp-contributor-bar-name-row"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        flexWrap: 'wrap'
                      }}
                    >
                      <span
                        className="rp-contributor-bar-name"
                        style={{
                          fontSize: 14.5,
                          fontWeight: 700,
                          color: '#FFFFFF',
                          lineHeight: 1.3
                        }}
                      >
                        {contributor.full_name}
                      </span>
                      <span
                        className="rp-submittask-badge-level"
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: RF_DEEP_GREEN,
                          background: RF_MINT_ACCENT,
                          padding: '2px 8px',
                          borderRadius: 100,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          display: 'inline-flex',
                          alignItems: 'center',
                          lineHeight: 1.4
                        }}
                      >
                        {contributor.contributor_level.replace('_', ' ')}
                      </span>
                      <span
                        className="rp-submittask-badge-squad"
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: 'rgba(255, 255, 255, 0.85)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '2px 8px',
                          borderRadius: 100,
                          display: 'inline-flex',
                          alignItems: 'center',
                          lineHeight: 1.4
                        }}
                      >
                        {contributor.division}
                      </span>
                    </div>
                    <div
                      className="rp-contributor-bar-meta"
                      style={{
                        fontSize: 11.5,
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginTop: 4,
                        lineHeight: 1.4,
                        wordBreak: 'break-word'
                      }}
                    >
                      {contributor.email} {contributor.application_number ? `• ${contributor.application_number}` : ''} {contributor.pioneer_id ? `• ${contributor.pioneer_id}` : ''}
                    </div>
                  </div>
                </div>

                <div
                  className="rp-banner-action-col"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0
                  }}
                >
                  <button
                    type="button"
                    onClick={() => signOutContributor()}
                    className="rp-banner-btn-signout rp-contributor-bar-signout"
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      color: '#FCA5A5',
                      padding: '7px 14px',
                      borderRadius: 100,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      lineHeight: 1,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      transition: 'all 0.15s ease'
                    }}
                    title="Sign out of contributor session"
                  >
                    <LogOut size={12} style={{ flexShrink: 0 }} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}

            {/* 14-Day Inactivity Demotion Alert or Warning Banner */}
            {contributor && contributor.demoted_due_to_inactivity && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: 14,
                padding: '14px 16px',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FCA5A5',
                  flexShrink: 0
                }}>
                  <AlertTriangle size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#FFFFFF', marginBottom: 2 }}>
                    Progress Reset Due to 14-Day Inactivity Rule
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.45 }}>
                    Your rank was reset to <strong>Level 1 (Pioneer Associate)</strong> because no verified task deliverables were recorded for over 14 days. Complete and submit squad deliverables below to restore higher tiers!
                  </div>
                </div>
              </div>
            )}

            {contributor && !contributor.demoted_due_to_inactivity && activityStatus && activityStatus.isAtRisk && (
              <div style={{
                background: 'rgba(251, 191, 36, 0.12)',
                border: '1px solid rgba(251, 191, 36, 0.35)',
                borderRadius: 14,
                padding: '14px 16px',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(251, 191, 36, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: RF_GOLD_YELLOW,
                  flexShrink: 0
                }}>
                  <Clock size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#FFFFFF', marginBottom: 2 }}>
                    Activity Warning: {14 - activityStatus.daysSinceActive} Days Until Progress Reset
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.45 }}>
                    You have been inactive for <strong>{activityStatus.daysSinceActive} days</strong>. Refeir Pioneers inactive for 14 days have their tier progress withdrawn and reset to Level 1. Submit a task proof today to maintain your standing!
                  </div>
                </div>
              </div>
            )}

            {contributor && !contributor.is_profile_completed && (
              <div style={{
                background: 'rgba(255, 184, 0, 0.1)', border: '1px solid rgba(255, 184, 0, 0.35)',
                borderRadius: 14, padding: '14px 16px', marginBottom: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10
              }}>
                <div style={{ flex: '1 1 240px' }}>
                  <strong style={{ color: '#FFFFFF', fontSize: 13.5 }}>Complete Your Profile</strong>
                  <div style={{ fontSize: 12, color: '#FDE68A', marginTop: 1 }}>
                    Mint your Pioneer ID to unlock credential verification.
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('/complete-profile')}
                  style={{
                    background: RF_GOLD_YELLOW, color: RF_DEEP_GREEN, border: 'none',
                    padding: '8px 16px', borderRadius: 100, fontSize: 12.5, fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                    boxShadow: '0 2px 8px rgba(255, 184, 0, 0.25)'
                  }}
                >
                  Complete Profile →
                </button>
              </div>
            )}

            {!contributor ? (
              /* ─── PIONEER AUTHENTICATION REQUIRED GATE ─── */
              <div className="rp-auth-gate-card">
                <span className="rp-auth-gate-badge">
                  Access Restricted • Pioneer Sign-In Required
                </span>

                <h2 className="rp-auth-gate-title">
                  Pioneer Verification Required
                </h2>

                <p className="rp-auth-gate-desc">
                  Task reporting and ladder upgrades are restricted to <strong>officially accepted Refeir Pioneers</strong> with an active Application ID and Pioneer ID.
                </p>

                <div className="rp-auth-gate-steps">
                  <div className="rp-auth-gate-step-item">
                    <div className="rp-auth-gate-step-num">1</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="rp-auth-gate-step-title">Application &amp; Pioneer ID</div>
                      <div className="rp-auth-gate-step-desc">Assigned upon admission.</div>
                    </div>
                  </div>

                  <div className="rp-auth-gate-step-item">
                    <div className="rp-auth-gate-step-num">2</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="rp-auth-gate-step-title">Acceptance Code</div>
                      <div className="rp-auth-gate-step-desc">Issued by admissions.</div>
                    </div>
                  </div>
                </div>

                <div className="rp-auth-gate-actions">
                  <button
                    onClick={() => onNavigate('/signin')}
                    className="rp-auth-gate-btn-primary"
                  >
                    <LogIn size={14} style={{ flexShrink: 0 }} />
                    <span>Sign In</span>
                  </button>

                  <button
                    onClick={onOpenStatus}
                    className="rp-auth-gate-btn-secondary"
                  >
                    <Search size={14} style={{ flexShrink: 0, color: RF_MINT_ACCENT }} />
                    <span>Check Status</span>
                  </button>
                </div>

                <div className="rp-auth-gate-link-wrap">
                  <button
                    onClick={() => onNavigate('/#apply')}
                    className="rp-auth-gate-apply-link"
                  >
                    Not yet applied? Apply to Pioneers →
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* View Mode Tabs (Submit vs History) */}
                <div className="rp-submittask-tabs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('submit')}
                    className="rp-submittask-tab-btn"
                    style={{
                      background: activeTab === 'submit' ? RF_LEAF_GREEN : 'transparent',
                      color: activeTab === 'submit' ? RF_DEEP_GREEN : 'rgba(255,255,255,0.75)'
                    }}
                  >
                    <Zap size={14} /> Submit Proof
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className="rp-submittask-tab-btn"
                    style={{
                      background: activeTab === 'history' ? RF_LEAF_GREEN : 'transparent',
                      color: activeTab === 'history' ? RF_DEEP_GREEN : 'rgba(255,255,255,0.75)'
                    }}
                  >
                    <FileText size={14} />
                    My History
                    {myTasks.length > 0 && (
                      <span style={{
                        background: activeTab === 'history' ? RF_DEEP_GREEN : 'rgba(24, 252, 92, 0.2)',
                        color: activeTab === 'history' ? RF_MINT_ACCENT : '#FFFFFF',
                        fontSize: 10.5, fontWeight: 800, padding: '1px 6px', borderRadius: 100
                      }}>
                        {myTasks.length}
                      </span>
                    )}
                  </button>
                </div>

            {/* TAB: MISSION HISTORY */}
            {activeTab === 'history' && (
              <div className="rp-submittask-history-card">
                <div style={{ marginBottom: 20 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    My Tracked Proofs of Work
                  </h2>
                  <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', margin: '4px 0 0' }}>
                    Contributor: <strong style={{ color: RF_MINT_ACCENT }}>{contributor?.email || email || 'Current Session'}</strong>
                  </p>
                </div>

                {loadingTasks ? (
                  <div style={{ textAlign: 'center', padding: '50px 0', color: 'rgba(255,255,255,0.6)' }}>
                    <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
                    <div>Loading your mission history...</div>
                  </div>
                ) : myTasks.length === 0 ? (
                  <div style={{
                    textAlign: 'center', padding: '48px 20px', background: 'rgba(0,0,0,0.2)',
                    borderRadius: 16, border: '1px dashed rgba(255,255,255,0.15)'
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>
                      No Task Submissions Found Yet
                    </div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', maxWidth: 440, margin: '0 auto 20px' }}>
                      You haven't submitted any mission proofs under this email yet. Complete a squad task, upload your proof, and start climbing the Refeir Contributor Ladder!
                    </p>
                    <button
                      onClick={() => setActiveTab('submit')}
                      style={{
                        background: RF_LEAF_GREEN, color: RF_DEEP_GREEN, border: 'none',
                        padding: '9px 20px', borderRadius: 100, fontSize: 12.5, fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Submit Proof
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {myTasks.map(task => {
                      const isVerified = task.status === 'VERIFIED';
                      const isPending = task.status === 'PENDING';
                      const isRevision = task.status === 'NEEDS_REVISION';

                      return (
                        <div
                          key={task.id}
                          className="rp-submittask-task-card"
                          style={{
                            border: `1px solid ${isVerified ? RF_LEAF_GREEN + '55' : isRevision ? RF_ORANGE + '55' : 'rgba(255,255,255,0.1)'}`
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{
                                fontSize: 11, fontWeight: 800, letterSpacing: '0.04em',
                                color: RF_MINT_ACCENT, background: 'rgba(24, 252, 92, 0.1)',
                                padding: '3px 8px', borderRadius: 6, border: `1px solid ${RF_LEAF_GREEN}33`
                              }}>
                                {task.reference_id}
                              </span>
                              <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)' }}>
                                {new Date(task.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>

                            {/* Status Badge */}
                            <div style={{
                              display: 'inline-flex', alignItems: 'center',
                              padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                              background: isVerified
                                ? 'rgba(24, 252, 92, 0.15)'
                                : isPending
                                ? 'rgba(246, 178, 26, 0.15)'
                                : isRevision
                                ? 'rgba(244, 124, 32, 0.15)'
                                : 'rgba(239, 68, 68, 0.15)',
                              color: isVerified
                                ? RF_MINT_ACCENT
                                : isPending
                                ? RF_GOLD_YELLOW
                                : isRevision
                                ? RF_ORANGE
                                : '#FCA5A5',
                              border: `1px solid ${isVerified ? RF_LEAF_GREEN : isPending ? RF_GOLD_YELLOW : isRevision ? RF_ORANGE : '#EF4444'}`
                            }}>
                              {task.status.replace('_', ' ')}
                            </div>
                          </div>

                          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px' }}>
                            {task.task_title}
                          </h3>

                          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 6 }}>
                              {task.task_category}
                            </span>
                            <span style={{ fontSize: 11, color: RF_GOLD_YELLOW, background: 'rgba(246, 178, 26, 0.08)', padding: '2px 8px', borderRadius: 6 }}>
                              {task.target_level.replace('_', ' ')}
                            </span>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                              Squad: {task.division}
                            </span>
                          </div>

                          <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, margin: '0 0 12px' }}>
                            {task.task_description}
                          </p>

                          {/* Deliverables Links */}
                          {(task.deliverable_url || task.additional_url) && (
                            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                              {task.deliverable_url && (
                                <a
                                  href={task.deliverable_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rp-submittask-pill-link"
                                >
                                  <ExternalLink size={12} /> Deliverable
                                </a>
                              )}
                              {task.additional_url && (
                                <a
                                  href={task.additional_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rp-submittask-pill-link-secondary"
                                >
                                  <ExternalLink size={12} /> Link
                                </a>
                              )}
                            </div>
                          )}

                          {/* Screenshots preview */}
                          {task.screenshots && task.screenshots.length > 0 && (
                            <div style={{ marginTop: 8 }}>
                              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>
                                Attachments ({task.screenshots.length}):
                              </span>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {task.screenshots.map((s, idx) => (
                                  <img
                                    key={s.id || idx}
                                    src={s.data_url}
                                    alt={s.name}
                                    onClick={() => setPreviewModalImg(s.data_url)}
                                    onError={e => {
                                      // Hide broken image placeholder
                                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                                    }}
                                    style={{
                                      width: 58, height: 42, objectFit: 'cover', borderRadius: 6,
                                      border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer'
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Admin Feedback Box */}
                          {task.admin_feedback && (
                            <div style={{
                              marginTop: 12, padding: '10px 12px', borderRadius: 8,
                              background: isVerified ? 'rgba(24, 252, 92, 0.08)' : 'rgba(244, 124, 32, 0.08)',
                              border: `1px solid ${isVerified ? RF_LEAF_GREEN + '33' : RF_ORANGE + '33'}`,
                              fontSize: 12, color: '#FFFFFF', lineHeight: 1.4
                            }}>
                              <strong style={{ color: isVerified ? RF_MINT_ACCENT : RF_ORANGE }}>Reviewer Feedback: </strong>
                              {task.admin_feedback}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB: SUBMIT NEW PROOF */}
            {activeTab === 'submit' && (
              <form onSubmit={handleSubmit} className="rp-submittask-form-card">

                {errorMessage && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444',
                    borderRadius: 12, padding: '12px 16px', color: '#FCA5A5',
                    fontSize: 13.5, marginBottom: 20
                  }}>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Section 1: Contributor Identification */}
                <div style={{ marginBottom: 28 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: RF_MINT_ACCENT, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: '50%', background: `${RF_LEAF_GREEN}33`,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
                      lineHeight: 1, flexShrink: 0
                    }}>1</span>
                    Contributor Identification
                  </h2>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 5 }}>
                        Full Name *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="e.g. Kwame Mensah"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          style={{
                            width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                            color: '#FFFFFF', fontSize: 13.5, outline: 'none', boxSizing: 'border-box'
                          }}
                        />
                        <User size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                        <label style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                          Registered Email *
                        </label>
                        <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)' }}>
                          Locked
                        </span>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="email"
                          placeholder="e.g. kwame@example.com"
                          value={email}
                          readOnly
                          style={{
                            width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.7)', fontSize: 13.5, outline: 'none', boxSizing: 'border-box',
                            cursor: 'not-allowed'
                          }}
                        />
                        <Mail size={15} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                        <label style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                          Application ID *
                        </label>
                        <span style={{ fontSize: 10.5, color: `${RF_LEAF_GREEN}cc` }}>
                          Locked
                        </span>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="e.g. RP-2026-492019"
                          value={applicationNumber}
                          readOnly
                          style={{
                            width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(24, 252, 92, 0.2)',
                            color: 'rgba(255,255,255,0.85)', fontSize: 13.5, outline: 'none', boxSizing: 'border-box',
                            fontFamily: 'monospace', textTransform: 'uppercase', cursor: 'not-allowed'
                          }}
                        />
                        <Key size={15} color="rgba(24, 252, 92, 0.5)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                        <label style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                          Pioneer ID *
                        </label>
                        <span style={{ fontSize: 10.5, color: 'rgba(246, 178, 26, 0.85)' }}>
                          Locked
                        </span>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="e.g. RP-045"
                          value={pioneerId}
                          readOnly
                          style={{
                            width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(246, 178, 26, 0.25)',
                            color: RF_GOLD_YELLOW, fontSize: 13.5, outline: 'none', boxSizing: 'border-box',
                            fontFamily: 'monospace', textTransform: 'uppercase', fontWeight: 700,
                            cursor: 'not-allowed'
                          }}
                        />
                        <Award size={15} color="rgba(246, 178, 26, 0.6)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 5 }}>
                        Primary Division / Squad *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={division}
                          onChange={e => setDivision(e.target.value)}
                          style={{
                            width: '100%', padding: '10px 42px 10px 38px', borderRadius: 10,
                            background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.15)',
                            color: '#FFFFFF', fontSize: 13.5, outline: 'none', boxSizing: 'border-box'
                          }}
                        >
                          {DIVISIONS_LIST.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                        <Briefcase size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                    </div>
                  </div>

                  {/* Target Contributor Level Selector */}
                  <div style={{ marginTop: 18 }}>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 8 }}>
                      Qualifying Contributor Rank *
                    </label>
                    <div className="rp-target-levels-grid">
                      {[
                        { id: 'LEVEL_2', label: 'Level 2: Pioneer', subtitle: '1st Tangible Mission', color: RF_MINT_ACCENT },
                        { id: 'LEVEL_3', label: 'Level 3: Builder', subtitle: '4+ Missions Delivered', color: RF_GOLD_YELLOW },
                        { id: 'LEVEL_4', label: 'Level 4: Lead', subtitle: 'Team / Squad Anchor', color: RF_ORANGE },
                        { id: 'LEVEL_5', label: 'Level 5: Core Team', subtitle: 'Protocol Delivery', color: '#60A5FA' },
                      ].map(lvl => {
                        const active = targetLevel === lvl.id;
                        return (
                          <div
                            key={lvl.id}
                            onClick={() => setTargetLevel(lvl.id as any)}
                            className="rp-target-level-card"
                            style={{
                              background: active ? `${RF_LEAF_GREEN}22` : 'rgba(255,255,255,0.03)',
                              borderColor: active ? lvl.color : 'rgba(255,255,255,0.1)'
                            }}
                          >
                            <div className="rp-target-level-card-label" style={{ fontWeight: 700, color: active ? lvl.color : '#FFFFFF', marginBottom: 3 }}>
                              {lvl.label}
                            </div>
                            <div className="rp-target-level-card-sub" style={{ color: 'rgba(255,255,255,0.6)' }}>
                              {lvl.subtitle}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Section 2: Task Details */}
                <div style={{ marginBottom: 28 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: RF_MINT_ACCENT, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: '50%', background: `${RF_LEAF_GREEN}33`,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
                      lineHeight: 1, flexShrink: 0
                    }}>2</span>
                    Mission &amp; Deliverables
                  </h2>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 5 }}>
                        Task / Mission Title *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="e.g. Escrow UI component implementation"
                          value={taskTitle}
                          onChange={e => setTaskTitle(e.target.value)}
                          style={{
                            width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                            color: '#FFFFFF', fontSize: 13.5, outline: 'none', boxSizing: 'border-box'
                          }}
                        />
                        <Zap size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 5 }}>
                        Task Category *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={taskCategory}
                          onChange={e => setTaskCategory(e.target.value)}
                          style={{
                            width: '100%', padding: '10px 42px 10px 38px', borderRadius: 10,
                            background: 'rgba(15, 46, 30, 0.95)', border: '1px solid rgba(255,255,255,0.15)',
                            color: '#FFFFFF', fontSize: 13.5, outline: 'none', boxSizing: 'border-box'
                          }}
                        >
                          {TASK_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <CheckCircle2 size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 5 }}>
                      Description &amp; Impact *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe what was accomplished, metrics, problems solved, tools used..."
                      value={taskDescription}
                      onChange={e => setTaskDescription(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                        color: '#FFFFFF', fontSize: 13.5, outline: 'none', boxSizing: 'border-box',
                        fontFamily: 'inherit', resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 5 }}>
                        Primary Deliverable URL <span style={{ opacity: 0.6, fontWeight: 400 }}>(PR, Figma, Demo)</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="url"
                          placeholder="https://github.com/... or https://figma.com/..."
                          value={deliverableUrl}
                          onChange={e => setDeliverableUrl(e.target.value)}
                          style={{
                            width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                            color: '#FFFFFF', fontSize: 13.5, outline: 'none', boxSizing: 'border-box'
                          }}
                        />
                        <LinkIcon size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 5 }}>
                        Additional Verification URL <span style={{ opacity: 0.6, fontWeight: 400 }}>(Tweet, Docs)</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="url"
                          placeholder="https://x.com/... or https://docs.google.com/..."
                          value={additionalUrl}
                          onChange={e => setAdditionalUrl(e.target.value)}
                          style={{
                            width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                            color: '#FFFFFF', fontSize: 13.5, outline: 'none', boxSizing: 'border-box'
                          }}
                        />
                        <Globe size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Screenshots & Visual Evidence */}
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: RF_MINT_ACCENT, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: '50%', background: `${RF_LEAF_GREEN}33`,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
                      lineHeight: 1, flexShrink: 0
                    }}>3</span>
                    Screenshots &amp; Evidence
                  </h2>

                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', marginBottom: 14 }}>
                  Attach screenshots proving your work (code diffs, test results, designs, event photos). Up to 5 images.
                </p>

                {/* Drag and Drop Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `1.5px dashed ${RF_LEAF_GREEN}55`,
                    borderRadius: 14,
                    padding: '22px 16px',
                    textAlign: 'center',
                    background: 'rgba(15, 46, 30, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginBottom: 14
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = RF_MINT_ACCENT;
                    e.currentTarget.style.background = 'rgba(15, 46, 30, 0.7)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = `${RF_LEAF_GREEN}55`;
                    e.currentTarget.style.background = 'rgba(15, 46, 30, 0.4)';
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    multiple
                    style={{ display: 'none' }}
                    onChange={e => handleFileUpload(e.target.files)}
                  />

                  <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>
                    {isCompressing ? 'Optimizing images...' : 'Click or Drag Screenshots to Upload'}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                    PNG, JPG, WEBP (Max 5 files)
                  </div>
                </div>

                {/* Screenshot Thumbnails & Captions */}
                {screenshots.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                    {screenshots.map((s, idx) => (
                      <div
                        key={s.id}
                        style={{
                          background: 'rgba(7, 24, 15, 0.9)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: 10,
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        {/* Image Preview */}
                        <div style={{ position: 'relative', height: 120, background: '#000000' }}>
                          <img
                            src={s.data_url}
                            alt={s.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveScreenshot(s.id)}
                            style={{
                              position: 'absolute', top: 6, right: 6,
                              width: 24, height: 24, borderRadius: '50%',
                              background: 'rgba(0,0,0,0.7)', border: 'none',
                              color: '#EF4444', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', cursor: 'pointer'
                            }}
                            title="Remove image"
                          >
                            <X size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewModalImg(s.data_url)}
                            style={{
                              position: 'absolute', bottom: 6, right: 6,
                              padding: '3px 6px', borderRadius: 4,
                              background: 'rgba(0,0,0,0.7)', border: 'none',
                              color: '#FFFFFF', display: 'flex', alignItems: 'center',
                              gap: 3, fontSize: 10.5, cursor: 'pointer'
                            }}
                          >
                            <Eye size={11} /> View
                          </button>
                        </div>

                        {/* Caption input */}
                        <div style={{ padding: '8px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            #{idx + 1}: {s.name}
                          </div>
                          <input
                            type="text"
                            placeholder="Caption (optional)"
                            value={s.caption || ''}
                            onChange={e => handleCaptionChange(s.id, e.target.value)}
                            style={{
                              width: '100%', padding: '5px 8px', borderRadius: 6,
                              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                              color: '#FFFFFF', fontSize: 11.5, outline: 'none', boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 4: Declaration & Submit */}
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: 18,
                marginBottom: 20
              }}>
                <label style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  cursor: 'pointer', fontSize: 12.5, color: 'rgba(255,255,255,0.8)', lineHeight: 1.45
                }}>
                  <input
                    type="checkbox"
                    checked={agreeAuthentic}
                    onChange={e => setAgreeAuthentic(e.target.checked)}
                    style={{ marginTop: 2, accentColor: RF_LEAF_GREEN, cursor: 'pointer', width: 15, height: 15, flexShrink: 0 }}
                  />
                  <span>
                    I confirm that this submission is my authentic work for Refeir and is ready for verification review.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || isCompressing}
                className="rp-submittask-submit-btn"
                style={{
                  background: submitting || isCompressing ? 'rgba(102, 187, 42, 0.5)' : undefined,
                  cursor: submitting || isCompressing ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" style={{ flexShrink: 0 }} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Zap size={16} style={{ flexShrink: 0 }} />
                    Submit Proof
                  </>
                )}
              </button>
            </form>
          )}
        </>
        )}
      </div>
        )}
      </div>

      {/* Lightbox Preview Modal for Screenshots */}
      {previewModalImg && (
        <div
          onClick={() => setPreviewModalImg(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img
              src={previewModalImg}
              alt="Screenshot Preview"
              style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)' }}
            />
            <button
              onClick={() => setPreviewModalImg(null)}
              style={{
                position: 'absolute', top: -14, right: -14,
                width: 32, height: 32, borderRadius: '50%',
                background: '#FFFFFF', color: '#000000', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontWeight: 800
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
