/**
 * Prism Console JavaScript
 * BlackRoad OS Admin Interface
 */

class PrismConsole {
  constructor() {
    this.apiBase = window.location.origin;
    this.init();
  }

  async init() {
    console.log('Prism Console initializing...');

    // Setup tab navigation
    this.setupTabs();

    // Load initial data
    await this.loadDashboard();

    // Setup auto-refresh
    setInterval(() => this.loadDashboard(), 30000); // Every 30 seconds

    console.log('Prism Console ready');
  }

  setupTabs() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        // Remove active from all
        navItems.forEach(nav => nav.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(panel => {
          panel.classList.remove('active');
        });

        // Add active to clicked
        item.classList.add('active');
        const tabId = `${item.dataset.tab}-tab`;
        document.getElementById(tabId).classList.add('active');

        // Load tab-specific data
        this.loadTabData(item.dataset.tab);
      });
    });
  }

  async loadDashboard() {
    try {
      // Get system version
      const version = await this.fetchAPI('/api/system/version');
      document.getElementById('backend-version').textContent = version.version;
      document.getElementById('environment-badge').textContent = version.env;

      // Get system status
      document.getElementById('system-status').textContent = 'Healthy ✓';
      document.getElementById('health-status').style.color = '#10b981';

      // Update last updated time
      const now = new Date().toLocaleTimeString();
      document.getElementById('last-updated').textContent = `Last updated: ${now}`;

    } catch (error) {
      console.error('Failed to load dashboard:', error);
      document.getElementById('system-status').textContent = 'Error';
      document.getElementById('health-status').style.color = '#ef4444';
    }
  }

  async loadTabData(tab) {
    console.log(`Loading data for tab: ${tab}`);

    switch (tab) {
      case 'jobs':
        await this.loadJobs();
        break;
      case 'agents':
        await this.loadAgents();
        break;
      case 'system':
        await this.loadSystemConfig();
        break;
      default:
        console.log('No specific data to load for this tab');
    }
  }

  async loadJobs() {
    console.log('TODO: Load jobs from Operator Engine API');
    // Future: Fetch from /api/operator/jobs
  }

  async loadAgents() {
    console.log('TODO: Load agents from Agent Library API');
    // Future: Fetch from /api/agents
  }

  async loadSystemConfig() {
    try {
      const config = await this.fetchAPI('/api/system/config/public');

      // Display config
      const configDisplay = document.getElementById('config-display');
      configDisplay.innerHTML = `
        <pre>${JSON.stringify(config, null, 2)}</pre>
      `;

      // Display features
      const featuresDisplay = document.getElementById('features-display');
      featuresDisplay.innerHTML = Object.entries(config.features || {})
        .map(([key, value]) => {
          const icon = value ? '✅' : '❌';
          return `<div>${icon} ${key}: ${value}</div>`;
        })
        .join('');

    } catch (error) {
      console.error('Failed to load system config:', error);
    }
  }

  async fetchAPI(endpoint) {
    const response = await fetch(`${this.apiBase}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return response.json();
  }
}

// Global functions for HTML onclick
function refreshDashboard() {
  window.prism.loadDashboard();
}

function viewLogs() {
  document.querySelector('[data-tab="logs"]').click();
}

function openOS() {
  window.location.href = '/';
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.prism = new PrismConsole();
});
