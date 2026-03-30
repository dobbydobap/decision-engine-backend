import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Brain, LayoutDashboard, LogOut, Plus, BarChart3, Folder, Settings, Sparkles,
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard?new=true', icon: Plus, label: 'New Decision' },
    { to: '/dashboard', icon: BarChart3, label: 'My Decisions' },
    { to: '/dashboard', icon: Folder, label: 'Categories' },
    { to: '/dashboard', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="sidebar flex flex-col fixed left-0 top-0 bottom-0 z-40 overflow-y-auto" style={{ width: 240 }}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-8">
        <Link to="/dashboard" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-xl bg-teal/90 flex items-center justify-center shrink-0">
            <Brain size={19} className="text-white" />
          </div>
          <span className="text-[17px] font-bold text-white tracking-tight">DecisionIQ</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <Link key={item.label} to={item.to}
            className={`sidebar-link ${isActive(item.to.split('?')[0]) && item.label === 'Dashboard' ? 'active' : ''}`}>
            <item.icon size={17} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* CTA Card */}
      <div className="px-3 mb-4">
        <div className="p-4 rounded-xl bg-white/[0.07] border border-white/[0.08]">
          <div className="w-9 h-9 rounded-lg bg-teal/20 flex items-center justify-center mb-3">
            <Sparkles size={17} className="text-teal-light" />
          </div>
          <p className="text-white/90 text-[13px] font-semibold leading-snug mb-1">Ready to decide?</p>
          <p className="text-white/40 text-[11px] leading-relaxed mb-3">Let math guide your next choice.</p>
          <Link to="/dashboard?new=true">
            <button className="w-full py-2 bg-teal hover:bg-teal-light text-white text-[12px] font-semibold rounded-lg border-none cursor-pointer transition-colors flex items-center justify-center gap-1.5">
              <Plus size={13} /> New decision
            </button>
          </Link>
        </div>
      </div>

      {/* User */}
      <div className="px-3 pb-5 border-t border-white/[0.08] pt-4">
        <div className="flex items-center gap-2.5 px-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-teal/80 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <p className="text-[12px] text-white/70 font-medium truncate flex-1 min-w-0">{user?.email}</p>
        </div>
        <button onClick={handleLogout}
          className="sidebar-link w-full text-left text-[13px] hover:!text-red-300 hover:!bg-red-500/10">
          <LogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );
}
