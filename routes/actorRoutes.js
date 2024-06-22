const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');
const { authenticateApiKeyAndToken, checkAdminRole } = require('../middleware/auth');


router.get('/', authenticateApiKeyAndToken, actorController.getAllActors);
router.get('/:id', authenticateApiKeyAndToken, actorController.getActorById);

router.post('/', authenticateApiKeyAndToken, checkAdminRole,  actorController.createActor);
router.patch('/:id', authenticateApiKeyAndToken, checkAdminRole, actorController.updateActor);
router.delete('/:id', authenticateApiKeyAndToken, checkAdminRole, actorController.deleteActor);

module.exports = router;
