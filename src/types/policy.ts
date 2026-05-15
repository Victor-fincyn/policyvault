export type PolicyType = "motor" | "health" | "life" | "home" | "travel";
export type PolicyStatus = "active" | "expired" | "expiring_soon" | "cancelled";
export type PaymentFrequency =
  | "monthly"
  | "quarterly"
  | "half_yearly"
  | "yearly";

export interface MotHistoryEntry {
  date: string;
  result: "Passed" | "Failed";
  mileage?: number;
  advisories: string[];
}

export interface Nominee {
  name: string;
  relation: string;
  percentage: number;
}

export interface Policy {
  id: string;
  policy_number: string;
  policy_type: PolicyType;
  provider: string;
  policyholder_name: string;
  start_date: string;
  end_date: string;
  premium_amount: number;
  sum_insured: number;
  status: PolicyStatus;
  covered_items: string[];
  not_covered_items: string[];
  additional_policyholder?: string;
  vehicle_number?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  compulsory_excess?: number;
  voluntary_excess?: number;
  tax_due_date?: string;
  tax_status?: string;
  euro_status?: string;
  vehicle_owner_since?: string;
  ulez_zone?: string;
  vehicle_address?: string;
  mot_expiry?: string;
  last_mot_mileage?: number;
  mot_advisories?: string[];
  mot_history?: MotHistoryEntry[];
  document_url?: string;
  nominees: Nominee[];
  payment_frequency: PaymentFrequency;
  days_until_expiry: number;
  auto_renewal: boolean;
  claim_settlement_ratio?: number;
}

export type NotificationType =
  | "expiry"
  | "renewal"
  | "payment"
  | "claim"
  | "document"
  | "promo"
  | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  policy_id?: string;
  action_label?: string;
  action_route?: string;
}

export interface RenewalQuote {
  id: string;
  provider: string;
  annual_premium: number;
  coverage_type: string;
  claim_settlement_ratio: number;
  rating: number;
  discount_percentage?: number;
  features: string[];
  recommended?: boolean;
}

export type ClaimStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "settled"
  | "rejected";

export interface ClaimHistoryEntry {
  id: string;
  ref_number: string;
  policy_id: string;
  claim_type: string;
  claim_type_label: string;
  incident_date: string;
  submitted_date: string;
  status: ClaimStatus;
  amount_claimed?: number;
  amount_settled?: number;
  description: string;
}
