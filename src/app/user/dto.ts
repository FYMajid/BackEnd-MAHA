export interface UserDto {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumbe: string;
  password: string;
  address: string;
  position: string;
}

export enum Posistion {
  CLIENT = "CLIENT",
  SENIOR_LAWYER = "SENIOR_LAWYER",
  JUNIOR_LAWYER = "JUNIOR_LAWYER",
}
