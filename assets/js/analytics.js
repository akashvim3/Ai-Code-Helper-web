// ============================================
// ANALYTICS JAVASCRIPT - CodeAssist AI
// ============================================

class Analytics {
    constructor() {
        this.charts = {};
        this.dateRange = 7; // days
        this.init();
    }

    init() {
        this.initCharts();
        this.attachEventListeners();
        console.log('📈 Analytics - Initialized');
    }

    // Initialize all charts
    initCharts() {
        this.createSuggestionsChart();
        this.createLanguageChart();
        this.createActivityChart();
        this.createErrorsChart();
    }

    // Create suggestions over time chart
    createSuggestionsChart() {
        const ctx = document.getElementById('suggestionsChart');
        if (!ctx) return;

        const data = this.generateTimeSeriesData(7);

        this.charts.suggestions = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'AI Suggestions',
                    data: data.values,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Create language distribution chart
    createLanguageChart() {
        const ctx = document.getElementById('languageChart');
        if (!ctx) return;

        this.charts.language = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['JavaScript', 'Python', 'React', 'Node.js', 'CSS'],
                datasets: [{
                    data: [45, 30, 15, 7, 3],
                    backgroundColor: [
                        '#f7df1e',
                        '#3776ab',
                        '#61dafb',
                        '#68a063',
                        '#264de4'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Create coding activity chart
    createActivityChart() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;

        const hours = [];
        const activity = [];

        for (let i = 0; i < 24; i++) {
            hours.push(`${i}:00`);
            activity.push(Math.floor(Math.random() * 100) + 20);
        }

        this.charts.activity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: hours,
                datasets: [{
                    label: 'Activity',
                    data: activity,
                    backgroundColor: '#8b5cf6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Create errors chart
    createErrorsChart() {
        const ctx = document.getElementById('errorsChart');
        if (!ctx) return;

        const data = this.generateTimeSeriesData(7, 50);

        this.charts.errors = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Errors Detected',
                        data: data.values,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Errors Fixed',
                        data: data.values.map(v => v - Math.floor(Math.random() * 10)),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Generate time series data
    generateTimeSeriesData(days, max = 200) {
        const labels = [];
        const values = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            values.push(Math.floor(Math.random() * max) + 50);
        }

        return { labels, values };
    }

    // Attach event listeners
    attachEventListeners() {
        document.querySelectorAll('.date-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const days = parseInt(btn.textContent);
                if (!isNaN(days)) {
                    this.updateDateRange(days);
                }
            });
        });
    }

    // Update date range
    updateDateRange(days) {
        this.dateRange = days;

        // Update time series charts
        const newData = this.generateTimeSeriesData(days);

        if (this.charts.suggestions) {
            this.charts.suggestions.data.labels = newData.labels;
            this.charts.suggestions.data.datasets[0].data = newData.values;
            this.charts.suggestions.update();
        }

        if (this.charts.errors) {
            this.charts.errors.data.labels = newData.labels;
            this.charts.errors.data.datasets[0].data = newData.values;
            this.charts.errors.data.datasets[1].data = newData.values.map(v => v - Math.floor(Math.random() * 10));
            this.charts.errors.update();
        }

        showNotification(`Updated to ${days} day view`, 'info');
    }
}

// Initialize analytics
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('suggestionsChart')) {
        window.analytics = new Analytics();
    }
});
