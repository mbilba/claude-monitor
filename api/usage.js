/**
 * Claude Usage API - Vercel Serverless Function
 * Fetches usage data from Claude API and returns clean JSON
 */

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get session cookie from environment
    const sessionCookie = process.env.CLAUDE_SESSION_COOKIE;
    if (!sessionCookie) {
      return res.status(500).json({ 
        error: 'CLAUDE_SESSION_COOKIE environment variable not set' 
      });
    }

    // Headers for API requests
    const headers = {
      'Accept': 'application/json',
      'Cookie': `sessionKey=${sessionCookie}`,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Referer': 'https://claude.ai/',
      'Origin': 'https://claude.ai'
    };

    // Fetch organizations
    const orgsResponse = await fetch('https://claude.ai/api/organizations', {
      headers,
      timeout: 10000
    });

    if (!orgsResponse.ok) {
      throw new Error(`Organizations API returned ${orgsResponse.status}`);
    }

    const orgsData = await orgsResponse.json();
    const orgs = Array.isArray(orgsData) ? orgsData : [orgsData];
    
    // Find Claude Max org or use first one
    const org = orgs.find(o => o.capabilities && o.capabilities.includes('claude_max')) || orgs[0];
    if (!org) {
      throw new Error('No organization found');
    }

    // Fetch usage data
    const usageResponse = await fetch(`https://claude.ai/api/organizations/${org.uuid}/usage`, {
      headers,
      timeout: 10000
    });

    if (!usageResponse.ok) {
      throw new Error(`Usage API returned ${usageResponse.status}`);
    }

    const usage = await usageResponse.json();

    // Determine plan type
    const isMax = org.capabilities && org.capabilities.includes('claude_max');
    const plan = isMax ? 'Claude Max' : 'Claude Pro';
    
    // Build clean response
    const response = {
      organization: org.name || 'Unknown',
      plan: plan,
      billing_type: org.billing_type || 'unknown',
      rate_limit_tier: org.rate_limit_tier || '',
      timestamp: new Date().toISOString()
    };

    // Add usage data
    if (usage.five_hour) {
      response.five_hour = {
        utilization: Math.round(usage.five_hour.utilization || 0),
        resets_at: usage.five_hour.resets_at
      };
    }

    if (usage.seven_day) {
      response.seven_day = {
        utilization: Math.round(usage.seven_day.utilization || 0),
        resets_at: usage.seven_day.resets_at
      };
    }

    if (usage.seven_day_opus) {
      response.seven_day_opus = {
        utilization: Math.round(usage.seven_day_opus.utilization || 0)
      };
    }

    if (usage.seven_day_sonnet) {
      response.seven_day_sonnet = {
        utilization: Math.round(usage.seven_day_sonnet.utilization || 0)
      };
    }

    if (usage.seven_day_cowork) {
      response.seven_day_cowork = {
        utilization: Math.round(usage.seven_day_cowork.utilization || 0)
      };
    }

    // Set cache headers (cache for 2 minutes)
    res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=60');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json(response);

  } catch (error) {
    console.error('Claude Usage API Error:', error.message);
    
    // Return appropriate error
    if (error.message.includes('401') || error.message.includes('403')) {
      return res.status(401).json({ 
        error: 'Authentication failed - check CLAUDE_SESSION_COOKIE' 
      });
    }
    
    if (error.message.includes('timeout')) {
      return res.status(408).json({ 
        error: 'Request timeout - Claude API is slow' 
      });
    }
    
    return res.status(500).json({ 
      error: `Failed to fetch usage data: ${error.message}` 
    });
  }
}

// Export config for Vercel
export const config = {
  runtime: 'nodejs18.x',
  maxDuration: 30
};