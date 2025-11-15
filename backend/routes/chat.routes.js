const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const authMiddleware = require('../middleware/auth');

router.post('/session', authMiddleware, chatController.createSession);
router.get('/sessions', authMiddleware, chatController.getSessions);
router.get('/messages/:sessionId', authMiddleware, chatController.getMessages);
router.post('/stream', authMiddleware, chatController.streamChat);
router.delete('/session/:sessionId', authMiddleware, chatController.deleteSession);
router.patch('/session/:sessionId/title', authMiddleware, chatController.updateSessionTitle);
router.post('/clear', authMiddleware, chatController.clearChat);

module.exports = router;