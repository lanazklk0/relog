const express = require('express');
const axios = require('axios');

const router = express.Router();

const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';
const FRONTEND_URL = () => process.env.FRONTEND_URL || 'http://localhost:5173';

// GET /auth/github — redirect to GitHub OAuth
router.get('/github', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: `${req.protocol}://${req.get('host')}/auth/github/callback`,
    scope: 'read:user user:email',
    state: Math.random().toString(36).slice(2),
  });

  res.redirect(`${GITHUB_AUTH_URL}?${params.toString()}`);
});

// GET /auth/github/callback — handle GitHub OAuth callback
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${FRONTEND_URL()}?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      GITHUB_TOKEN_URL,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${req.protocol}://${req.get('host')}/auth/github/callback`,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const { access_token, error } = tokenResponse.data;

    if (error || !access_token) {
      return res.redirect(`${FRONTEND_URL()}?error=token_exchange_failed`);
    }

    // Fetch user data from GitHub
    const userResponse = await axios.get(GITHUB_USER_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    const user = userResponse.data;

    // Save user and token in session
    req.session.user = {
      id: user.id,
      login: user.login,
      name: user.name || user.login,
      avatar_url: user.avatar_url,
      html_url: user.html_url,
      bio: user.bio,
      public_repos: user.public_repos,
      followers: user.followers,
    };
    req.session.accessToken = access_token;
    req.session.loginAt = Date.now();

    res.redirect(FRONTEND_URL());
  } catch (err) {
    console.error('OAuth callback error:', err.message);
    res.redirect(`${FRONTEND_URL()}?error=oauth_error`);
  }
});

// GET /auth/me — return current user
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({
    user: req.session.user,
    loginAt: req.session.loginAt,
  });
});

// GET /auth/logout — clear session
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err.message);
    }
    res.clearCookie('connect.sid');
    res.redirect(FRONTEND_URL());
  });
});

// GET /auth/refresh — re-validate session (used by frontend polling)
router.get('/refresh', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Session expired or invalid' });
  }
  // Touch the session to keep it alive
  req.session.touch();
  res.json({ ok: true, user: req.session.user });
});

module.exports = router;
