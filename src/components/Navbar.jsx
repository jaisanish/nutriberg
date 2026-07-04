import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, Search, CalendarDays, ClipboardList, User,
  Users, ChefHat, LogOut, Leaf, PlusCircle
} from 'lucide-react';

const navItems = [
  { label: 'Main', items: [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/explore', icon: Search, label: 'Explore Recipes' },
    { path: '/add-recipe', icon: PlusCircle, label: 'Add Recipe' },
  ]},
  { label: 'Planning', items: [
    { path: '/planner', icon: CalendarDays, label: 'Meal Planner' },
    { path: '/tracker', icon: ClipboardList, label: 'Meal Tracker' },
  ]},
  { label: 'Social', items: [
    { path: '/community', icon: Users, label: 'Community' },
  ]},
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <aside className="sidebar" id="main-sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Leaf size={22} color="white" />
        </div>
        <h2 className="gradient-text">NutriBerg</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((section) => (
          <div key={section.label}>
            <div className="nav-section-label">{section.label}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={item.path === '/'}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        {isAuthenticated && user ? (
          <>
            <div
              className="user-card"
              onClick={() => navigate('/profile')}
              role="button"
              tabIndex={0}
            >
              <div className="user-avatar">{user.avatar}</div>
              <div className="user-info">
                <div className="name">{user.name}</div>
                <div className="email">{user.email}</div>
              </div>
            </div>
            <button
              className="nav-link mt-sm"
              onClick={handleLogout}
              style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
            >
              <LogOut size={20} />
              <span>Log Out</span>
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => navigate('/auth')}
            style={{ width: '100%' }}
          >
            <ChefHat size={18} />
            Sign In
          </button>
        )}
      </div>
    </aside>
  );
}
