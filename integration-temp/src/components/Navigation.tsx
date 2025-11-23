// Navigation Component - Sidebar Menu
import React from 'react';
import {
  Users,
  Calendar,
  Tooth,
  FileText,
  DollarSign,
  Flask,
  Package,
  TrendingDown,
  BarChart3,
  Menu,
  X
} from 'lucide-react';

interface NavigationProps {
  currentModule: string;
  onModuleChange: (module: string) => void;
  userRole: 'doctor' | 'assistant';
  userName: string;
}

export default function Navigation({ 
  currentModule, 
  onModuleChange, 
  userRole, 
  userName 
}: NavigationProps) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, color: '#3b82f6' },
    { id: 'patients', name: 'Patients', icon: Users, color: '#8b5cf6' },
    { id: 'appointments', name: 'Appointments', icon: Calendar, color: '#06b6d4' },
    { id: 'treatments', name: 'Treatments', icon: Tooth, color: '#10b981' },
    { id: 'prescriptions', name: 'Prescriptions', icon: FileText, color: '#f59e0b' },
    { id: 'billing', name: 'Billing', icon: DollarSign, color: '#ef4444' },
    { id: 'lab', name: 'Lab Work', icon: Flask, color: '#ec4899' },
    { id: 'inventory', name: 'Inventory', icon: Package, color: '#14b8a6' },
    { id: 'expenses', name: 'Expenses', icon: TrendingDown, color: '#f97316' }
  ];

  const handleModuleClick = (moduleId: string) => {
    onModuleChange(moduleId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <nav className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="clinic-logo">
            <Tooth size={32} color="#ff6b35" />
          </div>
          <h2 className="clinic-name">Abdullah Dental Care</h2>
          <p className="clinic-location">Hayatabad, Peshawar</p>
        </div>

        {/* User Info */}
        <div className="user-info">
          <div className="user-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <div className="user-name">{userName}</div>
            <div className="user-role">
              {userRole === 'doctor' ? '👨‍⚕️ Doctor' : '👔 Assistant'}
            </div>
          </div>
        </div>

        {/* Module Navigation */}
        <div className="nav-modules">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = currentModule === module.id;
            
            return (
              <button
                key={module.id}
                className={`nav-module-item ${isActive ? 'active' : ''}`}
                onClick={() => handleModuleClick(module.id)}
                style={{
                  '--module-color': module.color
                } as React.CSSProperties}
              >
                <Icon size={20} />
                <span>{module.name}</span>
                {isActive && <div className="active-indicator" />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="version-info">v2.0.0</div>
          <div className="copyright">© 2025 Abdullah Dental Care</div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
