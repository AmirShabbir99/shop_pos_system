import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import { getTheme, applyTheme } from "../../utils/theme";
import {
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "../../features/user/userManageApi";
import {
  User, Lock, Bell, Palette,
  Save, Loader2, CheckCircle, Eye, EyeOff,
  Moon, Sun, Monitor,
} from "lucide-react";

const TABS = [
  { id: "profile",   label: "My Profile",    icon: User    },
  { id: "password",  label: "Change Password", icon: Lock  },
  { id: "appearance",label: "Appearance",    icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
];

// ─── Profile Tab ──────────────────────────────────────────
const ProfileTab = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [success, setSuccess] = useState(false);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user: updated } = await updateProfile(form).unwrap();
      dispatch(setCredentials(updated));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err?.data?.message || "Update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-gray-800">{user?.name}</p>
          <p className="text-sm text-gray-400 capitalize">{user?.role}</p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Role</label>
          <input
            value={user?.role}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm capitalize cursor-not-allowed"
          />
        </div>
      </div>

      <button type="submit" disabled={isLoading}
        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60">
        {isLoading
          ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
          : success
          ? <><CheckCircle size={15} /> Saved!</>
          : <><Save size={15} /> Save Changes</>
        }
      </button>
    </form>
  );
};

// ─── Password Tab ─────────────────────────────────────────
const PasswordTab = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [success, setSuccess] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      alert("New passwords match nahi kar rahe!");
      return;
    }
    if (form.newPassword.length < 6) {
      alert("Password minimum 6 characters hona chahiye!");
      return;
    }
    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword:     form.newPassword,
      }).unwrap();
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err?.data?.message || "Password change failed");
    }
  };

  const PasswordInput = ({ label, field, placeholder }) => (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>
      <div className="relative">
        <input
          type={show[field] ? "text" : "password"}
          value={form[field === "current" ? "currentPassword" : field === "new" ? "newPassword" : "confirmPassword"]}
          onChange={(e) => setForm({
            ...form,
            [field === "current" ? "currentPassword" : field === "new" ? "newPassword" : "confirmPassword"]: e.target.value,
          })}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          required
        />
        <button type="button"
          onClick={() => setShow({ ...show, [field]: !show[field] })}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show[field] ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <p className="text-sm text-amber-700">
          Strong password use karo — letters, numbers aur symbols milao.
        </p>
      </div>

      <PasswordInput label="Current Password"  field="current" placeholder="Enter current password" />
      <PasswordInput label="New Password"      field="new"     placeholder="Enter new password" />
      <PasswordInput label="Confirm Password"  field="confirm" placeholder="Repeat new password" />

      {form.newPassword && form.confirmPassword && (
        <div className={`flex items-center gap-1.5 text-xs ${form.newPassword === form.confirmPassword ? "text-emerald-600" : "text-red-500"}`}>
          <CheckCircle size={12} />
          {form.newPassword === form.confirmPassword ? "Passwords match!" : "Passwords match nahi kar rahe"}
        </div>
      )}

      <button type="submit" disabled={isLoading}
        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60">
        {isLoading
          ? <><Loader2 size={15} className="animate-spin" /> Changing...</>
          : success
          ? <><CheckCircle size={15} /> Changed!</>
          : <><Lock size={15} /> Change Password</>
        }
      </button>
    </form>
  );
};

// ─── Appearance Tab ───────────────────────────────────────
const AppearanceTab = () => {
  const [theme,    setTheme]    = useState(() => getTheme());
  const [accent,   setAccent]   = useState("indigo");
  const [compact,  setCompact]  = useState(false);
  const [saved,    setSaved]    = useState(false);

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(getTheme());
    };
    window.addEventListener("theme-change", handleThemeChange);
    return () => window.removeEventListener("theme-change", handleThemeChange);
  }, []);

  const THEMES  = [
    { id: "light",  label: "Light",  icon: Sun     },
    { id: "dark",   label: "Dark",   icon: Moon    },
    { id: "system", label: "System", icon: Monitor },
  ];
  const ACCENTS = [
    { id: "indigo", color: "bg-indigo-500" },
    { id: "violet", color: "bg-violet-500" },
    { id: "blue",   color: "bg-blue-500"   },
    { id: "emerald",color: "bg-emerald-500"},
    { id: "rose",   color: "bg-rose-500"   },
    { id: "amber",  color: "bg-amber-500"  },
  ];

  const handleSave = () => {
    applyTheme(theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-lg">
      {/* Theme */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setTheme(id); applyTheme(id); }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition text-sm font-medium
                ${theme === id
                  ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}>
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Accent Color</h3>
        <div className="flex gap-3 flex-wrap">
          {ACCENTS.map(({ id, color }) => (
            <button key={id} onClick={() => setAccent(id)}
              className={`w-9 h-9 rounded-xl ${color} transition-transform hover:scale-110
                ${accent === id ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* Compact Mode */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Compact Mode</p>
          <p className="text-xs text-gray-400 mt-0.5">Smaller padding aur font size</p>
        </div>
        <button onClick={() => setCompact(!compact)}
          className={`relative w-12 h-6 rounded-full transition-colors ${compact ? "bg-indigo-500" : "bg-gray-200"}`}>
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform
            ${compact ? "translate-x-6" : "translate-x-0.5"}`} />
        </button>
      </div>

      <button onClick={handleSave}
        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
        {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Preferences</>}
      </button>
    </div>
  );
};

// ─── Notifications Tab ────────────────────────────────────
const NotificationsTab = () => {
  const [settings, setSettings] = useState({
    lowStock:     true,
    newSale:      true,
    dailyReport:  false,
    expenseAlert: true,
    loginAlert:   true,
    smsAlerts:    false,
  });
  const [saved, setSaved] = useState(false);

  const NOTIF_ITEMS = [
    { id: "lowStock",    label: "Low Stock Alert",      desc: "Jab koi product low stock ho jaye" },
    { id: "newSale",     label: "New Sale",             desc: "Har sale ke baad notification" },
    { id: "dailyReport", label: "Daily Report",         desc: "Raat ko daily summary email" },
    { id: "expenseAlert",label: "Expense Added",        desc: "Naya expense add hone par" },
    { id: "loginAlert",  label: "Login Alert",          desc: "Naye device se login hone par" },
    { id: "smsAlerts",   label: "SMS Alerts",           desc: "Mobile pe SMS notifications" },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-lg">
      <div className="space-y-3">
        {NOTIF_ITEMS.map(({ id, label, desc }) => (
          <div key={id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-4">
            <div>
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
            <button onClick={() => setSettings({ ...settings, [id]: !settings[id] })}
              className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0
                ${settings[id] ? "bg-indigo-500" : "bg-gray-200"}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform
                ${settings[id] ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
        ))}
      </div>

      <button onClick={handleSave}
        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
        {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Settings</>}
      </button>
    </div>
  );
};

// ─── Main Settings Page ───────────────────────────────────
const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Account aur app preferences manage karo</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-52 flex-shrink-0">
          <nav className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition text-left
                  ${activeTab === id
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}>
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {activeTab === "profile"       && <ProfileTab />}
          {activeTab === "password"      && <PasswordTab />}
          {activeTab === "appearance"    && <AppearanceTab />}
          {activeTab === "notifications" && <NotificationsTab />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;