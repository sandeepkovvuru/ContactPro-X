// ContactPro X - Smart Contact Management System
// Complete JavaScript Application Logic

class ContactManager {
  constructor() {
    this.contacts = this.loadContacts();
    this.history = [];
    this.historyIndex = -1;
    this.filters = { search: '', tag: '', recent: false };
    this.sortBy = 'name';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.render();
    this.loadTheme();
  }

  setupEventListeners() {
    document.getElementById('add-contact-btn').addEventListener('click', () => this.openAddDialog());
    document.getElementById('import-btn').addEventListener('click', () => this.importData());
    document.getElementById('export-btn').addEventListener('click', () => this.exportData());
    document.getElementById('backup-btn').addEventListener('click', () => this.backupData());
    document.getElementById('restore-btn').addEventListener('click', () => this.restoreData());
    document.getElementById('undo-btn').addEventListener('click', () => this.undo());
    document.getElementById('redo-btn').addEventListener('click', () => this.redo());
    document.getElementById('bulk-delete-btn').addEventListener('click', () => this.bulkDelete());
    document.getElementById('select-all-chk').addEventListener('change', (e) => this.toggleSelectAll(e));
    document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
    document.getElementById('search-input').addEventListener('input', (e) => this.filterContacts('search', e.target.value));
    document.getElementById('tag-filter').addEventListener('change', (e) => this.filterContacts('tag', e.target.value));
    document.getElementById('recent-filter').addEventListener('change', (e) => this.filterContacts('recent', e.target.checked));
    document.getElementById('sort-select').addEventListener('change', (e) => this.setSortBy(e.target.value));
    document.getElementById('dialog-close').addEventListener('click', () => this.closeDialog());
    document.getElementById('save-contact-btn').addEventListener('click', () => this.saveContact());
  }

  loadContacts() {
    const stored = localStorage.getItem('contacts');
    return stored ? JSON.parse(stored) : [];
  }

  saveContactsToStorage() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  saveState() {
    this.historyIndex++;
    this.history = this.history.slice(0, this.historyIndex);
    this.history.push(JSON.stringify(this.contacts));
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.contacts = JSON.parse(this.history[this.historyIndex]);
      this.saveContactsToStorage();
      this.render();
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.contacts = JSON.parse(this.history[this.historyIndex]);
      this.saveContactsToStorage();
      this.render();
    }
  }

  openAddDialog() {
    this.currentEditId = null;
    document.getElementById('contact-form').reset();
    document.getElementById('dialog-title').textContent = 'Add New Contact';
    document.getElementById('dialog').classList.add('show');
  }

  closeDialog() {
    document.getElementById('dialog').classList.remove('show');
  }

  saveContact() {
    const name = document.getElementById('name-input').value.trim();
    const email = document.getElementById('email-input').value.trim();
    const phone = document.getElementById('phone-input').value.trim();
    const address = document.getElementById('address-input').value.trim();
    const tags = document.getElementById('tags-input').value.trim().split(',').map(t => t.trim()).filter(t => t);

    if (!name || !email) {
      alert('Name and Email are required!');
      return;
    }

    this.saveState();

    if (this.currentEditId) {
      const contact = this.contacts.find(c => c.id === this.currentEditId);
      if (contact) {
        contact.name = name;
        contact.email = email;
        contact.phone = phone;
        contact.address = address;
        contact.tags = tags;
        contact.updated = new Date().toISOString();
      }
    } else {
      this.contacts.push({
        id: Date.now().toString(),
        name,
        email,
        phone,
        address,
        tags,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      });
    }

    this.saveContactsToStorage();
    this.render();
    this.closeDialog();
  }

  editContact(id) {
    const contact = this.contacts.find(c => c.id === id);
    if (!contact) return;

    this.currentEditId = id;
    document.getElementById('name-input').value = contact.name;
    document.getElementById('email-input').value = contact.email;
    document.getElementById('phone-input').value = contact.phone;
    document.getElementById('address-input').value = contact.address;
    document.getElementById('tags-input').value = contact.tags.join(', ');
    document.getElementById('dialog-title').textContent = 'Edit Contact';
    document.getElementById('dialog').classList.add('show');
  }

  deleteContact(id) {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.saveState();
      this.contacts = this.contacts.filter(c => c.id !== id);
      this.saveContactsToStorage();
      this.render();
    }
  }

  toggleSelectAll(e) {
    document.querySelectorAll('.contact-checkbox').forEach(chk => chk.checked = e.target.checked);
  }

  bulkDelete() {
    const selected = Array.from(document.querySelectorAll('.contact-checkbox:checked')).map(chk => chk.dataset.id);
    if (selected.length === 0) {
      alert('No contacts selected!');
      return;
    }
    if (confirm(`Delete ${selected.length} contact(s)?`)) {
      this.saveState();
      this.contacts = this.contacts.filter(c => !selected.includes(c.id));
      this.saveContactsToStorage();
      this.render();
    }
  }

  filterContacts(type, value) {
    this.filters[type] = value;
    this.render();
  }

  setSortBy(value) {
    this.sortBy = value;
    this.render();
  }

  getFilteredContacts() {
    let filtered = this.contacts;

    if (this.filters.search) {
      const search = this.filters.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(search) || 
        c.email.toLowerCase().includes(search)
      );
    }

    if (this.filters.tag) {
      filtered = filtered.filter(c => c.tags.includes(this.filters.tag));
    }

    if (this.filters.recent) {
      const week = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(c => new Date(c.created) > week);
    }

    return filtered.sort((a, b) => {
      if (this.sortBy === 'name') return a.name.localeCompare(b.name);
      if (this.sortBy === 'recent') return new Date(b.updated) - new Date(a.updated);
      return 0;
    });
  }

  render() {
    const filtered = this.getFilteredContacts();
    const tbody = document.getElementById('contacts-tbody');
    tbody.innerHTML = '';

    filtered.forEach(contact => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input type="checkbox" class="contact-checkbox" data-id="${contact.id}"></td>
        <td><strong>${contact.name}</strong></td>
        <td>${contact.email}</td>
        <td>${contact.phone || '-'}</td>
        <td>${contact.tags.map(t => `<span class="tag">${t}</span>`).join('')}</td>
        <td>
          <button class="btn-edit" onclick="manager.editContact('${contact.id}')">Edit</button>
          <button class="btn-delete" onclick="manager.deleteContact('${contact.id}')">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    document.getElementById('contact-count').textContent = `${filtered.length} contact(s)`;
  }

  exportData() {
    const format = prompt('Export as (csv/json)?', 'csv');
    if (!format) return;

    let content, filename, type;

    if (format === 'csv') {
      const headers = ['Name', 'Email', 'Phone', 'Address', 'Tags'];
      const rows = this.contacts.map(c => [
        c.name,
        c.email,
        c.phone,
        c.address,
        c.tags.join(';')
      ]);
      content = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      filename = 'contacts.csv';
      type = 'text/csv';
    } else {
      content = JSON.stringify(this.contacts, null, 2);
      filename = 'contacts.json';
      type = 'application/json';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        try {
          this.saveState();
          if (file.name.endsWith('.json')) {
            this.contacts = JSON.parse(event.target.result);
          } else if (file.name.endsWith('.csv')) {
            const lines = event.target.result.split('\n');
            this.contacts = lines.slice(1).filter(l => l.trim()).map(line => {
              const [name, email, phone, address, tags] = line.split(',').map(cell => cell.trim().replace(/"/g, ''));
              return {
                id: Date.now().toString() + Math.random(),
                name,
                email,
                phone,
                address,
                tags: tags.split(';').filter(t => t),
                created: new Date().toISOString(),
                updated: new Date().toISOString()
              };
            });
          }
          this.saveContactsToStorage();
          this.render();
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing file: ' + error.message);
        }
      });
      reader.readAsText(file);
    });
    input.click();
  }

  backupData() {
    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      contacts: this.contacts
    };
    localStorage.setItem('contactsBackup', JSON.stringify(backup));
    alert('Backup created successfully!');
  }

  restoreData() {
    const backup = localStorage.getItem('contactsBackup');
    if (!backup) {
      alert('No backup found!');
      return;
    }
    if (confirm('Restore from backup? This will overwrite current data.')) {
      this.saveState();
      const data = JSON.parse(backup);
      this.contacts = data.contacts;
      this.saveContactsToStorage();
      this.render();
      alert('Data restored successfully!');
    }
  }

  toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.body.classList.add('dark');
    }
  }
}

let manager;

document.addEventListener('DOMContentLoaded', () => {
  manager = new ContactManager();
});
