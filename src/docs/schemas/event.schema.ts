/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Calendar & event management
 *
 * components:
 *   schemas:
 *     EventCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         color:
 *           type: string
 *
 *     EventBase:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         location:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 *         notification:
 *           type: string
 *         attendees:
 *           type: string
 *         repeat:
 *           type: string
 *         hyperlink:
 *           type: string
 *         fileUrl:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     EventListItem:
 *       allOf:
 *         - $ref: '#/components/schemas/EventBase'
 *         - type: object
 *           properties:
 *             category:
 *               $ref: '#/components/schemas/EventCategory'
 *             matter:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 caseArea:
 *                   type: string
 *
 *     EventDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/EventBase'
 *         - type: object
 *           properties:
 *             category:
 *               $ref: '#/components/schemas/EventCategory'
 *             matter:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 caseArea:
 *                   type: string
 *                 client:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *
 *     CreateEventDTO:
 *       type: object
 *       required:
 *         - title
 *         - categoryId
 *         - startTime
 *         - endTime
 *       properties:
 *         title:
 *           type: string
 *         categoryId:
 *           type: string
 *         location:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 *         matterId:
 *           type: string
 *         notification:
 *           type: string
 *         attendees:
 *           type: string
 *         repeat:
 *           type: string
 *         hyperlink:
 *           type: string
 *         fileUrl:
 *           type: string
 */
export {};
