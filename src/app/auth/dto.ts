export interface RegisterUser {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  position: string;
  role: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export enum Posistion {
  CLIENT = "CLIENT",
  SENIOR_LAWYER = "SENIOR_LAWYER",
  JUNIOR_LAWYER = "JUNIOR_LAWYER",
}

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}
