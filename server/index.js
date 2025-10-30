// server/index.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb+srv://newDev:6MbAMckFhn2uoFSj@safe-ship-sandbox.wntjwof.mongodb.net/';

let client;
let dummyDataCollection;
let dummyRolesCollection;

async function connectToMongoDB() {
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const adminDb = client.db().admin();
    const { databases } = await adminDb.listDatabases();

    console.log('📁 Available databases:', databases.map(db => db.name).join(', '));

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
        console.log(`✅ Found 'dummy_data' in database: ${dbInfo.name}`);
      }

      if (!foundRoles && collectionNames.includes('dummy_roles')) {
        dummyRolesCollection = db.collection('dummy_roles');
        foundRoles = true;
        console.log(`✅ Found 'dummy_roles' in database: ${dbInfo.name}`);
      }
    }

    if (!foundData || !foundRoles) {
      console.warn('⚠️  Warning: Could not find one or both collections');
      if (!foundData) console.warn('   - dummy_data collection not found');
      if (!foundRoles) console.warn('   - dummy_roles collection not found');
    }

  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

connectToMongoDB();

// Fake users for authentication
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

// Login
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

// Verify token
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

// Overall Analytics Summary
app.get('/api/analytics/summary', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection) {
      return res.status(503).json({ error: 'dummy_data collection not found' });
    }

    const jobs = await dummyDataCollection.find().toArray();

    const totalProfit = jobs.reduce((sum, job) => sum + (job.profit || 0), 0);
    const totalJobs = jobs.length;
    const avgProfitPerJob = totalJobs > 0 ? totalProfit / totalJobs : 0;

    const jobsByStatus = jobs.reduce((acc, job) => {
      const status = job.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalProfit,
      totalJobs,
      avgProfitPerJob,
      jobsByStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profit by Team/Department
app.get('/api/analytics/profit-by-team', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection || !dummyRolesCollection) {
      return res.status(503).json({ error: 'Required collections not found' });
    }

    const jobs = await dummyDataCollection.find().toArray();
    const roles = await dummyRolesCollection.find().toArray();

    const agentDepartmentMap = {};
    roles.forEach(role => {
      agentDepartmentMap[role.agentId || role.agent_id] = role.department || 'Unknown';
    });

    const profitByTeam = {};
    jobs.forEach(job => {
      const agentId = job.agentId || job.agent_id;
      const department = agentDepartmentMap[agentId] || 'Unassigned';
      const profit = job.profit || 0;

      if (!profitByTeam[department]) {
        profitByTeam[department] = {
          department,
          totalProfit: 0,
          jobCount: 0,
          avgProfit: 0
        };
      }

      profitByTeam[department].totalProfit += profit;
      profitByTeam[department].jobCount += 1;
    });

    Object.values(profitByTeam).forEach(team => {
      team.avgProfit = team.jobCount > 0 ? team.totalProfit / team.jobCount : 0;
    });

    const result = Object.values(profitByTeam).sort((a, b) => b.totalProfit - a.totalProfit);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profit by Individual Agent
app.get('/api/analytics/profit-by-agent', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection || !dummyRolesCollection) {
      return res.status(503).json({ error: 'Required collections not found' });
    }

    const jobs = await dummyDataCollection.find().toArray();
    const roles = await dummyRolesCollection.find().toArray();

    const agentInfoMap = {};
    roles.forEach(role => {
      const agentId = role.agentId || role.agent_id;
      agentInfoMap[agentId] = {
        name: role.agentName || role.agent_name || `Agent ${agentId}`,
        department: role.department || 'Unknown'
      };
    });

    const profitByAgent = {};
    jobs.forEach(job => {
      const agentId = job.agentId || job.agent_id || 'unknown';
      const profit = job.profit || 0;

      if (!profitByAgent[agentId]) {
        profitByAgent[agentId] = {
          agentId,
          agentName: agentInfoMap[agentId]?.name || `Agent ${agentId}`,
          department: agentInfoMap[agentId]?.department || 'Unknown',
          totalProfit: 0,
          jobCount: 0,
          avgProfit: 0
        };
      }

      profitByAgent[agentId].totalProfit += profit;
      profitByAgent[agentId].jobCount += 1;
    });

    Object.values(profitByAgent).forEach(agent => {
      agent.avgProfit = agent.jobCount > 0 ? agent.totalProfit / agent.jobCount : 0;
    });

    const result = Object.values(profitByAgent).sort((a, b) => b.totalProfit - a.totalProfit);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profit by Outreach Method
app.get('/api/analytics/profit-by-outreach', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection) {
      return res.status(503).json({ error: 'dummy_data collection not found' });
    }

    const jobs = await dummyDataCollection.find().toArray();

    const profitByMethod = {};
    jobs.forEach(job => {
      const method = job.outreachMethod || job.outreach_method || job.leadSource || 'Unknown';
      const profit = job.profit || 0;

      if (!profitByMethod[method]) {
        profitByMethod[method] = {
          method,
          totalProfit: 0,
          jobCount: 0,
          avgProfit: 0,
          conversionRate: 0
        };
      }

      profitByMethod[method].totalProfit += profit;
      profitByMethod[method].jobCount += 1;
    });

    const totalJobs = jobs.length;
    Object.values(profitByMethod).forEach(method => {
      method.avgProfit = method.jobCount > 0 ? method.totalProfit / method.jobCount : 0;
      method.conversionRate = totalJobs > 0 ? (method.jobCount / totalJobs) * 100 : 0;
    });

    const result = Object.values(profitByMethod).sort((a, b) => b.totalProfit - a.totalProfit);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Top Performers
app.get('/api/analytics/top-performers', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection || !dummyRolesCollection) {
      return res.status(503).json({ error: 'Required collections not found' });
    }

    const limit = parseInt(req.query.limit) || 10;
    const jobs = await dummyDataCollection.find().toArray();
    const roles = await dummyRolesCollection.find().toArray();

    const agentInfoMap = {};
    roles.forEach(role => {
      const agentId = role.agentId || role.agent_id;
      agentInfoMap[agentId] = {
        name: role.agentName || role.agent_name || `Agent ${agentId}`,
        department: role.department || 'Unknown'
      };
    });

    const profitByAgent = {};
    jobs.forEach(job => {
      const agentId = job.agentId || job.agent_id || 'unknown';
      const profit = job.profit || 0;

      if (!profitByAgent[agentId]) {
        profitByAgent[agentId] = {
          agentId,
          agentName: agentInfoMap[agentId]?.name || `Agent ${agentId}`,
          department: agentInfoMap[agentId]?.department || 'Unknown',
          totalProfit: 0,
          jobCount: 0
        };
      }

      profitByAgent[agentId].totalProfit += profit;
      profitByAgent[agentId].jobCount += 1;
    });

    const result = Object.values(profitByAgent)
      .sort((a, b) => b.totalProfit - a.totalProfit)
      .slice(0, limit);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Efficiency Metrics
app.get('/api/analytics/efficiency', authenticateToken, async (req, res) => {
  try {
    if (!dummyDataCollection || !dummyRolesCollection) {
      return res.status(503).json({ error: 'Required collections not found' });
    }

    const jobs = await dummyDataCollection.find().toArray();
    const roles = await dummyRolesCollection.find().toArray();

    const totalAgents = roles.length;
    const totalJobs = jobs.length;
    const avgJobsPerAgent = totalAgents > 0 ? totalJobs / totalAgents : 0;

    const completedJobs = jobs.filter(job =>
      job.status === 'completed' || job.status === 'closed' || job.status === 'won'
    ).length;
    const completionRate = totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0;

    res.json({
      totalAgents,
      totalJobs,
      avgJobsPerAgent: Math.round(avgJobsPerAgent * 100) / 100,
      completedJobs,
      completionRate: Math.round(completionRate * 100) / 100
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
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
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`\n📝 Login credentials:`);
  console.log(`   Username: admin | Password: admin123`);
  console.log(`   Username: manager | Password: manager123`);
});
