import express, { NextFunction, Request, Response } from "express";
import * as ContactService from "./service";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, filter } = req.query;
    const contacts = await ContactService.getAllContacts(
      search as string,
      filter as string,
    );
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const contact = await ContactService.getContactById(req.params.id);

      if (!contact) {
        return res.status(404).json({ message: "Kontak tidak ditemukan" });
      }

      res.status(200).json(contact);
    } catch (error) {
      next(error);
    }
  },
);

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contact = await ContactService.createNewContact(req.body);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      await ContactService.deleteContactById(req.params.id);
      res.status(200).json({ message: "Kontak berhasil dihapus" });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

/**
 * @swagger
 * tags:
 *   - name: Contacts
 *     description: API manajemen kontak (Personal, Business, Organization)
 */

/**
 * @swagger
 * /api/contact:
 *   get:
 *     summary: Ambil semua kontak
 *     tags: [Contacts]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Pencarian berdasarkan nama
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [All, CLIENT, NON_CLIENT]
 *         description: Filter status client
 *     responses:
 *       200:
 *         description: List kontak
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *
 *   post:
 *     summary: Buat kontak baru
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateContactDTO'
 *     responses:
 *       201:
 *         description: Kontak berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 */

/**
 * @swagger
 * /api/contact/{id}:
 *   delete:
 *     summary: Hapus kontak berdasarkan ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kontak berhasil dihapus
 *       404:
 *         description: Kontak tidak ditemukan
 */
