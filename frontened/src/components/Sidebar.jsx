import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldAlert,
  Bell,
  FileText,
  LogOut,
  ShieldCheck,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: "/threats",
      name: "Threats",
      icon: <ShieldAlert size={20} />,
    },
    {
      path: "/alerts",
      name: "Alerts",
      icon: <Bell size={20} />,
    },
    {
      path: "/reports",
      name: "Reports",
      icon: <FileText size={20} />,
    },
    {
      path: "/phishing",
      name: "AI Phishing Detection",
      icon: <ShieldCheck size={20} />,
    },
  ];

  return (
    <aside className="sidebar">

      {/* Brand */}
      <div className="brand">
        <div className="brand-icon">
          <ShieldCheck size={26} />
        </div>

        <div>
          <h2>CyberShield</h2>
          <span>Security Management</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <p className="nav-heading">MAIN MENU</p>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}

      </nav>

      {/* Logout */}
      <div className="sidebar-bottom">
        <button className="logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;