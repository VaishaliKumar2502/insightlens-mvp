# 🔎 InsightLens

# AI-powered Decision Intelligence Copilot

> **Transform scattered research into confident, evidence-backed decisions.**

InsightLens helps professionals move beyond document summarization by transforming multiple research sources into transparent, explainable, and actionable decision briefs.

---

# 🌐 Live Demo

**Application**

https://insightlens-mvp.vercel.app/

---

# 🚀 Problem Statement

## **We don't have an information problem anymore. We have a decision problem.**

Every important decision—whether choosing a business strategy, approving an insurance claim, selecting a vendor, reviewing a contract, evaluating an investment, or defining product direction—is backed by information scattered across reports, contracts, meeting notes, policies, research papers, and internal documents.

While Generative AI can summarize documents, decision-makers are still left asking:

* Do we have enough evidence to move forward?
* What critical information is missing?
* Which conclusions are backed by evidence?
* Are different sources contradicting each other?
* What risks remain?
* What additional evidence could change this decision?

Professionals still spend hours manually validating evidence, comparing documents, identifying blind spots, and preparing decision briefs.

**InsightLens transforms scattered research into evidence-backed decisions.**

Instead of simply summarizing documents, it:

* 📄 Understands multiple research sources together
* 🔍 Extracts supporting evidence
* ⚠️ Identifies risks, contradictions, and missing information
* 📊 Evaluates research readiness
* 💡 Generates recommendations, alternatives, confidence, and next steps

Rather than replacing human judgment, InsightLens augments it—helping professionals move from:

> **"I have too much information."**

to

> **"I know exactly what decision to make, why, and what evidence supports it."**

---

# ✨ Key Features

* 📄 Multi-document upload (PDF, DOCX, TXT)
* 🤖 AI-powered decision analysis
* 📊 Research Readiness assessment
* 🔍 Supporting Evidence extraction
* ⚠️ Risk & contradiction detection
* 💡 Evidence-backed recommendations
* 📈 Confidence scoring
* 📑 Export decision brief as PDF

---

# 📸 Application Preview

> Additional screenshots are available inside the **`docs/`** folder.
>
> <table>

<tr>
<td align="center">
<b>Landing Page</b><br><br>
<img src="docs/Upload panel 1.png" width="420">
</td>

<td align="center">
<b>About InsightLens</b><br><br>
<img src="docs/About Page2.png" width="420">
</td>
</tr>

<tr>
<td align="center">
<b>Research Workspace</b><br><br>
<img src="docs/Research corpus ready.png" width="420">
</td>

<td align="center">
<b>Decision Context</b><br><br>
<img src="docs/Decision context screen 1.png" width="420">
</td>
</tr>

<tr>
<td align="center">
<b>AI Analysis</b><br><br>
<img src="docs/Research readiness.png" width="420">
</td>

<td align="center">
<b>Decision Brief</b><br><br>
<img src="docs/Decision Brief.png" width="420">
</td>
</tr>

</table>

---

# ⚡ Quick Start

No installation required.

### 1. Open the application

https://insightlens-mvp.vercel.app/

### 2. Configure Gemini

Settings → **Configure API**

Paste your Google Gemini API Key.

The key is:

* Stored locally in your browser
* Never uploaded to any server
* Automatically validated before use

### 3. Load Sample Project

Click **Use Sample Project**

(or upload your own PDF, DOCX or TXT files)

### 4. Example Workflow

Select **Employment Agreement.docx**

Enter the following decision:

> **Should I sign this employment agreement?**

Click **Analyze Research**

InsightLens generates:

* Decision Brief
* Analysis Summary
* Research Readiness
* Key Findings
* Major Themes
* Supporting Evidence
* Risks & Contradictions
* Missing Evidence
* Recommendations
* Next Steps

Finally,

Click **Download PDF** to export the complete decision brief.

---

# 🌍 Potential Applications

InsightLens can support evidence-backed decision making across:

* 💼 Consulting & Strategy
* 🏦 Banking & Finance
* ⚖️ Legal & Compliance
* 🏥 Healthcare & Insurance
* 🏢 Enterprise Operations
* 🚀 Product & Market Research
* 🎓 Research & Academia

Any workflow that requires reviewing multiple documents before making an important decision can benefit from InsightLens.

---

# 🛠 Technology Stack

| Category         | Technology          |
| ---------------- | ------------------- |
| Framework        | Next.js App Router  |
| Language         | TypeScript          |
| UI               | React               |
| Styling          | Tailwind CSS        |
| AI               | Google Gemini       |
| Document Parsing | pdfjs-dist, mammoth |
| Deployment       | Vercel              |

---

# 🏗 Architecture

```text
Documents
(PDF • DOCX • TXT)

        │
        ▼

Document Parsing

        │
        ▼

Research Corpus

        │
        ▼

Decision Context

        │
        ▼

Google Gemini

        │
        ▼

Evidence-backed Decision Brief
```

---

# 🚀 Roadmap

* Research Chat
* Multi-document citations
* PowerPoint export
* Collaborative workspaces
* Cloud projects
* Research history
* Advanced confidence scoring

---

# 🎯 Design Principles

Every recommendation generated by InsightLens follows four principles:

* Evidence before opinion
* Explain every recommendation
* Highlight uncertainty
* Help users make faster, more informed decisions

---

# ⚠ Disclaimer

InsightLens is designed to assist decision-making—not replace professional legal, financial, medical, or regulatory advice.

Users should always review the original source documents before acting on AI-generated recommendations.

---

# 👩‍💻 Author

**Vaishali Kumar**

Built for **Build With AI UAE Hackathon 2026**

Powered by **Google Gemini**

---

## ⭐ Vision

> **The future of AI is not just answering questions.**
>
> **It is helping people make better decisions.**
>
> **InsightLens doesn't just summarize research.**
>
> **It transforms research into decisions.**
