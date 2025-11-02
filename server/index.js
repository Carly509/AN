const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

let client;
let dummyDataCollection;
let dummyRolesCollection;

async function connectToMongoDB() {
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('Connected to MongoDB');

    const adminDb = client.db().admin();
    const { databases } = await adminDb.listDatabases();

    console.log('Available databases:', databases.map(db => db.name).join(', '));

    let foundData = false;
    let foundRoles = false;

    for (const dbInfo of databases) {
      if (foundData && foundRoles) break;

      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);

      if (!foundData && collectionNames.includes('dummy_data')) {
        dummyDataCollection = db.collection('dummy_data');
        foundData = true;

        const allFields = new Set();
        const allDocs = await dummyDataCollection.find().limit(20).toArray();
        allDocs.forEach(doc => {
          Object.keys(doc).forEach(key => allFields.add(key));
        });
      }

      if (!foundRoles && collectionNames.includes('dummy_roles')) {
        dummyRolesCollection = db.collection('dummy_roles');
        foundRoles = true;

        const allFields = new Set();
        const allDocs = await dummyRolesCollection.find().limit(20).toArray();
        allDocs.forEach(doc => {
          Object.keys(doc).forEach(key => allFields.add(key));
        });
      }
    }

    if (!foundData || !foundRoles) {
      console.warn('Warning: Could not find one or both collections');
      if (!foundData) console.warn('   - dummy_data collection not found');
      if (!foundRoles) console.warn('   - dummy_roles collection not found');
    }

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

connectToMongoDB();

const FAKE_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: '2',
    username: 'manager',
    password: 'manager123',
    role: 'manager',
    name: 'Manager User'
  }
];


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = FAKE_USERS.find(u => u.username === username);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Get all jobs (dummy_data)
app.get('/api/jobs', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection) {
      return res.status(503).json({ error: 'dummy_data collection not found' });
    }
    const jobs = await dummyDataCollection.find().toArray();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all roles (dummy_roles)
app.get('/api/roles', authenticateToken, async (req, res) => {
  try {
    if (!dummyRolesCollection) {
      return res.status(503).json({ error: 'dummy_roles collection not found' });
    }
    const roles = await dummyRolesCollection.find().toArray();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/analytics/summary', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection) {
      return res.status(503).json({ error: 'dummy_data collection not found' });
    }

    const jobs = await dummyDataCollection.find().toArray();

    // Calculate total profit
    const totalProfit = jobs.reduce((sum, job) => sum + (job.profit || 0), 0);
    const totalJobs = jobs.length;
    const avgProfitPerJob = totalJobs > 0 ? totalProfit / totalJobs : 0;

    // Count jobs by status (paid vs unpaid)
    const paidJobs = jobs.filter(job => job.status === 'paid').length;
    const unpaidJobs = jobs.filter(job => job.status === 'unpaid').length;

    // Calculate profit from paid vs unpaid
    const paidProfit = jobs
      .filter(job => job.status === 'paid')
      .reduce((sum, job) => sum + (job.profit || 0), 0);
    const unpaidProfit = jobs
      .filter(job => job.status === 'unpaid')
      .reduce((sum, job) => sum + (job.profit || 0), 0);

    res.json({
      totalProfit,
      totalJobs,
      avgProfitPerJob: Math.round(avgProfitPerJob * 100) / 100,
      paidJobs,
      unpaidJobs,
      paidProfit,
      unpaidProfit,
      paymentRate: totalJobs > 0 ? Math.round((paidJobs / totalJobs) * 100 * 100) / 100 : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/profit-by-team', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection || !dummyRolesCollection) {
      return res.status(503).json({ error: 'Required collections not found' });
    }

    const jobs = await dummyDataCollection.find().toArray();
    const roles = await dummyRolesCollection.find().toArray();

    // Create a map of agent name to role/department
    const agentRoleMap = {};
    roles.forEach(role => {
      agentRoleMap[role.agent] = role.role;
    });

    // Group profits by role
    const profitByTeam = {};
    jobs.forEach(job => {
      const agentName = job.agent;
      const role = agentRoleMap[agentName] || 'Unassigned';
      const profit = job.profit || 0;

      if (!profitByTeam[role]) {
        profitByTeam[role] = {
          team: role,
          totalProfit: 0,
          jobCount: 0,
          avgProfit: 0,
          paidJobs: 0,
          unpaidJobs: 0
        };
      }

      profitByTeam[role].totalProfit += profit;
      profitByTeam[role].jobCount += 1;

      if (job.status === 'paid') {
        profitByTeam[role].paidJobs += 1;
      } else {
        profitByTeam[role].unpaidJobs += 1;
      }
    });

    // Calculate averages and payment rates
    Object.values(profitByTeam).forEach(team => {
      team.avgProfit = team.jobCount > 0 ? Math.round((team.totalProfit / team.jobCount) * 100) / 100 : 0;
      team.paymentRate = team.jobCount > 0 ? Math.round((team.paidJobs / team.jobCount) * 100 * 100) / 100 : 0;
    });

    // Convert to array and sort by profit
    const result = Object.values(profitByTeam).sort((a, b) => b.totalProfit - a.totalProfit);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/profit-by-agent', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection || !dummyRolesCollection) {
      return res.status(503).json({ error: 'Required collections not found' });
    }

    const jobs = await dummyDataCollection.find().toArray();
    const roles = await dummyRolesCollection.find().toArray();

    // Create agent info map
    const agentRoleMap = {};
    roles.forEach(role => {
      agentRoleMap[role.agent] = role.role;
    });

    // Group by agent
    const profitByAgent = {};
    jobs.forEach(job => {
      const agentName = job.agent;
      const profit = job.profit || 0;

      if (!profitByAgent[agentName]) {
        profitByAgent[agentName] = {
          agent: agentName,
          team: agentRoleMap[agentName] || 'Unknown',
          totalProfit: 0,
          jobCount: 0,
          avgProfit: 0,
          paidJobs: 0,
          unpaidJobs: 0
        };
      }

      profitByAgent[agentName].totalProfit += profit;
      profitByAgent[agentName].jobCount += 1;

      if (job.status === 'paid') {
        profitByAgent[agentName].paidJobs += 1;
      } else {
        profitByAgent[agentName].unpaidJobs += 1;
      }
    });

    // Calculate averages and payment rates
    Object.values(profitByAgent).forEach(agent => {
      agent.avgProfit = agent.jobCount > 0 ? Math.round((agent.totalProfit / agent.jobCount) * 100) / 100 : 0;
      agent.paymentRate = agent.jobCount > 0 ? Math.round((agent.paidJobs / agent.jobCount) * 100 * 100) / 100 : 0;
    });

    // Convert to array and sort by profit
    const result = Object.values(profitByAgent).sort((a, b) => b.totalProfit - a.totalProfit);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/profit-by-lead', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection) {
      return res.status(503).json({ error: 'dummy_data collection not found' });
    }

    const jobs = await dummyDataCollection.find().toArray();

    // Group by lead source
    const profitByLead = {};
    jobs.forEach(job => {
      const leadSource = job.lead || 'Unknown';
      const profit = job.profit || 0;

      if (!profitByLead[leadSource]) {
        profitByLead[leadSource] = {
          leadSource,
          totalProfit: 0,
          jobCount: 0,
          avgProfit: 0,
          paidJobs: 0,
          unpaidJobs: 0,
          conversionRate: 0
        };
      }

      profitByLead[leadSource].totalProfit += profit;
      profitByLead[leadSource].jobCount += 1;

      if (job.status === 'paid') {
        profitByLead[leadSource].paidJobs += 1;
      } else {
        profitByLead[leadSource].unpaidJobs += 1;
      }
    });

    // Calculate averages, payment rates, and conversion rates
    const totalJobs = jobs.length;
    Object.values(profitByLead).forEach(lead => {
      lead.avgProfit = lead.jobCount > 0 ? Math.round((lead.totalProfit / lead.jobCount) * 100) / 100 : 0;
      lead.paymentRate = lead.jobCount > 0 ? Math.round((lead.paidJobs / lead.jobCount) * 100 * 100) / 100 : 0;
      lead.conversionRate = totalJobs > 0 ? Math.round((lead.jobCount / totalJobs) * 100 * 100) / 100 : 0;
    });

    // Sort by total profit
    const result = Object.values(profitByLead).sort((a, b) => b.totalProfit - a.totalProfit);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/analytics/top-performers', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection || !dummyRolesCollection) {
      return res.status(503).json({ error: 'Required collections not found' });
    }

    const limit = parseInt(req.query.limit) || 10;
    const jobs = await dummyDataCollection.find().toArray();
    const roles = await dummyRolesCollection.find().toArray();

    const agentRoleMap = {};
    roles.forEach(role => {
      agentRoleMap[role.agent] = role.role;
    });

    const profitByAgent = {};
    jobs.forEach(job => {
      const agentName = job.agent;
      const profit = job.profit || 0;

      if (!profitByAgent[agentName]) {
        profitByAgent[agentName] = {
          agent: agentName,
          team: agentRoleMap[agentName] || 'Unknown',
          totalProfit: 0,
          jobCount: 0
        };
      }

      profitByAgent[agentName].totalProfit += profit;
      profitByAgent[agentName].jobCount += 1;
    });

    const result = Object.values(profitByAgent)
      .sort((a, b) => b.totalProfit - a.totalProfit)
      .slice(0, limit);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/efficiency', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection || !dummyRolesCollection) {
      return res.status(503).json({ error: 'Required collections not found' });
    }

    const jobs = await dummyDataCollection.find().toArray();
    const roles = await dummyRolesCollection.find().toArray();

    const totalAgents = roles.length;
    const totalJobs = jobs.length;
    const avgJobsPerAgent = totalAgents > 0 ? Math.round((totalJobs / totalAgents) * 100) / 100 : 0;

    // Calculate paid/unpaid jobs
    const paidJobs = jobs.filter(job => job.status === 'paid').length;
    const unpaidJobs = jobs.filter(job => job.status === 'unpaid').length;
    const paymentRate = totalJobs > 0 ? Math.round((paidJobs / totalJobs) * 100 * 100) / 100 : 0;

    // Count unique lead sources
    const uniqueLeadSources = [...new Set(jobs.map(job => job.lead))].length;

    // Calculate team distribution
    const teamCounts = {};
    roles.forEach(role => {
      teamCounts[role.role] = (teamCounts[role.role] || 0) + 1;
    });

    res.json({
      totalAgents,
      totalJobs,
      avgJobsPerAgent,
      paidJobs,
      unpaidJobs,
      paymentRate,
      uniqueLeadSources,
      teamDistribution: teamCounts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/trends', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection) {
      return res.status(503).json({ error: 'dummy_data collection not found' });
    }

    const jobs = await dummyDataCollection.find().toArray();

    // Group by month
    const profitByMonth = {};
    jobs.forEach(job => {
      const date = new Date(job.timestamp);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!profitByMonth[monthKey]) {
        profitByMonth[monthKey] = {
          month: monthKey,
          totalProfit: 0,
          jobCount: 0,
          avgProfit: 0,
          paidJobs: 0,
          unpaidJobs: 0
        };
      }

      profitByMonth[monthKey].totalProfit += job.profit || 0;
      profitByMonth[monthKey].jobCount += 1;

      if (job.status === 'paid') {
        profitByMonth[monthKey].paidJobs += 1;
      } else {
        profitByMonth[monthKey].unpaidJobs += 1;
      }
    });

    // Calculate averages and sort by month
    const result = Object.values(profitByMonth)
      .map(month => ({
        ...month,
        avgProfit: month.jobCount > 0 ? Math.round((month.totalProfit / month.jobCount) * 100) / 100 : 0,
        paymentRate: month.jobCount > 0 ? Math.round((month.paidJobs / month.jobCount) * 100 * 100) / 100 : 0
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/performance-comparison', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection || !dummyRolesCollection) {
      return res.status(503).json({ error: 'Required collections not found' });
    }

    const jobs = await dummyDataCollection.find().toArray();
    const roles = await dummyRolesCollection.find().toArray();

    const agentRoleMap = {};
    roles.forEach(role => {
      agentRoleMap[role.agent] = role.role;
    });

    const profitByAgent = {};
    jobs.forEach(job => {
      const agentName = job.agent;
      const profit = job.profit || 0;

      if (!profitByAgent[agentName]) {
        profitByAgent[agentName] = {
          agent: agentName,
          team: agentRoleMap[agentName] || 'Unknown',
          totalProfit: 0,
          jobCount: 0,
          avgProfit: 0,
          paidJobs: 0
        };
      }

      profitByAgent[agentName].totalProfit += profit;
      profitByAgent[agentName].jobCount += 1;
      if (job.status === 'paid') profitByAgent[agentName].paidJobs += 1;
    });

    // Calculate averages
    Object.values(profitByAgent).forEach(agent => {
      agent.avgProfit = agent.jobCount > 0 ? Math.round((agent.totalProfit / agent.jobCount) * 100) / 100 : 0;
      agent.paymentRate = agent.jobCount > 0 ? Math.round((agent.paidJobs / agent.jobCount) * 100 * 100) / 100 : 0;
    });

    const allAgents = Object.values(profitByAgent);
    const sortedByProfit = [...allAgents].sort((a, b) => b.totalProfit - a.totalProfit);

    // Calculate team averages
    const teamStats = {};
    allAgents.forEach(agent => {
      if (!teamStats[agent.team]) {
        teamStats[agent.team] = { totalProfit: 0, count: 0 };
      }
      teamStats[agent.team].totalProfit += agent.totalProfit;
      teamStats[agent.team].count += 1;
    });

    const teamAverages = {};
    Object.keys(teamStats).forEach(team => {
      teamAverages[team] = Math.round((teamStats[team].totalProfit / teamStats[team].count) * 100) / 100;
    });

    res.json({
      topPerformers: sortedByProfit.slice(0, 5),
      bottomPerformers: sortedByProfit.slice(-5).reverse(),
      teamAverages,
      companyAverage: allAgents.length > 0
        ? Math.round((allAgents.reduce((sum, a) => sum + a.totalProfit, 0) / allAgents.length) * 100) / 100
        : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/lead-roi', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection) {
      return res.status(503).json({ error: 'dummy_data collection not found' });
    }

    const jobs = await dummyDataCollection.find().toArray();

    const leadAnalysis = {};
    jobs.forEach(job => {
      const lead = job.lead || 'Unknown';

      if (!leadAnalysis[lead]) {
        leadAnalysis[lead] = {
          leadSource: lead,
          totalProfit: 0,
          paidProfit: 0,
          unpaidProfit: 0,
          jobCount: 0,
          paidJobs: 0,
          unpaidJobs: 0,
          avgProfit: 0,
          avgPaidProfit: 0,
          paymentRate: 0
        };
      }

      const profit = job.profit || 0;
      leadAnalysis[lead].totalProfit += profit;
      leadAnalysis[lead].jobCount += 1;

      if (job.status === 'paid') {
        leadAnalysis[lead].paidProfit += profit;
        leadAnalysis[lead].paidJobs += 1;
      } else {
        leadAnalysis[lead].unpaidProfit += profit;
        leadAnalysis[lead].unpaidJobs += 1;
      }
    });

    // Calculate metrics
    const result = Object.values(leadAnalysis).map(lead => ({
      ...lead,
      avgProfit: lead.jobCount > 0 ? Math.round((lead.totalProfit / lead.jobCount) * 100) / 100 : 0,
      avgPaidProfit: lead.paidJobs > 0 ? Math.round((lead.paidProfit / lead.paidJobs) * 100) / 100 : 0,
      paymentRate: lead.jobCount > 0 ? Math.round((lead.paidJobs / lead.jobCount) * 100 * 100) / 100 : 0,
      roi: lead.jobCount > 0 ? Math.round((lead.paidProfit / lead.totalProfit) * 100 * 100) / 100 : 0
    })).sort((a, b) => b.totalProfit - a.totalProfit);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/analytics/team-lead-matrix', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection || !dummyRolesCollection) {
      return res.status(503).json({ error: 'Required collections not found' });
    }

    const jobs = await dummyDataCollection.find().toArray();
    const roles = await dummyRolesCollection.find().toArray();

    const agentRoleMap = {};
    roles.forEach(role => {
      agentRoleMap[role.agent] = role.role;
    });

    // Matrix: team x lead source
    const matrix = {};
    jobs.forEach(job => {
      const team = agentRoleMap[job.agent] || 'Unknown';
      const lead = job.lead || 'Unknown';
      const key = `${team}|${lead}`;

      if (!matrix[key]) {
        matrix[key] = {
          team,
          leadSource: lead,
          totalProfit: 0,
          jobCount: 0,
          avgProfit: 0,
          paidJobs: 0
        };
      }

      matrix[key].totalProfit += job.profit || 0;
      matrix[key].jobCount += 1;
      if (job.status === 'paid') matrix[key].paidJobs += 1;
    });

    // Calculate averages
    const result = Object.values(matrix).map(item => ({
      ...item,
      avgProfit: item.jobCount > 0 ? Math.round((item.totalProfit / item.jobCount) * 100) / 100 : 0,
      paymentRate: item.jobCount > 0 ? Math.round((item.paidJobs / item.jobCount) * 100 * 100) / 100 : 0
    })).sort((a, b) => b.totalProfit - a.totalProfit);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/analytics/profit-distribution', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection) {
      return res.status(503).json({ error: 'dummy_data collection not found' });
    }

    const jobs = await dummyDataCollection.find().toArray();
    const profits = jobs.map(job => job.profit || 0).sort((a, b) => a - b);

    const getPercentile = (arr, p) => {
      const index = Math.ceil((arr.length * p) / 100) - 1;
      return arr[index] || 0;
    };

    const sum = profits.reduce((a, b) => a + b, 0);
    const mean = sum / profits.length;
    const median = getPercentile(profits, 50);

    // Calculate standard deviation
    const variance = profits.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / profits.length;
    const stdDev = Math.sqrt(variance);

    res.json({
      min: Math.min(...profits),
      max: Math.max(...profits),
      mean: Math.round(mean * 100) / 100,
      median,
      stdDev: Math.round(stdDev * 100) / 100,
      quartiles: {
        q1: getPercentile(profits, 25),
        q2: median,
        q3: getPercentile(profits, 75)
      },
      percentiles: {
        p10: getPercentile(profits, 10),
        p25: getPercentile(profits, 25),
        p50: median,
        p75: getPercentile(profits, 75),
        p90: getPercentile(profits, 90),
        p95: getPercentile(profits, 95),
        p99: getPercentile(profits, 99)
      },
      totalJobs: profits.length,
      totalProfit: sum
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/agent-specialization', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection || !dummyRolesCollection) {
      return res.status(503).json({ error: 'Required collections not found' });
    }

    const jobs = await dummyDataCollection.find().toArray();
    const roles = await dummyRolesCollection.find().toArray();

    const agentRoleMap = {};
    roles.forEach(role => {
      agentRoleMap[role.agent] = role.role;
    });

    // Agent x Lead matrix
    const agentLeadPerformance = {};
    jobs.forEach(job => {
      const agent = job.agent;
      const lead = job.lead || 'Unknown';

      if (!agentLeadPerformance[agent]) {
        agentLeadPerformance[agent] = {
          agent,
          team: agentRoleMap[agent] || 'Unknown',
          leadSources: {}
        };
      }

      if (!agentLeadPerformance[agent].leadSources[lead]) {
        agentLeadPerformance[agent].leadSources[lead] = {
          totalProfit: 0,
          jobCount: 0,
          avgProfit: 0
        };
      }

      agentLeadPerformance[agent].leadSources[lead].totalProfit += job.profit || 0;
      agentLeadPerformance[agent].leadSources[lead].jobCount += 1;
    });

    // Calculate best lead source for each agent
    const result = Object.values(agentLeadPerformance).map(agent => {
      const leadStats = Object.entries(agent.leadSources).map(([lead, stats]) => ({
        leadSource: lead,
        totalProfit: stats.totalProfit,
        jobCount: stats.jobCount,
        avgProfit: stats.jobCount > 0 ? Math.round((stats.totalProfit / stats.jobCount) * 100) / 100 : 0
      }));

      const bestLead = leadStats.sort((a, b) => b.totalProfit - a.totalProfit)[0];

      return {
        agent: agent.agent,
        team: agent.team,
        bestLeadSource: bestLead.leadSource,
        bestLeadProfit: bestLead.totalProfit,
        bestLeadJobCount: bestLead.jobCount,
        bestLeadAvgProfit: bestLead.avgProfit,
        allLeadSources: leadStats
      };
    }).sort((a, b) => b.bestLeadProfit - a.bestLeadProfit);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/payment-collection', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection || !dummyRolesCollection) {
      return res.status(503).json({ error: 'Required collections not found' });
    }

    const jobs = await dummyDataCollection.find().toArray();
    const roles = await dummyRolesCollection.find().toArray();

    const agentRoleMap = {};
    roles.forEach(role => {
      agentRoleMap[role.agent] = role.role;
    });

    // Agent payment collection stats
    const agentPaymentStats = {};
    jobs.forEach(job => {
      const agent = job.agent;

      if (!agentPaymentStats[agent]) {
        agentPaymentStats[agent] = {
          agent,
          team: agentRoleMap[agent] || 'Unknown',
          totalJobs: 0,
          paidJobs: 0,
          unpaidJobs: 0,
          paidProfit: 0,
          unpaidProfit: 0,
          paymentRate: 0
        };
      }

      agentPaymentStats[agent].totalJobs += 1;
      if (job.status === 'paid') {
        agentPaymentStats[agent].paidJobs += 1;
        agentPaymentStats[agent].paidProfit += job.profit || 0;
      } else {
        agentPaymentStats[agent].unpaidJobs += 1;
        agentPaymentStats[agent].unpaidProfit += job.profit || 0;
      }
    });

    // Calculate payment rates
    const result = Object.values(agentPaymentStats).map(agent => ({
      ...agent,
      paymentRate: agent.totalJobs > 0 ? Math.round((agent.paidJobs / agent.totalJobs) * 100 * 100) / 100 : 0
    })).sort((a, b) => b.paymentRate - a.paymentRate);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    collections: {
      dummy_data: !!dummyDataCollection,
      dummy_roles: !!dummyRolesCollection
    }
  });
});

app.listen(PORT, () => {
  console.log(`\n Server running on http://localhost:${PORT}`);
  console.log(`\n Login credentials:`);
  console.log(`   Username: admin | Password: admin123`);
  console.log(`   Username: manager | Password: manager123\n`);
});
