// ============================================
// SNIPPETS LIBRARY JAVASCRIPT - CodeAssist AI
// ============================================

class SnippetsLibrary {
    constructor() {
        this.snippets = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadSnippets();
        this.renderSnippets();
        this.attachEventListeners();
        console.log('📚 Snippets Library - Initialized');
    }

    // Load snippets from localStorage or use default
    loadSnippets() {
        const saved = localStorage.getItem('code_snippets');
        if (saved) {
            this.snippets = JSON.parse(saved);
        } else {
            this.snippets = this.getDefaultSnippets();
            this.saveSnippets();
        }
    }

    // Save snippets to localStorage
    saveSnippets() {
        localStorage.setItem('code_snippets', JSON.stringify(this.snippets));
    }

    // Get default snippets
    getDefaultSnippets() {
        return [
            {
                id: 1,
                title: 'Async Fetch with Error Handling',
                language: 'javascript',
                tags: ['async', 'fetch', 'api'],
                description: 'Fetch data from API with proper error handling',
                code: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}`,
                created: new Date('2025-10-20'),
                favorites: 142,
                uses: 567
            },
            {
                id: 2,
                title: 'React Custom Hook - useLocalStorage',
                language: 'react',
                tags: ['react', 'hooks', 'localstorage'],
                description: 'Custom hook for managing localStorage state',
                code: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }, [key, value]);

  return [value, setValue];
}`,
                created: new Date('2025-10-19'),
                favorites: 98,
                uses: 234
            },
            {
                id: 3,
                title: 'Python Decorator - Timer',
                language: 'python',
                tags: ['python', 'decorator', 'performance'],
                description: 'Decorator to measure function execution time',
                code: `import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(2)
    return "Done"`,
                created: new Date('2025-10-18'),
                favorites: 76,
                uses: 189
            },
            {
                id: 4,
                title: 'Express REST API Boilerplate',
                language: 'node',
                tags: ['express', 'api', 'nodejs'],
                description: 'Basic Express server with middleware',
                code: `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.post('/api/data', async (req, res) => {
  try {
    const { data } = req.body;
    // Process data
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});`,
                created: new Date('2025-10-17'),
                favorites: 134,
                uses: 421
            },
            {
                id: 5,
                title: 'CSS Grid Responsive Layout',
                language: 'css',
                tags: ['css', 'grid', 'responsive'],
                description: 'Responsive grid layout with auto-fit',
                code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.grid-item {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
}`,
                created: new Date('2025-10-16'),
                favorites: 89,
                uses: 312
            },
            {
                id: 6,
                title: 'Debounce Function',
                language: 'javascript',
                tags: ['javascript', 'performance', 'utility'],
                description: 'Debounce function for performance optimization',
                code: `function debounce(func, delay = 300) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage example
const handleSearch = debounce((query) => {
  console.log('Searching for:', query);
  // Perform search
}, 500);

searchInput.addEventListener('input', (e) => {
  handleSearch(e.target.value);
});`,
                created: new Date('2025-10-15'),
                favorites: 156,
                uses: 678
            }
        ];
    }

    // Render all snippets
    renderSnippets() {
        const grid = document.getElementById('snippetsGrid');
        if (!grid) return;

        const filtered = this.getFilteredSnippets();

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="no-snippets">
                    <i class="fas fa-inbox fa-3x"></i>
                    <h3>No snippets found</h3>
                    <p>Try adjusting your filters or add a new snippet</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(snippet => this.createSnippetCard(snippet)).join('');
        this.attachSnippetCardListeners();
    }

    // Create snippet card HTML
    createSnippetCard(snippet) {
        return `
            <div class="snippet-card" data-id="${snippet.id}">
                <div class="snippet-header">
                    <span class="snippet-language ${snippet.language}">${snippet.language}</span>
                    <div class="snippet-actions">
                        <button class="snippet-action-btn favorite-btn ${snippet.isFavorite ? 'active' : ''}"
                                data-id="${snippet.id}" title="Favorite">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="snippet-action-btn" onclick="snippetLib.copySnippet(${snippet.id})" title="Copy">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="snippet-action-btn" onclick="snippetLib.editSnippet(${snippet.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="snippet-action-btn delete-btn" onclick="snippetLib.deleteSnippet(${snippet.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <h3>${snippet.title}</h3>
                <p class="snippet-description">${snippet.description}</p>
                <div class="snippet-tags">
                    ${snippet.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
                <div class="snippet-code">
                    <pre><code>${this.escapeHtml(snippet.code)}</code></pre>
                </div>
                <div class="snippet-footer">
                    <span><i class="fas fa-heart"></i> ${snippet.favorites}</span>
                    <span><i class="fas fa-code"></i> ${snippet.uses} uses</span>
                    <span><i class="fas fa-calendar"></i> ${this.formatDate(snippet.created)}</span>
                </div>
            </div>
        `;
    }

    // Get filtered snippets
    getFilteredSnippets() {
        let filtered = this.snippets;

        // Apply language filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(s => s.language === this.currentFilter);
        }

        // Apply search filter
        const searchTerm = document.getElementById('snippetSearch')?.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(s =>
                s.title.toLowerCase().includes(searchTerm) ||
                s.description.toLowerCase().includes(searchTerm) ||
                s.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        return filtered;
    }

    // Attach event listeners
    attachEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderSnippets();
            });
        });

        // Search
        const searchInput = document.getElementById('snippetSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.renderSnippets());
        }

        // Add snippet button
        const addBtn = document.getElementById('addSnippetBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openModal());
        }

        // Modal
        document.getElementById('closeModal')?.addEventListener('click', () => this.closeModal());
        document.getElementById('cancelSnippet')?.addEventListener('click', () => this.closeModal());

        // Form submit
        const form = document.getElementById('snippetForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveNewSnippet();
            });
        }
    }

    // Attach snippet card listeners
    attachSnippetCardListeners() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.toggleFavorite(id);
            });
        });
    }

    // Open modal
    openModal() {
        document.getElementById('snippetModal').classList.add('active');
        document.getElementById('snippetForm').reset();
    }

    // Close modal
    closeModal() {
        document.getElementById('snippetModal').classList.remove('active');
    }

    // Save new snippet
    saveNewSnippet() {
        const title = document.getElementById('snippetTitle').value;
        const language = document.getElementById('snippetLanguage').value;
        const tags = document.getElementById('snippetTags').value.split(',').map(t => t.trim()).filter(t => t);
        const description = document.getElementById('snippetDescription').value;
        const code = document.getElementById('snippetCode').value;

        const snippet = {
            id: Date.now(),
            title,
            language,
            tags,
            description,
            code,
            created: new Date(),
            favorites: 0,
            uses: 0,
            isFavorite: false
        };

        this.snippets.unshift(snippet);
        this.saveSnippets();
        this.renderSnippets();
        this.closeModal();

        showNotification('Snippet saved successfully!', 'success');
    }

    // Copy snippet
    async copySnippet(id) {
        const snippet = this.snippets.find(s => s.id === id);
        if (!snippet) return;

        try {
            await navigator.clipboard.writeText(snippet.code);

            // Update uses count
            snippet.uses++;
            this.saveSnippets();
            this.renderSnippets();

            showNotification('Code copied to clipboard!', 'success');
        } catch (err) {
            showNotification('Failed to copy code', 'error');
        }
    }

    // Edit snippet
    editSnippet(id) {
        const snippet = this.snippets.find(s => s.id === id);
        if (!snippet) return;

        document.getElementById('snippetTitle').value = snippet.title;
        document.getElementById('snippetLanguage').value = snippet.language;
        document.getElementById('snippetTags').value = snippet.tags.join(', ');
        document.getElementById('snippetDescription').value = snippet.description;
        document.getElementById('snippetCode').value = snippet.code;

        this.openModal();

        // Remove old snippet on save
        const form = document.getElementById('snippetForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            this.snippets = this.snippets.filter(s => s.id !== id);
            this.saveNewSnippet();
            form.onsubmit = null; // Reset handler
        };
    }

    // Delete snippet
    deleteSnippet(id) {
        if (!confirm('Are you sure you want to delete this snippet?')) return;

        this.snippets = this.snippets.filter(s => s.id !== id);
        this.saveSnippets();
        this.renderSnippets();
        showNotification('Snippet deleted', 'info');
    }

    // Toggle favorite
    toggleFavorite(id) {
        const snippet = this.snippets.find(s => s.id === id);
        if (!snippet) return;

        snippet.isFavorite = !snippet.isFavorite;
        if (snippet.isFavorite) {
            snippet.favorites++;
        } else {
            snippet.favorites--;
        }

        this.saveSnippets();
        this.renderSnippets();
    }

    // Utility functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(date) {
        const d = new Date(date);
        const now = new Date();
        const diff = Math.floor((now - d) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

        return d.toLocaleDateString();
    }
}

// Initialize snippets library
let snippetLib;
document.addEventListener('DOMContentLoaded', () => {
    snippetLib = new SnippetsLibrary();
});
