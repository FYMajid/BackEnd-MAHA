export type MatterType = "LITIGATION" | "NON_LITIGATION";
export type MatterStatus = "OPEN" | "IN_PROGRESS" | "CLOSED" | "ARCHIVED";
export type BillingType = "HOURLY" | "FIXED" | "RETAINER";

export interface CreateMatterDTO {
  organizationId: bigint;
  clientId?: bigint;
  title: string;
  type: MatterType;
  status: MatterStatus;
  billingType: BillingType;
}

export interface UpdateMatterDTO {
  clientId?: bigint | null;
  title?: string;
  type?: MatterType;
  status?: MatterStatus;
  billingType?: BillingType;
}
