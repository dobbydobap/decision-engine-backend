import { Router } from 'express';
import { create, getAll, getOne, update, evaluate, remove } from '../controllers/decision.controller';
import { createOption, patchOption, removeOption } from '../controllers/option.controller';
import { createCriterion, patchCriterion, removeCriterion } from '../controllers/criterion.controller';
import { createScore, patchScore } from '../controllers/score.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { CreateDecisionSchema, UpdateDecisionSchema } from '../services/decision.service';
import { CreateOptionSchema, UpdateOptionSchema } from '../services/option.service';
import { CreateCriterionSchema, UpdateCriterionSchema } from '../services/criterion.service';
import { CreateScoreSchema, UpdateScoreSchema } from '../services/score.service';

const router = Router();

// Decision CRUD
router.post('/', requireAuth, validate(CreateDecisionSchema), create);
router.get('/', requireAuth, getAll);
router.get('/:id', requireAuth, getOne);
router.patch('/:id', requireAuth, validate(UpdateDecisionSchema), update);
router.delete('/:id', requireAuth, remove);

// Options
router.post('/:decisionId/options', requireAuth, validate(CreateOptionSchema), createOption);
router.patch('/:decisionId/options/:optionId', requireAuth, validate(UpdateOptionSchema), patchOption);
router.delete('/:decisionId/options/:optionId', requireAuth, removeOption);

// Criteria
router.post('/:decisionId/criteria', requireAuth, validate(CreateCriterionSchema), createCriterion);
router.patch('/:decisionId/criteria/:criterionId', requireAuth, validate(UpdateCriterionSchema), patchCriterion);
router.delete('/:decisionId/criteria/:criterionId', requireAuth, removeCriterion);

// Scores
router.post('/:decisionId/scores', requireAuth, validate(CreateScoreSchema), createScore);
router.patch('/:decisionId/scores/:scoreId', requireAuth, validate(UpdateScoreSchema), patchScore);

// Evaluation engine
router.get('/:id/evaluate', requireAuth, evaluate);

export default router;
