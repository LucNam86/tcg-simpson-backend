import { Router } from 'express';
import '@database/models/card.model'; // ← 
import '@database/models/family.model';
import '@database/models/affinity.model';
import '@database/models/serie.model';

const router = Router();

export default router;