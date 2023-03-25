export interface AppJwtData {
  first_name?: string;
  last_name?: string;
  id?: string;
  email?: string;
  roles?: string;
  aud?: string;
  exp?: number | any;
  iss?: string;
  jti?: string;
  nbf?: number;
  sub?: string;
  tenant_id?: number
  has_personal_picture?: string;
  has_simulation_access?: string;
  has_performance_access?: string;
}


export enum AppUserRoles {
  ADMIN = 'Admin'
}


