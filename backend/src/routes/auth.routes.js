const { Router } = require('express');
const router = Router();
const { signupStudent, signin, verifiedCode, confirmRole } = require('../controllers/auth/auth.controller');

router.post('/student/signup-student', signupStudent);
router.post('/student/verified-code', verifiedCode);
router.post('/users/signin', signin);
router.post('/users/confirm-role', confirmRole);

module.exports = router;
