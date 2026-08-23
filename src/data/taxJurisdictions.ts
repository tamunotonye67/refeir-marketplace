import { TaxJurisdictionInfo, TaxIdType } from '../types';

export const TAX_JURISDICTIONS: Record<string, TaxJurisdictionInfo> = {
  'Nigeria': {
    country: 'Nigeria',
    country_code: 'NG',
    tax_authority: 'FIRS (Federal Inland Revenue Service) & State IRS (LIRS/FIRS)',
    primary_tax_id_name: 'TIN (Tax Identification Number) / NIN',
    tax_id_placeholder: '23891024-0001 (or 11-digit NIN)',
    vat_rate_percent: 7.5,
    withholding_tax_percent: 5.0,
    is_headquarters: true,
    compliance_notes: 'Refeir Nigeria HQ entity (RC-1892044). Nigerian service/platform fees are subject to 7.5% statutory VAT. Qualifying independent contractor payouts include 5% WHT credit tracking.'
  },
  'Kenya': {
    country: 'Kenya',
    country_code: 'KE',
    tax_authority: 'KRA (Kenya Revenue Authority)',
    primary_tax_id_name: 'KRA PIN',
    tax_id_placeholder: 'A019283746Z',
    vat_rate_percent: 16.0,
    withholding_tax_percent: 5.0,
    is_headquarters: false,
    compliance_notes: 'Cross-border East African treaty compliance. Kenyan residents must provide valid 11-character alphanumeric KRA PIN.'
  },
  'Ghana': {
    country: 'Ghana',
    country_code: 'GH',
    tax_authority: 'GRA (Ghana Revenue Authority)',
    primary_tax_id_name: 'Ghana Card PIN / GRA TIN',
    tax_id_placeholder: 'GHA-721908234-1',
    vat_rate_percent: 15.0,
    withholding_tax_percent: 7.5,
    is_headquarters: false,
    compliance_notes: 'Ghana Card acts as official GRA TIN for individual professionals. 7.5% WHT credit certificates recorded on milestone settlements.'
  },
  'South Africa': {
    country: 'South Africa',
    country_code: 'ZA',
    tax_authority: 'SARS (South African Revenue Service)',
    primary_tax_id_name: 'SARS Tax Reference Number',
    tax_id_placeholder: '9812739481 (10 digits)',
    vat_rate_percent: 15.0,
    withholding_tax_percent: 0.0,
    is_headquarters: false,
    compliance_notes: 'Standard SARS independent contractor reporting. 15% VAT reverse-charge on international B2B digital marketplace services.'
  },
  'Rwanda': {
    country: 'Rwanda',
    country_code: 'RW',
    tax_authority: 'RRA (Rwanda Revenue Authority)',
    primary_tax_id_name: 'RRA TIN',
    tax_id_placeholder: '109283746 (9 digits)',
    vat_rate_percent: 18.0,
    withholding_tax_percent: 5.0,
    is_headquarters: false,
    compliance_notes: 'Kigali Innovation City digital services protocol. 18% standard VAT rate.'
  },
  'Egypt': {
    country: 'Egypt',
    country_code: 'EG',
    tax_authority: 'ETA (Egyptian Tax Authority)',
    primary_tax_id_name: 'Egyptian Tax Card / Registration ID',
    tax_id_placeholder: '123-456-789',
    vat_rate_percent: 14.0,
    withholding_tax_percent: 5.0,
    is_headquarters: false,
    compliance_notes: 'North African digital commerce framework. Arabic/English bilingual tax invoices.'
  },
  'United States': {
    country: 'United States',
    country_code: 'US',
    tax_authority: 'IRS (Internal Revenue Service)',
    primary_tax_id_name: 'EIN / SSN (Form W-9 or W-8BEN)',
    tax_id_placeholder: 'XX-XXXXXXX or Foreign Tax ID',
    vat_rate_percent: 0.0,
    withholding_tax_percent: 0.0,
    is_headquarters: false,
    compliance_notes: 'US client engagements utilize Form W-8BEN self-certification for non-US talent to claim 0% US withholding tax under international bilateral agreements.'
  },
  'United Kingdom': {
    country: 'United Kingdom',
    country_code: 'GB',
    tax_authority: 'HMRC (Her Majesty’s Revenue and Customs)',
    primary_tax_id_name: 'UTR (Unique Taxpayer Reference) / VAT Number',
    tax_id_placeholder: '12345 67890 (10 digits)',
    vat_rate_percent: 20.0,
    withholding_tax_percent: 0.0,
    is_headquarters: false,
    compliance_notes: 'UK / Pan-African cross-border corridor. B2B cross-border reverse charge for VAT.'
  },
  'European Union': {
    country: 'European Union',
    country_code: 'EU',
    tax_authority: 'National EU Tax Office / VIES',
    primary_tax_id_name: 'EU VAT Identification Number',
    tax_id_placeholder: 'e.g. DE123456789 / FR12345678901',
    vat_rate_percent: 19.0,
    withholding_tax_percent: 0.0,
    is_headquarters: false,
    compliance_notes: 'VIES validated VAT reverse-charge for cross-border digital services.'
  },
  'International / Other': {
    country: 'International / Other',
    country_code: 'GLOBAL',
    tax_authority: 'Local National Tax Authority',
    primary_tax_id_name: 'National Tax Identification Number (TIN / ID)',
    tax_id_placeholder: 'Local Tax ID or Passport / National ID',
    vat_rate_percent: 0.0,
    withholding_tax_percent: 0.0,
    is_headquarters: false,
    compliance_notes: 'Universal international tax declaration. Users certify self-filing compliance in their country of permanent tax residency.'
  }
};

export const getTaxJurisdiction = (countryNameOrCode?: string): TaxJurisdictionInfo => {
  if (!countryNameOrCode) return TAX_JURISDICTIONS['Nigeria'];
  const match = Object.values(TAX_JURISDICTIONS).find(
    j => j.country.toLowerCase() === countryNameOrCode.toLowerCase() ||
         j.country_code.toLowerCase() === countryNameOrCode.toLowerCase()
  );
  return match || TAX_JURISDICTIONS['International / Other'];
};
