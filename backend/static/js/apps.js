/**
 * BlackRoad OS Application Modules
 * Handles data loading and UI updates for all desktop applications
 */

class BlackRoadApps {
    constructor() {
        this.api = window.BlackRoadAPI;
        this.refreshIntervals = {};
    }

    /**
     * Initialize all apps when user logs in
     */
    initialize() {
        // Listen for login event
        window.addEventListener('auth:login', () => {
            this.loadAllApps();
        });

        // Listen for window open events to load data on-demand
        this.setupWindowListeners();
    }

    /**
     * Load all apps data
     */
    async loadAllApps() {
        // Load critical apps immediately
        await Promise.all([
            this.loadWallet(),
            this.loadMinerStats(),
            this.loadBlockchainStats(),
        ]);

        // Load other apps in the background
        setTimeout(() => {
            this.loadDevices();
            this.loadEmailInbox();
            this.loadSocialFeed();
            this.loadVideos();
        }, 1000);
    }

    /**
     * Setup listeners for window open events
     */
    setupWindowListeners() {
        // Override the global openWindow function to load data when windows open
        const originalOpenWindow = window.openWindow;
        window.openWindow = (id) => {
            originalOpenWindow(id);
            this.onWindowOpened(id);
        };
    }

    /**
     * Handle window opened event
     */
    onWindowOpened(windowId) {
        switch (windowId) {
            case 'roadcoin-miner':
                this.loadMinerStatus();
                this.startMinerRefresh();
                break;
            case 'roadchain':
                this.loadBlockchainExplorer();
                break;
            case 'wallet':
                this.loadWallet();
                break;
            case 'raspberry-pi':
                this.loadDevices();
                break;
            case 'roadmail':
                this.loadEmailInbox();
                break;
            case 'blackroad-social':
                this.loadSocialFeed();
                break;
            case 'blackstream':
                this.loadVideos();
                break;
            case 'ai-chat':
                this.loadAIChat();
                break;
        }
    }

    /**
     * Start auto-refresh for a window
     */
    startRefresh(windowId, callback, interval = 5000) {
        this.stopRefresh(windowId);
        this.refreshIntervals[windowId] = setInterval(callback, interval);
    }

    /**
     * Stop auto-refresh for a window
     */
    stopRefresh(windowId) {
        if (this.refreshIntervals[windowId]) {
            clearInterval(this.refreshIntervals[windowId]);
            delete this.refreshIntervals[windowId];
        }
    }

    // ===== MINER APPLICATION =====

    async loadMinerStatus() {
        try {
            const [status, stats, blocks] = await Promise.all([
                this.api.getMinerStatus(),
                this.api.getMinerStats(),
                this.api.getMinedBlocks(5),
            ]);

            this.updateMinerUI(status, stats, blocks);
        } catch (error) {
            console.error('Failed to load miner status:', error);
        }
    }

    async loadMinerStats() {
        try {
            const stats = await this.api.getMinerStats();
            this.updateMinerStatsInTaskbar(stats);
        } catch (error) {
            console.error('Failed to load miner stats:', error);
        }
    }

    updateMinerUI(status, stats, blocks) {
        const content = document.querySelector('#roadcoin-miner .window-content');
        if (!content) return;

        const statusColor = status.is_mining ? '#2ecc40' : '#ff4136';
        const statusText = status.is_mining ? 'MINING' : 'STOPPED';

        content.innerHTML = `
            <div class="miner-dashboard">
                <div class="miner-header">
                    <h2>⛏️ RoadCoin Miner</h2>
                    <div class="miner-status" style="color: ${statusColor}; font-weight: bold;">
                        ${statusText}
                    </div>
                </div>

                <div class="miner-stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">Hashrate</div>
                        <div class="stat-value">${status.hashrate_mhs.toFixed(2)} MH/s</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Shares</div>
                        <div class="stat-value">${status.shares_accepted}/${status.shares_submitted}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Temperature</div>
                        <div class="stat-value">${status.temperature_celsius.toFixed(1)}°C</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Power</div>
                        <div class="stat-value">${status.power_watts.toFixed(0)}W</div>
                    </div>
                </div>

                <div class="miner-lifetime-stats">
                    <h3>Lifetime Statistics</h3>
                    <div class="stat-row">
                        <span>Blocks Mined:</span>
                        <span><strong>${stats.blocks_mined}</strong></span>
                    </div>
                    <div class="stat-row">
                        <span>RoadCoins Earned:</span>
                        <span><strong>${stats.roadcoins_earned.toFixed(2)} RC</strong></span>
                    </div>
                    <div class="stat-row">
                        <span>Pool:</span>
                        <span>${status.pool_url}</span>
                    </div>
                </div>

                <div class="miner-recent-blocks">
                    <h3>Recent Blocks</h3>
                    <div class="blocks-list">
                        ${blocks.length > 0 ? blocks.map(block => `
                            <div class="block-item">
                                <span>Block #${block.block_index}</span>
                                <span>${block.reward.toFixed(2)} RC</span>
                                <span class="text-muted">${this.formatTime(block.timestamp)}</span>
                            </div>
                        `).join('') : '<div class="text-muted">No blocks mined yet</div>'}
                    </div>
                </div>

                <div class="miner-controls">
                    <button class="btn ${status.is_mining ? 'btn-danger' : 'btn-success'}"
                            onclick="window.BlackRoadApps.toggleMiner()">
                        ${status.is_mining ? 'Stop Mining' : 'Start Mining'}
                    </button>
                </div>
            </div>
        `;
    }

    updateMinerStatsInTaskbar(stats) {
        // Update system tray icon tooltip or status
        const trayIcon = document.querySelector('.system-tray span:last-child');
        if (trayIcon) {
            trayIcon.title = `Mining: ${stats.blocks_mined} blocks, ${stats.roadcoins_earned.toFixed(2)} RC earned`;
        }
    }

    async toggleMiner() {
        try {
            const status = await this.api.getMinerStatus();
            const action = status.is_mining ? 'stop' : 'start';
            await this.api.controlMiner(action);
            await this.loadMinerStatus();
        } catch (error) {
            console.error('Failed to toggle miner:', error);
            alert('Failed to control miner: ' + error.message);
        }
    }

    startMinerRefresh() {
        this.startRefresh('roadcoin-miner', () => this.loadMinerStatus(), 5000);
    }

    // ===== BLOCKCHAIN EXPLORER =====

    async loadBlockchainExplorer() {
        try {
            const [stats, blocks] = await Promise.all([
                this.api.getBlockchainStats(),
                this.api.getBlocks(10),
            ]);

            this.updateBlockchainUI(stats, blocks);
        } catch (error) {
            console.error('Failed to load blockchain data:', error);
        }
    }

    async loadBlockchainStats() {
        try {
            const stats = await this.api.getBlockchainStats();
            this.updateBlockchainStatsInTaskbar(stats);
        } catch (error) {
            console.error('Failed to load blockchain stats:', error);
        }
    }

    updateBlockchainUI(stats, blocks) {
        const content = document.querySelector('#roadchain .window-content');
        if (!content) return;

        content.innerHTML = `
            <div class="blockchain-explorer">
                <div class="explorer-header">
                    <h2>⛓️ RoadChain Explorer</h2>
                </div>

                <div class="blockchain-stats">
                    <div class="stat-card">
                        <div class="stat-label">Chain Height</div>
                        <div class="stat-value">${stats.total_blocks}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Transactions</div>
                        <div class="stat-value">${stats.total_transactions}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Difficulty</div>
                        <div class="stat-value">${stats.difficulty}</div>
                    </div>
                </div>

                <div class="recent-blocks">
                    <h3>Recent Blocks</h3>
                    <div class="blocks-table">
                        ${blocks.map(block => `
                            <div class="block-row" onclick="window.BlackRoadApps.showBlockDetail(${block.id})">
                                <div class="block-index">#${block.index}</div>
                                <div class="block-hash">${block.hash.substring(0, 16)}...</div>
                                <div class="block-txs">${block.transactions?.length || 0} txs</div>
                                <div class="block-time">${this.formatTime(block.timestamp)}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="explorer-actions">
                    <button class="btn btn-primary" onclick="window.BlackRoadApps.mineNewBlock()">
                        Mine New Block
                    </button>
                </div>
            </div>
        `;
    }

    updateBlockchainStatsInTaskbar(stats) {
        // Could update a taskbar indicator
    }

    async mineNewBlock() {
        try {
            const result = await this.api.mineBlock();
            alert(`Successfully mined block #${result.index}! Reward: ${result.reward} RC`);
            await this.loadBlockchainExplorer();
            await this.loadWallet();
        } catch (error) {
            console.error('Failed to mine block:', error);
            alert('Failed to mine block: ' + error.message);
        }
    }

    showBlockDetail(blockId) {
        // TODO: Open block detail modal
        console.log('Show block detail:', blockId);
    }

    // ===== WALLET =====

    async loadWallet() {
        try {
            const [wallet, balance, transactions] = await Promise.all([
                this.api.getWallet(),
                this.api.getBalance(),
                this.api.getTransactions(10),
            ]);

            this.updateWalletUI(wallet, balance, transactions);
        } catch (error) {
            console.error('Failed to load wallet:', error);
        }
    }

    updateWalletUI(wallet, balance, transactions) {
        const content = document.querySelector('#wallet .window-content');
        if (!content) return;

        const usdValue = balance.balance * 15; // Mock conversion rate

        content.innerHTML = `
            <div class="wallet-container">
                <div class="wallet-header">
                    <h2>💰 RoadCoin Wallet</h2>
                </div>

                <div class="wallet-balance">
                    <div class="balance-amount">${balance.balance.toFixed(8)} RC</div>
                    <div class="balance-usd">≈ $${usdValue.toFixed(2)} USD</div>
                </div>

                <div class="wallet-address">
                    <label>Your Address:</label>
                    <div class="address-field">
                        <input type="text" readonly value="${wallet.address}"
                               onclick="this.select()" style="width: 100%; font-size: 9px;" />
                    </div>
                </div>

                <div class="wallet-transactions">
                    <h3>Recent Transactions</h3>
                    <div class="transactions-list">
                        ${transactions.length > 0 ? transactions.map(tx => {
                            const isReceived = tx.to_address === wallet.address;
                            const sign = isReceived ? '+' : '-';
                            const color = isReceived ? '#2ecc40' : '#ff4136';
                            return `
                                <div class="transaction-item">
                                    <div class="tx-type" style="color: ${color};">${sign}${tx.amount.toFixed(4)} RC</div>
                                    <div class="tx-hash">${tx.hash.substring(0, 12)}...</div>
                                    <div class="tx-time">${this.formatTime(tx.created_at)}</div>
                                </div>
                            `;
                        }).join('') : '<div class="text-muted">No transactions yet</div>'}
                    </div>
                </div>
            </div>
        `;
    }

    // ===== DEVICES (RASPBERRY PI) =====

    async loadDevices() {
        try {
            const [devices, stats] = await Promise.all([
                this.api.getDevices(),
                this.api.getDeviceStats(),
            ]);

            this.updateDevicesUI(devices, stats);
        } catch (error) {
            console.error('Failed to load devices:', error);
            // Show stub UI if no devices yet
            this.updateDevicesUI([], {
                total_devices: 0,
                online_devices: 0,
                offline_devices: 0,
                total_cpu_usage: 0,
                total_ram_usage: 0,
                average_temperature: 0,
            });
        }
    }

    updateDevicesUI(devices, stats) {
        const content = document.querySelector('#raspberry-pi .window-content');
        if (!content) return;

        content.innerHTML = `
            <div class="devices-container">
                <div class="devices-header">
                    <h2>🥧 Device Manager</h2>
                    <div class="devices-stats">
                        <span class="text-success">${stats.online_devices} online</span> /
                        <span class="text-muted">${stats.total_devices} total</span>
                    </div>
                </div>

                <div class="devices-list">
                    ${devices.length > 0 ? devices.map(device => {
                        const statusColor = device.is_online ? '#2ecc40' : '#aaa';
                        const statusText = device.is_online ? '🟢 Online' : '🔴 Offline';
                        return `
                            <div class="device-card">
                                <div class="device-name">
                                    <strong>${device.name}</strong>
                                    <span class="device-type">${device.device_type}</span>
                                </div>
                                <div class="device-status" style="color: ${statusColor};">
                                    ${statusText}
                                </div>
                                ${device.is_online ? `
                                    <div class="device-metrics">
                                        <div class="metric">CPU: ${device.cpu_usage_percent?.toFixed(1) || 0}%</div>
                                        <div class="metric">RAM: ${device.ram_usage_percent?.toFixed(1) || 0}%</div>
                                        <div class="metric">Temp: ${device.temperature_celsius?.toFixed(1) || 0}°C</div>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('') : `
                        <div class="no-devices">
                            <p>No devices registered yet.</p>
                            <p class="text-muted">Deploy a device agent to see your Raspberry Pi, Jetson, and other IoT devices here.</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    // ===== EMAIL =====

    async loadEmailInbox() {
        try {
            const emails = await this.api.getEmails('inbox', 20);
            this.updateEmailUI(emails);
        } catch (error) {
            console.error('Failed to load emails:', error);
        }
    }

    updateEmailUI(emails) {
        const emailList = document.querySelector('#roadmail .email-list');
        if (!emailList) return;

        if (emails.length === 0) {
            emailList.innerHTML = '<div class="text-muted" style="padding: 10px;">No emails yet</div>';
            return;
        }

        emailList.innerHTML = emails.map(email => `
            <div class="email-item ${email.is_read ? '' : 'unread'}" onclick="window.BlackRoadApps.openEmail(${email.id})">
                <div class="email-from">${email.sender || 'Unknown'}</div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-date">${this.formatTime(email.created_at)}</div>
            </div>
        `).join('');
    }

    openEmail(emailId) {
        console.log('Open email:', emailId);
        // TODO: Show email detail
    }

    // ===== SOCIAL FEED =====

    async loadSocialFeed() {
        try {
            const feed = await this.api.getSocialFeed(20);
            this.updateSocialUI(feed);
        } catch (error) {
            console.error('Failed to load social feed:', error);
        }
    }

    updateSocialUI(posts) {
        const feedContainer = document.querySelector('#blackroad-social .social-feed');
        if (!feedContainer) return;

        if (posts.length === 0) {
            feedContainer.innerHTML = '<div class="text-muted">No posts yet. Be the first to post!</div>';
            return;
        }

        feedContainer.innerHTML = posts.map(post => `
            <div class="post-card">
                <div class="post-author">
                    <strong>${post.author?.username || 'Anonymous'}</strong>
                    <span class="text-muted">${this.formatTime(post.created_at)}</span>
                </div>
                <div class="post-content">${post.content}</div>
                <div class="post-actions">
                    <button class="btn-link" onclick="window.BlackRoadApps.likePost(${post.id})">
                        ❤️ ${post.likes_count || 0}
                    </button>
                    <button class="btn-link">💬 ${post.comments_count || 0}</button>
                </div>
            </div>
        `).join('');
    }

    async likePost(postId) {
        try {
            await this.api.likePost(postId);
            await this.loadSocialFeed();
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    }

    // ===== VIDEOS =====

    async loadVideos() {
        try {
            const videos = await this.api.getVideos(20);
            this.updateVideosUI(videos);
        } catch (error) {
            console.error('Failed to load videos:', error);
        }
    }

    updateVideosUI(videos) {
        const videoGrid = document.querySelector('#blackstream .video-grid');
        if (!videoGrid) return;

        if (videos.length === 0) {
            videoGrid.innerHTML = '<div class="text-muted">No videos available</div>';
            return;
        }

        videoGrid.innerHTML = videos.map(video => `
            <div class="video-card" onclick="window.BlackRoadApps.playVideo(${video.id})">
                <div class="video-thumbnail">📹</div>
                <div class="video-title">${video.title}</div>
                <div class="video-stats">
                    <span>👁️ ${video.views || 0}</span>
                    <span>❤️ ${video.likes || 0}</span>
                </div>
            </div>
        `).join('');
    }

    playVideo(videoId) {
        console.log('Play video:', videoId);
        // TODO: Open video player
    }

    // ===== AI CHAT =====

    async loadAIChat() {
        const content = document.querySelector('#ai-chat .window-content');
        if (!content) return;

        content.innerHTML = `
            <div class="ai-chat-container">
                <div class="chat-messages" id="ai-chat-messages">
                    <div class="text-muted">AI Assistant ready! How can I help you?</div>
                </div>
                <div class="chat-input">
                    <input type="text" id="ai-chat-input" placeholder="Type your message..." />
                    <button class="btn btn-primary" onclick="window.BlackRoadApps.sendAIMessage()">Send</button>
                </div>
            </div>
        `;
    }

    async sendAIMessage() {
        const input = document.getElementById('ai-chat-input');
        const message = input.value.trim();
        if (!message) return;

        console.log('Send AI message:', message);
        // TODO: Implement AI chat
        input.value = '';
    }

    // ===== UTILITY FUNCTIONS =====

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;

        return date.toLocaleDateString();
    }
}

// Create singleton instance
const blackRoadApps = new BlackRoadApps();
window.BlackRoadApps = blackRoadApps;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        blackRoadApps.initialize();
    });
} else {
    blackRoadApps.initialize();
}
