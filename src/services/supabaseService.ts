import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TalentProfile, Service, Project, Referral, Transaction } from '../types';
import { createMoney, formatMoney } from '../data/currencies';

export class SupabaseService {
  /**
   * Fetch talents from Supabase profiles + talent_profiles
   */
  static async getTalents(): Promise<TalentProfile[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('talent_profiles')
        .select(`
          id,
          title,
          hourly_rate,
          currency,
          skills,
          is_pro,
          is_featured,
          rating,
          review_count,
          completed_projects,
          response_time,
          profiles:id (
            id,
            name,
            email,
            avatar_url,
            country,
            city,
            bio,
            verification_status
          )
        `);

      if (error) {
        console.warn('Supabase talents fetch error:', error.message);
        return null;
      }

      if (!data || data.length === 0) return null;

      return data.map((item: any) => {
        const prof = item.profiles || {};
        const currency = item.currency || 'USD';
        const rateAmount = Number(item.hourly_rate) || 35;
        return {
          id: item.id,
          user_id: item.id,
          full_name: prof.name || 'Talent',
          headline: item.title || 'Verified Professional',
          bio: prof.bio || 'Verified Pan-African Professional',
          avatar_url: prof.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          country_id: (prof.country || 'Nigeria').toLowerCase(),
          country_name: prof.country || 'Nigeria',
          city: prof.city || 'Lagos',
          timezone: 'Africa/Lagos',
          skills: item.skills || ['React', 'TypeScript', 'Node.js'],
          languages: ['English'],
          experience_years: 5,
          education: 'B.Sc. Computer Science',
          starting_price: createMoney(rateAmount, currency),
          referral_percentage: 10,
          availability: 'Available Now',
          response_time: item.response_time || '< 2 hours',
          rating: Number(item.rating) || 5.0,
          reviews_count: item.review_count || 0,
          completed_projects: item.completed_projects || 0,
          completion_rate: 99,
          verification_status: prof.verification_status || 'PROFESSION_VERIFIED',
          is_pro: item.is_pro || false,
          is_featured: item.is_featured || false,
          portfolio: []
        };
      });
    } catch (err) {
      console.warn('Failed to fetch talents from Supabase:', err);
      return null;
    }
  }

  /**
   * Fetch services from Supabase
   */
  static async getServices(): Promise<Service[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*');

      if (error) {
        console.warn('Supabase services fetch error:', error.message);
        return null;
      }

      if (!data || data.length === 0) return null;

      return data.map((s: any) => {
        const currency = s.currency || 'USD';
        const priceAmount = Number(s.price) || 500;
        return {
          id: s.id,
          talent_id: s.talent_id,
          talent_name: 'Verified Talent',
          talent_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          talent_country: 'Nigeria',
          talent_rating: 5.0,
          title: s.title,
          category: s.category || 'Engineering & Technology',
          description: s.description || '',
          skills: s.tags || ['Web Development'],
          price: createMoney(priceAmount, currency),
          pricing_type: 'FIXED',
          delivery_days: s.delivery_days || 3,
          revisions: 3,
          referral_percentage: Number(s.scout_reward_percent) || 10,
          availability: true,
          country_availability: ['ALL'],
          remote_availability: true,
          image_url: s.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          created_at: s.created_at || new Date().toISOString()
        };
      });
    } catch (err) {
      console.warn('Failed to fetch services from Supabase:', err);
      return null;
    }
  }

  /**
   * Save a newly created Referral Link to Supabase
   */
  static async saveReferralLink(referral: Referral): Promise<void> {
    if (!isSupabaseConfigured || referral.scout_id.startsWith('user-')) return;
    try {
      await supabase.from('referral_links').insert({
        id: referral.id,
        scout_id: referral.scout_id,
        code: referral.referral_code,
        target_type: referral.service_id ? 'SERVICE' : 'TALENT',
        target_id: referral.service_id || referral.talent_id,
        click_count: referral.clicks_count,
        conversion_count: 0
      });
    } catch (err) {
      console.error('Error saving referral link to Supabase:', err);
    }
  }

  /**
   * Save or sync a contract and its milestones to Supabase (Trust Vault Escrow)
   */
  static async saveProjectContract(project: Project): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      const totalAmountMajor = (project.project_amount.amount_minor || 0) / 100;
      // Upsert Contract
      await supabase.from('contracts').upsert({
        id: project.id,
        client_id: project.client_id,
        talent_id: project.talent_id,
        scout_id: project.scout_id || null,
        title: project.title,
        total_amount: totalAmountMajor,
        currency: project.currency,
        status: project.status,
        updated_at: new Date().toISOString()
      });

      // Upsert Milestones
      if (project.milestones && project.milestones.length > 0) {
        const milestonePayload = project.milestones.map((m, idx) => ({
          id: m.id,
          contract_id: project.id,
          milestone_order: idx + 1,
          title: m.title,
          description: m.description,
          amount: (m.amount.amount_minor || 0) / 100,
          status: m.status
        }));
        await supabase.from('milestones').upsert(milestonePayload);
      }
    } catch (err) {
      console.error('Error saving project contract to Supabase:', err);
    }
  }

  /**
   * Save a transaction to Supabase ledger and update wallet balance
   */
  static async recordLedgerTransaction(tx: Transaction): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      const amountMajor = (tx.amount.amount_minor || 0) / 100;

      // Extract destination user if available from first ledger entry
      const mainEntry = tx.ledger_entries[0];
      const targetUserId = mainEntry ? mainEntry.account_id : null;

      if (!targetUserId || targetUserId.startsWith('user-')) return;

      // 1. Insert transaction
      await supabase.from('ledger_transactions').insert({
        id: tx.id,
        user_id: targetUserId,
        type: tx.type,
        amount: amountMajor,
        currency: tx.amount.currency,
        description: mainEntry?.description || `Transaction ${tx.reference_code}`,
        reference_id: tx.project_id || null,
        status: tx.status
      });

      // 2. Fetch current wallet
      const { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', targetUserId)
        .eq('currency', tx.amount.currency)
        .single();

      if (wallet) {
        let newAvailable = Number(wallet.available_balance) || 0;
        let newEscrow = Number(wallet.escrow_locked_balance) || 0;

        if (tx.type === 'TALENT_EARNING_RELEASE' || tx.type === 'SCOUT_COMMISSION_CREDIT') {
          newAvailable += amountMajor;
        } else if (tx.type === 'PROJECT_PAYMENT_PROTECTION_HOLD') {
          newEscrow += amountMajor;
        } else if (tx.type === 'PAYOUT_WITHDRAWAL') {
          newAvailable = Math.max(0, newAvailable - amountMajor);
        }

        await supabase
          .from('wallets')
          .update({
            available_balance: newAvailable,
            escrow_locked_balance: newEscrow
          })
          .eq('id', wallet.id);
      }
    } catch (err) {
      console.error('Error recording ledger transaction in Supabase:', err);
    }
  }
}
