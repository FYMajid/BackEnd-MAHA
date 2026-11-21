export interface CreateContactDTO {
  isClient: "CLIENT" | "NON_CLIENT";
  contactType: string;
  name: string;
  image?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  additionalInfo?: string;
  creator: string;

  // Data Detail (Opsional tergantung contactType)
  personalData?: {
    citizenship?: string;
    identificationNo?: string;
    position?: string;
    office_position?: string;
    gender?: string;
    birthDate?: string;
    religion?: string;
  };
  businessData?: {
    businessType?: string;
    taxCode?: string;
    commissioners?: string;
    directors?: string;
    shareholders?: string;
    lawyers?: string;
  };
  organizationData?: {
    structureType?: string;
    taxCode?: string;
    maintainers?: string;
    mentors?: string;
    supervisors?: string;
    members?: string;
    lawyers?: string;
  };
}
