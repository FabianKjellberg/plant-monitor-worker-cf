import { Hono } from 'hono'
import { loginHandler } from '../handlers/authHandlers/loginHandler'
import { registerHandler } from '../handlers/authHandlers/registerHandler'
import { logoutHandler } from '../handlers/authHandlers/logoutHandler'
import { refreshHandler } from '../handlers/authHandlers/refreshHandler'

import { authMiddleware } from '../middleware/authMiddleware'
import { testAuthHandler } from '../handlers/authHandlers/testAuthHandler'

const authRoutes = new Hono();

// Test auth
authRoutes.get('/test-auth', authMiddleware, testAuthHandler)

// Login route
authRoutes.post('/login', loginHandler);

// Register route
authRoutes.post('/register', registerHandler);

// Logout route
authRoutes.post('/logout', logoutHandler);

// Refresh route
authRoutes.post('/refresh', refreshHandler);

export default authRoutes;