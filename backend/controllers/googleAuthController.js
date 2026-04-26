const { google } = require('googleapis');
const pool = require('../config/db');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'https://med.api.hylith.com/auth/google/callback'
);

// Initiate Google OAuth flow
const initiateGoogleAuth = async (req, res) => {
    try {
        // Verify OAuth configuration
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            console.error('Google OAuth credentials not configured');
            return res.status(500).send(`
                <html>
                    <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                        <h1 style="color: #f44336;">❌ Configuration Error</h1>
                        <p>Google OAuth credentials are not configured.</p>
                        <p>Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.</p>
                    </body>
                </html>
            `);
        }

        const scopes = ['https://www.googleapis.com/auth/calendar'];
        
        // Check if we already have tokens
        const existingTokens = await pool.query('SELECT id FROM google_oauth_tokens LIMIT 1');
        const hasExistingTokens = existingTokens.rows.length > 0;
        
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: hasExistingTokens ? 'select_account' : 'consent', // Force consent only if no tokens exist
            include_granted_scopes: true
        });

        console.log('Initiating Google OAuth flow...');
        console.log('Redirect URI:', process.env.GOOGLE_REDIRECT_URI || 'https://med.api.hylith.com/auth/google/callback');
        
        res.redirect(authUrl);
    } catch (err) {
        console.error('Error initiating Google OAuth:', err);
        res.status(500).send(`
            <html>
                <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                    <h1 style="color: #f44336;">❌ Server Error</h1>
                    <p>Error: ${err.message}</p>
                    <p><a href="/dashboard">Go to Dashboard</a></p>
                </body>
            </html>
        `);
    }
};

// Handle Google OAuth callback
const handleGoogleCallback = async (req, res) => {
    try {
        const { code, error } = req.query;

        // Check for OAuth errors from Google
        if (error) {
            console.error('Google OAuth error:', error);
            return res.status(400).send(`
                <html>
                    <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                        <h1 style="color: #f44336;">❌ Authorization Failed</h1>
                        <p>Error: ${error}</p>
                        <p>Please try again: <a href="/auth/google" style="color: #2196F3;">Authorize Google Calendar</a></p>
                        <p><a href="/dashboard">Go to Dashboard</a></p>
                    </body>
                </html>
            `);
        }

        if (!code) {
            console.error('No authorization code received');
            return res.status(400).send(`
                <html>
                    <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                        <h1 style="color: #f44336;">❌ Authorization Failed</h1>
                        <p>No authorization code was provided by Google.</p>
                        <p>Please try again: <a href="/auth/google" style="color: #2196F3;">Authorize Google Calendar</a></p>
                        <p><a href="/dashboard">Go to Dashboard</a></p>
                    </body>
                </html>
            `);
        }

        console.log('Received authorization code, exchanging for tokens...');
        console.log('Redirect URI configured:', process.env.GOOGLE_REDIRECT_URI || 'https://med.api.hylith.com/auth/google/callback');
        console.log('Client ID:', process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...` : 'NOT SET');

        // Exchange code for tokens
        let tokens;
        try {
            const tokenResponse = await oauth2Client.getToken(code);
            tokens = tokenResponse.tokens;
            console.log('Successfully exchanged code for tokens');
        } catch (tokenError) {
            console.error('Error exchanging code for tokens:', tokenError);
            if (tokenError.message && tokenError.message.includes('redirect_uri_mismatch')) {
                return res.status(400).send(`
                    <html>
                        <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                            <h1 style="color: #f44336;">❌ Redirect URI Mismatch</h1>
                            <p>The redirect URI in your Google Cloud Console does not match the configured URI.</p>
                            <p><strong>Expected:</strong> ${process.env.GOOGLE_REDIRECT_URI || 'https://med.api.hylith.com/auth/google/callback'}</p>
                            <p>Please update your Google Cloud Console OAuth 2.0 Client ID settings to include this exact URI.</p>
                            <p><a href="/dashboard">Go to Dashboard</a></p>
                        </body>
                    </html>
                `);
            }
            throw tokenError;
        }
        
        if (!tokens.access_token) {
            console.error('No access token received');
            return res.status(400).send(`
                <html>
                    <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                        <h1 style="color: #f44336;">❌ Authorization Failed</h1>
                        <p>Failed to obtain access token from Google.</p>
                        <p>Please try again: <a href="/auth/google" style="color: #2196F3;">Authorize Google Calendar</a></p>
                        <p><a href="/dashboard">Go to Dashboard</a></p>
                    </body>
                </html>
            `);
        }

        if (!tokens.refresh_token) {
            console.warn('No refresh token received. This may happen if the user has already authorized the app.');
            console.warn('Attempting to use existing refresh token or requesting new authorization...');
        }

        // Calculate expiration time (access tokens typically expire in 1 hour)
        const expiresAt = new Date();
        if (tokens.expiry_date) {
            expiresAt.setTime(tokens.expiry_date);
        } else {
            expiresAt.setSeconds(expiresAt.getSeconds() + 3600); // Default to 1 hour
        }

        // Check if tokens already exist
        const existingTokens = await pool.query('SELECT id, refresh_token FROM google_oauth_tokens LIMIT 1');
        
        if (existingTokens.rows.length > 0) {
            // Update existing tokens
            // Preserve existing refresh_token if new one is not provided
            const refreshTokenToStore = tokens.refresh_token || existingTokens.rows[0].refresh_token;
            
            if (!refreshTokenToStore) {
                console.warn('Warning: No refresh token available. User may need to re-authorize.');
            }

            await pool.query(
                `UPDATE google_oauth_tokens 
                 SET access_token = $1, refresh_token = $2, expires_at = $3, updated_at = CURRENT_TIMESTAMP 
                 WHERE id = $4`,
                [tokens.access_token, refreshTokenToStore, expiresAt, existingTokens.rows[0].id]
            );
            console.log('✅ OAuth tokens updated');
        } else {
            // Insert new tokens
            if (!tokens.refresh_token) {
                return res.status(400).send(`
                    <html>
                        <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                            <h1 style="color: #f44336;">❌ Authorization Failed</h1>
                            <p>Refresh token is required for the first authorization.</p>
                            <p>Please try again: <a href="/auth/google" style="color: #2196F3;">Authorize Google Calendar</a></p>
                            <p><a href="/dashboard">Go to Dashboard</a></p>
                        </body>
                    </html>
                `);
            }

            await pool.query(
                `INSERT INTO google_oauth_tokens (access_token, refresh_token, expires_at) 
                 VALUES ($1, $2, $3)`,
                [tokens.access_token, tokens.refresh_token, expiresAt]
            );
            console.log('✅ OAuth tokens stored');
        }

        res.send(`
            <html>
                <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                    <h1 style="color: #4CAF50;">✅ Google Calendar Authorization Successful!</h1>
                    <p>OAuth tokens have been stored. You can now close this window.</p>
                    <p><a href="/dashboard" style="color: #2196F3;">Go to Dashboard</a></p>
                </body>
            </html>
        `);
    } catch (err) {
        console.error('Error handling Google OAuth callback:', err);
        res.status(500).send(`
            <html>
                <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                    <h1 style="color: #f44336;">❌ Authorization Failed</h1>
                    <p>Error: ${err.message}</p>
                    <p><a href="/dashboard">Go to Dashboard</a></p>
                </body>
            </html>
        `);
    }
};

module.exports = {
    initiateGoogleAuth,
    handleGoogleCallback,
    oauth2Client
};

