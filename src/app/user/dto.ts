export interface CreateUserDTO {
  organizationId: bigint;
  name: string;
  email: string;
  password: string;
  hourlyRate?: number;
  roleNames?: string[];
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  hourlyRate?: number;
  isActive?: boolean;
  roleNames?: string[];
}
