# ContactPro X - Smart Contact Management System

A lightweight, offline-ready contact management system built with vanilla HTML, CSS, and JavaScript. Features include import/export (CSV/JSON), QR vCard generation, undo/redo capabilities, automatic backups, and a beautiful dark/light theme.

## Features

- 📇 **Smart Search & Filters** - Search by name, email, phone, company, tags, and groups
- 📌 **Inline Editing** - Edit contacts directly in the table
- 🏷️ **Tags & Groups** - Organize contacts with custom tags and groups
- ⭐ **Favorites** - Mark important contacts as favorites
- 📤 **Bulk Operations** - Select, delete, group assign, and export multiple contacts
- 💾 **Import/Export** - CSV, JSON, vCard (VCF), and PDF export
- 🔄 **Undo/Redo** - Undo and redo your last 10 actions
- 📹 **Auto Backups** - Keep up to 5 rolling backups
- 🌙 **Dark/Light Theme** - Beautiful UI with theme persistence
- 📱 **PWA Ready** - Installable on desktop and mobile
- 🔌 **Offline Mode** - Service Worker for offline functionality
- 🎯 **Frontend-Only** - No backend required, runs entirely in your browser

## Quick Start

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No server required!

## Project Structure

```
ContactProX/
├── index.html           # Main application UI
├── style.css            # Complete responsive styling
├── script.js            # Core app logic with CRUD operations
├── manifest.json        # PWA manifest for installation
├── sw.js                # Service Worker for offline mode
├── assets/
│   ├── logo.svg         # Project logo
│   ├── favicon.png      # Browser favicon
│   └── icons/
│       ├── icon-192.png # PWA icon (192x192)
│       └── icon-512.png # PWA icon (512x512)
├── docs/
│   ├── README.md        # This file
│   ├── CHANGELOG.md     # Version history
│   ├── LICENSE          # MIT License
│   └── CONTRIBUTING.md  # Contribution guidelines
└── backups/             # Auto-generated backup JSONs
```

## Usage

### Adding a Contact
Click the "New" button to open the add contact form. Fill in the details and click "Save".

### Editing a Contact
Double-click any field in the table to edit inline, or click "Edit" to open the full form.

### Bulk Operations
Select multiple contacts using the checkboxes, then:
- Delete selected contacts
- Assign to a group
- Export as CSV, JSON, VCF, or PDF

### Import Contacts
Use the "Import CSV" or "Import JSON" buttons to add contacts from files. Duplicates are automatically merged by email.

### Export Contacts
- **CSV** - Open in Excel or Google Sheets
- **JSON** - For backup or data transfer
- **vCard (VCF)** - Add to Apple Contacts, Outlook, Google Contacts
- **PDF** - Professional contact list printout

### Theme Toggle
Click the theme toggle button in the top bar to switch between dark and light modes.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - Free to use and modify

## Contributing

See `CONTRIBUTING.md` for guidelines on how to contribute.

---

**Version:** 1.0.0 | **Last Updated:** November 2025
