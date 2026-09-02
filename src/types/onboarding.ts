import { EntityConfig, EntityFieldDefinition } from '@/lib/moduleCatalog';

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
  businessType?: 'TRAINING' | 'RETAIL' | 'SERVICES' | 'CUSTOM' | string;
  organizationType: string;
  customOrganizationType?: string;
}

export interface EntityConfigData {
  entityLabel: string;
  entityLabelPlural?: string;
  fields: EntityFieldDefinition[];
}

export interface TeamMember {
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'ADMINISTRATOR' | 'MANAGER' | 'INSTRUCTOR' | 'STAFF' | string;
  firstName?: string;
  lastName?: string;
  department?: string;
}

export interface TeamInviteData {
  members: {
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    department?: string;
  }[];
}

export interface ModuleItem {
  key: string;
  enabled: boolean;
}

export interface ModulesData {
  modules: ModuleItem[];
}

export interface OnboardingStatusResponse {
  status: 'NOT_STARTED' | 'BUSINESS_INFO' | 'BUSINESS_TYPE' | 'ENTITY_CONFIG' | 'TEAM_SETUP' | 'MODULES' | 'COMPLETED' | string;
  isCompleted?: boolean;
  business?: any;
  catalog?: any;
  presets?: any;
  message?: string;
}

export interface ApiMessageResponse {
  message?: string;
  business?: any;
  error?: string;
  invitedCount?: number;
  preset?: any;
  entityConfig?: EntityConfig;
}

export interface OnboardingCompleteResponse {
  message: string;
  workspace: {
    id: string;
    name: string;
    slug: string;
    businessType: string;
    status: string;
    email?: string;
    phone?: string;
    currency?: string;
    timeZone?: string;
  };
  entity: EntityConfig;
  modules: {
    key: string;
    enabled: boolean;
  }[];
  userRole?: string;
}
