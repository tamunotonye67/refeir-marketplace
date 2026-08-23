import { VerificationStatus } from '../types';

export interface KYCVerificationRequest {
  user_id: string;
  account_user_name?: string;
  full_legal_name_on_doc: string;
  date_of_birth: string;
  country_iso: string;
  id_type: 'NATIONAL_ID' | 'PASSPORT' | 'DRIVERS_LICENSE' | 'VOTERS_CARD';
  id_number: string;
  document_front_url?: string;
  document_back_url?: string;
  face_capture_url?: string;
  video_capture_url?: string;
  capture_type?: 'PHOTO' | 'VIDEO';
  biometric_consent_granted: boolean;
  biometric_consent_timestamp?: string;
  liveness_score?: number;
  portfolio_verification_links?: string[];
}

export interface KYCVerificationResult {
  verification_id: string;
  status: VerificationStatus;
  provider_reference: string;
  verification_date: string;
  is_fully_approved: boolean;
  name_aligned: boolean;
  dob_aligned: boolean;
  document_valid: boolean;
  face_vector_aligned: boolean;
  face_match_confidence: number;
  video_liveness_verified: boolean;
  discrepancy_details: string[];
  notes: string;
}

export interface KYCProvider {
  provider_name: string;
  initializeVerification(request: KYCVerificationRequest): Promise<KYCVerificationResult>;
  getVerificationStatus(verification_id: string): Promise<VerificationStatus>;
}

export class MockKYCProvider implements KYCProvider {
  provider_name = 'Refeir Pan-African Sovereign KYC & Multi-Factor Alignment Engine (Smile ID & AU Trust Rails)';

  async initializeVerification(request: KYCVerificationRequest): Promise<KYCVerificationResult> {
    const discrepancies: string[] = [];

    // 1. Name Alignment Check (Full Legal Name on Document vs Account Profile Name)
    const docName = (request.full_legal_name_on_doc || '').trim().toLowerCase();
    const acctName = (request.account_user_name || '').trim().toLowerCase();
    
    // Check if names share core tokens or if document name is adequately provided
    let nameAligned = true;
    if (!docName || docName.length < 3) {
      nameAligned = false;
      discrepancies.push('Full Legal Name on document is missing or invalid.');
    } else if (acctName && acctName.length > 2) {
      const docTokens = docName.split(/\s+/);
      const acctTokens = acctName.split(/\s+/);
      const sharesToken = docTokens.some(dt => acctTokens.some(at => at.includes(dt) || dt.includes(at)));
      if (!sharesToken && acctName !== 'guest' && acctName !== 'anonymous') {
        nameAligned = false;
        discrepancies.push(`Name on document ("${request.full_legal_name_on_doc}") does not match profile name ("${request.account_user_name}").`);
      }
    }

    // 2. Date of Birth & Age Verification Check
    let dobAligned = true;
    if (!request.date_of_birth) {
      dobAligned = false;
      discrepancies.push('Date of Birth was not provided.');
    } else {
      const birthYear = new Date(request.date_of_birth).getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;
      if (isNaN(birthYear) || age < 18 || age > 100) {
        dobAligned = false;
        discrepancies.push(`Date of birth indicates age (${age || 0}) below legal platform requirement (18+).`);
      }
    }

    // 3. Document ID Format Validity
    let docValid = true;
    const cleanedDocNo = (request.id_number || '').trim();
    if (!cleanedDocNo || cleanedDocNo.length < 5) {
      docValid = false;
      discrepancies.push(`Document ID number "${request.id_number}" does not conform to official ${request.id_type} registry format.`);
    }

    // 4. Biometric Face & Video Vector Similarity Match Check
    const hasMedia = Boolean(request.video_capture_url || request.face_capture_url);
    const hasConsent = Boolean(request.biometric_consent_granted);
    let faceVectorAligned = hasMedia && hasConsent;
    let faceMatchConfidence = request.video_capture_url ? 99.6 : request.face_capture_url ? 98.8 : 94.2;

    if (!hasMedia) {
      faceVectorAligned = false;
      faceMatchConfidence = 0;
      discrepancies.push('Live face or 3D video biometric capture is required for verification.');
    } else if (!hasConsent) {
      faceVectorAligned = false;
      discrepancies.push('Biometric data processing consent was not granted.');
    }

    // Final Approval Decision: ALL 4 conditions must pass
    const isFullyApproved = nameAligned && dobAligned && docValid && faceVectorAligned;
    const isVideo = Boolean(request.video_capture_url || request.capture_type === 'VIDEO');

    return {
      verification_id: `KYC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      status: isFullyApproved ? 'PROFESSION_VERIFIED' : 'REJECTED',
      provider_reference: `SMILE-AFR-${Math.floor(100000 + Math.random() * 900000)}`,
      verification_date: new Date().toISOString(),
      is_fully_approved: isFullyApproved,
      name_aligned: nameAligned,
      dob_aligned: dobAligned,
      document_valid: docValid,
      face_vector_aligned: faceVectorAligned,
      face_match_confidence: faceMatchConfidence,
      video_liveness_verified: Boolean(faceVectorAligned && isVideo),
      discrepancy_details: discrepancies,
      notes: isFullyApproved
        ? isVideo
          ? `All credentials aligned (Name, DOB, ID No, and 3D Video Biometrics verified with ${faceMatchConfidence}% confidence).`
          : `All credentials aligned (Name, DOB, ID No, and Facial Biometrics verified with ${faceMatchConfidence}% confidence).`
        : `Verification Rejected: ${discrepancies.join(' ')}`
    };
  }

  async getVerificationStatus(verification_id: string): Promise<VerificationStatus> {
    return 'PROFESSION_VERIFIED';
  }
}

export const defaultKYCProvider = new MockKYCProvider();
