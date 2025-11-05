// ============================================
// TUTORIALS PAGE JAVASCRIPT - CodeAssist AI
// ============================================

class TutorialsPage {
    constructor() {
        this.currentCategory = 'all';
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.filterTutorials('all');
        console.log('📚 Tutorials Page - Initialized');
    }

    attachEventListeners() {
        // Category filter buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterTutorials(category);

                // Update active state
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Tutorial cards click
        document.querySelectorAll('.tutorial-card').forEach(card => {
            const startBtn = card.querySelector('.btn-primary');
            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    const title = card.querySelector('h3').textContent;
                    this.startTutorial(title);
                });
            }
        });

        // Learning path buttons
        document.querySelectorAll('.path-card .btn-primary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pathCard = e.target.closest('.path-card');
                const pathName = pathCard.querySelector('h3').textContent;
                this.startLearningPath(pathName);
            });
        });
    }

    filterTutorials(category) {
        this.currentCategory = category;
        const cards = document.querySelectorAll('.tutorial-card');

        cards.forEach(card => {
            const cardCategory = card.dataset.category;

            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });

        // Update tutorial count
        const visibleCount = Array.from(cards).filter(card =>
            card.style.display !== 'none'
        ).length;

        console.log(`Showing ${visibleCount} tutorials in category: ${category}`);
    }

    startTutorial(title) {
        // Simulate starting a tutorial
        showNotification(`Starting tutorial: ${title}`, 'info');

        // Store progress
        const progress = this.loadProgress();
        if (!progress.startedTutorials) {
            progress.startedTutorials = [];
        }

        if (!progress.startedTutorials.includes(title)) {
            progress.startedTutorials.push(title);
            this.saveProgress(progress);
        }

        // In production, navigate to tutorial page
        setTimeout(() => {
            showNotification('Loading tutorial content...', 'success');
        }, 1000);
    }

    startLearningPath(pathName) {
        showNotification(`Starting ${pathName}!`, 'success');

        const progress = this.loadProgress();
        progress.currentPath = pathName;
        progress.pathStartedDate = new Date().toISOString();
        this.saveProgress(progress);

        console.log(`Learning path started: ${pathName}`);
    }

    loadProgress() {
        const saved = localStorage.getItem('tutorial_progress');
        return saved ? JSON.parse(saved) : {};
    }

    saveProgress(progress) {
        localStorage.setItem('tutorial_progress', JSON.stringify(progress));
    }
}

// Initialize tutorials page
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.tutorials-section')) {
        window.tutorialsPage = new TutorialsPage();
    }
});
