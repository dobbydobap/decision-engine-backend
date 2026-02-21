import { Router } from "express";
import { create, getAll, getOne } from '../controllers/decision.controller';
import { createOption } from '../controllers/option.controller';
import { createCriterion } from '../controllers/criterion.controller';
import { createScore } from '../controllers/score.controller';
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post('/', requireAuth, create);
router.get('/', requireAuth, getAll);
router.get('/:id', requireAuth, getOne);
router.post('/:decisionId/options', requireAuth, createOption);
router.post('/:decisionId/criteria', requireAuth, createCriterion);
router.post('/:decisionId/scores', requireAuth, createScore);
export default router;