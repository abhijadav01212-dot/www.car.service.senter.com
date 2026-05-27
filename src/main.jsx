import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity, ArrowRight, BarChart3, BriefcaseBusiness, Car, CheckCircle2, ClipboardList,
  CreditCard, Database, Gauge, LockKeyhole, LogOut, MessageSquare, Moon, Package,
  Phone, QrCode, ReceiptText, Shield, ShoppingCart, Sparkles, Sun, Upload, UserPlus,
  Users, Wrench, X
} from 'lucide-react';
import './styles.css';

const API = import.meta.env.VITE_API_URL || '';
const GARAGE_PHONE = '+919999999999';
const MARKET_CATEGORIES = ['Engine Oil', 'Battery', 'Indicators', 'Tyres', 'Brake Pads', 'Engine Repair Kits', 'Car Accessories', 'Bike Accessories'];

const USER_VISUALS = {
  homepageSupport: '/user-visuals/homepage-customer-support.png',
  billingInvoice: '/user-visuals/billing-invoice.png',
  workflowCommunication: '/user-visuals/workflow-communication.png',
  securityShield: '/user-visuals/security-shield.png',
  operationsGears: '/user-visuals/operations-gears.png',
  bossDay: '/user-visuals/boss-day.png',
  staffTeam: '/user-visuals/staff-team.png',
  dataPlatform: '/user-visuals/data-platform.png',
  repairStatus: '/visuals/repair-status.png',
  vehicleService: '/visuals/vehicle-service.png'
};

const ROLE_VISUALS = {
  customer: [
    ['Great customer support', USER_VISUALS.homepageSupport, 'Private help, booking, and repair updates'],
    ['Repair communication', USER_VISUALS.workflowCommunication, 'Only your own service messages'],
    ['Smart bills', USER_VISUALS.billingInvoice, 'Invoices, GST, and receipts']
  ],
  staff: [
    ['Staff workflow', USER_VISUALS.staffTeam, 'Assigned jobs and priorities'],
    ['Repair operations', USER_VISUALS.operationsGears, 'Proof photos and status'],
    ['Customer support', USER_VISUALS.workflowCommunication, 'Private customer messages']
  ],
  boss: [
    ['Boss command center', USER_VISUALS.bossDay, 'Leadership view for the garage'],
    ['Business operations', USER_VISUALS.operationsGears, 'Repairs, staff, and customer workflow'],
    ['Security management', USER_VISUALS.securityShield, 'Protected system actions']
  ],
  accounts: [
    ['Invoice control', USER_VISUALS.billingInvoice, 'GST billing and approvals'],
    ['Payment analytics', USER_VISUALS.dataPlatform, 'Daily and monthly income'],
    ['GST security', USER_VISUALS.securityShield, 'Tax records and smart bills']
  ]
};

function request(path, options = {}) {
  const token = localStorage.getItem('torqueiq_token');
  const headers = options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(`${API}${path}`, { ...options, headers: { ...headers, ...(options.headers || {}) } })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Request failed');
      return data;
    });
}

function App() {
  const [user, setUser] = useState(null);
  const [section, setSection] = useState('dashboard');
  const [dark, setDark] = useState(false);
  const [toast, setToast] = useState('');

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3200);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    if (!localStorage.getItem('torqueiq_token')) return;
    request('/api/auth/me')
      .then(({ user: me }) => setUser(me))
      .catch(() => localStorage.removeItem('torqueiq_token'));
  }, []);

  const logout = () => {
    localStorage.removeItem('torqueiq_token');
    setUser(null);
    setSection('dashboard');
    notify('Logged out successfully');
  };

  return (
    <div className="app-shell">
      <AnimatePresence>{toast && <Toast message={toast} />}</AnimatePresence>
      {!user ? (
        <Landing setUser={setUser} setSection={setSection} notify={notify} dark={dark} setDark={setDark} />
      ) : (
        <Workspace user={user} logout={logout} section={section} setSection={setSection} notify={notify} dark={dark} setDark={setDark} />
      )}
    </div>
  );
}

function Toast({ message }) {
  return (
    <motion.div initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} className="toast">
      {message}
    </motion.div>
  );
}

function Landing({ setUser, setSection, notify, dark, setDark }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [mode, setMode] = useState('login');
  const [target, setTarget] = useState(null);

  const openAuth = (nextMode, nextTarget = null) => {
    setMode(nextMode);
    setTarget(nextTarget);
    setAuthOpen(true);
  };

  const saveSession = (data) => {
    localStorage.setItem('torqueiq_token', data.token);
    setUser(data.user);
    if (target === 'repairs' && data.user.role === 'customer') setSection('repairs');
    setAuthOpen(false);
    notify(data.message);
  };

  return (
    <div>
      <header className="topbar">
        <Brand />
        <div className="top-actions">
          <a className="icon-btn" href={`tel:${GARAGE_PHONE}`} title="Direct call"><Phone size={18} /></a>
          <button className="icon-btn" type="button" onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          <button className="secondary-btn hide-sm" type="button" onClick={() => openAuth('login')}><LockKeyhole size={17} /> Login</button>
          <button className="primary-btn" type="button" onClick={() => openAuth('signup')}><UserPlus size={17} /> Signup</button>
        </div>
      </header>

      <AnimatePresence>
        {authOpen && <AuthPopover mode={mode} setMode={setMode} close={() => setAuthOpen(false)} saveSession={saveSession} notify={notify} target={target} />}
      </AnimatePresence>

      <main>
        <section className="hero-section">
          <div className="hero-grid">
            <div>
              <p className="eyebrow"><Sparkles size={16} /> AI automobile service analytics</p>
              <h1>Premium car service operations, intelligently managed.</h1>
              <p className="hero-copy">A luxury automobile service platform with repair booking, smart billing, private customer support, staff communication, and AI analytics after secure login.</p>
              <img className="mobile-hero-inline" src={USER_VISUALS.homepageSupport} alt="Luxury customer support and car service visual" />
              <div className="hero-actions">
                <button className="primary-btn big" type="button" onClick={() => { openAuth('login', 'repairs'); notify('Login or signup to continue repair booking'); }}><Wrench size={18} /> Book Repair Service</button>
                <button className="secondary-btn big" type="button" onClick={() => openAuth('login')}><LockKeyhole size={18} /> Secure login</button>
                <button className="secondary-btn big" type="button" onClick={() => openAuth('signup')}><UserPlus size={18} /> Create account</button>
                <a className="secondary-btn big" href={`tel:${GARAGE_PHONE}`}><Phone size={18} /> Call garage</a>
              </div>
            </div>
            <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="hero-visual">
              <img src={USER_VISUALS.homepageSupport} alt="Premium TorqueIQ automobile dashboard visual" />
              <div className="hero-card">
                <span>Live after login</span>
                <div className="mini-grid">
                  <PreviewMini icon={Wrench} label="Book" />
                  <PreviewMini icon={MessageSquare} label="Support" />
                  <PreviewMini icon={ReceiptText} label="Billing" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <PublicPreview />
      </main>
    </div>
  );
}

function AuthPopover({ mode, setMode, close, saveSession, notify, target }) {
  const [form, setForm] = useState({ role: 'customer', identifier: '', password: '', name: '', mobile: '', email: '', staffSkill: '' });
  const [loading, setLoading] = useState(false);
  const update = (key, value) => setForm((old) => ({ ...old, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        saveSession(await request('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ identifier: form.identifier, password: form.password })
        }));
      } else {
        saveSession(await request('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            mobile: form.mobile,
            password: form.password,
            role: form.role,
            staffSkill: form.staffSkill
          })
        }));
      }
    } catch (error) {
      notify(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: -12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: .98 }} className="auth-popover">
      <div className="popover-head">
        <div>
          <h2>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
          <p>{target === 'repairs' ? 'Continue to repair booking after login' : 'Secure access to TorqueIQ Nexus'}</p>
        </div>
        <button className="icon-btn" type="button" onClick={close}><X size={18} /></button>
      </div>
      <div className="tabs">
        <button type="button" onClick={() => setMode('login')} className={mode === 'login' ? 'active' : ''}>Login</button>
        <button type="button" onClick={() => setMode('signup')} className={mode === 'signup' ? 'active' : ''}>Signup</button>
      </div>
      <form onSubmit={submit} className="form-grid one">
        {mode === 'signup' && (
          <>
            <Field label="Full name" value={form.name} onChange={(v) => update('name', v)} />
            <Field label="Email" type="email" value={form.email} onChange={(v) => update('email', v)} required={false} />
            <Field label="Mobile number" value={form.mobile} onChange={(v) => update('mobile', v)} />
            <Select label="Role" value={form.role} onChange={(v) => update('role', v)} options={['customer', 'staff']} />
            <Field label="Staff skill" value={form.staffSkill} onChange={(v) => update('staffSkill', v)} disabled={form.role !== 'staff'} required={form.role === 'staff'} />
          </>
        )}
        {mode === 'login' && <Field label="Email, mobile, or Boss ID" value={form.identifier} onChange={(v) => update('identifier', v)} />}
        <Field label="Password" type="password" value={form.password} onChange={(v) => update('password', v)} />
        {mode === 'login' && <p className="hint">Boss: boss2026 | Accounts: account2026</p>}
        <button className="primary-btn full" disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}</button>
      </form>
    </motion.div>
  );
}

function PublicPreview() {
  const cards = [
    ['Luxury support desk', 'Customer booking, repair updates, and support messages stay private.', USER_VISUALS.homepageSupport],
    ['Smart billing', 'Accounts can generate GST bills, invoices, approvals, and payment records.', USER_VISUALS.billingInvoice],
    ['AI data platform', 'Analytics and reporting use permanent records.', USER_VISUALS.dataPlatform],
    ['Staff support team', 'Staff can message assigned customers and share direct repair progress.', USER_VISUALS.staffTeam],
    ['Security controls', 'Boss and Accounts workflows stay protected by role-based access.', USER_VISUALS.securityShield],
    ['Garage operations', 'Repair, inventory, and service workflows in one place.', USER_VISUALS.operationsGears]
  ];
  return (
    <>
      <section className="section">
        <div className="section-head">
          <div>
            <p className="section-kicker">Public preview</p>
            <h2>Luxury automobile platform with real workflow.</h2>
          </div>
          <p>No customer, staff, repair, payment, or revenue records are shown publicly. Real data appears only after secure login.</p>
        </div>
        <div className="visual-grid">{cards.map(([title, body, image]) => <VisualInfoCard key={title} title={title} body={body} image={image} />)}</div>
      </section>
      <section className="section">
        <div className="support-showcase">
          <div>
            <p className="section-kicker">Great customer support</p>
            <h2>Premium communication for every service customer.</h2>
            <p>Repair booking, direct messages, staff updates, payment support, and invoice sharing are presented as one clean luxury service workflow.</p>
            <div className="mini-grid">
              <PreviewMini icon={MessageSquare} label="Private chat" />
              <PreviewMini icon={Wrench} label="Repair status" />
              <PreviewMini icon={ReceiptText} label="Bill support" />
            </div>
          </div>
          <img src={USER_VISUALS.workflowCommunication} alt="Customer support workflow visual" />
        </div>
      </section>
    </>
  );
}

function Workspace({ user, logout, section, setSection, notify, dark, setDark }) {
  const seenMessages = useRef(null);
  const roleNav = {
    customer: [['dashboard', Gauge], ['vehicles', Car], ['repairs', Wrench], ['marketplace', ShoppingCart], ['payments', CreditCard], ['complaints', ClipboardList], ['messages', MessageSquare], ['ai', Sparkles]],
    staff: [['dashboard', Gauge], ['repairs', Wrench], ['marketplace', ShoppingCart], ['messages', MessageSquare], ['ai', Sparkles]],
    boss: [['dashboard', Gauge], ['records', Users], ['complaints', ClipboardList], ['inventory', Package], ['payments', CreditCard], ['messages', MessageSquare], ['ai', Sparkles], ['system', Database]],
    accounts: [['dashboard', Gauge], ['billing', ReceiptText], ['payments', CreditCard], ['messages', MessageSquare]]
  };
  const nav = roleNav[user.role] || roleNav.customer;

  useEffect(() => {
    let cancelled = false;
    const checkMessages = () => {
      request('/api/messages').then((messages) => {
        if (cancelled) return;
        if (seenMessages.current !== null && messages.length > seenMessages.current) {
          const latest = messages[0];
          notify(latest?.body?.includes('vehicle repair has been completed') ? latest.body : 'New message received');
        }
        seenMessages.current = messages.length;
      }).catch(() => {});
    };
    checkMessages();
    const timer = setInterval(checkMessages, 9000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [user.id]);

  return (
    <div className="workspace">
      <aside className="sidebar">
        <Brand />
        <div className="profile-card">
          <strong>{user.name}</strong>
          <span>{user.role} workspace</span>
          {user.customerId && <em>{user.customerId}</em>}
        </div>
        <nav>{nav.map(([item, Icon]) => <button key={item} type="button" className={section === item ? 'nav-active' : ''} onClick={() => setSection(item)}><Icon size={18} /> {item}</button>)}</nav>
        <div className="side-actions">
          <button className="icon-btn" type="button" onClick={() => setDark(!dark)}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
          <a className="icon-btn" href={`tel:${GARAGE_PHONE}`}><Phone size={17} /></a>
          <button className="icon-btn" type="button" onClick={logout}><LogOut size={17} /></button>
        </div>
      </aside>
      <main className="content"><Section section={section} user={user} notify={notify} /></main>
    </div>
  );
}

function Section({ section, user, notify }) {
  if (section === 'dashboard' && user.role === 'accounts') return <AccountsDashboard notify={notify} />;
  if (section === 'dashboard') return <Dashboard user={user} notify={notify} />;
  if (section === 'vehicles') return <Vehicles notify={notify} />;
  if (section === 'repairs') return user.role === 'staff' ? <StaffJobs notify={notify} /> : <Repairs notify={notify} />;
  if (section === 'marketplace' || section === 'inventory') return <Inventory user={user} notify={notify} />;
  if (section === 'messages') return <Messages user={user} notify={notify} />;
  if (section === 'billing') return <AccountsBilling notify={notify} />;
  if (section === 'payments') return <Payments user={user} notify={notify} />;
  if (section === 'records') return <BossRecords notify={notify} />;
  if (section === 'complaints') return <Complaints user={user} notify={notify} />;
  if (section === 'system') return <SystemManagement notify={notify} />;
  return <AIStudio notify={notify} />;
}

function Dashboard({ user, notify }) {
  const [data, setData] = useState(null);
  useEffect(() => { request('/api/analytics/dashboard').then(setData).catch((e) => notify(e.message)); }, []);
  return (
    <Page title={`${user.role === 'boss' ? 'Master' : user.role === 'staff' ? 'Staff' : 'Customer'} Dashboard`} icon={Gauge}>
      <VisualStrip items={ROLE_VISUALS[user.role] || ROLE_VISUALS.customer} />
      <div className="metrics">
        {user.customerId && <Metric label="Customer ID" value={user.customerId} icon={QrCode} />}
        <Metric label="Total customers" value={data?.totalCustomers ?? 'Role scoped'} icon={Users} />
        <Metric label="Pending repairs" value={data?.pendingRepairs ?? 0} icon={Wrench} />
        <Metric label="Completed repairs" value={data?.completedRepairs ?? 0} icon={CheckCircle2} />
        <Metric label="Revenue" value={`Rs. ${data?.revenue ?? 0}`} icon={BriefcaseBusiness} />
      </div>
      <Panel title="AI insights"><div className="insight-grid">{(data?.aiInsights || ['Real insights appear after service activity.']).map((item) => <div key={item}>{item}</div>)}</div></Panel>
    </Page>
  );
}

function Vehicles({ notify }) {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ registrationNumber: '', make: '', model: '', year: '', fuelType: 'petrol', odometerKm: '' });
  const load = () => request('/api/customer/vehicles').then(setVehicles).catch((e) => notify(e.message));
  useEffect(() => { load(); }, []);
  const submit = async (e) => {
    e.preventDefault();
    try {
      await request('/api/customer/vehicles', { method: 'POST', body: JSON.stringify(form) });
      notify('Vehicle added');
      setForm({ registrationNumber: '', make: '', model: '', year: '', fuelType: 'petrol', odometerKm: '' });
      load();
    } catch (error) { notify(error.message); }
  };
  return (
    <Page title="Vehicle Garage" icon={Car}>
      <FormGrid onSubmit={submit}>
        {Object.entries(form).map(([key, value]) => key === 'fuelType'
          ? <Select key={key} label="Fuel type" value={value} onChange={(v) => setForm({ ...form, [key]: v })} options={['petrol', 'diesel', 'cng', 'ev', 'hybrid']} />
          : <Field key={key} label={labelize(key)} value={value} onChange={(v) => setForm({ ...form, [key]: v })} />)}
        <button className="primary-btn full">Save vehicle</button>
      </FormGrid>
      <List items={vehicles} empty="No vehicles yet." render={(v) => <Card title={`${v.registrationNumber} - ${v.make} ${v.model}`} meta={`${v.fuelType} - ${v.odometerKm || 0} km`} image={USER_VISUALS.vehicleService} />} />
    </Page>
  );
}

function Repairs({ notify }) {
  const [jobs, setJobs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ vehicle: '', vehicleType: 'Car', brand: '', model: '', issueType: '', description: '', priority: 'normal', serviceType: 'General service', scheduledAt: '' });
  const estimate = estimateBookingCost(form);
  const load = () => {
    request('/api/customer/jobs').then(setJobs).catch((e) => notify(e.message));
    request('/api/customer/vehicles').then(setVehicles).catch(() => setVehicles([]));
  };
  useEffect(() => { load(); }, []);
  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('estimatedCost', String(estimate));
    try {
      await request('/api/customer/jobs', { method: 'POST', body: fd });
      notify('Repair booked');
      setForm({ vehicle: '', vehicleType: 'Car', brand: '', model: '', issueType: '', description: '', priority: 'normal', serviceType: 'General service', scheduledAt: '' });
      e.currentTarget.reset();
      load();
    } catch (error) { notify(error.message); }
  };
  return (
    <Page title="Repair Booking Dashboard" icon={Wrench}>
      <form onSubmit={submit} className="panel form-grid">
        <VisualHero image={USER_VISUALS.repairStatus} title="Book a precision repair service" body="AI estimate, private staff updates, and complete service tracking begin here." />
        <Select required={false} name="vehicle" label="Saved vehicle" value={form.vehicle} onChange={(v) => setForm({ ...form, vehicle: v })} options={[{ label: 'No saved vehicle', value: '' }, ...vehicles.map((v) => ({ label: `${v.registrationNumber} ${v.make} ${v.model}`, value: v._id }))]} />
        <Select name="vehicleType" label="Vehicle type" value={form.vehicleType} onChange={(v) => setForm({ ...form, vehicleType: v })} options={['Car', 'Bike', 'SUV', 'EV', 'Luxury car']} />
        <Field name="brand" label="Car/Bike brand" value={form.brand} onChange={(v) => setForm({ ...form, brand: v })} />
        <Field name="model" label="Model" value={form.model} onChange={(v) => setForm({ ...form, model: v })} />
        <Field name="issueType" label="Issue/problem" value={form.issueType} onChange={(v) => setForm({ ...form, issueType: v })} />
        <Select name="serviceType" label="Service type" value={form.serviceType} onChange={(v) => setForm({ ...form, serviceType: v })} options={['General service', 'Engine repair', 'Brake service', 'Battery replacement', 'Tyre service', 'Emergency inspection', 'Luxury detailing']} />
        <Select name="priority" label="Priority" value={form.priority} onChange={(v) => setForm({ ...form, priority: v })} options={['normal', 'high', 'emergency']} />
        <Field name="scheduledAt" label="Date & time" type="datetime-local" value={form.scheduledAt} onChange={(v) => setForm({ ...form, scheduledAt: v })} />
        <Field name="description" label="Problem details" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
        <label className="field"><span>Issue photos</span><input name="photos" type="file" multiple accept="image/*" /></label>
        <div className="estimate"><span>Estimated repair cost</span><strong>Rs. {estimate}</strong><small>Final bill is approved by Accounts.</small></div>
        <button className="primary-btn full"><Upload size={18} /> Book repair service</button>
      </form>
      <List items={jobs} empty="No repair history yet." render={(j) => <Card title={`${j.issueType} - ${j.status}`} meta={`${j.bookingBrand || j.vehicle?.make || ''} ${j.bookingModel || j.vehicle?.model || ''} - Estimate Rs. ${j.estimatedCost || 0} - ${j.serviceType || 'Service booking'}`} image={USER_VISUALS.repairStatus} />} />
    </Page>
  );
}

function StaffJobs({ notify }) {
  const [open, setOpen] = useState([]);
  const [mine, setMine] = useState([]);
  const load = () => {
    request('/api/staff/jobs/open').then(setOpen).catch((e) => notify(e.message));
    request('/api/staff/jobs/mine').then(setMine).catch(() => setMine([]));
  };
  useEffect(() => { load(); }, []);
  const update = async (job, status) => {
    try {
      const response = await request(`/api/staff/jobs/${job._id}`, { method: 'PATCH', body: JSON.stringify({ status, note: `Repair update: ${status}` }) });
      notify(response.message);
      load();
    } catch (error) { notify(error.message); }
  };
  return (
    <Page title="Mechanic Dashboard" icon={Wrench}>
      <VisualStrip items={ROLE_VISUALS.staff} />
      <Panel title="Customer requests"><List items={open} empty="No open customer requests right now." render={(j) => <Card title={`${j.issueType} - ${j.priority}`} meta={`${j.customer?.name || ''} - ${j.vehicle?.registrationNumber || ''}`} image={USER_VISUALS.staffTeam} action={<button className="primary-btn" type="button" onClick={() => request(`/api/staff/jobs/${j._id}/accept`, { method: 'PATCH' }).then(() => { notify('Job accepted'); load(); })}>Accept</button>} />} /></Panel>
      <Panel title="Assigned work"><List items={mine} empty="Accepted jobs will appear here." render={(j) => <Card title={`${j.issueType} - ${j.status}`} meta={`${j.customer?.name || ''} - ${j.vehicle?.make || ''} ${j.vehicle?.model || ''}`} image={USER_VISUALS.operationsGears} action={<select className="input" value={j.status} onChange={(e) => update(j, e.target.value)}><option>accepted</option><option>diagnosing</option><option>repairing</option><option>quality_check</option><option>completed</option></select>} />} /></Panel>
    </Page>
  );
}

function Inventory({ user, notify }) {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const load = () => request('/api/inventory').then(setItems).catch((e) => notify(e.message));
  useEffect(() => { load(); }, []);
  const visible = category === 'All' ? items : items.filter((item) => item.category === category);
  return (
    <Page title={user.role === 'boss' ? 'Product Marketplace Manager' : 'Car & Bike Marketplace'} icon={Package}>
      <div className="market-tabs">{['All', ...MARKET_CATEGORIES].map((c) => <button key={c} type="button" className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div>
      {visible.length ? <div className="market-grid">{visible.map((p) => <ProductCard key={p._id} product={p} user={user} buy={() => setSelected(p)} />)}</div> : <Empty text="No products have been uploaded yet." />}
      {selected && <PaymentDialog product={selected} close={() => setSelected(null)} notify={notify} onPaid={() => { setSelected(null); load(); }} />}
    </Page>
  );
}

function ProductCard({ product, user, buy }) {
  const image = product.imageUrl || USER_VISUALS.billingInvoice;
  return (
    <motion.article whileHover={{ y: -5 }} className="product-card">
      <img src={image} alt={`${product.name} product visual`} />
      <div>
        <span>{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description || 'Ready for purchase or service booking'}</p>
        <strong>Rs. {product.price}</strong>
        <em>Stock {product.stock}</em>
        {user.role === 'customer' && <button className="primary-btn full" type="button" onClick={buy}><ShoppingCart size={18} /> Purchase</button>}
      </div>
    </motion.article>
  );
}

function PaymentDialog({ product, close, notify, onPaid }) {
  const [form, setForm] = useState({ method: 'UPI', quantity: 1, transactionId: '', utrNumber: '' });
  const subtotal = Number(product.price || 0) * Number(form.quantity || 1);
  const gstAmount = Math.round(subtotal * 0.18);
  const finalAmount = subtotal + gstAmount;
  const submit = async (event) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    fd.set('subtotal', String(subtotal));
    fd.set('productCost', String(subtotal));
    fd.set('gstRate', '18');
    fd.set('gstAmount', String(gstAmount));
    fd.set('amount', String(finalAmount));
    fd.set('productId', product.id || product._id);
    try {
      const response = await request('/api/payments', { method: 'POST', body: fd });
      notify(response.message || 'Payment successful');
      onPaid();
    } catch (error) { notify(error.message); }
  };
  return (
    <div className="modal"><form onSubmit={submit} className="panel dialog">
      <button className="icon-btn close" type="button" onClick={close}><X size={18} /></button>
      <h2>Complete Payment</h2>
      <p>{product.name} - GST included smart bill</p>
      <Select name="method" label="Payment method" value={form.method} onChange={(v) => setForm({ ...form, method: v })} options={['UPI', 'Card', 'Cash', 'Net Banking']} />
      <Field name="quantity" label="Quantity" value={form.quantity} onChange={(v) => setForm({ ...form, quantity: v })} />
      <Field name="transactionId" label="Transaction ID" value={form.transactionId} onChange={(v) => setForm({ ...form, transactionId: v })} required={false} />
      <Field name="utrNumber" label="UTR number" value={form.utrNumber} onChange={(v) => setForm({ ...form, utrNumber: v })} required={false} />
      <label className="field"><span>Payment screenshot</span><input name="screenshot" type="file" accept="image/*" /></label>
      <div className="estimate"><span>GST 18%: Rs. {gstAmount}</span><strong>Rs. {finalAmount}</strong></div>
      <button className="primary-btn full">Pay Rs. {finalAmount}</button>
    </form></div>
  );
}

function Messages({ user, notify }) {
  const [items, setItems] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [receiver, setReceiver] = useState('');
  const [body, setBody] = useState('');
  const load = () => request('/api/messages').then(setItems).catch((e) => notify(e.message));
  useEffect(() => {
    load();
    if (user.role === 'staff') {
      request('/api/staff/jobs/mine').then((jobs) => {
        const unique = new Map();
        jobs.forEach((job) => job.customer?.id && unique.set(job.customer.id, job.customer));
        setContacts([...unique.values()]);
      }).catch(() => setContacts([]));
    }
  }, [user.role]);
  const submit = async (e) => {
    e.preventDefault();
    try {
      await request('/api/messages', { method: 'POST', body: JSON.stringify({ body, receiver: receiver || undefined, channel: user.role === 'staff' ? 'repair_update' : 'support' }) });
      notify('Message sent');
      setBody('');
      load();
    } catch (error) { notify(error.message); }
  };
  return (
    <Page title="Private Messaging Center" icon={MessageSquare}>
      <div className="communication-hero"><img src={USER_VISUALS.homepageSupport} alt="Great customer support visual" /><div><p className="section-kicker">Great customer support</p><h3>Customer-specific service communication</h3><p>Every message is private to the sender, receiver, and assigned repair workflow.</p></div></div>
      <form onSubmit={submit} className="panel message-form">
        {user.role === 'staff' && <Select required={false} label="Assigned customer" value={receiver} onChange={setReceiver} options={contacts.map((c) => ({ label: `${c.name} - ${c.mobile}`, value: c.id }))} />}
        <input className="input" value={body} onChange={(e) => setBody(e.target.value)} placeholder={user.role === 'staff' ? 'Send private repair update' : 'Message support/admin'} required />
        <button className="primary-btn"><MessageSquare size={18} /> Send</button>
      </form>
      <List items={items} empty="No messages yet." render={(m) => <Card title={`${m.sender?.name || 'Message'}${m.receiver?.name ? ` to ${m.receiver.name}` : ''}`} meta={`${m.channel} - ${m.body}`} image={USER_VISUALS.workflowCommunication} />} />
    </Page>
  );
}

function AccountsDashboard({ notify }) {
  const [data, setData] = useState(null);
  useEffect(() => { request('/api/accounts/summary').then(setData).catch((e) => notify(e.message)); }, []);
  return (
    <Page title="Accounts Department" icon={ReceiptText}>
      <VisualStrip items={ROLE_VISUALS.accounts} />
      <div className="metrics">
        <Metric label="Total revenue" value={`Rs. ${data?.totalRevenue ?? 0}`} icon={BriefcaseBusiness} />
        <Metric label="Daily income" value={`Rs. ${data?.dailyIncome ?? 0}`} icon={CreditCard} />
        <Metric label="Monthly income" value={`Rs. ${data?.monthlyIncome ?? 0}`} icon={BarChart3} />
        <Metric label="GST collected" value={`Rs. ${data?.gstCollected ?? 0}`} icon={ReceiptText} />
        <Metric label="Pending payments" value={data?.pendingPayments ?? 0} icon={Activity} />
        <Metric label="Successful transactions" value={data?.successfulTransactions ?? 0} icon={CheckCircle2} />
      </div>
    </Page>
  );
}

function AccountsBilling({ notify }) {
  const [form, setForm] = useState({ customerId: '', repairCharges: '', productCost: '', gstRate: 18, serviceTax: '', method: 'UPI', transactionId: '', utrNumber: '', notes: '' });
  const submit = async (event) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    try {
      const response = await request('/api/accounts/bills', { method: 'POST', body: fd });
      notify(response.message || 'Smart bill created');
      event.currentTarget.reset();
      setForm({ customerId: '', repairCharges: '', productCost: '', gstRate: 18, serviceTax: '', method: 'UPI', transactionId: '', utrNumber: '', notes: '' });
    } catch (error) { notify(error.message); }
  };
  return (
    <Page title="Smart Billing & GST Invoice" icon={ReceiptText}>
      <VisualHero image={USER_VISUALS.billingInvoice} title="Luxury billing and invoice workflow" body="Create GST-ready smart bills with payment proofs, transaction details, and customer financial history." />
      <form onSubmit={submit} className="panel form-grid">
        <Field name="customerId" label="Customer unique ID" value={form.customerId} onChange={(v) => setForm({ ...form, customerId: v })} />
        <Select name="method" label="Payment method" value={form.method} onChange={(v) => setForm({ ...form, method: v })} options={['UPI', 'Card', 'Cash', 'Net Banking']} />
        {['repairCharges', 'productCost', 'gstRate', 'serviceTax', 'transactionId', 'utrNumber', 'notes'].map((key) => <Field key={key} name={key} label={labelize(key)} value={form[key]} onChange={(v) => setForm({ ...form, [key]: v })} required={false} />)}
        <label className="field"><span>Payment screenshot</span><input name="screenshot" type="file" accept="image/*" /></label>
        <button className="primary-btn full">Create bill for approval</button>
      </form>
    </Page>
  );
}

function Payments({ user, notify }) {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState({ customerId: '', invoiceNumber: '' });
  const load = () => request(user.role === 'boss' ? '/api/boss/payments' : user.role === 'accounts' ? '/api/accounts/payments' : '/api/invoices/mine').then(setItems).catch((e) => notify(e.message));
  useEffect(() => { load(); }, [user.role]);
  const search = async (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.customerId) params.set('customerId', query.customerId);
    if (query.invoiceNumber) params.set('invoiceNumber', query.invoiceNumber);
    try { setItems(await request(`/api/invoices/search?${params.toString()}`)); } catch (e) { notify(e.message); }
  };
  return (
    <Page title={user.role === 'customer' ? 'My Smart Bills & Invoices' : 'Payment History'} icon={CreditCard}>
      <form onSubmit={search} className="panel message-form">
        <Field label="Check bill using Customer ID" value={query.customerId} onChange={(v) => setQuery({ ...query, customerId: v })} required={false} />
        <Field label="Invoice number" value={query.invoiceNumber} onChange={(v) => setQuery({ ...query, invoiceNumber: v })} required={false} />
        <button className="primary-btn">Search bill</button>
      </form>
      <List items={items} empty="No payment records yet." render={(p) => <Card title={`${p.customerName || p.invoiceNumber || 'Payment'} - Rs. ${p.finalAmount || p.amount || 0}`} meta={`${p.method || p.paymentStatus || p.status || ''} - ${p.transactionId || 'No transaction ID'} - Invoice ${p.invoiceNumber || ''}`} image={USER_VISUALS.billingInvoice} />} />
    </Page>
  );
}

function BossRecords({ notify }) {
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    request('/api/boss/users').then(setUsers).catch((e) => notify(e.message));
    request('/api/boss/login-history').then(setHistory).catch(() => setHistory([]));
  }, []);
  return <Page title="Staff & Customer Records" icon={Users}><Panel title="All registered users"><List items={users} empty="No users yet." render={(u) => <Card title={`${u.name} - ${u.role}`} meta={`${u.mobile} - ${u.customerId || u.loginId || 'No ID'} - Last activity ${u.lastActivity || 'Not active yet'}`} image={USER_VISUALS.staffTeam} />} /></Panel><Panel title="Login history"><List items={history.map((h) => ({ ...h, _id: h.id }))} empty="No login history yet." render={(h) => <Card title={`${h.name} - ${h.role}`} meta={`${h.username || h.email || h.mobile} - ${h.login_at}`} image={USER_VISUALS.dataPlatform} />} /></Panel></Page>;
}

function Complaints({ user, notify }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ type: 'service_request', title: '', description: '' });
  const load = () => request(user.role === 'boss' ? '/api/boss/complaints' : '/api/customer/complaints').then(setItems).catch((e) => notify(e.message));
  useEffect(() => { load(); }, [user.role]);
  const submit = async (e) => {
    e.preventDefault();
    try {
      await request('/api/customer/complaints', { method: 'POST', body: JSON.stringify(form) });
      notify('Complaint sent to Boss dashboard');
      setForm({ type: 'service_request', title: '', description: '' });
      load();
    } catch (error) { notify(error.message); }
  };
  return <Page title="Complaints & Service Tracking" icon={ClipboardList}>{user.role === 'customer' && <FormGrid onSubmit={submit}><Select label="Type" value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={['service_request', 'complaint', 'emergency']} /><Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} /><Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} /><button className="primary-btn full">Send to Boss</button></FormGrid>}<List items={items} empty="No complaints or service requests yet." render={(c) => <Card title={`${c.title} - ${c.status}`} meta={`${c.type} - ${c.description}`} image={USER_VISUALS.homepageSupport} />} /></Page>;
}

function AIStudio({ notify }) {
  const [form, setForm] = useState({ issueType: '', odometerKm: '', year: '', priority: 'normal' });
  const [result, setResult] = useState(null);
  const submit = async (e) => {
    e.preventDefault();
    try { setResult(await request('/api/ai/predict-repair', { method: 'POST', body: JSON.stringify(form) })); } catch (error) { notify(error.message); }
  };
  return <Page title="AI Repair Intelligence" icon={Sparkles}><FormGrid onSubmit={submit}>{Object.keys(form).map((key) => key === 'priority' ? <Select key={key} label="Priority" value={form[key]} onChange={(v) => setForm({ ...form, [key]: v })} options={['normal', 'high', 'emergency']} /> : <Field key={key} label={labelize(key)} value={form[key]} onChange={(v) => setForm({ ...form, [key]: v })} />)}<button className="primary-btn full">Predict cost and health</button></FormGrid>{result && <Panel title="AI result"><div className="metrics"><Metric label="Cost min" value={`Rs. ${result.costMin}`} icon={Gauge} /><Metric label="Cost max" value={`Rs. ${result.costMax}`} icon={Gauge} /><Metric label="Health score" value={result.healthScore} icon={CheckCircle2} /><Metric label="Risk" value={result.risk} icon={Shield} /></div><p className="muted">{result.recommendation}</p></Panel>}</Page>;
}

function SystemManagement({ notify }) {
  const [secretCode, setSecretCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    try {
      await request('/api/boss/password', { method: 'PATCH', body: JSON.stringify({ secretCode, newPassword }) });
      notify('Boss password changed');
    } catch (error) { notify(error.message); }
  };
  return <Page title="System Management" icon={Database}><VisualStrip items={ROLE_VISUALS.boss} /><Panel title="Secret-code protected actions"><form onSubmit={submit} className="form-grid"><Field label="Secret code" value={secretCode} onChange={setSecretCode} /><Field label="New Boss password" type="password" value={newPassword} onChange={setNewPassword} /><button className="primary-btn full">Change password</button></form></Panel></Page>;
}

function Brand() {
  return <div className="brand"><div><Gauge size={22} /></div><section><strong>TorqueIQ Nexus</strong><span>Provided by Abhishek Jatav</span></section></div>;
}

function Page({ title, icon: Icon, children }) {
  return <div><div className="page-head"><div><Icon /></div><section><h2>{title}</h2><p>Secure real-workflow workspace</p></section></div>{children}</div>;
}

function VisualStrip({ items = [] }) {
  return <div className="visual-grid slim">{items.map(([title, image, body]) => <VisualInfoCard key={title} title={title} image={image} body={body} />)}</div>;
}

function VisualHero({ image, title, body }) {
  return <div className="visual-hero"><img src={image} alt={`${title} visual`} /><div><p className="section-kicker">Luxury AI workflow</p><h3>{title}</h3><p>{body}</p></div></div>;
}

function Panel({ title, children }) {
  return <section className="panel"><h3>{title}</h3>{children}</section>;
}

function Metric({ label, value, icon: Icon }) {
  return <div className="panel metric"><span>{label}</span><Icon size={18} /><strong>{value}</strong></div>;
}

function Card({ title, meta, action, image }) {
  return <div className="panel list-card"><img src={image || USER_VISUALS.homepageSupport} alt="" /><div><strong>{title}</strong><p>{meta}</p></div>{action}</div>;
}

function List({ items, empty, render }) {
  return <div className="list">{items?.length ? items.map((item, index) => <React.Fragment key={item._id || item.id || index}>{render(item)}</React.Fragment>) : <Empty text={empty} />}</div>;
}

function Empty({ text }) {
  return <div className="empty">{text}</div>;
}

function VisualInfoCard({ image, title, body }) {
  return <motion.article whileHover={{ y: -4 }} className="visual-card"><img src={image} alt={`${title} dashboard visual`} /><h3>{title}</h3><p>{body}</p></motion.article>;
}

function PreviewMini({ icon: Icon, label }) {
  return <div className="mini"><Icon size={18} /><span>{label}</span></div>;
}

function FormGrid({ children, onSubmit }) {
  return <form onSubmit={onSubmit} className="panel form-grid">{children}</form>;
}

function Field({ label, value, onChange, type = 'text', disabled = false, name, required = true }) {
  return <label className="field"><span>{label}</span><input name={name} disabled={disabled} type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required && !disabled} /></label>;
}

function Select({ label, value, onChange, options, name, required = true }) {
  const opts = options.map((item) => typeof item === 'string' ? { label: item, value: item } : item);
  return <label className="field"><span>{label}</span><select name={name} value={value} onChange={(e) => onChange(e.target.value)} required={required}>{opts.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>;
}

function labelize(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
}

function estimateBookingCost(form) {
  const priority = { normal: 0, high: 900, emergency: 1800 }[form.priority] || 0;
  const service = {
    'General service': 1800,
    'Engine repair': 6800,
    'Brake service': 3200,
    'Battery replacement': 2600,
    'Tyre service': 2400,
    'Emergency inspection': 3600,
    'Luxury detailing': 5200
  }[form.serviceType] || 2200;
  const issue = String(form.issueType || '').toLowerCase();
  const issueCost = issue.includes('engine') ? 2400 : issue.includes('brake') ? 1200 : issue.includes('battery') ? 900 : issue.includes('noise') ? 700 : 500;
  return service + priority + issueCost;
}

createRoot(document.getElementById('root')).render(<App />);
