const express = require('express');
const router = express.Router();
const directorController = require('../controllers/directorController');
const { authenticateApiKeyAndToken, checkAdminRole } = require('../middleware/auth');


router.get('/', authenticateApiKeyAndToken, directorController.getAllDirectors);
router.get('/:id', authenticateApiKeyAndToken, directorController.getDirectorById);

router.post('/', authenticateApiKeyAndToken, checkAdminRole, directorController.createDirector);
router.put('/:id', authenticateApiKeyAndToken, checkAdminRole, directorController.updateDirector);
router.delete('/:id', authenticateApiKeyAndToken, checkAdminRole, directorController.deleteDirector);

module.exports = router;
