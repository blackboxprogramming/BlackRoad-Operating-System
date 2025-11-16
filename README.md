# BlackRoad Operating System

A nostalgic Windows 95-inspired web interface showcasing the complete BlackRoad AI ecosystem.

![Black Road OS](https://img.shields.io/badge/OS-BlackRoad-008080)
![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Overview

BlackRoad OS is a fully functional web-based operating system interface that brings together AI orchestration, blockchain technology, social media, video streaming, and gaming - all wrapped in a beautiful 1995 aesthetic.

## Features

### 🤖 AI & Communication
- **RoadMail** - Email client for managing communications
- **BlackRoad Social** - Social network for the BlackRoad community
- **AI Assistant** - Interactive AI chat interface

### ⛓️ Blockchain Infrastructure
- **RoadChain Explorer** - View blocks, transactions, and network stats
- **RoadCoin Miner** - Mine RoadCoin cryptocurrency
- **Wallet** - Manage your RoadCoin assets

### 🎮 Gaming Ecosystem
- **Road City** - City-building simulation game
- **RoadCraft** - Voxel world building game
- **Road Life** - Life simulation game

### 🌐 Web & Tools
- **RoadView Browser** - Web browser for the information superhighway
- **BlackStream** - Decentralized video platform
- **Terminal** - Command-line interface
- **File Explorer** - File management system
- **GitHub Integration** - Repository management
- **Raspberry Pi Manager** - Connected device management

## Getting Started

### Quick Start

Simply open `index.html` in any modern web browser to launch BlackRoad OS.

```bash
# Clone the repository
git clone https://github.com/blackboxprogramming/BlackRoad-Operating-System.git

# Navigate to the directory
cd BlackRoad-Operating-System

# Open in your browser
open index.html
```

### GitHub Pages / GoDaddy Deployment

Only the static UI should be served from GitHub Pages or GoDaddy. The backend API and services continue to run on Railway so they remain isolated from the static hosting tier.

The default `Deploy to GitHub Pages` workflow now bundles the canonical front-end (everything under `backend/static` plus root-level assets such as `index.html`) into a temporary `dist/` directory before uploading it. This ensures that Pages/GoDaddy only receives the static bundle, while the backend code stays out of the artifact and continues to deploy independently to Railway.

To publish manually without the workflow:

1. Copy the contents of `backend/static/` and any required root assets into a temporary folder (e.g., `dist/`).
2. Upload that folder to your Pages or GoDaddy hosting destination.
3. Keep the backend running on Railway so the static UI can communicate with the live services.

## Architecture

### Single-Page Application
BlackRoad OS is built as a single-page HTML application with embedded CSS and JavaScript:
- No build process required
- No external dependencies
- Pure HTML/CSS/JavaScript
- Works offline

### Window Management
- Draggable windows
- Minimize/Maximize/Close functionality
- Z-index management for window layering
- Taskbar integration with active window tracking

### Design Philosophy
- **Nostalgic**: Windows 95-inspired UI with authentic styling
- **Complete**: Full ecosystem of interconnected applications
- **Immersive**: Desktop icons, start menu, taskbar, and system tray
- **Interactive**: Functional window management and application switching

## Technology Stack

- **HTML5** - Structure and content
- **CSS3** - Styling with Grid and Flexbox
- **Vanilla JavaScript** - Window management and interactivity
- **No frameworks** - Pure, dependency-free code

## Components

### Desktop Environment
- Grid-based icon layout
- Double-click to launch applications
- Teal background (classic Windows 95)

### Window System
- Title bars with app icons and names
- Window controls (minimize, maximize, close)
- Menu bars and toolbars
- Content areas with custom layouts

### Taskbar
- Start button with menu
- Application switcher
- System tray icons
- Live clock

### Applications
Each application has its own custom interface:
- Email client with folders and preview pane
- Social media feed with posts and interactions
- Video platform with player and recommendations
- Blockchain explorer with live network stats
- Mining dashboard with real-time metrics
- Games with pixel art graphics

## Customization

### Adding New Applications

1. **Create the window HTML structure**:
```html
<div id="my-app" class="window" style="left: 100px; top: 100px; width: 600px; height: 400px;">
    <div class="title-bar" onmousedown="dragStart(event, 'my-app')">
        <div class="title-text">
            <span>🎨</span>
            <span>My App</span>
        </div>
        <div class="title-buttons">
            <div class="title-button" onclick="minimizeWindow('my-app')">_</div>
            <div class="title-button" onclick="maximizeWindow('my-app')">□</div>
            <div class="title-button" onclick="closeWindow('my-app')">×</div>
        </div>
    </div>
    <div class="window-content">
        <!-- Your app content here -->
    </div>
</div>
```

2. **Add desktop icon**:
```html
<div class="icon" ondblclick="openWindow('my-app')">
    <div class="icon-image">🎨</div>
    <div class="icon-label">My App</div>
</div>
```

3. **Add to start menu**:
```html
<div class="start-menu-item" onclick="openWindow('my-app'); toggleStartMenu();">
    <span style="font-size: 18px;">🎨</span>
    <span>My App</span>
</div>
```

4. **Add to taskbar titles** (in JavaScript):
```javascript
const titles = {
    // ... existing titles
    'my-app': '🎨 MyApp'
};
```

## Browser Compatibility

BlackRoad OS works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Windows 95 and the nostalgic computing era
- Built with love for the BlackRoad ecosystem
- Special thanks to the AI development community

## Project Vision

BlackRoad OS represents a complete AI-powered ecosystem:
- **1000+ AI agents** working in harmony
- **Blockchain infrastructure** with RoadChain
- **Decentralized applications** for social media and video
- **Gaming experiences** that blend creativity and strategy
- **Developer tools** for building the future

## Support

For issues, questions, or contributions, please visit:
- GitHub Issues: [Report a bug](https://github.com/blackboxprogramming/BlackRoad-Operating-System/issues)
- Discussions: Share ideas and ask questions

---

**Built with 💻 by the BlackRoad community**

*Where AI meets the open road* 🛣️
# BlackRoad-Operating-System
# BlackRoad-Operating-System
