// ============================================
// EDITOR JAVASCRIPT - CodeAssist AI
// ============================================

let editor;
let currentLanguage = 'javascript';
let aiSuggestionTimeout;
let suggestionHistory = [];

// Initialize CodeMirror Editor
document.addEventListener('DOMContentLoaded', () => {
    const editorElement = document.getElementById('codeEditor');

    if (editorElement && typeof CodeMirror !== 'undefined') {
        editor = CodeMirror.fromTextArea(editorElement, {
            mode: 'javascript',
            theme: 'dracula',
            lineNumbers: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            indentUnit: 2,
            tabSize: 2,
            lineWrapping: true,
            extraKeys: {
                'Ctrl-Space': 'autocomplete',
                'Tab': (cm) => {
                    // Accept AI suggestion with Tab
                    const suggestionPopup = document.getElementById('aiSuggestion');
                    if (suggestionPopup.classList.contains('active')) {
                        acceptAISuggestion();
                    } else {
                        cm.replaceSelection('  ');
                    }
                },
                'Esc': (cm) => {
                    // Reject AI suggestion with Escape
                    rejectAISuggestion();
                }
            }
        });

        // Set initial value
        editor.setValue(`// Welcome to CodeAssist AI Editor
// Start typing to get real-time AI suggestions

function calculateSum(numbers) {
  // Type here and watch the AI assist you

}`);

        // Editor event listeners
        editor.on('change', handleEditorChange);
        editor.on('cursorActivity', updateCursorPosition);

        // Initialize editor features
        initializeEditorFeatures();
    }
});

// Handle editor changes
function handleEditorChange(cm, change) {
    // Clear previous timeout
    clearTimeout(aiSuggestionTimeout);

    // Get current code and cursor position
    const code = cm.getValue();
    const cursor = cm.getCursor();
    const line = cm.getLine(cursor.line);

    // Update word count
    updateWordCount(code);

    // Trigger AI suggestions after a delay
    if (change.origin === '+input') {
        aiSuggestionTimeout = setTimeout(() => {
            generateAISuggestion(code, cursor, line);
        }, 500);
    }
}

// Update cursor position display
function updateCursorPosition(cm) {
    const cursor = cm.getCursor();
    const positionElement = document.getElementById('cursorPosition');
    if (positionElement) {
        positionElement.textContent = `Ln ${cursor.line + 1}, Col ${cursor.ch + 1}`;
    }
}

// Update word count
function updateWordCount(code) {
    const wordCountElement = document.getElementById('wordCount');
    if (wordCountElement) {
        const words = code.trim().split(/s+/).filter(w => w.length > 0).length;
        wordCountElement.textContent = `${words} words`;
    }
}

// Generate AI Suggestion
function generateAISuggestion(code, cursor, currentLine) {
    // Simulate AI suggestion based on context
    const suggestions = getContextualSuggestions(currentLine, code);

    if (suggestions.length > 0) {
        const suggestion = suggestions[0];
        showAISuggestion(suggestion);
    }
}

// Get contextual suggestions based on current code
function getContextualSuggestions(line, fullCode) {
    const suggestions = [];

    // Function declaration suggestions
    if (line.includes('function') && !line.includes('{')) {
        suggestions.push({
            text: '{
  // Add function implementation
  return result;
}',
            description: 'Complete function body'
        });
    }

    // If statement suggestions
    if (line.trim().startsWith('if') && !line.includes('{')) {
        suggestions.push({
            text: '{
  // Add condition logic
}',
            description: 'Complete if statement'
        });
    }

    // Loop suggestions
    if (line.includes('for') && !line.includes('{')) {
        suggestions.push({
            text: '{
  // Loop implementation
}',
            description: 'Complete for loop'
        });
    }

    // Console.log suggestions
    if (line.includes('console.')) {
        suggestions.push({
            text: 'log()',
            description: 'Console log statement'
        });
    }

    // Array method suggestions
    if (line.includes('.map')) {
        suggestions.push({
            text: '(item => {
  return item;
})',
            description: 'Map function'
        });
    }

    // Async/await suggestions
    if (line.includes('async')) {
        suggestions.push({
            text: 'function getData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}',
            description: 'Async function with error handling'
        });
    }

    // Error handling suggestions
    if (line.includes('try') && !fullCode.includes('catch')) {
        suggestions.push({
            text: '{
  // Try block
} catch (error) {
  console.error("Error:", error);
}',
            description: 'Try-catch block'
        });
    }

    return suggestions;
}

// Show AI suggestion popup
function showAISuggestion(suggestion) {
    const popup = document.getElementById('aiSuggestion');
    const suggestionText = document.getElementById('suggestionText');

    if (popup && suggestionText) {
        suggestionText.textContent = suggestion.description || suggestion.text;
        popup.classList.add('active');

        // Store current suggestion
        window.currentSuggestion = suggestion;
    }
}

// Accept AI suggestion
function acceptAISuggestion() {
    const popup = document.getElementById('aiSuggestion');
    const suggestion = window.currentSuggestion;

    if (suggestion && editor) {
        const cursor = editor.getCursor();
        editor.replaceRange(suggestion.text, cursor);
        popup.classList.remove('active');

        // Add to history
        suggestionHistory.push({
            suggestion: suggestion,
            timestamp: new Date(),
            accepted: true
        });

        showNotification('Suggestion applied!', 'success');
    }
}

// Reject AI suggestion
function rejectAISuggestion() {
    const popup = document.getElementById('aiSuggestion');
    popup.classList.remove('active');
}

// Language selection
const languageSelect = document.getElementById('languageSelect');
if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;

        // Update editor mode
        const modeMap = {
            'javascript': 'javascript',
            'python': 'python',
            'java': 'text/x-java',
            'cpp': 'text/x-c++src',
            'html': 'htmlmixed',
            'css': 'css'
        };

        if (editor) {
            editor.setOption('mode', modeMap[currentLanguage] || 'javascript');
        }

        showNotification(`Switched to ${e.target.options[e.target.selectedIndex].text}`, 'info');
    });
}

// Editor toolbar actions
document.getElementById('saveCode')?.addEventListener('click', () => {
    const code = editor.getValue();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${getFileExtension(currentLanguage)}`;
    a.click();
    showNotification('Code saved successfully!', 'success');
});

document.getElementById('runCode')?.addEventListener('click', () => {
    const code = editor.getValue();
    runCode(code);
});

document.getElementById('shareCode')?.addEventListener('click', () => {
    const code = editor.getValue();
    // Simulate share functionality
    navigator.clipboard.writeText(code);
    showNotification('Code copied to clipboard!', 'success');
});

document.getElementById('formatCode')?.addEventListener('click', () => {
    if (editor) {
        const code = editor.getValue();
        // Basic formatting (in real app, use prettier or similar)
        const formatted = formatCode(code);
        editor.setValue(formatted);
        showNotification('Code formatted!', 'success');
    }
});

document.getElementById('aiOptimize')?.addEventListener('click', () => {
    showNotification('AI is analyzing your code...', 'info');
    setTimeout(() => {
        showNotification('Optimization suggestions added to panel', 'success');
    }, 1500);
});

document.getElementById('clearEditor')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the editor?')) {
        editor.setValue('');
        showNotification('Editor cleared', 'info');
    }
});

// Run code function
function runCode(code) {
    const outputPanel = document.querySelector('#output .output-console');
    if (!outputPanel) return;

    outputPanel.innerHTML = `
        <div class="console-line">
            <span class="console-prompt">$</span>
            <span>Running code...</span>
        </div>
    `;

    setTimeout(() => {
        try {
            // For JavaScript only (security warning: don't use eval in production!)
            if (currentLanguage === 'javascript') {
                const result = eval(code);
                outputPanel.innerHTML += `
                    <div class="console-line success">
                        <span class="console-time">[${new Date().toLocaleTimeString()}]</span>
                        <span>Execution completed successfully</span>
                    </div>
                    <div class="console-line">
                        <span>Output: ${result !== undefined ? result : 'undefined'}</span>
                    </div>
                `;
            } else {
                outputPanel.innerHTML += `
                    <div class="console-line info">
                        <span>Note: Code execution is only available for JavaScript in this demo</span>
                    </div>
                `;
            }
        } catch (error) {
            outputPanel.innerHTML += `
                <div class="console-line" style="color: var(--error-color);">
                    <span class="console-time">[${new Date().toLocaleTimeString()}]</span>
                    <span>Error: ${error.message}</span>
                </div>
            `;
        }
    }, 1000);
}

// Format code (basic implementation)
function formatCode(code) {
    // Very basic formatting - in production use prettier
    let formatted = code;
    let indentLevel = 0;
    const lines = formatted.split('
');

    formatted = lines.map(line => {
        line = line.trim();

        if (line.includes('}')) indentLevel--;
        const indent = '  '.repeat(Math.max(0, indentLevel));
        if (line.includes('{')) indentLevel++;

        return indent + line;
    }).join('
');

    return formatted;
}

// Get file extension based on language
function getFileExtension(lang) {
    const extensions = {
        'javascript': 'js',
        'python': 'py',
        'java': 'java',
        'cpp': 'cpp',
        'html': 'html',
        'css': 'css'
    };
    return extensions[lang] || 'txt';
}

// Initialize additional editor features
function initializeEditorFeatures() {
    // Button event listeners
    document.getElementById('acceptSuggestion')?.addEventListener('click', acceptAISuggestion);
    document.getElementById('rejectSuggestion')?.addEventListener('click', rejectAISuggestion);

    // Auto-save functionality
    setInterval(() => {
        if (editor) {
            const code = editor.getValue();
            localStorage.setItem('codeassist_autosave', code);
        }
    }, 30000); // Auto-save every 30 seconds

    // Load auto-saved code
    const savedCode = localStorage.getItem('codeassist_autosave');
    if (savedCode && editor) {
        // Ask user if they want to restore
        const restore = confirm('Found auto-saved code. Would you like to restore it?');
        if (restore) {
            editor.setValue(savedCode);
        }
    }
}

// Keyboard shortcuts for editor
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        document.getElementById('saveCode')?.click();
    }

    // Ctrl/Cmd + R to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        document.getElementById('runCode')?.click();
    }

    // Ctrl/Cmd + Shift + F to format
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        document.getElementById('formatCode')?.click();
    }
});

console.log('📝 Code Editor - Initialized');

// Complete the editor.js file with remaining functionality

                // Display result
                outputPanel.innerHTML += `
                    <div class="console-line success">
                        <span class="console-prompt">></span>
                        <span>Execution completed successfully</span>
                    </div>
                    <div class="console-line">
                        <span>Result: ${result !== undefined ? result : 'undefined'}</span>
                    </div>
                `;
            } catch (error) {
                outputPanel.innerHTML += `
                    <div class="console-line error">
                        <span class="console-prompt">✖</span>
                        <span>Error: ${error.message}</span>
                    </div>
                `;
            }
        } else {
            outputPanel.innerHTML += `
                <div class="console-line warning">
                    <span class="console-prompt">!</span>
                    <span>Code execution is only available for JavaScript</span>
                </div>
            `;
        }
    }, 1000);
}

// Format code function
function formatCode(code) {
    // Basic code formatting (in production, use prettier or similar)
    let formatted = code;

    // Add indentation
    let indentLevel = 0;
    const lines = formatted.split('
');
    const formattedLines = lines.map(line => {
        const trimmed = line.trim();

        // Decrease indent for closing braces
        if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        const indented = '  '.repeat(indentLevel) + trimmed;

        // Increase indent for opening braces
        if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
            indentLevel++;
        }

        return indented;
    });

    return formattedLines.join('
');
}

// Get file extension for language
function getFileExtension(language) {
    const extensions = {
        'javascript': 'js',
        'python': 'py',
        'java': 'java',
        'cpp': 'cpp',
        'html': 'html',
        'css': 'css',
        'typescript': 'ts',
        'php': 'php',
        'ruby': 'rb',
        'go': 'go'
    };
    return extensions[language] || 'txt';
}

// AI suggestion keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const popup = document.getElementById('aiSuggestion');

    if (popup && popup.classList.contains('active')) {
        // Tab or Enter to accept
        if (e.key === 'Tab' || e.key === 'Enter') {
            e.preventDefault();
            acceptAISuggestion();
        }
        // Escape to reject
        else if (e.key === 'Escape') {
            e.preventDefault();
            rejectAISuggestion();
        }
    }
});

// Auto-save functionality
let autoSaveTimeout;
if (editor) {
    editor.on('change', () => {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            const code = editor.getValue();
            localStorage.setItem('editor_autosave', code);
            console.log('Code auto-saved');
        }, 2000);
    });

    // Load auto-saved content
    const autoSaved = localStorage.getItem('editor_autosave');
    if (autoSaved) {
        const userWantsRestore = confirm('Restore previously saved work?');
        if (userWantsRestore) {
            editor.setValue(autoSaved);
        }
    }
}

console.log('✅ Editor fully loaded with all features');
