export interface BusinessInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  website?: string;
  currency: string;
  timeZone: string;
}

export interface BusinessTypeData {
  businessType: string;
}

export interface TeamMember {
  email: string;
  role: string;
}

export interface TeamInviteData {
  members: TeamMember[];
}

export interface ModuleConfig {
  key: string;
  enabled: boolean;
  name?: string;
  description?: string;
  icon?: string;
}

export interface ModulesData {
  modules: { key: string; enabled: boolean }[];
}

export interface OnboardingStatusResponse {
  status: 'NOT_STARTED' | 'BUSINESS_INFO_ADDED' | 'BUSINESS_TYPE_SET' | 'TEAM_INVITED' | 'MODULES_CONFIGURED' | 'COMPLETED' | string;
  business?: any;
  message?: string;
}

export interface ApiMessageResponse {
  message?: string;
  error?: string;
  success?: boolean;
}
