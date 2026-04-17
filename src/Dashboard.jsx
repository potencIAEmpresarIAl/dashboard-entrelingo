import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, LabelList
} from "recharts";

const GREEN = "#2ECC71";
const DARK_GREEN = "#1A7A43";
const DARK = "#1C2B36";
const MID = "#3D5A6C";
const YELLOW = "#F9C846";
const RED = "#E74C3C";
const GRAY = "#95A5A6";
const LIGHT = "#F0F7F4";

const campaigns = [
  { name: "SkillsPRO WP", short: "SkillsPRO WP", leads: 95, spend: 388.44, cpl: 4.09, status: "Inactiva", funnel: "MOFU", contactados: 0, agendados: 0, ventas: 0 },
  { name: "AustraliaPRO WP (Old)", short: "AuPRO WP Old", leads: 81, spend: 377.83, cpl: 4.66, status: "Inactiva", funnel: "MOFU", contactados: 0, agendados: 0, ventas: 0 },
  { name: "Retargeting Entrelingo (Old)", short: "Retargeting Old", leads: 43, spend: 169.92, cpl: 3.95, status: "Inactiva", funnel: "BOFU", contactados: 0, agendados: 0, ventas: 43 },
  { name: "Entrelingo WP (Activa)", short: "Entrelingo WP", leads: 23, spend: 139.11, cpl: 6.05, status: "Activa", funnel: "MOFU", contactados: 13, agendados: 0, ventas: 0 },
  { name: "AustraliaPRO WP (Activa)", short: "AuPRO WP", leads: 19, spend: 68.49, cpl: 3.60, status: "Activa", funnel: "MOFU", contactados: 0, agendados: 0, ventas: 0 },
  { name: "Retargeting Entrelingo (Activa)", short: "Retargeting Activa", leads: 8, spend: 132.11, cpl: 16.51, status: "Activa", funnel: "BOFU", contactados: 0, agendados: 0, ventas: 6 },
  { name: "SkillsPRO VSL Test A", short: "Test A ✅", leads: 9, spend: 120.02, cpl: 13.34, status: "Activa", funnel: "MOFU", contactados: 13, agendados: 10, ventas: 0 },
  { name: "SkillsPRO VSL Test B", short: "Test B ❌", leads: 5, spend: 101.65, cpl: 20.33, status: "Inactiva", funnel: "MOFU", contactados: 9, agendados: 4, ventas: 0 },
  { name: "AustraliaPRO VSL", short: "AuPRO VSL", leads: 0, spend: 108.90, cpl: 0, status: "Inactiva", funnel: "MOFU", contactados: 0, agendados: 0, ventas: 0 },
  { name: "SkillsPRO VSL Old", short: "SkillsPRO VSL", leads: 4, spend: 103.98, cpl: 26.00, status: "Inactiva", funnel: "MOFU", contactados: 0, agendados: 4, ventas: 0 },
];

const TOTAL_BUDGET = 2000; // Estimated monthly budget AUD
const totalSpend = campaigns.reduce((a, c) => a + c.spend, 0);
const totalLeads = campaigns.reduce((a, c) => a + c.leads, 0);
const avgCPL = totalSpend / totalLeads;
const budgetPct = ((totalSpend / TOTAL_BUDGET) * 100).toFixed(1);

const getColor = (c) => c.status === "Activa" ? GREEN : GRAY;
const getCPLColor = (cpl) => cpl <= 5 ? GREEN : cpl <= 15 ? YELLOW : RED;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: DARK, color: "white", padding: "10px 14px", borderRadius: 8, fontSize: 12 }}>
        <p style={{ fontWeight: "bold", marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === "number" && p.name.includes("AUD") ? `$${p.value.toFixed(2)}` : p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const KPICard = ({ label, value, sub, color, icon }) => (
  <div style={{ background: "white", borderRadius: 12, padding: "16px 20px", flex: 1, borderTop: `4px solid ${color}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
    <div style={{ fontSize: 11, color: GRAY, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 800, color: color, margin: "6px 0 2px" }}>{value}</div>
    <div style={{ fontSize: 11, color: MID }}>{sub}</div>
  </div>
);

export default function Dashboard() {
  const [filter, setFilter] = useState("Todas");
  const [activeTab, setFilter2] = useState("leads");

  const filtered = filter === "Todas" ? campaigns : campaigns.filter(c => c.status === filter);

  const cplData = [...filtered].filter(c => c.cpl > 0).sort((a, b) => a.cpl - b.cpl).map(c => ({
    name: c.short, cpl: c.cpl, color: getCPLColor(c.cpl), status: c.status
  }));

  const leadsData = [...filtered].sort((a, b) => b.leads - a.leads).map(c => ({
    name: c.short, leads: c.leads, spend: parseFloat(c.spend.toFixed(2)), status: c.status
  }));

  const pieData = [
    { name: "Activas", value: parseFloat(campaigns.filter(c => c.status === "Activa").reduce((a,c)=>a+c.spend,0).toFixed(2)) },
    { name: "Inactivas", value: parseFloat(campaigns.filter(c => c.status === "Inactiva").reduce((a,c)=>a+c.spend,0).toFixed(2)) },
    { name: "Presupuesto restante", value: parseFloat((TOTAL_BUDGET - totalSpend).toFixed(2)) },
  ];
  const PIE_COLORS = [GREEN, GRAY, LIGHT];

  const funnelData = [
    { stage: "Leads", testA: 9, testB: 5 },
    { stage: "Contactados", testA: 13, testB: 9 },
    { stage: "Agendados", testA: 10, testB: 4 },
    { stage: "Ejecutadas", testA: 2, testB: 0 },
  ];

  const tabs = [
    { id: "leads", label: "Leads y Spend" },
    { id: "cpl", label: "Costo por Lead" },
    { id: "budget", label: "Presupuesto" },
    { id: "funnel", label: "Test A vs B" },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#F4F8F6", minHeight: "100vh", padding: 20 }}>
      {/* Header */}
      <div style={{ background: DARK_GREEN, borderRadius: 14, padding: "20px 28px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: GREEN, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Entrelingo · Dashboard</div>
          <div style={{ color: "white", fontSize: 22, fontWeight: 800, marginTop: 4 }}>Panel de Control — Meta Ads Febrero 2026</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 4 }}>Datos reales · Última actualización: Feb 28, 2026</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Todas", "Activa", "Inactiva"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                background: filter === f ? GREEN : "rgba(255,255,255,0.15)", color: filter === f ? DARK : "white" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <KPICard label="Total invertido" value={`$${totalSpend.toFixed(0)}`} sub="AUD · Febrero 2026" color={DARK_GREEN} />
        <KPICard label="Total leads" value={totalLeads} sub="conversiones Meta Ads" color={DARK} />
        <KPICard label="CPL promedio" value={`$${avgCPL.toFixed(2)}`} sub="AUD por lead" color={MID} />
        <KPICard label="Presupuesto ejecutado" value={`${budgetPct}%`} sub={`$${totalSpend.toFixed(0)} / $${TOTAL_BUDGET} AUD`} color={parseFloat(budgetPct) > 85 ? RED : GREEN} />
        <KPICard label="Mejor CPL activa" value="$3.60" sub="AustraliaPRO WP Activa" color={GREEN} />
      </div>

      {/* Tabs */}
      <div style={{ background: "white", borderRadius: 14, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: `2px solid ${LIGHT}`, paddingBottom: 16 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setFilter2(t.id)}
              style={{ padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                background: activeTab === t.id ? DARK_GREEN : LIGHT,
                color: activeTab === t.id ? "white" : DARK }}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "leads" && (
          <div>
            <h3 style={{ color: DARK, margin: "0 0 16px", fontSize: 15 }}>Leads y Gasto por Campaña</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={leadsData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECF0F1" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: MID }} angle={-30} textAnchor="end" interval={0} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: MID }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: MID }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="leads" name="Leads" radius={[4,4,0,0]}>
                  {leadsData.map((entry, i) => <Cell key={i} fill={entry.status === "Activa" ? GREEN : GRAY} />)}
                </Bar>
                <Bar yAxisId="right" dataKey="spend" name="Gasto AUD" fill={MID} opacity={0.5} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: GRAY }}>
                <div style={{ width: 12, height: 12, background: GREEN, borderRadius: 2 }} /> Campaña Activa
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: GRAY }}>
                <div style={{ width: 12, height: 12, background: GRAY, borderRadius: 2 }} /> Campaña Inactiva
              </div>
            </div>
          </div>
        )}

        {activeTab === "cpl" && (
          <div>
            <h3 style={{ color: DARK, margin: "0 0 16px", fontSize: 15 }}>Costo por Lead (CPL) — Ranking de Eficiencia</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={cplData} layout="vertical" margin={{ top: 5, right: 60, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECF0F1" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: MID }} tickFormatter={v => `$${v}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: MID }} width={95} />
                <Tooltip formatter={(v) => [`$${v} AUD`, "CPL"]} />
                <Bar dataKey="cpl" name="CPL" radius={[0,4,4,0]}>
                  {cplData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  <LabelList dataKey="cpl" position="right" formatter={v => `$${v}`} style={{ fontSize: 10, fontWeight: 700, fill: DARK }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              {[[GREEN,"≤ $5 AUD (Excelente)"],[YELLOW,"$5–$15 AUD (Aceptable)"],[RED,"> $15 AUD (Revisar)"]].map(([c,l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: GRAY }}>
                  <div style={{ width: 12, height: 12, background: c, borderRadius: 2 }} /> {l}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "budget" && (
          <div style={{ display: "flex", gap: 30, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: DARK, margin: "0 0 16px", fontSize: 15 }}>Distribución del Presupuesto</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={120}
                    dataKey="value" nameKey="name" paddingAngle={3}
                    label={({ name, value }) => `${name}: $${value}`} labelLine={true}>
                    {pieData.map((entry, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`$${v} AUD`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: DARK, margin: "0 0 16px", fontSize: 15 }}>Ejecución por Campaña Activa</h3>
              {campaigns.filter(c => c.status === "Activa").map(c => (
                <div key={c.name} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: DARK, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{c.short}</span>
                    <span style={{ color: DARK_GREEN, fontWeight: 700 }}>${c.spend.toFixed(2)} AUD</span>
                  </div>
                  <div style={{ background: LIGHT, borderRadius: 4, height: 8, overflow: "hidden" }}>
                    <div style={{ background: getCPLColor(c.cpl), height: "100%", width: `${Math.min((c.spend / 500) * 100, 100)}%`, borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 10, color: GRAY, marginTop: 2 }}>CPL: ${c.cpl} AUD · {c.leads} leads</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "funnel" && (
          <div>
            <h3 style={{ color: DARK, margin: "0 0 4px", fontSize: 15 }}>Comparativa de Funnel: Test A vs Test B</h3>
            <p style={{ color: GRAY, fontSize: 12, margin: "0 0 20px" }}>Test A: CPL $13.34 AUD · Test B: CPL $20.33 AUD (+52%)</p>
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ flex: 2 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={funnelData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ECF0F1" />
                    <XAxis dataKey="stage" tick={{ fontSize: 11, fill: MID }} />
                    <YAxis tick={{ fontSize: 10, fill: MID }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="testA" name="Test A ✅" fill={GREEN} radius={[4,4,0,0]}>
                      <LabelList dataKey="testA" position="top" style={{ fontSize: 11, fontWeight: 700, fill: DARK_GREEN }} />
                    </Bar>
                    <Bar dataKey="testB" name="Test B ❌" fill={RED} radius={[4,4,0,0]}>
                      <LabelList dataKey="testB" position="top" style={{ fontSize: 11, fontWeight: 700, fill: RED }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1 }}>
                {[
                  { metric: "CPL", a: "$13.34", b: "$20.33", winner: "a" },
                  { metric: "Leads generados", a: "9", b: "5", winner: "a" },
                  { metric: "Gasto total", a: "$120", b: "$102", winner: "b" },
                  { metric: "Tasa agendamiento", a: "77%", b: "44%", winner: "a" },
                  { metric: "Ejecutadas", a: "2", b: "0", winner: "a" },
                ].map(r => (
                  <div key={r.metric} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10, alignItems: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: MID }}>{r.metric}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: r.winner === "a" ? DARK_GREEN : DARK, textAlign: "center",
                      background: r.winner === "a" ? "#D5F5E3" : LIGHT, borderRadius: 6, padding: "4px 8px" }}>{r.a}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: r.winner === "b" ? DARK_GREEN : RED, textAlign: "center",
                      background: r.winner === "b" ? "#D5F5E3" : "#FADBD8", borderRadius: 6, padding: "4px 8px" }}>{r.b}</div>
                  </div>
                ))}
                <div style={{ background: "#D5F5E3", borderRadius: 8, padding: "10px 12px", marginTop: 12, fontSize: 11, color: DARK_GREEN, fontWeight: 700 }}>
                  Decision: Pausar Test B y redirigir 100% del budget a Test A
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: GRAY }}>
        Prueba Técnica — Entrelingo 2026 · Datos reales Meta Ads Febrero · Panel diseñado con metodología de toma de decisiones basada en datos
      </div>
    </div>
  );
}
