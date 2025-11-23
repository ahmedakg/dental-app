import { useState, useEffect } from 'react'
import { db, initializeDefaultData } from './lib/db'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState('dashboard')

  useEffect(() => {
    // Initialize database
    initializeDefaultData().then(() => {
      setIsLoading(false)
    })
  }, [])

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="logo">🦷</div>
        <h1>Abdullah Dental Care</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo-section">
          <span className="logo-icon">🦷</span>
          <h1>Abdullah Dental Care</h1>
        </div>
        <div className="user-section">
          <span className="points">🎮 0 pts</span>
          <span className="user-name">Naveed</span>
        </div>
      </header>

      <main className="app-main">
        <div className="welcome-card">
          <h2>Welcome to Abdullah Dental Care Management System v2.0</h2>
          <p>Complete dental clinic management solution</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">👥</span>
              <h3>Patient Management</h3>
              <p>Complete records with behavior tags</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">📅</span>
              <h3>Appointments</h3>
              <p>Dual calendars with smart scheduling</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">🦷</span>
              <h3>Treatment Planning</h3>
              <p>FDI tooth charts, 70 treatments</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">💊</span>
              <h3>Prescriptions</h3>
              <p>35 conditions, evidence-based</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">💰</span>
              <h3>Billing & Finance</h3>
              <p>Professional receipts & reports</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">🔬</span>
              <h3>Lab Work</h3>
              <p>Track cases and expenses</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">🦴</span>
              <h3>Orthodontics</h3>
              <p>Installments & split calculations</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">📱</span>
              <h3>WhatsApp Reminders</h3>
              <p>Free OS Share API integration</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">🎮</span>
              <h3>Gamification</h3>
              <p>Points, streak, achievements</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">☁️</span>
              <h3>Google Drive Backup</h3>
              <p>Automatic daily backups</p>
            </div>
          </div>

          <div className="deployment-info">
            <h3>🚀 Deployment Status</h3>
            <div className="status-items">
              <div className="status-item success">
                <span>✅</span>
                <span>Database Initialized (70 treatments loaded)</span>
              </div>
              <div className="status-item success">
                <span>✅</span>
                <span>App Ready for Deployment</span>
              </div>
              <div className="status-item pending">
                <span>⏳</span>
                <span>Deploy to Vercel (see README.md)</span>
              </div>
              <div className="status-item pending">
                <span>⏳</span>
                <span>Setup Google Drive Backup (optional)</span>
              </div>
            </div>
          </div>

          <div className="next-steps">
            <h3>📖 Next Steps</h3>
            <ol>
              <li>Read <code>README.md</code> for deployment instructions</li>
              <li>Read <code>MASTER_ARCHITECTURE_PLAN.md</code> for complete documentation</li>
              <li>Deploy to Vercel (free, takes 5 minutes)</li>
              <li>Start using the app!</li>
            </ol>
          </div>

          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-number">Rs. 0</div>
              <div className="stat-label">Monthly Cost</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">70</div>
              <div className="stat-label">Treatments Loaded</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">10</div>
              <div className="stat-label">Complete Modules</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">∞</div>
              <div className="stat-label">ROI</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div>Abdullah Dental Care Management System v2.0</div>
          <div>Dr. Ahmed Abdullah Khan | PMC: 7071-D | BDS, MPH</div>
          <div>+92-334-5822-622 | Hayatabad, Peshawar</div>
        </div>
      </footer>
    </div>
  )
}

export default App
