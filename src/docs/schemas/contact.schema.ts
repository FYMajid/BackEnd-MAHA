/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Contact:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         contactType:
 *           type: string
 *         isClient:
 *           type: string
 *           enum: [CLIENT, NON_CLIENT]
 *         email:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         address:
 *           type: string
 *         additionalInfo:
 *           type: string
 *         creator:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CreateContactDTO:
 *       type: object
 *       required:
 *         - name
 *         - contactType
 *         - isClient
 *         - creator
 *       properties:
 *         name:
 *           type: string
 *         contactType:
 *           type: string
 *         isClient:
 *           type: string
 *           enum: [CLIENT, NON_CLIENT]
 *         creator:
 *           type: string
 *         email:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         address:
 *           type: string
 *         additionalInfo:
 *           type: string
 *
 *         personalData:
 *           $ref: '#/components/schemas/PersonalDetail'
 *
 *         businessData:
 *           $ref: '#/components/schemas/BusinessDetail'
 *
 *         organizationData:
 *           $ref: '#/components/schemas/OrganizationDetail'
 *
 *     PersonalDetail:
 *       type: object
 *       properties:
 *         citizenship:
 *           type: string
 *         identificationNo:
 *           type: string
 *         gender:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *
 *     BusinessDetail:
 *       type: object
 *       properties:
 *         businessType:
 *           type: string
 *         taxCode:
 *           type: string
 *         directors:
 *           type: string
 *         shareholders:
 *           type: string
 *
 *     OrganizationDetail:
 *       type: object
 *       properties:
 *         taxCode:
 *           type: string
 *         maintainers:
 *           type: string
 *         supervisors:
 *           type: string
 */
export {};
