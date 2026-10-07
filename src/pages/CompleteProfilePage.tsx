import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Shield, CheckCircle2, User, Phone, Globe, MapPin,
  GraduationCap, Code2, Share2, Send, Award, ArrowRight,
  ArrowLeft, AlertCircle, FileText, Wallet, Check,
  ChevronDown, ChevronRight, Brain, Camera, Upload,
  Trash2, AtSign, ExternalLink, ZoomIn, ZoomOut, RotateCcw,
  Crop, Building2, CreditCard, X, Lock, Calendar,
  Printer, Sparkles
} from 'lucide-react';
import {
  RF_DEEP_GREEN,
  RF_DARK_GREEN,
  RF_FOREST_DARK,
  RF_LEAF_GREEN,
  RF_MINT_ACCENT,
  RF_GOLD_YELLOW
} from '../constants/brand';
import {
  getCurrentContributor,
  completeContributorProfile,
  updateContributorAvatar,
  ContributorProfile,
  PioneerSurveyResponse
} from '../lib/contributorAuth';
import {
  getSurveyQuestionsForSquad,
  SurveyQuestionDef
} from '../constants/squadSurveys';
import {
  getCertificatesByEmail,
  ensureLevel1Certificate,
  PioneerCertificate
} from '../lib/certificates';
import { CertificateModal } from '../components/CertificateModal';

interface CompleteProfilePageProps {
  onNavigate: (path: string) => void;
  onOpenStatus: () => void;
}

const POPULAR_SKILLS = [
  'React / Next.js', 'Node.js / TypeScript', 'Python', 'Smart Contracts / Web3',
  'UI/UX Design / Figma', 'Brand Design', 'Technical Writing', 'SEO & Content Marketing',
  'Community Management', 'Campus Organizing', 'QA Testing', 'Growth Loops'
];

interface HeadshotCropperModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onApplyCrop: (croppedDataUrl: string) => void;
}

const HeadshotCropperModal: React.FC<HeadshotCropperModalProps> = ({
  imageSrc,
  isOpen,
  onClose,
  onApplyCrop
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!isOpen || !imageSrc) return;
    setZoom(1);
    setPan({ x: 0, y: 0 });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      drawCanvas(img, 1, { x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [isOpen, imageSrc]);

  const drawCanvas = (img: HTMLImageElement, currentZoom: number, currentPan: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width; // 340
    ctx.clearRect(0, 0, size, size);

    // Calculate base cover scaling
    const baseScale = Math.max(size / img.width, size / img.height);
    const effectiveWidth = img.width * baseScale * currentZoom;
    const effectiveHeight = img.height * baseScale * currentZoom;
    const drawX = (size - effectiveWidth) / 2 + currentPan.x;
    const drawY = (size - effectiveHeight) / 2 + currentPan.y;

    // Draw the image
    ctx.drawImage(img, drawX, drawY, effectiveWidth, effectiveHeight);

    // Draw circular dark vignette / cutout
    const center = size / 2; // 170
    const radius = 125; // 250px diameter portrait circle

    ctx.save();
    ctx.fillStyle = 'rgba(2, 14, 8, 0.72)';
    ctx.beginPath();
    ctx.rect(0, 0, size, size);
    ctx.arc(center, center, radius, 0, Math.PI * 2, true); // counter-clockwise cutout
    ctx.fill();

    // Circular border
    ctx.strokeStyle = RF_MINT_ACCENT;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(24, 252, 92, 0.4)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Subtle guide crosshairs
    ctx.restore();
    ctx.strokeStyle = 'rgba(24, 252, 92, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(center, center - radius);
    ctx.lineTo(center, center + radius);
    ctx.moveTo(center - radius, center);
    ctx.lineTo(center + radius, center);
    ctx.stroke();
  };

  useEffect(() => {
    if (imgRef.current) {
      drawCanvas(imgRef.current, zoom, pan);
    }
  }, [zoom, pan]);

  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = { x: clientX, y: clientY };
    panStartRef.current = { ...pan };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + deltaX,
      y: panStartRef.current.y + deltaY
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleApply = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;

    const exportSize = 500;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = exportSize;
    exportCanvas.height = exportSize;
    const exportCtx = exportCanvas.getContext('2d');
    if (!exportCtx) return;

    const displaySize = 340;
    const radius = 125;
    const cropBoxX = displaySize / 2 - radius; // 45
    const cropBoxY = displaySize / 2 - radius; // 45
    const cropBoxSize = radius * 2; // 250

    const baseScale = Math.max(displaySize / img.width, displaySize / img.height);
    const effectiveWidth = img.width * baseScale * zoom;
    const effectiveHeight = img.height * baseScale * zoom;
    const drawX = (displaySize - effectiveWidth) / 2 + pan.x;
    const drawY = (displaySize - effectiveHeight) / 2 + pan.y;

    const scaleToExport = exportSize / cropBoxSize;

    exportCtx.save();
    exportCtx.fillStyle = '#020C07';
    exportCtx.fillRect(0, 0, exportSize, exportSize);

    const exportDrawX = (drawX - cropBoxX) * scaleToExport;
    const exportDrawY = (drawY - cropBoxY) * scaleToExport;
    const exportDrawWidth = effectiveWidth * scaleToExport;
    const exportDrawHeight = effectiveHeight * scaleToExport;

    exportCtx.drawImage(img, exportDrawX, exportDrawY, exportDrawWidth, exportDrawHeight);
    exportCtx.restore();

    const croppedDataUrl = exportCanvas.toDataURL('image/jpeg', 0.92);
    onApplyCrop(croppedDataUrl);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.82)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16
    }}>
      <div style={{
        background: `linear-gradient(145deg, ${RF_DARK_GREEN} 0%, #03140A 100%)`,
        border: `1.5px solid ${RF_LEAF_GREEN}66`,
        borderRadius: 20, maxWidth: 420, width: '100%',
        padding: '24px 22px', boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(24, 252, 92, 0.15)',
        color: '#FFFFFF', position: 'relative'
      }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.08)',
            border: 'none', borderRadius: '50%', width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.7)', cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: 'rgba(24, 252, 92, 0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: RF_MINT_ACCENT
          }}>
            <Crop size={18} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Adjust Official Headshot
          </h3>
        </div>
        <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', margin: '0 0 16px', lineHeight: 1.45 }}>
          Drag the picture and use the zoom slider to center your face inside the sovereign pioneer portrait frame.
        </p>

        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 16,
          touchAction: 'none', userSelect: 'none'
        }}>
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            style={{
              width: 320, height: 320, borderRadius: 16,
              cursor: isDragging ? 'grabbing' : 'grab',
              background: '#020C07', border: '1px solid rgba(255,255,255,0.1)'
            }}
            onMouseDown={e => handlePointerDown(e.clientX, e.clientY)}
            onMouseMove={e => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={e => {
              if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchMove={e => {
              if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchEnd={handlePointerUp}
          />
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.35)', borderRadius: 12, padding: '10px 14px',
          border: '1px solid rgba(255,255,255,0.08)', marginBottom: 18
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <ZoomIn size={13} color={RF_MINT_ACCENT} /> Zoom Level
            </span>
            <span style={{ fontSize: 11.5, color: RF_MINT_ACCENT, fontWeight: 700 }}>
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={() => setZoom(z => Math.max(1, +(z - 0.15).toFixed(2)))}
              style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 6,
                width: 28, height: 28, color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={e => setZoom(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: RF_MINT_ACCENT, cursor: 'pointer' }}
            />
            <button
              type="button"
              onClick={() => setZoom(z => Math.min(3, +(z + 0.15).toFixed(2)))}
              style={{
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 6,
                width: 28, height: 28, color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              type="button"
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              style={{
                background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 6,
                width: 28, height: 28, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              title="Reset Zoom & Pan"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1, background: 'rgba(255,255,255,0.08)', color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.2)', padding: '11px', borderRadius: 10,
              fontSize: 13, fontWeight: 700, cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            style={{
              flex: 1.6, background: RF_LEAF_GREEN, color: RF_DEEP_GREEN,
              border: 'none', padding: '11px', borderRadius: 10,
              fontSize: 13, fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: `0 4px 14px ${RF_LEAF_GREEN}44`
            }}
          >
            <Check size={16} /> Apply & Save Headshot
          </button>
        </div>
      </div>
    </div>
  );
};

export const CompleteProfilePage: React.FC<CompleteProfilePageProps> = ({ onNavigate }) => {
  const [contributor, setContributor] = useState<ContributorProfile | null>(getCurrentContributor());
  const [step, setStep] = useState<'profile' | 'survey' | 'complete'>('profile');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [successCard, setSuccessCard] = useState<ContributorProfile | null>(null);

  // Form State
  const [fullName, setFullName] = useState(contributor?.full_name || '');
  const [dateOfBirth, setDateOfBirth] = useState(contributor?.date_of_birth || '');
  const isDobLocked = Boolean(contributor?.date_of_birth && contributor.date_of_birth.trim().length > 0);
  const [avatarUrl, setAvatarUrl] = useState(contributor?.avatar_url || '');
  const [whatsapp, setWhatsapp] = useState(contributor?.whatsapp_number || '');
  const [telegram, setTelegram] = useState(contributor?.telegram_handle || '');
  const [twitterHandle, setTwitterHandle] = useState(contributor?.twitter_handle || '');
  const [instagramHandle, setInstagramHandle] = useState(contributor?.instagram_handle || '');
  const [country, setCountry] = useState(contributor?.country || 'Nigeria');
  const [city, setCity] = useState(contributor?.city || '');
  const [institution, setInstitution] = useState(contributor?.institution || '');
  const [division, setDivision] = useState(contributor?.division || 'TECHNOLOGY');
  const [githubUrl, setGithubUrl] = useState(contributor?.github_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState(contributor?.linkedin_url || '');
  const [portfolioUrl, setPortfolioUrl] = useState(contributor?.portfolio_url || '');
  const [bio, setBio] = useState(contributor?.bio || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(contributor?.skills || ['React / Next.js', 'UI/UX Design / Figma']);
  const [customSkill, setCustomSkill] = useState('');
  const [payoutPref, setPayoutPref] = useState<'BANK' | 'CRYPTO_USDT' | 'MOBILE_MONEY'>('BANK');
  const [payoutDetails, setPayoutDetails] = useState(contributor?.payout_details || '');
  const [bankName, setBankName] = useState(contributor?.bank_name || '');
  const [accountNumber, setAccountNumber] = useState(contributor?.account_number || '');
  const [accountName, setAccountName] = useState(contributor?.account_name || contributor?.full_name || '');

  // Cropper Modal State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState('');
  const [rawUploadedImage, setRawUploadedImage] = useState('');

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Survey State (Sequential: 10 squad-tailored questions one after the other)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, { optionId: string; note: string }>>({});
  const [writtenReflection, setWrittenReflection] = useState('');
  const [surveyReviewOpen, setSurveyReviewOpen] = useState(false);

  // Certificate State
  const [certificates, setCertificates] = useState<PioneerCertificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<PioneerCertificate | null>(null);

  // Dynamic squad questions (10 questions)
  const activeSquadQuestions = getSurveyQuestionsForSquad(division);

  useEffect(() => {
    const user = getCurrentContributor();
    if (!user) {
      onNavigate('/signin');
      return;
    }
    setContributor(user);
    if (user.full_name && !fullName) setFullName(user.full_name);
    if (user.date_of_birth && !dateOfBirth) setDateOfBirth(user.date_of_birth);
    if (user.avatar_url && !avatarUrl) setAvatarUrl(user.avatar_url);
    if (user.whatsapp_number && !whatsapp) setWhatsapp(user.whatsapp_number);
    if (user.telegram_handle && !telegram) setTelegram(user.telegram_handle);
    if (user.twitter_handle && !twitterHandle) setTwitterHandle(user.twitter_handle);
    if (user.instagram_handle && !instagramHandle) setInstagramHandle(user.instagram_handle);
    if (user.country && !country) setCountry(user.country);
    if (user.city && !city) setCity(user.city);
    if (user.institution && !institution) setInstitution(user.institution);
    if (user.github_url && !githubUrl) setGithubUrl(user.github_url);
    if (user.linkedin_url && !linkedinUrl) setLinkedinUrl(user.linkedin_url);
    if (user.portfolio_url && !portfolioUrl) setPortfolioUrl(user.portfolio_url);
    if (user.bio && !bio) setBio(user.bio);
    if (user.division) setDivision(user.division);
    if (user.bank_name && !bankName) setBankName(user.bank_name);
    if (user.account_number && !accountNumber) setAccountNumber(user.account_number);
    if (user.account_name && !accountName) setAccountName(user.account_name);
    else if (user.full_name && !accountName) setAccountName(user.full_name);

    const initialSquad = user.division || 'TECHNOLOGY';
    const initialQuestions = getSurveyQuestionsForSquad(initialSquad);
    if (user.survey_responses && user.survey_responses.length > 0) {
      const existingMap: Record<string, { optionId: string; note: string }> = {};
      user.survey_responses.forEach(resp => {
        const qDef = initialQuestions.find(q => q.id === resp.question_id) || initialQuestions.find(q => q.category === resp.category);
        if (qDef?.options.length === 0 || resp.selected_option === 'In-Depth Qualitative Reflection' || resp.question_id.includes('q5') || resp.question_id.includes('10')) {
          setWrittenReflection(resp.reasoning_notes || resp.selected_option || '');
        } else if (qDef) {
          const foundOpt = qDef.options.find(o => `${o.letter}) ${o.text}` === resp.selected_option || o.text === resp.selected_option);
          existingMap[qDef.id] = {
            optionId: foundOpt?.id || qDef.options[0]?.id || '',
            note: resp.reasoning_notes || ''
          };
        }
      });
      setSurveyAnswers(existingMap);
    }
  }, []);

  // Sync and ensure Level 1 Certificate for verified pioneers
  useEffect(() => {
    if (contributor && contributor.is_profile_completed) {
      try {
        ensureLevel1Certificate(contributor);
      } catch (err) {
        console.warn('Could not auto-ensure Level 1 certificate:', err);
      }
      const userCerts = getCertificatesByEmail(contributor.email);
      setCertificates(userCerts);
    }
  }, [contributor]);

  // Deep-link to certificates section if hash is #certificates
  useEffect(() => {
    const handleHashCheck = () => {
      if (window.location.hash === '#certificates' && contributor?.is_profile_completed) {
        setSuccessCard(contributor);
        setStep('complete');
        setTimeout(() => {
          const el = document.getElementById('certificates-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    };

    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, [contributor]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, JPEG, or WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Profile photo must be less than 5MB in file size.');
      return;
    }
    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setRawUploadedImage(result);
      setCropperImageSrc(result);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCroppedAvatar = (croppedDataUrl: string) => {
    setAvatarUrl(croppedDataUrl);
    setCropperOpen(false);
    if (contributor?.email) {
      const updated = updateContributorAvatar(contributor.email, croppedDataUrl);
      if (updated) {
        setContributor(updated);
      }
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    setRawUploadedImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (contributor?.email) {
      const updated = updateContributorAvatar(contributor.email, '');
      if (updated) {
        setContributor(updated);
      }
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSurveyAnswers(prev => ({
      ...prev,
      [questionId]: {
        optionId,
        note: prev[questionId]?.note || ''
      }
    }));
  };

  const handleUpdateNote = (questionId: string, note: string) => {
    setSurveyAnswers(prev => ({
      ...prev,
      [questionId]: {
        optionId: prev[questionId]?.optionId || '',
        note
      }
    }));
  };

  // Transition from Profile Form to Sequential Survey or Direct Update
  const handleProceedToSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributor) {
      onNavigate('/signin');
      return;
    }

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full legal name.');
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }
    if (!dateOfBirth.trim()) {
      setErrorMsg('Please enter your Date of Birth.');
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }
    if (!whatsapp.trim()) {
      setErrorMsg('Please enter your active WhatsApp or contact number.');
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }
    if (!country.trim() || !city.trim()) {
      setErrorMsg('Please provide your country and city of residence.');
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }
    if (!institution.trim()) {
      setErrorMsg('Please state your university, educational institution, or professional organization.');
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }
    if (!bankName.trim() || !accountNumber.trim() || !accountName.trim()) {
      setErrorMsg('Please complete your local bank settlement details (Bank Name, Account Digits, and Beneficiary Name).');
      window.scrollTo({ top: 600, behavior: 'smooth' });
      return;
    }

    setErrorMsg('');

    // If profile is already completed (Pioneer ID minted), save directly!
    if (contributor.is_profile_completed) {
      setLoading(true);
      try {
        const formattedPayout = `Bank: ${bankName.trim()} | Account: ${accountNumber.trim()} | Beneficiary: ${accountName.trim()}`;
        const updated = await completeContributorProfile(contributor.email, {
          full_name: fullName.trim(),
          avatar_url: avatarUrl,
          date_of_birth: dateOfBirth.trim(),
          whatsapp_number: whatsapp.trim(),
          telegram_handle: telegram.trim(),
          twitter_handle: twitterHandle.trim(),
          instagram_handle: instagramHandle.trim(),
          country: country.trim(),
          city: city.trim(),
          institution: institution.trim(),
          division,
          github_url: githubUrl.trim(),
          linkedin_url: linkedinUrl.trim(),
          portfolio_url: portfolioUrl.trim(),
          bio: bio.trim(),
          skills: selectedSkills,
          payout_preference: 'BANK',
          payout_details: formattedPayout,
          bank_name: bankName.trim(),
          account_number: accountNumber.trim(),
          account_name: accountName.trim()
        });
        setSuccessCard(updated);
        setContributor(updated);
        setSuccessMsg('Profile updated successfully!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setSuccessMsg(''), 5000);
      } catch (err: any) {
        setErrorMsg(err?.message || 'Failed to update profile.');
      } finally {
        setLoading(false);
      }
      return;
    }

    setCurrentQuestionIndex(0);
    setStep('survey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Next Question in Survey
  const handleNextQuestion = () => {
    const activeQ = activeSquadQuestions[currentQuestionIndex];
    if (!activeQ) return;

    if (activeQ.options.length > 0) {
      if (!surveyAnswers[activeQ.id]?.optionId) {
        setErrorMsg('Please choose the approach that best matches your thought process to proceed.');
        return;
      }
    } else {
      if (writtenReflection.trim().length < 30) {
        setErrorMsg('Please provide at least 30 characters reflecting your reasoning and work ethic.');
        return;
      }
    }

    setErrorMsg('');
    if (currentQuestionIndex < activeSquadQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Previous Question in Survey
  const handlePrevQuestion = () => {
    setErrorMsg('');
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setStep('profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final Survey Submission -> Mint Pioneer ID
  const handleFinalSubmit = async () => {
    if (!contributor) return;

    if (writtenReflection.trim().length < 30) {
      setErrorMsg('Please provide at least 30 characters reflecting your reasoning and work ethic.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const formattedResponses: PioneerSurveyResponse[] = activeSquadQuestions.map(q => {
        if (q.options.length > 0) {
          const ans = surveyAnswers[q.id];
          const opt = q.options.find(o => o.id === ans?.optionId);
          return {
            question_id: q.id,
            category: q.category,
            question: q.question,
            selected_option: opt ? `${opt.letter}) ${opt.text}` : '',
            reasoning_notes: ans?.note || ''
          };
        } else {
          return {
            question_id: q.id,
            category: q.category,
            question: q.question,
            selected_option: 'In-Depth Qualitative Reflection',
            reasoning_notes: writtenReflection.trim()
          };
        }
      });

      const formattedPayout = `Bank: ${bankName.trim()} | Account: ${accountNumber.trim()} | Beneficiary: ${accountName.trim()}`;

      const updated = await completeContributorProfile(contributor.email, {
        full_name: fullName.trim(),
        avatar_url: avatarUrl,
        date_of_birth: dateOfBirth.trim(),
        whatsapp_number: whatsapp.trim(),
        telegram_handle: telegram.trim(),
        twitter_handle: twitterHandle.trim(),
        instagram_handle: instagramHandle.trim(),
        country: country.trim(),
        city: city.trim(),
        institution: institution.trim(),
        division,
        github_url: githubUrl.trim(),
        linkedin_url: linkedinUrl.trim(),
        portfolio_url: portfolioUrl.trim(),
        bio: bio.trim(),
        skills: selectedSkills,
        payout_preference: 'BANK',
        payout_details: formattedPayout,
        bank_name: bankName.trim(),
        account_number: accountNumber.trim(),
        account_name: accountName.trim(),
        survey_responses: formattedResponses
      });

      setSuccessCard(updated);
      setContributor(updated);
      setStep('complete');

      try {
        ensureLevel1Certificate(updated);
        setCertificates(getCertificatesByEmail(updated.email));
      } catch (certErr) {
        console.warn('Auto-issue Level 1 certificate error:', certErr);
      }

      try {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to finalize profile and survey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!contributor) {
    return (
      <div style={{ background: RF_DEEP_GREEN, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
        <p>Redirecting to authentication portal...</p>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE 3: CELEBRATORY CREDENTIAL PASS (SURVEY + PROFILE COMPLETED)
  // ═══════════════════════════════════════════════════════════════════════════
  if (step === 'complete' && successCard) {
    return (
      <div className="rp-profile-page" style={{ background: RF_DEEP_GREEN, minHeight: '100vh', color: '#FFFFFF' }}>
        <div className="rp-profile-container" style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 14px', borderRadius: 100,
            background: 'rgba(24, 252, 92, 0.08)', border: '1px solid rgba(24, 252, 92, 0.28)',
            color: RF_MINT_ACCENT, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', marginBottom: 12
          }}>
            <CheckCircle2 size={13} /> Verified Pioneer
          </div>

          <h1 className="rp-profile-title" style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 'clamp(24px, 4.5vw, 34px)',
            fontWeight: 800,
            lineHeight: 1.22,
            margin: '0 0 8px',
            color: '#FFFFFF'
          }}>
            Welcome, Founding Pioneer
          </h1>
          <p className="rp-profile-subtitle" style={{
            fontSize: 13.5, color: 'rgba(255,255,255,0.7)',
            margin: '0 auto 24px', lineHeight: 1.5, maxWidth: 520
          }}>
            Your cognitive reasoning survey and credentials have been verified. Your Pioneer seat is active.
          </p>

          {/* Pioneer Credential Card */}
          <div className="rp-credential-card" style={{
            background: `linear-gradient(145deg, ${RF_DARK_GREEN} 0%, #03140A 100%)`,
            border: `1.5px solid ${RF_LEAF_GREEN}66`,
            borderRadius: 20,
            boxShadow: `0 20px 50px rgba(0,0,0,0.85), 0 0 35px ${RF_LEAF_GREEN}18`,
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 20,
            boxSizing: 'border-box'
          }}>
            {/* Hologram Accent Line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, ${RF_LEAF_GREEN}, ${RF_MINT_ACCENT}, ${RF_GOLD_YELLOW})`
            }} />

            {/* Header: Avatar, Name, and Pioneer ID */}
            <div className="rp-credential-header" style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              gap: 14, marginBottom: 18, flexWrap: 'wrap'
            }}>
              <div className="rp-credential-user" style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: '1 1 240px' }}>
                {successCard.avatar_url ? (
                  <img
                    src={successCard.avatar_url}
                    alt={successCard.full_name}
                    className="rp-credential-avatar"
                    style={{
                      width: 54, height: 54, borderRadius: '50%', objectFit: 'cover',
                      border: `2px solid ${RF_MINT_ACCENT}`,
                      boxShadow: `0 0 16px ${RF_MINT_ACCENT}35`,
                      flexShrink: 0
                    }}
                  />
                ) : (
                  <div
                    className="rp-credential-avatar"
                    style={{
                      width: 54, height: 54, borderRadius: '50%',
                      background: 'rgba(24, 252, 92, 0.12)', border: `2px solid ${RF_MINT_ACCENT}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, fontWeight: 800, color: RF_MINT_ACCENT,
                      boxShadow: `0 0 16px ${RF_MINT_ACCENT}25`,
                      flexShrink: 0
                    }}
                  >
                    {successCard.full_name ? successCard.full_name.slice(0, 2).toUpperCase() : 'RP'}
                  </div>
                )}
                <div className="rp-credential-info" style={{ minWidth: 0, flex: 1 }}>
                  <span className="rp-credential-badge-micro" style={{
                    fontSize: 10, fontWeight: 800, color: RF_MINT_ACCENT, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block'
                  }}>
                    Refeir Pioneer Credential
                  </span>
                  <h3 className="rp-credential-name" style={{
                    fontSize: 19, fontWeight: 800, color: '#FFFFFF', margin: '2px 0 0',
                    fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: 1.25,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>
                    {successCard.full_name}
                  </h3>
                  <div className="rp-credential-meta" style={{
                    fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>
                    {successCard.institution} {successCard.country ? `• ${successCard.country}` : ''}
                  </div>
                </div>
              </div>

              <div className="rp-credential-id-badge" style={{
                background: 'rgba(24, 252, 92, 0.1)', border: `1px solid ${RF_MINT_ACCENT}55`,
                borderRadius: 12, padding: '7px 14px', textAlign: 'right', flexShrink: 0
              }}>
                <div className="rp-credential-id-label" style={{
                  fontSize: 9.5, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  Official Pioneer ID
                </div>
                <div className="rp-credential-id-value" style={{
                  fontSize: 18, fontWeight: 900, color: RF_MINT_ACCENT, letterSpacing: '0.04em', lineHeight: 1.2
                }}>
                  {successCard.pioneer_id}
                </div>
              </div>
            </div>

            {/* 4-Stat Grid: Application, Squad, Rank, Reasoning */}
            <div className="rp-credential-stats-grid" style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10,
              background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: '12px 14px',
              marginBottom: 14, border: '1px solid rgba(255,255,255,0.06)', boxSizing: 'border-box'
            }}>
              <div className="rp-credential-stat-item" style={{ minWidth: 0 }}>
                <div className="rp-credential-stat-label" style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>Application</div>
                <div className="rp-credential-stat-val" style={{ fontSize: 12.5, fontWeight: 700, color: '#FFFFFF', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {successCard.application_number}
                </div>
              </div>
              <div className="rp-credential-stat-item" style={{ minWidth: 0 }}>
                <div className="rp-credential-stat-label" style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>Assigned Squad</div>
                <div className="rp-credential-stat-val" style={{ fontSize: 12.5, fontWeight: 700, color: RF_MINT_ACCENT, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {successCard.division}
                </div>
              </div>
              <div className="rp-credential-stat-item" style={{ minWidth: 0 }}>
                <div className="rp-credential-stat-label" style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>Rank</div>
                <div className="rp-credential-stat-val" style={{ fontSize: 12.5, fontWeight: 700, color: RF_GOLD_YELLOW, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {successCard.contributor_level.replace('_', ' ')}
                </div>
              </div>
              <div className="rp-credential-stat-item" style={{ minWidth: 0 }}>
                <div className="rp-credential-stat-label" style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>Reasoning</div>
                <div className="rp-credential-stat-val" style={{ fontSize: 12.5, fontWeight: 700, color: RF_MINT_ACCENT, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  10/10 ✓
                </div>
              </div>
            </div>

            {/* Verified Persona & Social Links */}
            {(successCard.linkedin_url || successCard.twitter_handle || successCard.instagram_handle || successCard.github_url || successCard.telegram_handle || successCard.portfolio_url) && (
              <div className="rp-credential-social-row" style={{
                display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
                padding: '8px 12px', background: 'rgba(0,0,0,0.25)', borderRadius: 10,
                marginBottom: 14, border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginRight: 2 }}>
                  Verified:
                </span>
                {successCard.linkedin_url && (
                  <a
                    href={successCard.linkedin_url.startsWith('http') ? successCard.linkedin_url : `https://${successCard.linkedin_url}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: 'rgba(10, 102, 194, 0.2)', border: '1px solid rgba(10, 102, 194, 0.35)',
                      padding: '3px 8px', borderRadius: 100, fontSize: 11, color: '#70B5F9', textDecoration: 'none'
                    }}
                  >
                    LinkedIn <ExternalLink size={9} />
                  </a>
                )}
                {successCard.twitter_handle && (
                  <a
                    href={successCard.twitter_handle.startsWith('http') ? successCard.twitter_handle : `https://x.com/${successCard.twitter_handle.replace('@', '')}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
                      padding: '3px 8px', borderRadius: 100, fontSize: 11, color: '#FFFFFF', textDecoration: 'none'
                    }}
                  >
                    𝕏 {successCard.twitter_handle.startsWith('@') ? successCard.twitter_handle : `@${successCard.twitter_handle}`} <ExternalLink size={9} />
                  </a>
                )}
                {successCard.instagram_handle && (
                  <a
                    href={successCard.instagram_handle.startsWith('http') ? successCard.instagram_handle : `https://instagram.com/${successCard.instagram_handle.replace('@', '')}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: 'rgba(225, 48, 108, 0.15)', border: '1px solid rgba(225, 48, 108, 0.35)',
                      padding: '3px 8px', borderRadius: 100, fontSize: 11, color: '#FF80AB', textDecoration: 'none'
                    }}
                  >
                    IG <ExternalLink size={9} />
                  </a>
                )}
                {successCard.github_url && (
                  <a
                    href={successCard.github_url.startsWith('http') ? successCard.github_url : `https://${successCard.github_url}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)',
                      padding: '3px 8px', borderRadius: 100, fontSize: 11, color: '#E2E8F0', textDecoration: 'none'
                    }}
                  >
                    GitHub <ExternalLink size={9} />
                  </a>
                )}
                {successCard.telegram_handle && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: 'rgba(0, 136, 204, 0.15)', border: '1px solid rgba(0, 136, 204, 0.3)',
                    padding: '3px 8px', borderRadius: 100, fontSize: 11, color: '#64B5F6'
                  }}>
                    TG: {successCard.telegram_handle}
                  </span>
                )}
                {successCard.portfolio_url && (
                  <a
                    href={successCard.portfolio_url.startsWith('http') ? successCard.portfolio_url : `https://${successCard.portfolio_url}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: 'rgba(24, 252, 92, 0.1)', border: `1px solid ${RF_MINT_ACCENT}35`,
                      padding: '3px 8px', borderRadius: 100, fontSize: 11, color: RF_MINT_ACCENT, textDecoration: 'none'
                    }}
                  >
                    Portfolio <ExternalLink size={9} />
                  </a>
                )}
              </div>
            )}

            {/* Verified Settlement Account */}
            {(successCard.bank_name || successCard.account_number) && (
              <div className="rp-credential-bank-card" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: 12,
                marginBottom: 14, border: '1px solid rgba(255,255,255,0.08)', gap: 10, boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <Building2 size={16} style={{ color: RF_MINT_ACCENT, flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Settlement Account
                    </div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {successCard.bank_name} • {successCard.account_number ? `••••${successCard.account_number.slice(-4)}` : ''} ({successCard.account_name || successCard.full_name})
                    </div>
                  </div>
                </div>
                <span className="rp-credential-payout-badge" style={{
                  fontSize: 10.5, fontWeight: 700, color: RF_MINT_ACCENT, background: 'rgba(24, 252, 92, 0.1)',
                  border: '1px solid rgba(24, 252, 92, 0.3)', padding: '3px 8px', borderRadius: 100, whiteSpace: 'nowrap', flexShrink: 0
                }}>
                  Ready ✓
                </span>
              </div>
            )}

            {/* Survey Verification Box */}
            <div className="rp-credential-survey-box" style={{
              background: 'rgba(24, 252, 92, 0.07)', border: '1px solid rgba(24, 252, 92, 0.22)',
              borderRadius: 12, padding: '10px 14px', marginBottom: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <Brain size={16} style={{ color: RF_MINT_ACCENT, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Reasoning Survey Recorded
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    10/10 scenarios evaluated &amp; attributed
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSurveyReviewOpen(!surveyReviewOpen)}
                style={{
                  background: 'none', border: `1px solid ${RF_LEAF_GREEN}55`, color: RF_MINT_ACCENT,
                  padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0, whiteSpace: 'nowrap'
                }}
              >
                {surveyReviewOpen ? 'Hide' : 'Answers'}
                <ChevronDown size={13} style={{ transform: surveyReviewOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
            </div>

            {/* Expandable Survey Answers Review */}
            {surveyReviewOpen && successCard.survey_responses && (
              <div style={{
                background: 'rgba(0,0,0,0.45)', borderRadius: 12, padding: 14, marginBottom: 16,
                border: '1px solid rgba(255,255,255,0.08)', maxHeight: 300, overflowY: 'auto'
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: RF_MINT_ACCENT, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                  Submitted Scenarios ({successCard.survey_responses.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {successCard.survey_responses.map((resp, idx) => (
                    <div key={resp.question_id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 8 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>
                        {idx + 1}. {resp.category}
                      </div>
                      <div style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 600, margin: '2px 0 4px' }}>
                        {resp.question}
                      </div>
                      <div style={{ fontSize: 11.5, color: RF_MINT_ACCENT, background: 'rgba(24, 252, 92, 0.08)', padding: '5px 8px', borderRadius: 6, lineHeight: 1.45 }}>
                        {resp.selected_option}
                      </div>
                      {resp.reasoning_notes && (
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 3, fontStyle: 'italic' }}>
                          Note: "{resp.reasoning_notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Pills */}
            {successCard.skills && successCard.skills.length > 0 && (
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {successCard.skills.map((s, i) => (
                  <span key={i} style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: 100, padding: '2px 8px', fontSize: 10.5, color: 'rgba(255,255,255,0.8)'
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          {/* MY CERTIFICATES OF LEVEL COMPLETION */}
          {/* ═══════════════════════════════════════════════════════════════════════════ */}
          <div
            id="certificates-section"
            className="rp-certificates-card"
            style={{
              background: `linear-gradient(145deg, rgba(7, 24, 15, 0.95) 0%, rgba(2, 14, 8, 0.95) 100%)`,
              border: `1.5px solid rgba(102, 187, 42, 0.3)`,
              borderRadius: 20,
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 35px rgba(24, 252, 92, 0.06)',
              textAlign: 'left',
              marginBottom: 24,
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            {/* Header Badge & Counts */}
            <div className="rp-certificates-header" style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              gap: 12, marginBottom: 16, flexWrap: 'wrap'
            }}>
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 10px', borderRadius: 100,
                  background: 'rgba(24, 252, 92, 0.1)', border: '1px solid rgba(24, 252, 92, 0.25)',
                  color: RF_MINT_ACCENT, fontSize: 10.5, fontWeight: 800, letterSpacing: '0.05em',
                  textTransform: 'uppercase', marginBottom: 6
                }}>
                  <Award size={12} /> Verified Accreditation
                </div>
                <h3 style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: 20, fontWeight: 800, margin: 0, color: '#FFFFFF'
                }}>
                  Certificates of Completion
                </h3>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', margin: '3px 0 0', lineHeight: 1.45 }}>
                  Verifiable proof-of-work certificates with cryptographic verification hash.
                </p>
              </div>

              <div style={{
                background: 'rgba(255, 184, 0, 0.1)', border: '1px solid rgba(255, 184, 0, 0.3)',
                borderRadius: 10, padding: '6px 12px', textAlign: 'right', flexShrink: 0
              }}>
                <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Issued</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: RF_GOLD_YELLOW, lineHeight: 1.2 }}>
                  {certificates.length} Total
                </div>
              </div>
            </div>

            {/* Certificates List */}
            {certificates.length === 0 ? (
              <div style={{
                padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: 14,
                border: '1px dashed rgba(255,255,255,0.12)', textAlign: 'center'
              }}>
                <Award size={28} style={{ color: RF_MINT_ACCENT, margin: '0 auto 8px', opacity: 0.8 }} />
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#FFFFFF' }}>Certificate in Progress</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>
                  Your Level 1: Pioneer Associate Certificate is being minted.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {certificates.map(cert => {
                  return (
                    <div
                      key={cert.id}
                      className="rp-certificate-item"
                      style={{
                        background: 'rgba(0,0,0,0.35)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 14,
                        padding: '14px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 12,
                        transition: 'all 0.2s',
                        boxSizing: 'border-box'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: '1 1 220px' }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 10,
                          background: `linear-gradient(135deg, ${RF_DARK_GREEN} 0%, rgba(24, 252, 92, 0.15) 100%)`,
                          border: `1.5px solid ${RF_MINT_ACCENT}55`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: RF_GOLD_YELLOW, flexShrink: 0
                        }}>
                          <Award size={20} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>
                              {cert.level_title}
                            </span>
                            <span style={{
                              fontSize: 9.5, fontWeight: 800,
                              background: cert.status === 'ISSUED' ? 'rgba(24, 252, 92, 0.15)' : 'rgba(239, 68, 68, 0.2)',
                              color: cert.status === 'ISSUED' ? RF_MINT_ACCENT : '#FCA5A5',
                              border: `1px solid ${cert.status === 'ISSUED' ? RF_MINT_ACCENT + '55' : '#EF444455'}`,
                              padding: '2px 7px', borderRadius: 100, textTransform: 'uppercase'
                            }}>
                              {cert.status === 'ISSUED' ? 'VERIFIED' : 'REVOKED'}
                            </span>
                          </div>
                          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                            Serial: <code style={{ color: RF_MINT_ACCENT }}>{cert.id}</code> • Squad: <strong>{cert.division}</strong>
                          </div>
                          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>
                            Issued: {new Date(cert.issued_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedCertificate(cert)}
                        className="rp-certificate-btn"
                        style={{
                          background: `linear-gradient(135deg, ${RF_LEAF_GREEN} 0%, ${RF_MINT_ACCENT} 100%)`,
                          color: RF_DEEP_GREEN,
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          boxShadow: `0 3px 12px ${RF_LEAF_GREEN}33`,
                          transition: 'all 0.18s',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}
                      >
                        <Printer size={13} /> View Certificate
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Sovereign Ladder Promotion Tracker */}
            <div className="rp-milestone-quota-box" style={{
              marginTop: 16,
              background: 'rgba(24, 252, 92, 0.05)',
              border: '1px solid rgba(24, 252, 92, 0.18)',
              borderRadius: 12,
              padding: '12px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 10,
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: '1 1 220px' }}>
                <Sparkles size={16} style={{ color: RF_GOLD_YELLOW, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF' }}>
                    Milestone Quotas
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
                    Certificates awarded: Level 2 (15 jobs), Level 3 (40 jobs), Level 4 (75 jobs), Level 5 (125 jobs).
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/rewards')}
                style={{
                  background: 'none', border: `1px solid ${RF_LEAF_GREEN}55`, color: RF_MINT_ACCENT,
                  padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  whiteSpace: 'nowrap', flexShrink: 0
                }}
              >
                View Ladder →
              </button>
            </div>
          </div>

          {/* Action Buttons: Concise, Modern, Minimal */}
          <div className="rp-profile-success-actions">
            <button
              onClick={() => onNavigate('/submit-task')}
              className="rp-btn-action-primary"
            >
              Submit Proofs <ArrowRight size={15} />
            </button>
            <button
              onClick={() => {
                setStep('profile');
                setSuccessCard(null);
              }}
              className="rp-btn-action-secondary"
            >
              Edit Profile
            </button>
          </div>

        </div>

        {/* Certificate Modal for full inspection & printing */}
        {selectedCertificate && (
          <CertificateModal
            isOpen={Boolean(selectedCertificate)}
            certificate={selectedCertificate}
            onClose={() => setSelectedCertificate(null)}
          />
        )}

      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE 2: SEQUENTIAL COGNITIVE & REASONING SURVEY ("ONE AFTER THE OTHER")
  // ═══════════════════════════════════════════════════════════════════════════
  if (step === 'survey') {
    const activeQ = activeSquadQuestions[currentQuestionIndex] || activeSquadQuestions[0];
    const totalQuestions = activeSquadQuestions.length;
    const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
    const currentAnswer = surveyAnswers[activeQ.id];
    const isFinalQuestion = currentQuestionIndex === totalQuestions - 1;

    return (
      <div style={{ background: RF_DEEP_GREEN, minHeight: '100vh', color: '#FFFFFF', paddingTop: 100, paddingBottom: 90 }}>
        <div style={{ maxWidth: 660, margin: '0 auto', padding: '0 20px' }}>
          
          {/* Header & Step Tracker */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 100,
              background: 'rgba(24, 252, 92, 0.1)', border: '1px solid rgba(24, 252, 92, 0.25)',
              color: RF_MINT_ACCENT, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', marginBottom: 14
            }}>
              <Brain size={14} /> Pioneer Reasoning & Mindset Survey
            </div>

            <h1 style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 'clamp(26px, 4.5vw, 36px)',
              fontWeight: 800,
              lineHeight: 1.2,
              margin: '0 0 10px',
              color: '#FFFFFF'
            }}>
              How You Think & Reason
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>
              Scenario questions tailored for the <strong style={{ color: RF_MINT_ACCENT }}>{division}</strong> squad. Answer each scenario honestly. Refeir values autonomous judgment, extreme craftsmanship, ethical transparency, and high-trust peer collaboration.
            </p>
          </div>

          {/* Progress Bar Container */}
          <div style={{
            background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '16px 20px', marginBottom: 26
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, fontSize: 12 }}>
              <span style={{ fontWeight: 700, color: RF_MINT_ACCENT, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                {progressPercent}% Completed
              </span>
            </div>

            <div style={{
              width: '100%', height: 7, background: 'rgba(255,255,255,0.1)',
              borderRadius: 10, overflow: 'hidden'
            }}>
              <div style={{
                width: `${progressPercent}%`, height: '100%',
                background: `linear-gradient(90deg, ${RF_LEAF_GREEN} 0%, ${RF_MINT_ACCENT} 100%)`,
                borderRadius: 10, transition: 'width 0.3s ease'
              }} />
            </div>

            {/* Quick Question Stepper Pills (10 Squad Scenarios) */}
            <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
              {activeSquadQuestions.map((q, idx) => {
                const isAnswered = q.options.length > 0 ? !!surveyAnswers[q.id]?.optionId : writtenReflection.trim().length >= 30;
                const isCurrent = idx === currentQuestionIndex;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setErrorMsg('');
                    }}
                    style={{
                      flex: '1 0 calc(10% - 6px)', minWidth: 28, height: 28, borderRadius: 6, border: 'none',
                      background: isCurrent
                        ? RF_MINT_ACCENT
                        : isAnswered
                        ? 'rgba(24, 252, 92, 0.25)'
                        : 'rgba(255,255,255,0.08)',
                      color: isCurrent ? RF_DEEP_GREEN : '#FFFFFF',
                      fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2
                    }}
                    title={`Question ${idx + 1}: ${q.title}`}
                  >
                    {idx + 1}
                    {isAnswered && !isCurrent && <Check size={10} style={{ color: RF_MINT_ACCENT }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 12, padding: '12px 16px', marginBottom: 20, color: '#FCA5A5',
              fontSize: 13, display: 'flex', alignItems: 'center', gap: 10
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Active Question Box */}
          <div style={{
            background: 'rgba(15, 46, 30, 0.65)',
            border: '1px solid rgba(102, 187, 42, 0.22)',
            borderRadius: 20,
            padding: '28px 24px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            marginBottom: 26
          }}>
            {/* Category Pill */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <span style={{
                fontSize: 11, fontWeight: 800, color: RF_MINT_ACCENT,
                background: 'rgba(24, 252, 92, 0.12)', border: `1px solid ${RF_LEAF_GREEN}44`,
                padding: '4px 12px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.06em'
              }}>
                {activeQ.category}
              </span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                Scenario {currentQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>

            <h2 style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 22, fontWeight: 700, margin: '0 0 16px', color: '#FFFFFF'
            }}>
              {activeQ.title}
            </h2>

            {/* Scenario Box */}
            <div style={{
              background: 'rgba(0,0,0,0.3)', borderLeft: `3px solid ${RF_MINT_ACCENT}`,
              borderRadius: '0 10px 10px 0', padding: '14px 16px', marginBottom: 20,
              fontSize: 13.5, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6
            }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: RF_MINT_ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                The Scenario
              </div>
              {activeQ.scenario}
            </div>

            {/* Question Heading */}
            <p style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF', marginBottom: 18, lineHeight: 1.5 }}>
              {activeQ.question}
            </p>

            {/* Options List for Multiple-Choice Questions */}
            {activeQ.options.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {activeQ.options.map(opt => {
                  const isSelected = currentAnswer?.optionId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(activeQ.id, opt.id)}
                      style={{
                        background: isSelected ? 'rgba(24, 252, 92, 0.1)' : 'rgba(0,0,0,0.25)',
                        border: isSelected ? `2px solid ${RF_MINT_ACCENT}` : '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 14, padding: '16px 18px', cursor: 'pointer',
                        transition: 'all 0.2s', position: 'relative'
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                          e.currentTarget.style.background = 'rgba(0,0,0,0.25)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        {/* Radio Dot indicator */}
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                          border: isSelected ? `6px solid ${RF_MINT_ACCENT}` : '2px solid rgba(255,255,255,0.3)',
                          background: isSelected ? RF_DEEP_GREEN : 'transparent',
                          transition: 'all 0.2s'
                        }} />

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{
                              fontSize: 11, fontWeight: 800, color: isSelected ? RF_DEEP_GREEN : RF_MINT_ACCENT,
                              background: isSelected ? RF_MINT_ACCENT : 'rgba(24, 252, 92, 0.1)',
                              padding: '2px 8px', borderRadius: 6
                            }}>
                              Option {opt.letter}
                            </span>
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.45, marginBottom: 4 }}>
                            {opt.text}
                          </div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                            {opt.subtext}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Optional Note Box */}
                <div style={{ marginTop: 8 }}>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
                    Your Rationale & Reflections (Optional)
                  </label>
                  <textarea
                    value={currentAnswer?.note || ''}
                    onChange={e => handleUpdateNote(activeQ.id, e.target.value)}
                    placeholder={activeQ.notePlaceholder}
                    rows={2}
                    style={{
                      width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
                      padding: '10px 12px', color: '#FFFFFF', fontSize: 13, outline: 'none', resize: 'vertical'
                    }}
                    onFocus={e => (e.target.style.borderColor = RF_MINT_ACCENT)}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                  />
                </div>
              </div>
            ) : (
              /* Open-ended Reflection for Question 10 */
              <div style={{ marginBottom: 20 }}>
                <textarea
                  value={writtenReflection}
                  onChange={e => setWrittenReflection(e.target.value)}
                  placeholder={activeQ.notePlaceholder}
                  rows={6}
                  style={{
                    width: '100%', boxSizing: 'border-box', background: 'rgba(0,0,0,0.35)',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12,
                    padding: '14px 16px', color: '#FFFFFF', fontSize: 13.5, outline: 'none',
                    lineHeight: 1.6, resize: 'vertical'
                  }}
                  onFocus={e => (e.target.style.borderColor = RF_MINT_ACCENT)}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 12 }}>
                  <span style={{ color: writtenReflection.trim().length >= 30 ? RF_MINT_ACCENT : 'rgba(255,255,255,0.45)' }}>
                    {writtenReflection.trim().length} characters {writtenReflection.trim().length < 30 ? `(minimum 30 needed: ${30 - writtenReflection.trim().length} remaining)` : '✓ Minimum met'}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                    High-standard peer evaluated
                  </span>
                </div>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="rp-profile-survey-nav">
              <button
                type="button"
                onClick={handlePrevQuestion}
                style={{
                  background: 'rgba(255,255,255,0.06)', color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.2)', padding: '11px 18px',
                  borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.2s'
                }}
              >
                <ArrowLeft size={14} />
                {currentQuestionIndex === 0 ? 'Back' : 'Previous'}
              </button>

              {!isFinalQuestion ? (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={!currentAnswer?.optionId}
                  style={{
                    background: currentAnswer?.optionId ? RF_LEAF_GREEN : 'rgba(255,255,255,0.1)',
                    color: currentAnswer?.optionId ? RF_DEEP_GREEN : 'rgba(255,255,255,0.4)',
                    border: 'none', padding: '11px 22px',
                    borderRadius: 100, fontSize: 13.5, fontWeight: 800,
                    cursor: currentAnswer?.optionId ? 'pointer' : 'not-allowed',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    boxShadow: currentAnswer?.optionId ? `0 4px 16px ${RF_LEAF_GREEN}44` : 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    if (currentAnswer?.optionId) e.currentTarget.style.background = RF_MINT_ACCENT;
                  }}
                  onMouseLeave={e => {
                    if (currentAnswer?.optionId) e.currentTarget.style.background = RF_LEAF_GREEN;
                  }}
                >
                  Next <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={loading || writtenReflection.trim().length < 30}
                  style={{
                    background: (writtenReflection.trim().length >= 30 && !loading) ? RF_LEAF_GREEN : 'rgba(255,255,255,0.1)',
                    color: (writtenReflection.trim().length >= 30 && !loading) ? RF_DEEP_GREEN : 'rgba(255,255,255,0.4)',
                    border: 'none', padding: '12px 24px',
                    borderRadius: 100, fontSize: 13.5, fontWeight: 800,
                    cursor: (writtenReflection.trim().length >= 30 && !loading) ? 'pointer' : 'not-allowed',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    boxShadow: (writtenReflection.trim().length >= 30 && !loading) ? `0 4px 18px ${RF_LEAF_GREEN}44` : 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    if (writtenReflection.trim().length >= 30 && !loading) e.currentTarget.style.background = RF_MINT_ACCENT;
                  }}
                  onMouseLeave={e => {
                    if (writtenReflection.trim().length >= 30 && !loading) e.currentTarget.style.background = RF_LEAF_GREEN;
                  }}
                >
                  {loading ? (
                    'Minting ID...'
                  ) : (
                    <>
                      <Award size={15} /> Mint Pioneer ID
                    </>
                  )}
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="rp-profile-page">
      <div className="rp-profile-container">
        
        {/* Header */}
        <div className="rp-profile-header">
          <div className="rp-profile-eyebrow">
            Contributor Onboarding
          </div>

          <h1 className="rp-profile-title">
            {contributor.is_profile_completed ? 'Update Contributor Profile' : 'Complete Your Profile'}
          </h1>
          <p className="rp-profile-subtitle">
            {contributor.is_profile_completed
              ? 'Keep your squad specialization, contact handles, and settlement details up to date.'
              : 'Provide your verified background and squad details to mint your Pioneer ID.'}
          </p>
        </div>

        {/* Verification Summary Bar */}
        <div className="rp-profile-summary-bar">
          <div className="rp-profile-summary-item">
            <div className="rp-profile-summary-label">Pioneer ID</div>
            <div className="rp-profile-summary-val" style={{ color: contributor.pioneer_id ? RF_MINT_ACCENT : RF_GOLD_YELLOW }}>
              {contributor.pioneer_id || 'Pending'}
            </div>
          </div>
          <div className="rp-profile-summary-item">
            <div className="rp-profile-summary-label">Status</div>
            <div className="rp-profile-summary-val" style={{ color: RF_MINT_ACCENT }}>
              {contributor.is_profile_completed ? 'ACTIVE' : 'ACCEPTED'}
            </div>
          </div>
          <div className="rp-profile-summary-item">
            <div className="rp-profile-summary-label">Squad</div>
            <div className="rp-profile-summary-val">
              {contributor.division || division || 'General'}
            </div>
          </div>
        </div>

        {/* If already completed, option to jump directly to credential card */}
        {contributor.is_profile_completed && (
          <div className="rp-profile-active-card">
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>Active Sovereign Pioneer</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                Pioneer ID: <strong style={{ color: RF_MINT_ACCENT }}>{contributor.pioneer_id}</strong>
              </div>
            </div>
            <div className="rp-profile-active-actions">
              <button
                type="button"
                onClick={() => {
                  setSuccessCard(contributor);
                  setStep('complete');
                  setTimeout(() => {
                    const el = document.getElementById('certificates-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }}
                className="rp-active-btn-gold"
              >
                <Award size={13} /> Certificates ({certificates.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setSuccessCard(contributor);
                  setStep('complete');
                }}
                className="rp-active-btn-mint"
              >
                View Pass
              </button>
            </div>
          </div>
        )}

        {/* Success Notice */}
        {successMsg && (
          <div style={{
            background: 'rgba(24, 252, 92, 0.12)', border: `1px solid ${RF_LEAF_GREEN}`,
            borderRadius: 12, padding: '12px 16px', color: RF_MINT_ACCENT,
            fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18
          }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="rp-profile-form-card">

          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444',
              borderRadius: 12, padding: '12px 16px', color: '#FCA5A5',
              fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 20,
              lineHeight: 1.5
            }}>
              <AlertCircle size={17} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleProceedToSurvey}>
            
            {/* Section 1: Official Headshot & Personal Contacts */}
            <div style={{ marginBottom: 26 }}>
              <div className="rp-section-header">
                <span className="rp-section-num">01</span>
                <div>
                  <h3 className="rp-section-title">Identity &amp; Contact</h3>
                  <p className="rp-section-desc">Portrait photo and official contact channels</p>
                </div>
              </div>

              {/* Photo Upload Area */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
              />

              <div className="rp-profile-headshot-box">
                <div className="rp-profile-headshot-avatar">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Headshot Preview"
                      style={{
                        width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover',
                        border: `2px solid ${RF_MINT_ACCENT}`,
                        boxShadow: `0 0 16px ${RF_MINT_ACCENT}33`
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%', borderRadius: '50%',
                      background: 'rgba(24, 252, 92, 0.08)', border: `2px dashed ${RF_LEAF_GREEN}88`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: RF_MINT_ACCENT
                    }}>
                      <Camera size={24} />
                    </div>
                  )}
                </div>

                <div className="rp-profile-headshot-info">
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginBottom: 2 }}>
                    {avatarUrl ? 'Portrait Uploaded' : 'Profile Photo'}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                    PNG, JPG or WEBP under 3MB
                  </div>
                  <div className="rp-profile-headshot-btns">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rp-btn-xs-primary"
                    >
                      <Upload size={12} /> {avatarUrl ? 'Change' : 'Upload'}
                    </button>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setCropperImageSrc(rawUploadedImage || avatarUrl);
                          setCropperOpen(true);
                        }}
                        className="rp-btn-xs-secondary"
                      >
                        <Crop size={12} /> Crop
                      </button>
                    )}
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="rp-btn-xs-danger"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Full Legal Name & Date of Birth */}
              <div className="rp-profile-grid-2col">
                <div>
                  <label className="rp-profile-label">
                    Full Legal Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Chidubem Nwosu"
                      className="rp-profile-input"
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                    <label className="rp-profile-label" style={{ marginBottom: 0 }}>
                      Date of Birth <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <span style={{ fontSize: 10.5, color: isDobLocked ? RF_GOLD_YELLOW : 'rgba(255,255,255,0.45)', fontWeight: isDobLocked ? 700 : 400 }}>
                      {isDobLocked ? 'Locked • Permanent' : 'Permanent once saved'}
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={15} color={isDobLocked ? 'rgba(255,255,255,0.3)' : RF_MINT_ACCENT} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    {isDobLocked ? (
                      <input
                        type="text"
                        value={dateOfBirth}
                        readOnly
                        className="rp-profile-input"
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.75)',
                          cursor: 'not-allowed', fontFamily: 'monospace'
                        }}
                      />
                    ) : (
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={e => setDateOfBirth(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="rp-profile-input"
                        style={{ colorScheme: 'dark' }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* WhatsApp Number & Telegram Handle */}
              <div className="rp-profile-grid-2col">
                <div>
                  <label className="rp-profile-label">
                    WhatsApp / Primary Phone <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      placeholder="+234 812 345 6789"
                      className="rp-profile-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="rp-profile-label">
                    Telegram / Discord Handle
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Send size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={telegram}
                      onChange={e => setTelegram(e.target.value)}
                      placeholder="@username"
                      className="rp-profile-input"
                    />
                  </div>
                </div>
              </div>

              {/* Country & City */}
              <div className="rp-profile-grid-2col" style={{ marginBottom: 0 }}>
                <div>
                  <label className="rp-profile-label">
                    Country of Residence <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Globe size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      placeholder="e.g. Nigeria, Ghana, Kenya"
                      className="rp-profile-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="rp-profile-label">
                    City / State <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. Lagos / Nairobi / Accra"
                      className="rp-profile-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Online Presence */}
            <div style={{ marginBottom: 26, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="rp-section-header">
                <span className="rp-section-num">02</span>
                <div>
                  <h3 className="rp-section-title">Online Presence</h3>
                  <p className="rp-section-desc">Active social handles and portfolio link</p>
                </div>
              </div>

              {/* LinkedIn & X / Twitter */}
              <div className="rp-profile-grid-2col">
                <div>
                  <label className="rp-profile-label">
                    LinkedIn URL
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Share2 size={15} color="#70B5F9" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={linkedinUrl}
                      onChange={e => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/yourhandle"
                      className="rp-profile-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="rp-profile-label">
                    X (Twitter) Handle
                  </label>
                  <div style={{ position: 'relative' }}>
                    <AtSign size={15} color="rgba(255,255,255,0.5)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={twitterHandle}
                      onChange={e => setTwitterHandle(e.target.value)}
                      placeholder="@yourhandle"
                      className="rp-profile-input"
                    />
                  </div>
                </div>
              </div>

              {/* Instagram & GitHub */}
              <div className="rp-profile-grid-2col">
                <div>
                  <label className="rp-profile-label">
                    Instagram Handle
                  </label>
                  <div style={{ position: 'relative' }}>
                    <AtSign size={15} color="#FF80AB" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={instagramHandle}
                      onChange={e => setInstagramHandle(e.target.value)}
                      placeholder="@yourhandle"
                      className="rp-profile-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="rp-profile-label">
                    GitHub Profile URL
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Code2 size={15} color="rgba(255,255,255,0.5)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={githubUrl}
                      onChange={e => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/yourhandle"
                      className="rp-profile-input"
                    />
                  </div>
                </div>
              </div>

              {/* Portfolio URL */}
              <div style={{ marginBottom: 0 }}>
                <label className="rp-profile-label">
                  Personal Portfolio / Showcase Website
                </label>
                <div style={{ position: 'relative' }}>
                  <Globe size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    value={portfolioUrl}
                    onChange={e => setPortfolioUrl(e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className="rp-profile-input"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Academic & Professional */}
            <div style={{ marginBottom: 26, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="rp-section-header">
                <span className="rp-section-num">03</span>
                <div>
                  <h3 className="rp-section-title">Academic &amp; Professional</h3>
                  <p className="rp-section-desc">University, college, or organization</p>
                </div>
              </div>

              <div>
                <label className="rp-profile-label">
                  University / College / Organization <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <GraduationCap size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    placeholder="e.g. University of Lagos (UNILAG) / Covenant University"
                    className="rp-profile-input"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Squad & Skills */}
            <div style={{ marginBottom: 26, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="rp-section-header">
                <span className="rp-section-num">04</span>
                <div>
                  <h3 className="rp-section-title">Squad &amp; Skills</h3>
                  <p className="rp-section-desc">Primary squad division and core superpowers</p>
                </div>
              </div>

              {/* Division Dropdown */}
              <div style={{ marginBottom: 14 }}>
                <label className="rp-profile-label">
                  Primary Pioneer Squad
                </label>
                <select
                  value={division}
                  onChange={e => setDivision(e.target.value)}
                  className="rp-profile-select"
                >
                  <option value="TECHNOLOGY">Technology & Architecture (Engineering / Web3)</option>
                  <option value="DESIGN">Product, UI/UX & Brand Design</option>
                  <option value="GROWTH">Growth, Marketing & Campus Referrals</option>
                  <option value="COMMUNITY">Community, Regional & University Chapters</option>
                  <option value="OPERATIONS">Operations, Quality & Governance</option>
                  <option value="BUSINESS">Business Development & Strategic Partnerships</option>
                  <option value="GENERAL">General Cross-Functional Squad</option>
                </select>
                {!contributor?.is_profile_completed && (
                  <div style={{ fontSize: 11.5, color: RF_MINT_ACCENT, marginTop: 5 }}>
                    Your 10-question cognitive survey will adapt dynamically to this squad choice.
                  </div>
                )}
              </div>

              {/* Skills Tags */}
              <div style={{ marginBottom: 14 }}>
                <label className="rp-profile-label">
                  Key Skills & Superpowers (Select all that apply)
                </label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  {POPULAR_SKILLS.map(skill => {
                    const active = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        style={{
                          background: active ? RF_LEAF_GREEN : 'rgba(255,255,255,0.05)',
                          color: active ? RF_DEEP_GREEN : 'rgba(255,255,255,0.8)',
                          border: `1px solid ${active ? RF_LEAF_GREEN : 'rgba(255,255,255,0.15)'}`,
                          borderRadius: 100, padding: '5px 12px', fontSize: 11.5, fontWeight: active ? 700 : 500,
                          cursor: 'pointer', transition: 'all 0.15s'
                        }}
                      >
                        {active ? '✓ ' : '+ '}{skill}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={customSkill}
                    onChange={e => setCustomSkill(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }}
                    placeholder="Add other skill (e.g. Solidity, Docker)"
                    style={{
                      flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 8, padding: '8px 12px', color: '#FFFFFF', fontSize: 12.5, outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    style={{
                      background: 'rgba(255,255,255,0.08)', color: '#FFFFFF',
                      border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8,
                      padding: '8px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Bio Statement */}
              <div style={{ marginBottom: 0 }}>
                <label className="rp-profile-label">
                  Contributor Bio & Motivation
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Share a brief introduction, what problems you solve, and what you aim to achieve as a Refeir Pioneer..."
                  className="rp-profile-textarea"
                />
              </div>
            </div>

            {/* Section 5: Reward Settlement */}
            <div style={{ marginBottom: 26, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="rp-section-header">
                <span className="rp-section-num">05</span>
                <div>
                  <h3 className="rp-section-title">Stipend &amp; Reward Settlement</h3>
                  <p className="rp-section-desc">Local bank account for automated grant payouts</p>
                </div>
              </div>

              {/* Active Settlement Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 10px', borderRadius: 6,
                background: 'rgba(24, 252, 92, 0.08)', border: '1px solid rgba(24, 252, 92, 0.3)',
                color: RF_MINT_ACCENT, fontSize: 11, fontWeight: 700, marginBottom: 14
              }}>
                Direct Bank Deposit (Active)
              </div>

              {/* Bank Details: Bank Name and Account Number */}
              <div className="rp-profile-grid-2col">
                {/* 1. Bank Name */}
                <div>
                  <label className="rp-profile-label">
                    Bank Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      list="popular-banks"
                      value={bankName}
                      onChange={e => setBankName(e.target.value)}
                      placeholder="e.g. GTBank / Access / Kuda / OPay"
                      className="rp-profile-input"
                    />
                    <datalist id="popular-banks">
                      <option value="Guaranty Trust Bank (GTBank)" />
                      <option value="Access Bank" />
                      <option value="Zenith Bank" />
                      <option value="First Bank of Nigeria" />
                      <option value="United Bank for Africa (UBA)" />
                      <option value="Kuda Bank" />
                      <option value="OPay" />
                      <option value="Moniepoint" />
                      <option value="Stanbic IBTC Bank" />
                      <option value="First City Monument Bank (FCMB)" />
                      <option value="Fidelity Bank" />
                      <option value="Sterling Bank" />
                      <option value="Wema Bank (ALAT)" />
                      <option value="Polaris Bank" />
                      <option value="Union Bank of Nigeria" />
                      <option value="Palmpay" />
                      <option value="Standard Chartered Bank" />
                      <option value="Ecobank" />
                    </datalist>
                  </div>
                </div>

                {/* 2. Account Digits or Numbers */}
                <div>
                  <label className="rp-profile-label">
                    Account Number <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <CreditCard size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={16}
                      value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value.replace(/[^\d]/g, ''))}
                      placeholder="e.g. 0123456789"
                      className="rp-profile-input"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Name of Beneficiary */}
              <div style={{ marginBottom: 0 }}>
                <label className="rp-profile-label">
                  Beneficiary Name (Account Legal Name) <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    value={accountName}
                    onChange={e => setAccountName(e.target.value)}
                    placeholder="e.g. Chidubem Nwosu (Must match bank records)"
                    className="rp-profile-input"
                  />
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 5 }}>
                  Must match your bank account name for automated clearance.
                </div>
              </div>
            </div>

            {/* Next Step Banner (Only for initial onboarding before survey) */}
            {!contributor?.is_profile_completed && (
              <div style={{
                background: 'rgba(24, 252, 92, 0.06)', border: `1px solid ${RF_LEAF_GREEN}33`,
                borderRadius: 12, padding: '12px 14px', marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 10
              }}>
                <Brain size={18} style={{ color: RF_MINT_ACCENT, flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.45 }}>
                  <strong style={{ color: '#FFFFFF' }}>Next: 10-Question Reasoning Survey</strong>. Dynamic scenario evaluation based on your selected squad.
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="rp-profile-submit-btn"
            >
              {loading ? (
                'Saving...'
              ) : contributor?.is_profile_completed ? (
                'Save Changes'
              ) : (
                <>
                  Continue to Survey <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Interactive Headshot Cropper Modal */}
        <HeadshotCropperModal
          isOpen={cropperOpen}
          imageSrc={cropperImageSrc || avatarUrl}
          onClose={() => setCropperOpen(false)}
          onApplyCrop={handleApplyCroppedAvatar}
        />

        {/* Certificate Modal for profile edit view */}
        {selectedCertificate && (
          <CertificateModal
            isOpen={Boolean(selectedCertificate)}
            certificate={selectedCertificate}
            onClose={() => setSelectedCertificate(null)}
          />
        )}

      </div>
    </div>
  );
};
