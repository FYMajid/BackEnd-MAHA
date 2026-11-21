import { CreateContactDTO } from "./dto";
import { prisma } from "../../lib/prisma";

export const getAllContacts = async (search?: string, filter?: string) => {
  return await prisma.contact.findMany({
    where: {
      AND: [
        search ? { name: { contains: search, mode: "insensitive" } } : {},
        filter && filter !== "All" ? { isClient: filter as any } : {},
      ],
    },
    include: {
      personalDetail: true,
      businessDetail: true,
      organizationDetail: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getContactById = async (id: string) => {
  return await prisma.contact.findUnique({
    where: { id },
    include: {
      personalDetail: true,
      businessDetail: true,
      organizationDetail: true,
    },
  });
};

export const createNewContact = async (dto: CreateContactDTO) => {
  const isPersonal = dto.contactType === "Personal";
  const isOrg = [
    "Cooperative",
    "Foundation",
    "Community Organization",
  ].includes(dto.contactType);
  const isBusiness = !isPersonal && !isOrg;

  const personalDetailPayload = dto.personalData
    ? {
        citizenship: dto.personalData.citizenship,
        identificationNo: dto.personalData.identificationNo,
        office_position:
          dto.personalData.office_position ?? dto.personalData.position,
        gender: dto.personalData.gender,
        birthDate: dto.personalData.birthDate
          ? new Date(dto.personalData.birthDate)
          : null,
        religion: dto.personalData.religion,
      }
    : undefined;

  return await prisma.contact.create({
    data: {
      isClient: dto.isClient,
      contactType: dto.contactType,
      name: dto.name,
      image: dto.image,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      address: dto.address,
      additionalInfo: dto.additionalInfo,
      creator: dto.creator,

      // Logika mapping detail ke tabel yang benar
      ...(isPersonal &&
        personalDetailPayload && {
          personalDetail: {
            create: personalDetailPayload,
          },
        }),
      ...(isBusiness &&
        dto.businessData && {
          businessDetail: { create: { ...dto.businessData } },
        }),
      ...(isOrg &&
        dto.organizationData && {
          organizationDetail: { create: { ...dto.organizationData } },
        }),
    },
  });
};

export const deleteContactById = async (id: string) => {
  return await prisma.contact.delete({ where: { id } });
};
