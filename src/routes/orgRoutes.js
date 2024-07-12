const express = require('express');
const {
  getOrganisations,
  getOrganisationById,
} = require('../controllers/orgController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.get('/', authenticate, getOrganisations);
router.get('/:orgId', authenticate, getOrganisationById);

module.exports = router;
