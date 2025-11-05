// ============================================
// ROADMAP PAGE JAVASCRIPT - CodeAssist AI
// ============================================

class RoadmapPage {
    constructor() {
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.filterFeatures('all');
        console.log('🗺️ Roadmap Page - Initialized');
    }

    attachEventListeners() {
        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const status = e.currentTarget.dataset.status;
                this.filterFeatures(status);

                // Update active state
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Vote buttons
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleVote(btn);
            });
        });

        // Feature request button
        const requestBtn = document.querySelector('.feature-request-card .btn-primary');
        if (requestBtn) {
            requestBtn.addEventListener('click', () => this.openFeatureRequestModal());
        }

        // Subscribe form
        const subscribeForm = document.querySelector('.roadmap-subscribe .subscribe-form');
        if (subscribeForm) {
            const submitBtn = subscribeForm.querySelector('.btn-primary');
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSubscribe();
            });
        }
    }

    filterFeatures(status) {
        this.currentFilter = status;
        const quarters = document.querySelectorAll('.roadmap-quarter');

        quarters.forEach(quarter => {
            const quarterStatus = quarter.dataset.status;

            if (status === 'all' || quarterStatus === status) {
                quarter.style.display = 'block';
                quarter.style.animation = 'fadeIn 0.4s ease';
            } else {
                quarter.style.display = 'none';
            }
        });

        console.log(`Filtered roadmap by: ${status}`);
    }

    handleVote(button) {
        // Check if already voted
        const featureId = button.closest('.feature-item').dataset.id || Date.now();
        const voted = localStorage.getItem(`voted_${featureId}`);

        if (voted) {
            showNotification('You have already voted for this feature', 'info');
            return;
        }

        // Increment vote count
        const voteSpan = button.querySelector('span');
        const currentVotes = parseInt(voteSpan.textContent);
        voteSpan.textContent = `${currentVotes + 1} votes`;

        // Mark as voted
        button.classList.add('voted');
        button.disabled = true;
        localStorage.setItem(`voted_${featureId}`, 'true');

        showNotification('Thanks for your vote! 🎉', 'success');
    }

    openFeatureRequestModal() {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'featureRequestModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Submit Feature Request</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="featureRequestForm">
                        <div class="form-group">
                            <label>Feature Title*</label>
                            <input type="text" required placeholder="Brief title for your feature">
                        </div>
                        <div class="form-group">
                            <label>Description*</label>
                            <textarea required rows="5" placeholder="Describe your feature idea in detail"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <select>
                                <option>AI/ML</option>
                                <option>Editor</option>
                                <option>Collaboration</option>
                                <option>Integration</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Priority</label>
                            <select>
                                <option>Nice to have</option>
                                <option>Would improve workflow</option>
                                <option>Critical for my work</option>
                            </select>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                            <button type="submit" class="btn-primary">Submit Request</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle form submit
        const form = modal.querySelector('#featureRequestForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Feature request submitted! 🚀', 'success');
            modal.remove();
        });
    }

    handleSubscribe() {
        const input = document.querySelector('.roadmap-subscribe input[type="email"]');
        const email = input.value.trim();

        if (!email || !email.includes('@')) {
            showNotification('Please enter a valid email', 'error');
            return;
        }

        // Simulate subscription
        showNotification('Successfully subscribed to roadmap updates! 📬', 'success');
        input.value = '';
    }
}

// Initialize roadmap page
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.roadmap-section')) {
        window.roadmapPage = new RoadmapPage();
    }
});
