const { ipcRenderer } = require('electron');

// Application state
let appData = {
  customers: [],
  products: [],
  partnerships: [],
  campaigns: []
};

// DOM elements
const loadingScreen = document.getElementById('loading');
const mainApp = document.getElementById('main-app');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize application
async function initApp() {
  try {
    // Load saved data
    const result = await ipcRenderer.invoke('load-data');
    if (result.success && result.data) {
      appData = { ...appData, ...result.data };
    } else {
      // Load default data
      loadDefaultData();
    }
    
    // Initialize UI
    initializeUI();
    
    // Hide loading screen
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      mainApp.classList.remove('hidden');
      mainApp.classList.add('fade-in');
    }, 1000);
    
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
}

// Load default data
function loadDefaultData() {
  appData.customers = [
    { 
      id: 1, 
      name: 'Sarah Johnson', 
      email: 'sarah@email.com', 
      type: 'General Consumer',
      cognitiveGoal: 'Memory Enhancement', 
      startDate: '2025-06-15',
      currentStack: ['THINK', 'Brain Water'],
      progressScore: 85,
      lastAssessment: '2025-07-30',
      totalSpent: 450,
      engagementLevel: 'High',
      improvements: { memory: +15, focus: +20, mood: +10 }
    },
    { 
      id: 2, 
      name: 'Mike Chen', 
      email: 'mike@email.com', 
      type: 'Professional Athlete',
      cognitiveGoal: 'Focus & Performance', 
      startDate: '2025-05-20',
      currentStack: ['THINK', 'Stress Shield', 'Brain Water'],
      progressScore: 92,
      lastAssessment: '2025-07-28',
      totalSpent: 780,
      engagementLevel: 'High',
      improvements: { memory: +25, focus: +35, mood: +18 }
    },
    { 
      id: 3, 
      name: 'Emily Davis', 
      email: 'emily@email.com', 
      type: 'Student',
      cognitiveGoal: 'Stress Management', 
      startDate: '2025-07-01',
      currentStack: ['Peaceful Slumber', 'Balance'],
      progressScore: 78,
      lastAssessment: '2025-07-25',
      totalSpent: 320,
      engagementLevel: 'Medium',
      improvements: { memory: +8, focus: +12, mood: +22 }
    }
  ];

  appData.products = [
    { 
      id: 1, 
      name: 'THINK', 
      category: 'Cognitive Enhancement', 
      stock: 150, 
      price: 49.99, 
      monthlySales: 89,
      rating: 4.8,
      primaryBenefit: 'Focus & Memory',
      ingredients: ['Blueberry Extract', 'Asian Ginseng', 'AlphaSize®'],
      targetCustomer: 'Professionals & Students',
      effectivenessRating: 92
    },
    { 
      id: 2, 
      name: 'Brain Water', 
      category: 'Hydration & Focus', 
      stock: 300, 
      price: 29.99, 
      monthlySales: 156,
      rating: 4.9,
      primaryBenefit: 'Hydration & Mental Clarity',
      ingredients: ['Electrolytes', 'Nootropics', 'Natural Flavors'],
      targetCustomer: 'Athletes & Active Individuals',
      effectivenessRating: 88
    },
    { 
      id: 3, 
      name: 'Peaceful Slumber', 
      category: 'Sleep & Recovery', 
      stock: 75, 
      price: 39.99, 
      monthlySales: 67,
      rating: 4.7,
      primaryBenefit: 'Deep Sleep & Recovery',
      ingredients: ['Melatonin', 'Magnesium', 'L-Theanine'],
      targetCustomer: 'Everyone',
      effectivenessRating: 90
    }
  ];

  appData.partnerships = [
    { id: 1, name: 'NFL Players Association', type: 'Professional Sports', status: 'Active', members: 45, monthlyRevenue: 12500 },
    { id: 2, name: 'University of Texas Athletics', type: 'College Sports', status: 'Active', members: 28, monthlyRevenue: 8200 },
    { id: 3, name: 'Corporate Wellness - Tech Co', type: 'Corporate', status: 'Pending', members: 120, monthlyRevenue: 0 },
    { id: 4, name: 'Austin Fitness Centers', type: 'Wellness Centers', status: 'Active', members: 67, monthlyRevenue: 6800 }
  ];

  appData.campaigns = [
    { 
      id: 1, 
      name: 'NFL Brain Health Awareness', 
      type: 'Professional Sports', 
      status: 'Active', 
      reach: 15000,
      engagement: 8.5,
      conversions: 145,
      roi: 340
    },
    { 
      id: 2, 
      name: 'Back to School Focus Campaign', 
      type: 'Educational', 
      status: 'Active', 
      reach: 8500,
      engagement: 6.2,
      conversions: 89,
      roi: 220
    }
  ];
}

// Initialize UI
function initializeUI() {
  // Set up tab navigation
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      switchTab(tabName);
    });
  });

  // Load initial dashboard
  loadDashboard();
  
  // Set up event listeners
  setupEventListeners();
}

// Switch tabs
function switchTab(tabName) {
  // Update tab buttons
  tabButtons.forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  
  // Update tab content
  tabContents.forEach(content => content.classList.remove('active'));
  document.getElementById(`${tabName}-content`).classList.add('active');
  
  // Load content based on tab
  switch(tabName) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'customers':
      loadCustomers();
      break;
    case 'products':
      loadProducts();
      break;
    case 'partnerships':
      loadPartnerships();
      break;
    case 'analytics':
      loadAnalytics();
      break;
    case 'campaigns':
      loadCampaigns();
      break;
  }
}

// Load dashboard content
function loadDashboard() {
  const content = document.getElementById('dashboard-content');
  content.innerHTML = `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Brain Tree Nutrition Dashboard</h1>
          <p class="text-gray-600">Optimizing cognitive health through science-backed nutrition</p>
        </div>
        <button class="btn-primary" onclick="newAssessment()">
          <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          New Assessment
        </button>
      </div>

      <div class="data-grid data-grid-4">
        ${generateStatCards()}
      </div>

      <div class="data-grid data-grid-2">
        ${generateTopProducts()}
        ${generateCustomerHighlights()}
      </div>

      <div class="data-grid data-grid-3">
        ${generatePartnerships()}
        ${generateCampaignPerformance()}
        ${generateActionItems()}
      </div>
    </div>
  `;
}

// Generate stat cards
function generateStatCards() {
  const totalCustomers = appData.customers.length;
  const totalRevenue = appData.customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgProgress = appData.customers.reduce((sum, c) => sum + c.progressScore, 0) / totalCustomers;
  
  return `
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-600 text-sm font-medium">Active Customers</p>
          <p class="text-2xl font-bold text-gray-900">${totalCustomers}</p>
          <p class="text-sm text-gray-500">Cognitive enhancement users</p>
        </div>
        <div class="p-3 rounded-lg bg-purple-100">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-600 text-sm font-medium">Total Revenue</p>
          <p class="text-2xl font-bold text-gray-900">$${totalRevenue.toLocaleString()}</p>
          <p class="text-sm text-gray-500">Supplement sales</p>
        </div>
        <div class="p-3 rounded-lg bg-green-100">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
        </div>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-600 text-sm font-medium">Avg. Progress</p>
          <p class="text-2xl font-bold text-gray-900">${Math.round(avgProgress)}%</p>
          <p class="text-sm text-gray-500">Cognitive performance boost</p>
        </div>
        <div class="p-3 rounded-lg bg-yellow-100">
          <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
          </svg>
        </div>
      </div>
    </div>
    
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-600 text-sm font-medium">Satisfaction</p>
          <p class="text-2xl font-bold text-gray-900">4.8/5</p>
          <p class="text-sm text-gray-500">Based on health outcomes</p>
        </div>
        <div class="p-3 rounded-lg bg-red-100">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </div>
      </div>
    </div>
  `;
}

// Setup event listeners
function setupEventListeners() {
  // IPC event listeners
  ipcRenderer.on('new-assessment', () => {
    newAssessment();
  });
  
  ipcRenderer.on('export-data', () => {
    exportData();
  });
  
  // Save data periodically
  setInterval(() => {
    ipcRenderer.invoke('save-data', appData);
  }, 30000); // Save every 30 seconds
}

// New assessment function
function newAssessment() {
  // Implementation for new assessment
  console.log('New assessment requested');
}

// Export data function
async function exportData() {
  try {
    const result = await ipcRenderer.invoke('export-csv', appData);
    if (result.success) {
      console.log('Data exported successfully to:', result.filePath);
    } else {
      console.error('Export failed:', result.error);
    }
  } catch (error) {
    console.error('Export error:', error);
  }
}

// Load other tab content functions (to be implemented)
function loadCustomers() {
  const content = document.getElementById('customers-content');
  content.innerHTML = '<div class="text-center py-8"><p class="text-gray-600">Customers tab - Coming soon</p></div>';
}

function loadProducts() {
  const content = document.getElementById('products-content');
  content.innerHTML = '<div class="text-center py-8"><p class="text-gray-600">Products tab - Coming soon</p></div>';
}

function loadPartnerships() {
  const content = document.getElementById('partnerships-content');
  content.innerHTML = '<div class="text-center py-8"><p class="text-gray-600">Partnerships tab - Coming soon</p></div>';
}

function loadAnalytics() {
  const content = document.getElementById('analytics-content');
  content.innerHTML = '<div class="text-center py-8"><p class="text-gray-600">Analytics tab - Coming soon</p></div>';
}

function loadCampaigns() {
  const content = document.getElementById('campaigns-content');
  content.innerHTML = '<div class="text-center py-8"><p class="text-gray-600">Campaigns tab - Coming soon</p></div>';
}

// Helper functions for generating content
function generateTopProducts() {
  const topProducts = appData.products.sort((a, b) => b.monthlySales - a.monthlySales).slice(0, 3);
  
  return `
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        Top Performing Products
      </h3>
      <div class="space-y-3">
        ${topProducts.map(product => `
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium text-gray-900">${product.name}</p>
              <p class="text-sm text-gray-600">${product.primaryBenefit}</p>
              <p class="text-xs text-gray-500">${product.monthlySales} units sold</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-900">$${product.price}</p>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-yellow-500 fill-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                <span class="text-sm text-gray-600">${product.rating}</span>
              </div>
              <p class="text-xs text-green-600">${product.effectivenessRating}% effective</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function generateCustomerHighlights() {
  const topCustomers = appData.customers.sort((a, b) => b.progressScore - a.progressScore).slice(0, 3);
  
  return `
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
        </svg>
        Customer Progress Highlights
      </h3>
      <div class="space-y-4">
        ${topCustomers.map(customer => `
          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="flex justify-between items-start mb-2">
              <div>
                <p class="font-medium text-gray-900">${customer.name}</p>
                <p class="text-sm text-gray-600">${customer.cognitiveGoal}</p>
              </div>
              <span class="px-2 py-1 rounded-full text-xs font-medium ${
                customer.progressScore >= 90 ? 'status-active' :
                customer.progressScore >= 80 ? 'bg-blue-100 text-blue-700' :
                'status-pending'
              }">
                ${customer.progressScore}% Progress
              </span>
            </div>
            <div class="grid grid-cols-3 gap-2 text-xs">
              <div class="text-center">
                <p class="text-gray-500">Memory</p>
                <p class="font-medium text-green-600">+${customer.improvements.memory}%</p>
              </div>
              <div class="text-center">
                <p class="text-gray-500">Focus</p>
                <p class="font-medium text-blue-600">+${customer.improvements.focus}%</p>
              </div>
              <div class="text-center">
                <p class="text-gray-500">Mood</p>
                <p class="font-medium text-purple-600">+${customer.improvements.mood}%</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function generatePartnerships() {
  const activePartnerships = appData.partnerships.filter(p => p.status === 'Active');
  
  return `
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
        </svg>
        Professional Partnerships
      </h3>
      <div class="space-y-3">
        ${activePartnerships.map(partnership => `
          <div class="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium text-gray-900 text-sm">${partnership.name}</p>
              <p class="text-xs text-gray-600">${partnership.members} members</p>
            </div>
            <p class="text-sm font-semibold text-green-600">$${partnership.monthlyRevenue.toLocaleString()}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function generateCampaignPerformance() {
  const activeCampaigns = appData.campaigns.filter(c => c.status === 'Active');
  
  return `
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        Campaign Performance
      </h3>
      <div class="space-y-3">
        ${activeCampaigns.map(campaign => `
          <div class="p-3 bg-gray-50 rounded-lg">
            <p class="font-medium text-gray-900 text-sm">${campaign.name}</p>
            <div class="flex justify-between text-xs text-gray-600 mt-1">
              <span>Reach: ${campaign.reach.toLocaleString()}</span>
              <span>ROI: ${campaign.roi}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1 mt-2">
              <div class="bg-blue-600 h-1 rounded-full progress-bar" style="width: ${Math.min(campaign.engagement * 10, 100)}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function generateActionItems() {
  return `
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        Action Items
      </h3>
      <div class="space-y-3">
        <div class="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
          <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <div>
            <p class="text-sm font-medium text-gray-900">Low Stock Alert</p>
            <p class="text-xs text-gray-600">Peaceful Slumber: 75 units left</p>
          </div>
        </div>
        <div class="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p class="text-sm font-medium text-gray-900">Follow-up Due</p>
            <p class="text-xs text-gray-600">12 customers need progress check</p>
          </div>
        </div>
        <div class="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
          <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p class="text-sm font-medium text-gray-900">New Testimonial</p>
            <p class="text-xs text-gray-600">NFL player review pending approval</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp); 