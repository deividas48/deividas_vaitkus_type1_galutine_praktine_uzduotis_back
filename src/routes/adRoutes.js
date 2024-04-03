import express from 'express';

const adsRouter = express.Router();

// GET /api/ads - grazina visus skelbimus
adsRouter.get('/', async (_req, res) => {
  res.json('getting all ads');
});
// GET /api/ads/:id - grazina viena skelbima
// POST /api/ads - sukuria nauja skelbima
// DELETE /api/ads/:id - istrina skelbima (is_published = false)

export default adsRouter;
