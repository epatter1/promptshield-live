## ⭐ **Teacher Dashboard — Master Restore Pack (MCP‑Aligned Edition)**  
### *Canonical Project Context & Architecture Specification*

This README defines the **authoritative, end‑to‑end context** for the Teacher Dashboard project, including:

- UI/UX baseline (Phase 7)  
- Deterministic safety pipeline  
- Agentic security layer  
- Safe RAG integration  
- Agent ecosystem  
- MCP‑aligned activation points  
- Full roadmap (Phases 8–14)  
- Design philosophy  

Paste this into any new environment or share with collaborators to restore the full project state.

---

## 📘 **Overview**

The Teacher Dashboard is a **multi‑phase AI Safety platform** designed for educators.  
It ingests student prompts, processes them through a deterministic safety pipeline, and provides:

- Analytics  
- Session replay  
- Risk insights  
- Governance tools  
- Archiving  
- Filtering  
- Session grouping  

The system must remain **teacher‑friendly**, **stable**, and **predictable**.

---

## 🧩 **Phase 7 — UI/UX Baseline (Golden Master)**  
This is the **canonical UI** and must remain stable unless explicitly updated.

### **Hybrid Layout**
- Desktop/tablet → table  
- Mobile → cards  
- Modal rendered via `createPortal` into `#modal-root`  
- Modal navigation respects sorted order  
- Archive panel visible on mobile  
- No sticky headers  
- No animations  
- No layout drift  

### **Mobile Interaction Rules**
- Long‑press enters selection mode  
- Long‑press toggle (stored in `localStorage`)  
- Sticky bottom action bar (`pb-16`)  
- Archive panel uses `pb-16`  
- Checkbox on mobile cards is top‑right  
- No accidental long‑press  

### **Files Updated in Phase 7**
- `DashboardClient.tsx`  
- `EventsTable.tsx`  
- `ArchiveManager.tsx`  

### **UX Philosophy**
- Stable  
- Predictable  
- Low cognitive load  
- Teacher‑first  

---

## 🔐 **Deterministic Safety Pipeline**

The backend pipeline includes:

- Classification  
- Risk scoring  
- Injection detection  
- Rewrite logic  
- Metadata logging  
- Latency tracking  
- Toxicity evaluation  

This pipeline is **non‑RAG**, deterministic, and auditable.

---

## 🛡️ **Agentic Security Layer (Zero‑Trust Agents)**

Agents operate behind the scenes with strict governance.

```
AGENTIC SECURITY LAYER (Zero Trust + Explainability + Policy)
⬆
AGENT RUNTIME (identity, permissions, allowlists, sandbox)
⬆
SAFETY PIPELINE (classification → risk → injection → rewrite)
⬆
TEACHER DASHBOARD (analytics, replay, governance)
```

### **Agent Flow**
Teacher Prompt  
→ Safety API  
→ Agent Dispatch Controller  
→ Agent Runtime  
→ Safety Agents  
→ Governance Layer  
→ Teacher Dashboard UI

---

## 📚 **Safe RAG (Retrieval‑Augmented Governance)**

The system uses **Safe RAG**, not general RAG.

### **Safe RAG Rules**
- Only inside specific agents  
- Only for explanation, governance, analytics  
- Never for classification or risk scoring  
- Read‑only  
- Scoped to a small, vetted, versioned corpus  
- Outputs validated by Governance Agents  
- Retrieval logged and auditable  
- Tenant‑scoped corpora  

### **Safe RAG Use Cases**
- Explainability (“Explain this risk using policy text”)  
- Governance (“Retrieve relevant policy for this override”)  
- Analytics (“Explain this trend using definitions”)  
- Replay (“Ground narration in policy definitions”)  
- Automation (“Policy‑grounded summaries”)  

---

## 🤖 **Agent Ecosystem**

### **Safety Pipeline Agents**
- Classification Agent  
- Risk Scoring Agent  
- Injection Detection Agent  
- Rewrite Agent  
- Risk Explanation Agent  
- Classification Challenge Agent  

### **Analytics Agents**
- Trend Analysis Agent  
- Risk Insight Agent  
- Student Behavior Summary Agent  

### **Replay Agents**
- Replay Narration Agent  
- Injection Trace Agent  
- Comparison Agent  

### **Governance Agents**
- Governance Consistency Agent  
- Override Validation Agent  
- Policy Compliance Agent  

### **Real‑Time Monitoring Agents**
- Risk Spike Detector Agent  
- Injection Burst Agent  
- Latency Anomaly Agent  
- Live Session Watcher Agent  

### **Automation Agents**
- Auto‑Flag Agent  
- Auto‑Tag Agent  
- Auto‑Archive Agent  
- Auto‑Summary Agent  
- Auto‑Risk Scoring Agent  

### **Security Agents**
- Agent Behavior Anomaly Detector  
- Agent Policy Enforcement Agent  
- Agent Rate‑Limit Monitor  

---

## 🗺️ **Roadmap (Phases 8–14)**  
## *Now updated to reflect MCP‑aligned activation points.*

---

## ⭐ **Phase 8 — Analytics Panel (Agents Begin, MCP Not Required Yet)**  
**Purpose:** Insight generation, not autonomy.

### Features
- Risk distribution  
- Injection timeline  
- Latency histogram  
- Student breakdowns  
- Model comparison  
- Chart interactivity  

### Agentic Activation
- **Trend Analysis Agent**  
- **Risk Insight Agent**  
- **Student Behavior Summary Agent**

### Safe RAG
- Policy‑grounded trend explanations  

### MCP Relevance
- **LOW**  
Agents are read‑only and do not require tool permissions or governance.

---

## ⭐ **Phase 9 — Session Replay Enhancements (Agents Become Narrative)**  
**Purpose:** Replay intelligence.

### Features
- Full chronological replay  
- Risky turn highlighting  
- Raw vs safe comparison  

### Agentic Activation
- **Replay Narration Agent**  
- **Injection Trace Agent**  
- **Comparison Agent**

### Safe RAG
- Policy‑grounded narration  

### MCP Relevance
- **MEDIUM**  
Agents begin calling internal utilities, but still no write‑actions.

---

# ⭐ **Phase 10 — Admin Tools & Governance (MCP Foundations Begin)**  
**Purpose:** Governance, permissions, identity.

### Features
- Teacher notes  
- Custom thresholds  
- Categories  
- Audit logs  

### Agentic Activation
- **Identity Registry Agent**  
- **Permission Scope Agent**  
- **Tool‑Use Allowlist Agent**  
- **Agent Audit Log Agent**  
- **Governance Consistency Agent**

### Safe RAG
- Policy retrieval for governance decisions  

### MCP Relevance
- **HIGH**  
This is where MCP‑style identity, permissions, and tool governance become required.

---

## ⭐ **Phase 10.5 — Explainability & Challenge System (MCP‑Style Tool Calls)**  
**Purpose:** Explainability + challenge workflows.

### Features
- Explain classification modal  
- Challenge workflow  
- Override classification/risk  

### Agentic Activation
- **Reasoning Trace Viewer Agent**  
- **Challenge Agent**  
- **Override Agent**

### Safe RAG
- Explainability RAG  
- Challenge‑grounding RAG  

### MCP Relevance
- **VERY HIGH**  
Agents now call tools, retrieve policy, validate overrides — this is MCP‑style behavior.

---

## ⭐ **Phase 11 — Real‑Time Monitoring (MCP‑Style Background Agents)**  
**Purpose:** Live safety monitoring.

### Features
- Live event stream  
- Live risk alerts  
- Live injection detection  

### Agentic Activation
- **Risk Spike Detector Agent**  
- **Injection Burst Agent**  
- **Latency Anomaly Agent**  
- **Live Session Watcher Agent**

### Safe RAG
- Policy‑grounded alert explanations  

### MCP Relevance
- **CRITICAL**  
Agents now behave like MCP background services.

---

## ⭐ **Phase 12 — AI Safety Automation Layer (Autonomous MCP Agents)**  
**Purpose:** Controlled autonomy.

### Features
- Auto‑flagging  
- Auto‑tagging  
- Auto‑summaries  

### Agentic Activation
- **Auto‑Flag Agent**  
- **Auto‑Tag Agent**  
- **Auto‑Archive Agent**  
- **Auto‑Summary Agent**  
- **Auto‑Risk Scoring Agent**

### Safe RAG
- Policy‑grounded automation summaries  

### MCP Relevance
- **MAXIMUM**  
Agents now take actions; MCP governance is mandatory.

---

## ⭐ **Phase 13 — Multi‑Teacher / Multi‑Class Support (Tenant‑Scoped MCP)**  
**Purpose:** Multi‑tenant isolation.

### Features
- Multi‑tenant support  
- RBAC  
- Class‑level analytics  

### Agentic Activation
- **Tenant‑Scoped Agents**

### Safe RAG
- Tenant‑scoped corpora  

### MCP Relevance
- **SYSTEM‑LEVEL**  
Agents must be tenant‑aware and permission‑scoped.

---

## ⭐ **Phase 14 — Production Hardening (Compliance‑Grade MCP)**  
**Purpose:** Enterprise‑grade integrity.

### Features
- Rate limiting  
- Logging  
- Monitoring  
- Load testing  

### Agentic Activation
- **Agent Telemetry Agent**  
- **Agent Anomaly Detector**  
- **SBOM‑Style Agent Manifest Generator**

### Safe RAG
- Corpus versioning  
- Integrity checks  
- Retrieval logging  

### MCP Relevance
- **FULL MCP GOVERNANCE**  
This is where the system reaches compliance‑grade agent governance.

---

## 🎓 **Teacher Experience Philosophy**

Agents and RAG **never** complicate the teacher’s workflow.

The UI remains:

- Familiar  
- Clean  
- Predictable  
- Stable  
- Low‑cognitive‑load  

Agents run behind the scenes unless explicitly surfaced.
