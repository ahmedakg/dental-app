// Dashboard Component - Overview and Quick Stats
import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Package
} from 'lucide-react';
import { db } from '../database/db';

interface DashboardProps {
  userRole: 'doctor' | 'assistant';
  userName: string;
}

export default function Dashboard({ userRole, userName }: DashboardProps) {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingPayments: 0,
    lowStockItems: 0,
    monthlyRevenue: 0,
    completedToday: 0
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get total patients
      const totalPatients = await db.patients.count();

      // Get today's appointments
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = await db.appointments
        .where('date')
        .equals(today)
        .count();

      // Get completed appointments today
      const completedToday = await db.appointments
        .where('date')
        .equals(today)
        .and(apt => apt.status === 'completed')
        .count();

      // Get unpaid invoices
      const unpaidInvoices = await db.invoices
        .where('status')
        .notEqual('paid')
        .toArray();
      
      const pendingPayments = unpaidInvoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);

      // Get low stock items
      const lowStockItems = await db.inventory
        .where('currentStock')
        .belowOrEqual(10)
        .count();

      // Get this month's revenue
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const monthInvoices = await db.invoices
        .where('date')
        .startsWith(currentMonth)
        .toArray();
      
      const monthlyRevenue = monthInvoices.reduce((sum, inv) => sum + inv.paid, 0);

      setStats({
        totalPatients,
        todayAppointments,
        pendingPayments,
        lowStockItems,
        monthlyRevenue,
        completedToday
      });

      // Get recent activity (last 5 items)
      const recentAppointments = await db.appointments
        .orderBy('createdAt')
        .reverse()
        .limit(5)
        .toArray();

      setRecentActivity(recentAppointments);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: '#8b5cf6',
      change: '+12 this month'
    },
    {
      title: "Today's Appointments",
      value: `${stats.completedToday}/${stats.todayAppointments}`,
      icon: Calendar,
      color: '#06b6d4',
      change: `${stats.todayAppointments - stats.completedToday} remaining`
    },
    {
      title: 'Monthly Revenue',
      value: `Rs. ${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: '#10b981',
      change: '+15% from last month'
    },
    {
      title: 'Pending Payments',
      value: `Rs. ${stats.pendingPayments.toLocaleString()}`,
      icon: AlertCircle,
      color: '#ef4444',
      change: `${stats.pendingPayments > 50000 ? 'High' : 'Normal'}`
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: Package,
      color: '#f59e0b',
      change: stats.lowStockItems > 0 ? 'Needs restock' : 'All good'
    }
  ];

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <div>
          <h1>{getGreeting()}, {userName}! 👋</h1>
          <p>Here's what's happening at Abdullah Dental Care today</p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div 
                className="stat-icon"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <Icon size={24} color={stat.color} />
              </div>
              <div className="stat-details">
                <div className="stat-title">{stat.title}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-change">{stat.change}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button className="quick-action-btn" style={{ backgroundColor: '#8b5cf6' }}>
            <Users size={20} />
            <span>Add New Patient</span>
          </button>
          <button className="quick-action-btn" style={{ backgroundColor: '#06b6d4' }}>
            <Calendar size={20} />
            <span>Book Appointment</span>
          </button>
          <button className="quick-action-btn" style={{ backgroundColor: '#10b981' }}>
            <DollarSign size={20} />
            <span>Create Invoice</span>
          </button>
          <button className="quick-action-btn" style={{ backgroundColor: '#f59e0b' }}>
            <Package size={20} />
            <span>Check Inventory</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.length === 0 ? (
            <div className="empty-state">
              <Clock size={48} />
              <p>No recent activity</p>
            </div>
          ) : (
            recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.status === 'completed' ? (
                    <CheckCircle size={20} color="#10b981" />
                  ) : (
                    <Clock size={20} color="#06b6d4" />
                  )}
                </div>
                <div className="activity-details">
                  <div className="activity-title">
                    {activity.patientName} - {activity.type === 'general' ? 'General' : 'Orthodontist'}
                  </div>
                  <div className="activity-time">
                    {new Date(activity.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="activity-status">
                  <span className={`status-badge ${activity.status}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Alerts & Notifications */}
      {(stats.lowStockItems > 0 || stats.pendingPayments > 50000) && (
        <div className="dashboard-section">
          <h2>⚠️ Alerts & Notifications</h2>
          <div className="alerts-list">
            {stats.lowStockItems > 0 && (
              <div className="alert-item warning">
                <AlertCircle size={20} />
                <span>
                  {stats.lowStockItems} items are running low on stock. Check inventory.
                </span>
              </div>
            )}
            {stats.pendingPayments > 50000 && (
              <div className="alert-item danger">
                <AlertCircle size={20} />
                <span>
                  High pending payments: Rs. {stats.pendingPayments.toLocaleString()}. Follow up required.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
