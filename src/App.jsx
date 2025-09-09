import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FiSun, FiMoon, FiSearch, FiDownload } from "react-icons/fi";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (e) {
      return null;
    }
  });
  // const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  async function login(email, password) {

    const user = JSON.parse(localStorage.getItem("user"))

    if(user){
      if(user?.email == email && user.password == password){
        setUser(user);
      }
    }
    // const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
    // const t = res.data?.token || null;
    // const u = res.data?.user || null;
    // if (t) {
    //   localStorage.setItem("token", t);
    //   setToken(t);
    // }
    // if (u) {
    //   localStorage.setItem("user", JSON.stringify(u));
    //   setUser(u);
    // }
    // return res.data;
  }

  async function signup(name, email, password) {
    localStorage.setItem("user", JSON.stringify({ name, email, password }));
    //const res = await axios.post(`${API_BASE}/api/auth/register`, { name, email, password });
    // if (res.data?.token && res.data?.user) {
    //   localStorage.setItem("token", res.data.token);
    //   setToken(res.data.token);
    //   setUser(res.data.user);
    // }
    // return res.data;

  }

  function logout() {
    localStorage.removeItem("user");
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    // setToken(null);
    // setUser(null);
  }

  // return { user, token, login, signup, logout };
  return { user, login, signup, logout };
}

function App() {
  const { user, login, signup, logout } = useAuth();
  // const { user, token, login, signup, logout } = useAuth();
  const [tab, setTab] = useState(() => (localStorage.getItem("user") ? "dashboard" : "login"));
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (user) setTab((t) => (t === "login" ? "dashboard" : t));
    else setTab((t) => (t === "dashboard" || t === "gallery" || t === "chat" || t === "account") ? "login" : t);
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="max-w-6xl mx-auto p-4">
        <Nav user={user} onTab={setTab} tab={tab} dark={dark} onToggleTheme={() => setDark((v) => !v)} onLogout={logout} />

        <main className="mt-6">
          {!user && tab === "login" && <AuthPanel onLogin={login} onSignup={signup} />}

          {user && (
            <div>
              {tab === "dashboard" && <Dashboard />}
              {tab === "gallery" && <Gallery  />}
              {tab === "chat" && <Chatbot  />}
              {tab === "account" && <Account user={user} />}
            </div>
          )}
          {/* {user && (
            <div>
              {tab === "dashboard" && <Dashboard token={token} />}
              {tab === "gallery" && <Gallery token={token} />}
              {tab === "chat" && <Chatbot token={token} />}
              {tab === "account" && <Account user={user} />}
            </div>
          )} */}

          {!user &&  (
            <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow rounded p-6">
              <h2 className="text-lg font-semibold">Please sign in to continue</h2>
              <p className="mt-2 text-sm text-gray-500">Use the Login tab to access your account.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Nav({ user, onTab, tab, dark, onToggleTheme, onLogout }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold">AI Wearable</div>
        <nav className="hidden md:flex items-center gap-2">
          <button onClick={() => onTab("dashboard")} className={`px-3 py-1 rounded ${tab === "dashboard" ? "bg-gray-200 dark:bg-gray-800" : ""}`}>Dashboard</button>
          <button onClick={() => onTab("gallery")} className={`px-3 py-1 rounded ${tab === "gallery" ? "bg-gray-200 dark:bg-gray-800" : ""}`}>Media Gallery</button>
          <button onClick={() => onTab("chat")} className={`px-3 py-1 rounded ${tab === "chat" ? "bg-gray-200 dark:bg-gray-800" : ""}`}>AI Chatbot</button>
          <button onClick={() => onTab("account")} className={`px-3 py-1 rounded ${tab === "account" ? "bg-gray-200 dark:bg-gray-800" : ""}`}>Account</button>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onToggleTheme} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          {dark ? <FiSun /> : <FiMoon />}
        </button>
        {user && <div className="hidden md:block">{user.name}</div>}
        {user ? (
          <button onClick={onLogout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
        ) : (
          <button onClick={() => onTab("login")} className="px-3 py-1 bg-blue-600 text-white rounded">Login</button>
        )}
      </div>
    </header>
  );
}

function AuthPanel({ onLogin, onSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) await onSignup(name, email, password);
      else await onLogin(email, password);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow rounded p-6">
      <h2 className="text-xl font-semibold mb-4">{isRegister ? "Create an account" : "Sign in to your account"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 rounded border dark:bg-gray-700" placeholder="Name" required />}
        <input required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded border dark:bg-gray-700" placeholder="Email" />
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded border dark:bg-gray-700" placeholder="Password" />
        <button disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded">{loading ? (isRegister ? "Creating..." : "Signing in...") : (isRegister ? "Create account" : "Sign in")}</button>
      </form>
      <p className="text-sm mt-3">
        {isRegister ? (
          <>
            Already have an account? <button onClick={() => setIsRegister(false)} className="text-blue-500">Sign in</button>
          </>
        ) : (
          <>
            Don't have an account? <button onClick={() => setIsRegister(true)} className="text-blue-500">Create one</button>
          </>
        )}
      </p>
    </div>
  );
}

function Dashboard({ token }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${API_BASE}/api/dashboard`, { headers });
        if (!cancelled) setData(res.data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
    return () => (cancelled = true);
  }, [token]);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Uploads this week" value={data?.uploadsThisWeek ?? "—"} />
        <Card title="Total media" value={data?.totalMedia ?? "—"} />
        <Card title="Conversations" value={data?.conversations ?? "—"} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3 className="font-semibold mb-2">Latest captions</h3>
          <ul className="space-y-2">
            {data?.latestCaptions?.length ? (
              data.latestCaptions.map((c) => (
                <li key={c.id} className="text-sm">
                  {c.caption} <span className="text-xs text-gray-400"> — {new Date(c.uploadedAt).toLocaleString()}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-400">No captions yet</li>
            )}
          </ul>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h3 className="font-semibold mb-2">AI Summary</h3>
          <p className="text-sm">{data?.summary ?? "—"}</p>
        </div>
      </div>
    </section>
  );
}

function Card({ title, value }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow flex flex-col">
      <span className="text-sm text-gray-500">{title}</span>
      <span className="text-2xl font-bold mt-2">{value}</span>
    </div>
  );
}

function Gallery({ token }) {
  const [media, setMedia] = useState([]);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${API_BASE}/api/media`, { headers });
        setMedia(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
      }
    }
    fetchMedia();
  }, [token]);

  const filtered = useMemo(
    () =>
      media.filter((m) => {
        if (typeFilter !== "all" && m.type !== typeFilter) return false;
        if (!q) return true;
        const s = q.toLowerCase();
        return (m.caption || "").toLowerCase().includes(s) || (m.filename || "").toLowerCase().includes(s);
      }),
    [media, q, typeFilter]
  );

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Media Gallery</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input value={q} onChange={(e) => setQ(e.target.value)} className="pl-8 p-2 rounded border dark:bg-gray-700" placeholder="Search captions or filename" />
            <FiSearch className="absolute left-2 top-2 text-gray-400" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="p-2 rounded border dark:bg-gray-700">
            <option value="all">All</option>
            <option value="image">Images</option>
            <option value="audio">Audio</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map((m) => (
          <MediaCard key={m.id} media={m} onOpen={() => setSelected(m)} />
        ))}
      </div>

      {selected && <FullscreenModal media={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function MediaCard({ media, onOpen }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
      {media.type === "image" ? (
        <img src={media.url} alt={media.caption || media.filename} className="w-full h-40 object-cover cursor-pointer" onClick={onOpen} />
      ) : (
        <div className="p-3 cursor-pointer" onClick={onOpen}>
          <div className="h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-700">Audio — {media.filename}</div>
        </div>
      )}
      <div className="p-2 text-sm">
        <div className="truncate">{media.caption || media.filename}</div>
        <div className="text-xs text-gray-400">{media.uploadedAt ? new Date(media.uploadedAt).toLocaleString() : ""}</div>
      </div>
    </div>
  );
}

function FullscreenModal({ media, onClose }) {
  async function handleDownload() {
    try {
      const a = document.createElement("a");
      a.href = media.url;
      a.download = media.filename || "media";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded max-w-4xl w-full shadow-lg overflow-hidden">
        <button onClick={onClose} className="absolute left-3 top-3 p-2 bg-white/20 rounded">Close</button>
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center justify-center">
            {media.type === "image" ? (
              <img src={media.url} alt={media.caption || media.filename} className="max-h-[70vh] object-contain" />
            ) : (
              <audio controls src={media.url} className="w-full" />
            )}
          </div>
          <div className="w-full md:w-80 p-2">
            <h3 className="font-semibold">{media.filename}</h3>
            <p className="mt-2 text-sm">{media.caption}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={handleDownload} className="px-3 py-1 bg-blue-600 text-white rounded flex items-center gap-2"><FiDownload /> Download</button>
              <button onClick={onClose} className="px-3 py-1 border rounded">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chatbot({ token }) {
  const [messages, setMessages] = useState([{ id: "s1", from: "bot", text: "Hi — ask me about your media." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input) return;
    const m = { id: Date.now().toString(), from: "user", text: input };
    setMessages((prev) => [...prev, m]);
    setInput("");
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${API_BASE}/api/chat`, { message: m.text }, { headers });
      setMessages((prev) => [...prev, { id: Date.now() + 1, from: "bot", text: res.data?.reply || "" }]);
    } catch (e) {
      setMessages((prev) => [...prev, { id: Date.now() + 2, from: "bot", text: "Sorry, I could not reach the AI service." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">AI Chatbot</h1>
      <div className="bg-white dark:bg-gray-800 rounded shadow p-4 h-[60vh] flex flex-col">
        <div className="flex-1 overflow-auto space-y-3 p-2">
          {messages.map((m) => (
            <div key={m.id} className={`max-w-[80%] p-2 rounded ${m.from === "user" ? "bg-blue-50 dark:bg-blue-900 self-end" : "bg-gray-100 dark:bg-gray-700 self-start"}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} className="flex-1 p-2 rounded border dark:bg-gray-700" placeholder="Ask about your media, e.g. 'Show me last week's uploads'" />
          <button onClick={send} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? "..." : "Send"}</button>
        </div>
      </div>
    </section>
  );
}

function Account({ user }) {
  return (
    <section className="max-w-muiyhd">
      <h1 className="text-2xl font-bold mb-4">Account</h1>
      <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
        <p><strong>Name:</strong> {user?.name}</p>
        <p className="mt-2"><strong>Email:</strong> {user?.email}</p>
      </div>
    </section>
  );
}

export default App;
