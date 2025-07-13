# Terminal Interface

A beautiful, interactive terminal interface for exploring Leo's personal data and blog content.

## Architecture

The terminal is built with a modular architecture for better maintainability and reusability:

### Core Components

- **`Window` Component** (`window.tsx`): Reusable window wrapper with resize functionality, theme controls, and header
- **`Terminal` Component** (`terminal.tsx`): Core terminal logic for command execution and content display
- **Command System** (`command-executor.ts`, `commands.ts`): Extensible command structure with categories
- **Theme System**: Consistent theming across all terminal components

### Supporting Components

- **`suggestion.tsx`**: Command suggestion display with keyboard navigation
- **`font-selector.tsx`**: Font selection dropdown
- **`theme-selector.tsx`**: Theme selection dropdown  
- **`blog-viewer.tsx`**: Modal blog post reader
- **`history.tsx`**: Command history management
- **`types.ts`**: TypeScript interfaces for terminal data

## Features

### 🎨 Beautiful Design
- **Solarized Light** theme (default) - Easy on the eyes for light mode users
- **Solarized Dark** theme - Perfect for dark mode lovers  
- **GitHub Light** theme - Clean and minimal
- **Multiple fonts**: Mono, JetBrains Mono, Fira Code, Source Code Pro

### 💻 Terminal Experience
- **Auto-suggestions** like zsh-autosuggestion - Start typing and see suggestions
- **Command history** - Use up/down arrows to navigate previous commands
- **Tab completion** - Press tab to complete suggested commands
- **Syntax highlighting** - Different colors for commands, output, and errors
- **Resizable window** - Drag the edges to resize the terminal (look for the resize indicator)

### 📝 Available Commands

#### Personal Info
- `whoami` / `who` / `me` - Display basic information about Leo
- `about` / `bio` / `info` - Show detailed bio and background  
- `skills` / `tech` / `stack` - List technical skills and expertise
- `hobbies` / `interests` / `fun` - What Leo does for fun
- `quotes` / `quote` / `wisdom` - Favorite quotes and thoughts

#### Data & Content  
- `projects` / `work` / `portfolio` / `built` - Show projects and work
- `blogs` / `posts` / `articles` / `writing` - List blog posts with views and dates
- `snippets` / `snip` / `code` - Show code snippets collection
- `activities` / `activity` / `logs` / `recent` - Recent activities (music, books, movies, commits)

#### Interactive Features
- `read <number>` - Read a blog post (e.g., `read 1` to read the first blog post)
- Blog posts open in a beautiful modal with:
  - Full content with syntax highlighting
  - Reaction buttons (like, comment, share)
  - Tags and metadata
  - Responsive design

#### Fun & Music
- `music` / `song` / `spotify` - Current music taste and recently played
- `date` / `time` / `now` - Show current date and time

#### System Commands
- `help` / `h` / `?` - Show all available commands
- `clear` / `cls` / `clean` - Clear the terminal screen
- `pwd` / `location` - Show current location

### 🎯 Smart Features

#### Auto-suggestions
- Type any part of a command to see suggestions
- Shows command description and category
- Lists aliases for each command
- Use arrow keys to navigate suggestions
- Press tab or enter to use suggestion

#### Command History
- All commands are saved to history
- Use up/down arrows to navigate
- Recent commands are remembered across sessions

#### Responsive Design
- Works on desktop, tablet, and mobile
- Terminal adjusts height based on screen size
- Font scaling for different devices

### 🔧 Customization

#### Theme Switching
Click the theme icon in the terminal header to switch between:
- Solarized Light (default)
- Solarized Dark  
- GitHub Light

#### Font Selection
Click the font icon in the terminal header to choose from:
- Mono (default)
- JetBrains Mono
- Fira Code
- Source Code Pro

### 📱 Usage Tips

1. **Start typing** - The terminal will show suggestions automatically
2. **Use aliases** - Most commands have short aliases (e.g., `h` for `help`)
3. **Explore blogs** - Use `blogs` then `read <number>` to read posts
4. **Tab completion** - Press tab to quickly complete commands
5. **Command history** - Use up/down arrows to reuse previous commands

### 🚀 Getting Started

1. Visit the home page to access the terminal
2. Type `help` to see all available commands
3. Start exploring with commands like `whoami`, `projects`, or `blogs`
4. Try reading blog posts with `blogs` then `read 1`
5. Customize the appearance with the theme and font selectors
6. Resize the terminal by dragging near the edges (look for the resize indicator in the bottom-right)

### 💡 Pro Tips

- All commands are **lowercase** for consistency
- Use **tab completion** to save time typing
- The terminal remembers your **command history**
- **Blog reading** feature provides a rich reading experience
- Terminal is fully **keyboard accessible**
- **Mobile friendly** - works great on phones and tablets
- **Resizable** - drag near the edges to adjust terminal size to your preference

Enjoy exploring Leo's world through the terminal! 🚀
