// routes/personRoutes.js
import express from 'express';
import { getPersons, createPerson } from '../controllers/personController.js';

const router = express.Router();

router.get('/', getPersons);
router.post('/', createPerson);

export default router;
