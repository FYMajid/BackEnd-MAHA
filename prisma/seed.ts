import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcrypt";
import {
  ClientStatus,
  DocumentType,
  MatterStatus,
  Position,
  Role,
} from "@prisma/client";

async function main() {
  await prisma.$transaction([
    prisma.event.deleteMany(),
    prisma.document.deleteMany(),
    prisma.matter.deleteMany(),
    prisma.personalDetail.deleteMany(),
    prisma.businessDetail.deleteMany(),
    prisma.organizationDetail.deleteMany(),
    prisma.contact.deleteMany(),
    prisma.eventCategory.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      firstName: "Admin",
      middleName: "System",
      lastName: "MAHA",
      email: "admin@maha.local",
      phoneNumber: "081234567890",
      password: passwordHash,
      position: Position.SENIOR_LAWYER,
      role: Role.ADMIN,
      address: "Jakarta",
    },
  });

  const lawyer = await prisma.user.create({
    data: {
      firstName: "Aufa",
      middleName: "H",
      lastName: "Hajran",
      email: "lawyer@maha.local",
      phoneNumber: "081234567891",
      password: passwordHash,
      position: Position.JUNIOR_LAWYER,
      role: Role.USER,
      address: "Bandung",
    },
  });

  const personalContact = await prisma.contact.create({
    data: {
      isClient: ClientStatus.CLIENT,
      contactType: "Personal",
      name: "Test Person 01",
      image: "/uploads/contacts/test-person-01.jpg",
      email: "testperson01@gmail.com",
      phoneNumber: "+62 812 0000 0001",
      address: "Jl. Mawar No. 10, Jakarta",
      additionalInfo: "Preferred contact by email",
      creator: admin.id,
      personalDetail: {
        create: {
          citizenship: "Indonesia",
          identificationNo: "3276010101010001",
          office_position: "Director",
          gender: "Male",
          birthDate: new Date("1995-06-15"),
          religion: "Islam",
        },
      },
    },
  });

  const businessContact = await prisma.contact.create({
    data: {
      isClient: ClientStatus.NON_CLIENT,
      contactType: "Limited Liability Company",
      name: "PT Nusantara Legal",
      email: "legal@nusantara.co.id",
      phoneNumber: "+62 812 0000 0002",
      address: "Jl. Merdeka No. 45, Bandung",
      additionalInfo: "Corporate client prospect",
      creator: admin.id,
      businessDetail: {
        create: {
          businessType: "Legal Services",
          taxCode: "NPWP-12.345.678.9-012.000",
          commissioners: "A. Wijaya",
          directors: "B. Putri",
          shareholders: "C. Dharma",
          lawyers: "D. Satria",
        },
      },
    },
  });

  const organizationContact = await prisma.contact.create({
    data: {
      isClient: ClientStatus.CLIENT,
      contactType: "Foundation",
      name: "Yayasan Cinta Negeri",
      email: "info@ycn.org",
      phoneNumber: "+62 812 0000 0003",
      address: "Jl. Anggrek No. 7, Surabaya",
      additionalInfo: "Nonprofit collaboration",
      creator: admin.id,
      organizationDetail: {
        create: {
          structureType: "Foundation",
          taxCode: "NPWP-98.765.432.1-000.000",
          maintainers: "E. Santoso",
          mentors: "F. Lestari",
          supervisors: "G. Pratama",
          members: "20",
          lawyers: "H. Rahman",
        },
      },
    },
  });

  const matterOne = await prisma.matter.create({
    data: {
      clientId: personalContact.id,
      responsibleAttorneyId: admin.id,
      members: "Team Alpha",
      caseArea: "Civil",
      caseType: "Traffic",
      disputeResolution: "Litigation",
      description: "Dispute related to traffic accident settlement.",
      address: "Jakarta Selatan",
      status: MatterStatus.IN_PROGRESS,
      startDate: new Date("2026-02-05"),
      pendingDate: new Date("2026-02-15"),
      paymentMethod: "Retainer",
      additionalInfo: "Urgent documentation required.",
    },
  });

  const matterTwo = await prisma.matter.create({
    data: {
      clientId: businessContact.id,
      responsibleAttorneyId: lawyer.id,
      members: "Team Beta",
      caseArea: "Corporate",
      caseType: "Contract Review",
      disputeResolution: "Non Litigation",
      description: "Review of partnership agreement.",
      address: "Bandung",
      status: MatterStatus.PENDING,
      startDate: new Date("2026-02-08"),
      paymentMethod: "Hourly",
      additionalInfo: "Waiting for signed draft.",
    },
  });

  await prisma.document.createMany({
    data: [
      {
        type: DocumentType.FOLDER,
        name: "Client Files",
        contactId: personalContact.id,
        matterId: matterOne.id,
        physicalLocation: "Shelf A-1",
        description: "Folder utama dokumen klien.",
        fileUrl: null,
      },
      {
        type: DocumentType.FILE,
        name: "Power of Attorney",
        contactId: personalContact.id,
        matterId: matterOne.id,
        physicalLocation: "Cabinet B-2",
        hyperlink: "https://example.com/documents/poa",
        description: "Surat kuasa klien.",
        fileUrl: "/uploads/documents/poa.pdf",
      },
      {
        type: DocumentType.FILE,
        name: "Old Contract",
        contactId: businessContact.id,
        matterId: matterTwo.id,
        physicalLocation: "Archive Room",
        description: "Dokumen lama untuk arsip.",
        fileUrl: "/uploads/documents/old-contract.pdf",
        isDeleted: true,
      },
    ],
  });

  const categoryCourt = await prisma.eventCategory.create({
    data: { name: "Sidang", color: "#5A7ACD" },
  });
  const categoryMeeting = await prisma.eventCategory.create({
    data: { name: "Meeting", color: "#FEB05D" },
  });
  const categoryDeadline = await prisma.eventCategory.create({
    data: { name: "Deadline", color: "#FF3131" },
  });

  await prisma.event.createMany({
    data: [
      {
        title: "Sidang Perdata",
        categoryId: categoryCourt.id,
        location: "Pengadilan Jakarta",
        startTime: new Date("2026-02-15T09:00:00.000Z"),
        endTime: new Date("2026-02-15T11:00:00.000Z"),
        description: "Sidang pertama untuk kasus perdata.",
        matterId: matterOne.id,
        notification: "15 minutes before",
        attendees: "Admin; Lawyer",
        repeat: "none",
        hyperlink: "https://example.com/agenda/sidang",
        fileUrl: "/uploads/events/sidang-perdata.pdf",
      },
      {
        title: "Meeting Client PT Nusantara",
        categoryId: categoryMeeting.id,
        location: "Office Bandung",
        startTime: new Date("2026-02-18T03:00:00.000Z"),
        endTime: new Date("2026-02-18T04:00:00.000Z"),
        description: "Diskusi final draft kontrak.",
        matterId: matterTwo.id,
        notification: "30 minutes before",
        attendees: "Lawyer; Client",
        repeat: "none",
        hyperlink: "https://example.com/meeting/pt-nusantara",
        fileUrl: "/uploads/events/meeting-pt-nusantara.pdf",
      },
      {
        title: "Deadline Submit Dokumen",
        categoryId: categoryDeadline.id,
        location: "Online",
        startTime: new Date("2026-02-20T01:00:00.000Z"),
        endTime: new Date("2026-02-20T02:00:00.000Z"),
        description: "Batas akhir pengumpulan dokumen.",
        matterId: matterOne.id,
        notification: "1 hour before",
        attendees: "Admin",
        repeat: "none",
        hyperlink: "https://example.com/deadline/dokumen",
        fileUrl: "/uploads/events/deadline-dokumen.pdf",
      },
    ],
  });

  console.log("seed complete");
}

main()
  .catch((error) => {
    console.error("seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
