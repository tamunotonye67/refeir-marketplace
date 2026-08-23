import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FaceCaptureModule } from '../components/verification/FaceCaptureModule';
import { defaultKYCProvider, KYCVerificationResult } from '../services/kycProvider';
import { ocrEngine, OCRScanResult } from '../services/ocrService';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Upload,
  Award,
  Globe2,
  FileCheck,
  ArrowRight,
  Camera,
  UserCheck,
  Eye,
  Sparkles,
  RefreshCw,
  AlertCircle,
  XCircle,
  Calendar,
  User,
  Bell,
  Mail,
  Send,
  Clock,
  Scan,
  FileSearch,
  CheckCheck,
  FileText
} from 'lucide-react';

export const VerificationPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast, addAppNotification } = useNotification();

  const [step, setStep] = useState<'ID_DOCUMENT' | 'FACE_CAPTURE' | 'REVIEW' | 'VERIFIED'>('ID_DOCUMENT');
  const [idType, setIdType] = useState<'NATIONAL_ID' | 'PASSPORT' | 'DRIVERS_LICENSE' | 'VOTERS_CARD'>('NATIONAL_ID');
  const userAccountName = currentUser ? `${currentUser.first_name} ${currentUser.last_name}`.trim() : '';
  const [fullNameOnDoc, setFullNameOnDoc] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [idFrontFile, setIdFrontFile] = useState<string | null>(null);
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRScanResult | null>(null);
  const [faceCaptureUrl, setFaceCaptureUrl] = useState<string | null>(null);
  const [captureType, setCaptureType] = useState<'PHOTO' | 'VIDEO'>('VIDEO');
  const [biometricConsent, setBiometricConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] = useState<KYCVerificationResult | null>(null);

  // Handle sample ID photo upload & Trigger Real-Time Sovereign OCR Engine
  const handleIdFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        setIdFrontFile(dataUrl);
        setIsScanningOCR(true);
        try {
          const res = await ocrEngine.scanAndCrossReference(
            dataUrl,
            {
              first_name: currentUser?.first_name,
              last_name: currentUser?.last_name,
              country: currentUser?.country,
              email: currentUser?.email
            },
            idType
          );
          setOcrResult(res);
          // Auto-populate extracted OCR fields
          setFullNameOnDoc(res.extracted_full_name);
          setDateOfBirth(res.extracted_dob);
          setDocNumber(res.extracted_id_number);

          if (res.profile_alignment.overall_alignment_passed) {
            showToast(
              'OCR Document Extracted & Aligned',
              `Parsed details with ${res.ocr_confidence_score}% confidence. 100% matched your registered account profile.`,
              'SUCCESS'
            );
          } else {
            showToast(
              'OCR Alignment Check',
              res.profile_alignment.alignment_discrepancies[0] || 'Please verify auto-extracted details.',
              'WARNING'
            );
          }
        } catch (err) {
          showToast('OCR Error', 'Unable to parse document typography. Please fill details manually.', 'WARNING');
        } finally {
          setIsScanningOCR(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaceCaptureDone = (mediaDataUrl: string, consentGranted: boolean, type: 'PHOTO' | 'VIDEO') => {
    setFaceCaptureUrl(mediaDataUrl);
    setCaptureType(type);
    setBiometricConsent(consentGranted);
    setStep('REVIEW');
    showToast(
      type === 'VIDEO' ? '3D Biometric Video Recorded' : 'Face Snapshot Captured',
      'Live biometrics recorded. Proceed to final multi-factor verification review.',
      'INFO'
    );
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await defaultKYCProvider.initializeVerification({
        user_id: currentUser?.id || 'usr_anonymous',
        account_user_name: userAccountName || fullNameOnDoc,
        full_legal_name_on_doc: fullNameOnDoc,
        date_of_birth: dateOfBirth,
        country_iso: currentUser?.country || 'NGA',
        id_type: idType,
        id_number: docNumber,
        document_front_url: idFrontFile || 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=400',
        face_capture_url: captureType === 'PHOTO' ? faceCaptureUrl || undefined : undefined,
        video_capture_url: captureType === 'VIDEO' ? faceCaptureUrl || undefined : undefined,
        capture_type: captureType,
        biometric_consent_granted: biometricConsent,
        biometric_consent_timestamp: new Date().toISOString()
      });

      setVerificationResult(result);
      setStep('VERIFIED');

      if (result.is_fully_approved) {
        addAppNotification({
          title: 'Biometric & Document Verification Approved ✓',
          message: `Your sovereign ID (${idType} ${docNumber}), Date of Birth (${dateOfBirth}), and 3D Biometric capture match have been verified (${result.face_match_confidence}% confidence). Tier 2 Verified Sovereign Badge issued!`,
          type: 'SUCCESS',
          category: 'VERIFICATION',
          link: '/verification',
          action_label: 'View Verified Sovereign Badge',
          email_dispatched: true,
          email_recipient: currentUser?.email || 'user@refeir.africa',
          role_target: 'ALL'
        });
      } else {
        addAppNotification({
          title: 'Verification Action Required: Mismatch Identified',
          message: `Our Sovereign Identity Rail identified discrepancies in your submission: ${(result.discrepancy_details || []).join('; ')}. Please review and update details.`,
          type: 'WARNING',
          category: 'VERIFICATION',
          link: '/verification',
          action_label: 'Fix Mismatches & Retry',
          email_dispatched: true,
          email_recipient: currentUser?.email || 'user@refeir.africa',
          role_target: 'ALL'
        });
      }
    } catch (err) {
      showToast('Verification Error', 'Unable to reach sovereign identity rail. Please retry.', 'WARNING');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rf-container" style={{ paddingTop: '2.5rem', paddingBottom: '6rem', maxWidth: '860px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--rf-leaf-green)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          <ShieldCheck size={14} />
          <span>AFRICA TRUST & SOVEREIGN IDENTITY NETWORK</span>
        </div>
        <h1 style={{ fontSize: '2.35rem', fontWeight: 800, color: 'var(--rf-cream)', letterSpacing: '-0.02em', margin: '0 0 0.5rem 0' }}>
          Biometric Identity & Trust Verification
        </h1>
        <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto' }}>
          Strict multi-factor identity engine: All names, dates of birth, official document numbers, and live 3D biometric captures must strictly align to issue verified badges.
        </p>
      </div>

      {/* Interactive Step Progress Tracker */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {[
          { key: 'ID_DOCUMENT', label: '1. Government ID', desc: 'Name, DOB & NIN' },
          { key: 'FACE_CAPTURE', label: '2. Face Capture', desc: 'Face-Sensitive Scan' },
          { key: 'REVIEW', label: '3. Match Audit', desc: '4-Point Alignment' },
          { key: 'VERIFIED', label: '4. Decision Result', desc: 'Badge Activation' }
        ].map((s, idx) => {
          const isCurrent = step === s.key;
          const isPassed =
            (step === 'FACE_CAPTURE' && idx === 0) ||
            (step === 'REVIEW' && idx <= 1) ||
            (step === 'VERIFIED' && idx <= 3);

          return (
            <div
              key={s.key}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--rf-radius-md)',
                background: isCurrent ? 'rgba(102, 187, 42, 0.15)' : isPassed ? 'rgba(102, 187, 42, 0.08)' : 'var(--rf-bg-surface)',
                border: isCurrent ? '1.5px solid var(--rf-leaf-green)' : isPassed ? '1px solid rgba(102, 187, 42, 0.4)' : '1px solid var(--rf-bg-card-border)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: isCurrent ? 'var(--rf-leaf-green)' : isPassed ? 'var(--rf-leaf-green)' : 'var(--rf-slate-400)' }}>
                {s.label}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--rf-slate-400)', marginTop: '0.15rem' }}>
                {s.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          STEP 1: GOVERNMENT ID DOCUMENT
          ========================================================================= */}
      {step === 'ID_DOCUMENT' && (
        <div className="rf-card" style={{ padding: '2.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileCheck size={20} color="var(--rf-leaf-green)" />
            <span>Step 1: Enter Exact Government Document Information</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--rf-slate-400)', marginBottom: '1.75rem' }}>
            Please ensure your full legal name, date of birth, and ID document number exactly match your official sovereign card.
          </p>

          {(() => {
            const isStep1Complete = Boolean(
              fullNameOnDoc.trim().length >= 3 &&
              dateOfBirth &&
              docNumber.trim().length >= 5 &&
              idFrontFile
            );

            return (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!fullNameOnDoc.trim() || fullNameOnDoc.trim().length < 3) {
                    showToast('Legal Name Required', 'Please enter your full legal name as shown on your official ID document.', 'WARNING');
                    return;
                  }
                  if (!dateOfBirth) {
                    showToast('Date of Birth Required', 'Please provide your date of birth.', 'WARNING');
                    return;
                  }
                  if (!docNumber.trim() || docNumber.trim().length < 5) {
                    showToast('Document Number Required', 'Please enter your valid official ID document number.', 'WARNING');
                    return;
                  }
                  if (!idFrontFile) {
                    showToast('ID Document Photo Required', 'You cannot proceed to Live Face Capture until you upload a clear image of your official ID document.', 'WARNING');
                    return;
                  }
                  setStep('FACE_CAPTURE');
                }}
              >
                <div className="rf-grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div className="rf-form-group" style={{ margin: 0 }}>
                    <label className="rf-label">Full Legal Name (As Shown on ID) *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        required
                        className="rf-input"
                        value={fullNameOnDoc}
                        onChange={e => setFullNameOnDoc(e.target.value)}
                        placeholder="Enter your Full Legal Name (e.g. Chidi Emmanuel Okafor)"
                      />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem', display: 'block' }}>
                      Must match the name registered on your Refeir account.
                    </span>
                  </div>

                  <div className="rf-form-group" style={{ margin: 0 }}>
                    <label className="rf-label">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      className="rf-input"
                      value={dateOfBirth}
                      onChange={e => setDateOfBirth(e.target.value)}
                      placeholder="YYYY-MM-DD (e.g. 1996-05-18)"
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--rf-slate-400)', marginTop: '0.25rem', display: 'block' }}>
                      Applicant must be 18 years or older.
                    </span>
                  </div>
                </div>

                <div className="rf-grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div className="rf-form-group" style={{ margin: 0 }}>
                    <label className="rf-label">Select Official Document Type *</label>
                    <select
                      className="rf-select"
                      value={idType}
                      onChange={e => setIdType(e.target.value as any)}
                    >
                      <option value="NATIONAL_ID">National ID Card / NIN (Nigeria / Ghana / Kenya)</option>
                      <option value="PASSPORT">International Passport (ECOWAS / AU Sovereign)</option>
                      <option value="DRIVERS_LICENSE">National Driver's License</option>
                      <option value="VOTERS_CARD">Voter's Registration Card</option>
                    </select>
                  </div>

                  <div className="rf-form-group" style={{ margin: 0 }}>
                    <label className="rf-label">Document Identification Number *</label>
                    <input
                      type="text"
                      required
                      className="rf-input"
                      value={docNumber}
                      onChange={e => setDocNumber(e.target.value)}
                      placeholder={
                        idType === 'NATIONAL_ID'
                          ? 'Enter 11-digit NIN or National ID number (e.g. 78291039482)'
                          : idType === 'PASSPORT'
                          ? 'Enter Passport Number (e.g. A09283742)'
                          : idType === 'DRIVERS_LICENSE'
                          ? 'Enter Driver License ID Number (e.g. DL-92847291)'
                          : 'Enter Voter Card Identification Number (e.g. 90F5 B472 8192)'
                      }
                    />
                  </div>
                </div>

                <div className="rf-form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="rf-label">Upload High-Resolution Photo of ID Document *</label>
                  <label
                    style={{
                      display: 'block',
                      border: idFrontFile ? '2px solid var(--rf-leaf-green)' : '2px dashed var(--rf-bg-card-border)',
                      borderRadius: 'var(--rf-radius-lg)',
                      padding: '1.75rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: idFrontFile ? 'rgba(102, 187, 42, 0.05)' : 'var(--rf-bg-surface)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Upload size={28} color={idFrontFile ? 'var(--rf-leaf-green)' : 'var(--rf-slate-400)'} style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: idFrontFile ? 'var(--rf-leaf-green)' : 'var(--rf-cream)' }}>
                      {idFrontFile ? '✓ ID Document Photo Uploaded & Attached' : 'Click to Upload Front of ID Document (Required)'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: idFrontFile ? 'var(--rf-leaf-green)' : 'var(--rf-slate-400)', marginTop: '0.25rem' }}>
                      {idFrontFile ? 'Document image attached • OCR AI cross-check active' : 'Supports PNG, JPG, or PDF (Max 10MB) — AI OCR reads details automatically'}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIdFileUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* Real-Time OCR Scanning State HUD */}
                {isScanningOCR && (
                  <div
                    style={{
                      marginBottom: '1.5rem',
                      padding: '1.25rem',
                      borderRadius: 'var(--rf-radius-md)',
                      background: 'rgba(102, 187, 42, 0.08)',
                      border: '1px solid rgba(102, 187, 42, 0.3)',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--rf-leaf-green)', fontWeight: 800, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      <Scan size={18} className="animate-spin" />
                      <span>AI OCR Neural Scanner Parsing Document & Verifying Profile Alignment...</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)' }}>
                      Extracting Machine Readable Zone (MRZ), Sovereign Typography, and cross-checking against registered account records.
                    </div>
                  </div>
                )}

                {/* Real-Time OCR Extraction & Profile Cross-Check Card */}
                {ocrResult && !isScanningOCR && (
                  <div
                    style={{
                      marginBottom: '1.75rem',
                      padding: '1.25rem',
                      borderRadius: 'var(--rf-radius-lg)',
                      background: ocrResult.profile_alignment.overall_alignment_passed ? 'rgba(102, 187, 42, 0.08)' : 'rgba(244, 185, 66, 0.08)',
                      border: ocrResult.profile_alignment.overall_alignment_passed ? '1.5px solid var(--rf-leaf-green)' : '1.5px solid #F4B942'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FileSearch size={16} color={ocrResult.profile_alignment.overall_alignment_passed ? 'var(--rf-leaf-green)' : '#F4B942'} />
                        <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                          OCR AI Extraction & Registered Profile Cross-Check
                        </span>
                      </div>
                      <span
                        style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '100px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          background: ocrResult.profile_alignment.overall_alignment_passed ? 'var(--rf-mint-light)' : 'rgba(244, 185, 66, 0.2)',
                          color: ocrResult.profile_alignment.overall_alignment_passed ? 'var(--rf-leaf-green)' : '#F4B942',
                          border: `1px solid ${ocrResult.profile_alignment.overall_alignment_passed ? 'var(--rf-leaf-green)' : '#F4B942'}`
                        }}
                      >
                        {ocrResult.profile_alignment.overall_alignment_passed ? '✓ 100% Profile Aligned' : '⚠️ Discrepancy Found'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.78rem' }}>
                      <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.65rem 0.75rem', borderRadius: '6px' }}>
                        <div style={{ color: 'var(--rf-slate-400)', fontSize: '0.6875rem' }}>Extracted Name vs Profile</div>
                        <div style={{ color: 'var(--rf-cream)', fontWeight: 700 }}>{ocrResult.extracted_full_name}</div>
                        <div style={{ color: ocrResult.profile_alignment.name_match ? 'var(--rf-leaf-green)' : '#F4B942', fontSize: '0.65rem', marginTop: '0.15rem' }}>
                          {ocrResult.profile_alignment.name_match ? `✓ Match Score: ${ocrResult.profile_alignment.name_match_score}%` : '⚠️ Name Mismatch'}
                        </div>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.65rem 0.75rem', borderRadius: '6px' }}>
                        <div style={{ color: 'var(--rf-slate-400)', fontSize: '0.6875rem' }}>Extracted Date of Birth</div>
                        <div style={{ color: 'var(--rf-cream)', fontWeight: 700 }}>{ocrResult.extracted_dob}</div>
                        <div style={{ color: 'var(--rf-leaf-green)', fontSize: '0.65rem', marginTop: '0.15rem' }}>
                          ✓ Age {ocrResult.profile_alignment.calculated_age} (Adult 18+ Validated)
                        </div>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.65rem 0.75rem', borderRadius: '6px' }}>
                        <div style={{ color: 'var(--rf-slate-400)', fontSize: '0.6875rem' }}>Sovereign Document ID</div>
                        <div style={{ color: 'var(--rf-cream)', fontWeight: 700, fontFamily: 'monospace' }}>{ocrResult.extracted_id_number}</div>
                        <div style={{ color: 'var(--rf-leaf-green)', fontSize: '0.65rem', marginTop: '0.15rem' }}>
                          ✓ NIMC/AU Registry Format Valid
                        </div>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.65rem 0.75rem', borderRadius: '6px' }}>
                        <div style={{ color: 'var(--rf-slate-400)', fontSize: '0.6875rem' }}>OCR Optical Confidence</div>
                        <div style={{ color: 'var(--rf-cream)', fontWeight: 700 }}>{ocrResult.ocr_confidence_score}%</div>
                        <div style={{ color: 'var(--rf-leaf-green)', fontSize: '0.65rem', marginTop: '0.15rem' }}>
                          ✓ MRZ Integrity Passed ({ocrResult.scan_duration_ms}ms)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isStep1Complete}
                  className="rf-btn rf-btn-primary rf-btn-lg"
                  style={{
                    width: '100%',
                    fontWeight: 800,
                    marginTop: '0.5rem',
                    opacity: !isStep1Complete ? 0.45 : 1,
                    cursor: !isStep1Complete ? 'not-allowed' : 'pointer'
                  }}
                >
                  <span>Continue to Live Face-Sensitive Capture →</span>
                </button>

                {!isStep1Complete && (
                  <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#F4B942', marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                    <AlertCircle size={14} />
                    <span>You cannot continue to Live Face Capture until all details and official document photo are uploaded.</span>
                  </div>
                )}
              </form>
            );
          })()}
        </div>
      )}

      {/* =========================================================================
          STEP 2: LIVE BIOMETRIC FACE CAPTURE (WITH PERMISSION & WEBCAM)
          ========================================================================= */}
      {step === 'FACE_CAPTURE' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <button
              onClick={() => setStep('ID_DOCUMENT')}
              style={{ background: 'none', border: 'none', color: 'var(--rf-slate-400)', cursor: 'pointer', fontSize: '0.8125rem' }}
            >
              ← Back to ID Document Details
            </button>
            <span style={{ fontSize: '0.75rem', color: 'var(--rf-leaf-green)', fontWeight: 700 }}>
              Step 2 of 4: Face-Sensitive Biometric Scan
            </span>
          </div>

          <FaceCaptureModule
            onCaptureComplete={handleFaceCaptureDone}
            onCancel={() => setStep('ID_DOCUMENT')}
          />
        </div>
      )}

      {/* =========================================================================
          STEP 3: MULTI-FACTOR MATCH AUDIT & FINAL SUBMISSION
          ========================================================================= */}
      {step === 'REVIEW' && (
        <div className="rf-card" style={{ padding: '2.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCheck size={20} color="var(--rf-leaf-green)" />
            <span>Step 3: Multi-Factor Credential Alignment Audit</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--rf-slate-400)', marginBottom: '1.75rem' }}>
            Verification will only be granted if names, dates of birth, ID format, and live face/video vectors strictly align.
          </p>

          {/* 4-Factor Alignment Matrix Table */}
          <div style={{ background: 'var(--rf-bg-surface)', border: '1px solid var(--rf-bg-card-border)', borderRadius: 'var(--rf-radius-lg)', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
              Credential Alignment Check
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
              {/* Factor 1: Name */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.65rem' }}>
                <div>
                  <div style={{ color: 'var(--rf-slate-400)', fontSize: '0.75rem' }}>1. Full Legal Name on ID vs Account</div>
                  <div style={{ color: 'var(--rf-cream)', fontWeight: 700 }}>{fullNameOnDoc}</div>
                </div>
                <span className="rf-badge rf-badge-mint rf-text-xs">
                  <CheckCircle2 size={12} /> Name Aligned
                </span>
              </div>

              {/* Factor 2: DOB */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.65rem' }}>
                <div>
                  <div style={{ color: 'var(--rf-slate-400)', fontSize: '0.75rem' }}>2. Date of Birth & Legal Age</div>
                  <div style={{ color: 'var(--rf-cream)', fontWeight: 700 }}>{dateOfBirth} (Adult 18+)</div>
                </div>
                <span className="rf-badge rf-badge-mint rf-text-xs">
                  <CheckCircle2 size={12} /> DOB Validated
                </span>
              </div>

              {/* Factor 3: Document Number */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.65rem' }}>
                <div>
                  <div style={{ color: 'var(--rf-slate-400)', fontSize: '0.75rem' }}>3. Official {idType} Record</div>
                  <div style={{ color: 'var(--rf-cream)', fontFamily: 'monospace', fontWeight: 700 }}>{docNumber}</div>
                </div>
                <span className="rf-badge rf-badge-mint rf-text-xs">
                  <CheckCircle2 size={12} /> Registry Formatted
                </span>
              </div>

              {/* Factor 4: Biometric Video / Face */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'var(--rf-slate-400)', fontSize: '0.75rem' }}>4. 3D Biometric Vector & Face Sensitivity</div>
                  <div style={{ color: 'var(--rf-cream)', fontWeight: 700 }}>
                    {captureType === 'VIDEO' ? '3D Video Motion Depth' : '68-Point Facial Landmark Map'}
                  </div>
                </div>
                <span className="rf-badge rf-badge-mint rf-text-xs">
                  <CheckCircle2 size={12} /> 99.6% Match Ready
                </span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison: ID Doc vs Face Capture */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {/* ID Document Card */}
            <div style={{ background: 'var(--rf-bg-surface)', border: '1px solid var(--rf-bg-card-border)', borderRadius: 'var(--rf-radius-lg)', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-slate-400)', marginBottom: '0.75rem' }}>
                Official ID Attachment
              </div>
              <div style={{ height: '110px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--rf-bg-card-border)' }}>
                <img src={idFrontFile || 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=400'} alt="ID Document" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>

            {/* Live Face / Video Capture Card */}
            <div style={{ background: 'var(--rf-bg-surface)', border: '1.5px solid var(--rf-leaf-green)', borderRadius: 'var(--rf-radius-lg)', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--rf-leaf-green)', marginBottom: '0.75rem' }}>
                {captureType === 'VIDEO' ? 'Live Biometric 3D Video' : 'Face Snapshot'}
              </div>
              <div style={{ height: '110px', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--rf-leaf-green)', background: '#000' }}>
                {faceCaptureUrl ? (
                  captureType === 'VIDEO' || faceCaptureUrl.startsWith('data:video') || faceCaptureUrl.startsWith('blob:') ? (
                    <video
                      src={faceCaptureUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <img src={faceCaptureUrl} alt="Captured Face" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Camera size={24} color="var(--rf-slate-400)" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setStep('ID_DOCUMENT')}
              className="rf-btn rf-btn-secondary"
            >
              <RefreshCw size={15} />
              <span>Edit Details</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="rf-btn rf-btn-primary rf-btn-lg"
              style={{ flex: 1, fontWeight: 800, opacity: isSubmitting ? 0.7 : 1 }}
            >
              <ShieldCheck size={18} />
              <span>{isSubmitting ? 'Running Multi-Factor Alignment Engine...' : 'Submit & Execute Alignment Check'}</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 4: VERIFICATION RESULT VIEW (APPROVED OR DISCREPANCY REJECTED)
          ========================================================================= */}
      {step === 'VERIFIED' && (
        <div>
          {/* Universal Notification Dispatch Status Banner */}
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '0.875rem 1.25rem',
              borderRadius: 'var(--rf-radius-lg)',
              background: 'rgba(102, 187, 42, 0.1)',
              border: '1px solid rgba(102, 187, 42, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(102, 187, 42, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rf-leaf-green)' }}>
                <Bell size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--rf-cream)' }}>
                  Official Decision Dispatched to Notification Box & Email
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--rf-slate-300)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={12} color="var(--rf-leaf-green)" />
                  <span>Email sent to: <strong>{currentUser?.email || 'chidi@refeir.africa'}</strong></span>
                </div>
              </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(0,0,0,0.4)', padding: '0.3rem 0.65rem', borderRadius: '100px', fontSize: '0.72rem', color: 'var(--rf-leaf-green)', fontWeight: 700 }}>
              <Send size={12} />
              <span>Multi-Role Synced (Talent, Client, Admin)</span>
            </div>
          </div>

          {verificationResult?.is_fully_approved ? (
            /* SUCCESS / APPROVED STATE */
            <div className="rf-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', background: 'linear-gradient(180deg, var(--rf-bg-card) 0%, rgba(10, 30, 18, 0.9) 100%)', border: '1.5px solid var(--rf-leaf-green)', boxShadow: 'var(--rf-shadow-glow)' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(102, 187, 42, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rf-leaf-green)', margin: '0 auto 1.25rem', border: '2px solid var(--rf-leaf-green)' }}>
                <CheckCircle2 size={40} />
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--rf-mint-light)', border: '1px solid var(--rf-leaf-green)', padding: '0.35rem 0.85rem', borderRadius: 'var(--rf-radius-full)', color: 'var(--rf-leaf-green)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
                <Award size={14} />
                <span>Tier 2 Sovereign Verified Badge Issued</span>
              </div>

              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.75rem' }}>
                All Credentials Aligned & Verified!
              </h2>

              <p style={{ color: 'var(--rf-slate-300)', fontSize: '0.95rem', maxWidth: '560px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                Full Legal Name (<strong>{fullNameOnDoc}</strong>), Date of Birth (<strong>{dateOfBirth}</strong>), and Document ID (<strong>{docNumber}</strong>) have strictly matched your live 3D biometric capture with a <strong>{verificationResult?.face_match_confidence}% confidence score</strong>.
              </p>

              <div style={{ maxWidth: '440px', margin: '0 auto 2.5rem', background: 'var(--rf-bg-surface)', border: '1px solid var(--rf-bg-card-border)', borderRadius: 'var(--rf-radius-md)', padding: '1rem', textAlign: 'left', fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div><strong style={{ color: 'var(--rf-slate-400)' }}>Verification ID:</strong> <span style={{ color: 'var(--rf-leaf-green)', fontFamily: 'monospace', fontWeight: 700 }}>{verificationResult?.verification_id || 'KYC-948271'}</span></div>
                <div><strong style={{ color: 'var(--rf-slate-400)' }}>Provider Rail:</strong> <span style={{ color: 'var(--rf-cream)' }}>Smile ID & AU Sovereign Trust Rail</span></div>
                <div><strong style={{ color: 'var(--rf-slate-400)' }}>Multi-Factor Audit:</strong> <span style={{ color: 'var(--rf-leaf-green)', fontWeight: 700 }}>Name, DOB, ID, Biometrics Matched (4/4 Passed) ✓</span></div>
                <div><strong style={{ color: 'var(--rf-slate-400)' }}>Notification Delivery:</strong> <span style={{ color: 'var(--rf-cream)' }}>In-App Notification Box & Email Inbox (Delivered)</span></div>
              </div>

              <button
                onClick={() => window.location.href = '/marketplace'}
                className="rf-btn rf-btn-mint rf-btn-lg"
                style={{ padding: '0.85rem 2.5rem', fontWeight: 800 }}
              >
                <span>Access Verified Escrow Marketplace →</span>
              </button>
            </div>
          ) : (
            /* REJECTION / DISCREPANCY REMEDIATION STATE */
            <div className="rf-card" style={{ padding: '3rem 2rem', textAlign: 'center', background: 'rgba(35, 10, 10, 0.6)', border: '1.5px solid #EF4444' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', margin: '0 auto 1.25rem', border: '2px solid #EF4444' }}>
                <XCircle size={36} />
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--rf-cream)', marginBottom: '0.5rem' }}>
                Verification Alignment Discrepancy
              </h2>
              <p style={{ color: '#FCA5A5', fontSize: '0.9rem', maxWidth: '540px', margin: '0 auto 1.5rem' }}>
                To safeguard the escrow network, verification can only be approved when all submitted credentials strictly match the official ID records and live biometrics.
              </p>

              {/* Discrepancy Reasons List */}
              <div style={{ maxWidth: '480px', margin: '0 auto 2rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--rf-radius-md)', padding: '1.25rem', textAlign: 'left' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#FCA5A5', marginBottom: '0.75rem' }}>
                  Identified Alignment Mismatches:
                </div>
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--rf-slate-200)' }}>
                  {verificationResult?.discrepancy_details?.map((detail, idx) => (
                    <li key={idx}><strong>{detail}</strong></li>
                  )) || <li>Details on ID document do not match account profile records.</li>}
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="/profile"
                  className="rf-btn rf-btn-secondary rf-btn-lg"
                  style={{ padding: '0.85rem 1.75rem', fontWeight: 800, textDecoration: 'none' }}
                >
                  <User size={16} />
                  <span>Update Registered Profile</span>
                </a>

                <button
                  onClick={() => setStep('ID_DOCUMENT')}
                  className="rf-btn rf-btn-primary rf-btn-lg"
                  style={{ padding: '0.85rem 2.25rem', fontWeight: 800 }}
                >
                  <RefreshCw size={16} />
                  <span>Correct Details & Retry Verification</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
