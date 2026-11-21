/**
 * @swagger
 * tags:
 *   name: Matters
 *   description: Matter management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Matter:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: uuid
 *         clientId:
 *           type: string
 *         responsibleAttorneyId:
 *           type: string
 *         caseArea:
 *           type: string
 *         caseType:
 *           type: string
 *         disputeResolution:
 *           type: string
 *         description:
 *           type: string
 *         address:
 *           type: string
 *         status:
 *           type: string
 *           enum: [DONE, IN_PROGRESS, PENDING]
 *         startDate:
 *           type: string
 *           format: date-time
 *         pendingDate:
 *           type: string
 *           format: date-time
 *         closeDate:
 *           type: string
 *           format: date-time
 *         relatedContacts:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               contactId:
 *                 type: string
 *               description:
 *                 type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateMatterDTO:
 *       type: object
 *       required:
 *         - clientId
 *         - responsibleAttorneyId
 *         - caseArea
 *         - caseType
 *         - disputeResolution
 *       properties:
 *         clientId:
 *           type: string
 *         responsibleAttorneyId:
 *           type: string
 *         caseArea:
 *           type: string
 *         caseType:
 *           type: string
 *         disputeResolution:
 *           type: string
 *         description:
 *           type: string
 *         address:
 *           type: string
 *         status:
 *           type: string
 *           enum: [DONE, IN_PROGRESS, PENDING]
 *         startDate:
 *           type: string
 *           format: date-time
 *         pendingDate:
 *           type: string
 *           format: date-time
 *         closeDate:
 *           type: string
 *           format: date-time
 *         relatedContacts:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               contactId:
 *                 type: string
 *               description:
 *                 type: string
 *
 *     UpdateMatterDTO:
 *       allOf:
 *         - $ref: '#/components/schemas/CreateMatterDTO'
 */
export {};
