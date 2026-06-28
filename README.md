# InsightLens 🔎

> **Evidence-backed Research Decision Copilot**
>
> Transform scattered research into confident, evidence-backed decisions using AI.

---

# Live Demo

Try InsightLens instantly without installing anything.

**Application**

https://insightlens-mvp.vercel.app/

# Quick Start

No installation is required.

### Step 1

Open the deployed application.

### Step 2

Click **Settings** on left bottom of the screen and select **Configure API**

### Step 3

Paste your Google Gemini API Key. 

It automatically validates. 

Click on **Save Configuration**.

The key is stored locally inside your browser and never uploaded to any server.

### Step 4

Upload your own research files or use the included Sample Project.

### Step 5

Describe the decision you want help making.

Example:

```
Step 1: Upload Sample Project
Step 2: Ensure Employee Agreement.docx file is successfully uploaded and selected on the left sidepanel.
Step 3: Click on Continue
Step 4: Enter 'Should I sign this employment agreement?' in the What decision are you trying to make? * placeholder
Step 5: Enter Goals, constraints, preferences, decision criterial if required. or you may kee them empty as they are optional. 
Step 6: Scroll down and click on 'Analyze research'
Step 7: Wait to retry if error is thrown and click again
Step 8: InsightLens will generate

- Decision Brief
- Analysis Summary
- Research readiness
- What Could Change This Decision?
- Risks, Contradictions & Alternatives
- Recommended Next Steps
- Key Findings
- Major Themes
- Supporting Evidence
- Other Missing Evidence

Step 9: Click on 'Download PDF' to export output in PDF.

```

## Overview

InsightLens is an AI-powered decision intelligence application that helps users transform multiple research documents into structured, evidence-backed recommendations.

Instead of manually reading PDFs, reports, meeting notes, contracts, and research papers, users upload their documents, describe the decision they are trying to make, and receive an AI-generated decision brief grounded in the selected evidence.

The application focuses on transparency by explaining:

- What the evidence supports
- What important information is missing
- Remaining risks
- Alternative approaches
- Confidence behind the recommendation
- Next recommended actions

---

## Problem Statement

Decision makers often need to review dozens of research documents before making an important decision.

Examples include:

- Business strategy
- Vendor selection
- Investment research
- Insurance claims
- Policy reviews
- Internal audits
- Product launches
- Market research

Reading every document manually is slow, repetitive, and increases the chance of missing important evidence.

InsightLens accelerates this process by generating a structured, source-aware decision brief.

---

# Features

## 📄 Multi-document Research Upload

Upload multiple research sources including:

- PDF
- DOCX
- TXT

Features include

- Drag & Drop upload
- Upload progress
- File validation
- Remove files
- Sample project
- Research corpus management
- Source selection before analysis

---

## 🧠 AI Decision Analysis

Generate a complete evidence-backed decision brief containing

- Analysis Summary
- Key Findings
- Major Themes
- Supporting Evidence
- Final Recommendation
- Confidence Score
- Risks
- Alternatives
- Decision-changing gaps
- Next Steps

---

## 🔍 Research Readiness

InsightLens identifies

- Missing evidence
- Weak research areas
- Contradictions
- Remaining uncertainty
- Decision risks

rather than simply summarizing documents.

---

## 📚 Evidence-aware Outputs

Recommendations are generated only from the selected research sources.

The application explains

- why a recommendation was made
- which evidence supports it
- what information is still missing

---

## 🎨 Clean Modern UI

- Responsive layout
- Progressive loading
- Research workflow
- Sidebar navigation
- Professional decision workspace

---

# Architecture

```
                 Documents

     PDF   DOCX   TXT

              │

              ▼

      Document Parsing

              │

              ▼

     Research Corpus Builder

              │

              ▼

      Decision Context

              │

              ▼

       Gemini AI Analysis

              │

              ▼

 Structured Decision Brief
```

---

# Technology Stack

| Category | Technology |
|-----------|------------|
| Framework | Next.js App Router |
| Language | TypeScript |
| UI | React |
| Styling | Tailwind CSS |
| AI | Google Gemini API |
| Document Parsing | pdfjs-dist, mammoth |
| Deployment | Vercel |

---

# Project Structure

```
app/

components/
    UploadPanel.tsx
    Workspace.tsx
    Sidebar.tsx
    ResultsScreen.tsx
    DecisionContext.tsx
    SettingsModal.tsx

lib/
    documentParser.ts

public/
    sample-project/

docs/

package.json
```

---

# Current Capabilities

- Upload multiple research documents
- Select research sources
- Decision context input
- AI-powered research analysis
- Executive summaries
- Recommendation generation
- Evidence inspection
- Major theme extraction
- Research readiness analysis
- Missing evidence detection
- Alternative recommendations
- Risk identification

---

# Limitations

Current MVP limitations include

- Requires a Gemini API key
- No authentication
- Local-first prototype
- Long documents may be shortened before analysis to remain within model limits

---

# Future Roadmap

- Multi-document citations
- Research chat
- PowerPoint export
- Research comparison mode
- Collaborative workspaces
- Persistent projects
- User authentication
- Cloud storage
- Research history
- Team sharing
- Advanced confidence scoring


---

# Design Principles

InsightLens was designed around four core principles:

- Evidence before opinion
- Explain every recommendation
- Highlight uncertainty
- Help users make faster, better-informed decisions

---

# Disclaimer

InsightLens is intended to assist decision making and should not replace professional legal, financial, medical, or regulatory advice.

Users should always review original source documents before acting on AI-generated recommendations.

---

## Author

**Vaishali Kumar**

Build With AI UAE Hackathon 2026

Powered by Google Gemini
