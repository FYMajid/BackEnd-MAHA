export interface CreateOrganizationDTO {
  name: string;
  plan?: string;
}

export interface UpdateOrganizationDTO {
  name?: string;
  plan?: string;
}
