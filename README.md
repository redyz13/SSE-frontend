# 🌱 Rently Frontend — SSE Version

## 📌 Overview

This repository contains the **frontend of the Rently project**, originally developed by students of the Software Engineering course.
We forked the original project (full credit to the authors: [https://github.com/rently-unisa/front-end](https://github.com/rently-unisa/front-end)) and extended it as part of the **Sustainable Software Engineering (SSE)** course.

The objective of this work is to **evaluate and improve the environmental and performance sustainability** of the frontend using the tools introduced during the course.

The repository includes three branches used during the analysis:

```
├─ baseline/            # version before sustainability evaluations
├─ sse-improvements/    # version after sustainability enhancements
└─ main                 # final integrated frontend
```

Experiment logs, tool outputs, and structured reports are stored under:

```
sse-reports/
   ├─ baseline/
   └─ sse-improvements/
```

Each directory contains:

* Raw tool results
* Screenshots
* Analysis notes

---

## 🌍 Sustainability Tools

As part of the SSE course activities, the frontend was evaluated using the tools presented during the laboratory sessions.
Each tool contributes to a different dimension of software sustainability.

---

### 🌐 **WebsiteCarbon**

WebsiteCarbon estimates the environmental impact of a public web page.
It provides metrics such as:

* CO₂ emitted per page view
* Estimated yearly emissions
* Grade (A+–F)
* Green hosting classification
* Comparison with other tested sites

In this project, WebsiteCarbon was used to evaluate the deployed version of the frontend hosted via GitHub Pages.
* **GitHub Pages:**
[https://redyz13.github.io/SSE-frontend/](https://redyz13.github.io/SSE-frontend/)

---

### 🍃 **EcoIndex**

EcoIndex analyzes web pages by estimating their environmental footprint based on:

* DOM complexity
* Number of HTTP requests
* Total page weight

EcoIndex generates indicators such as:

* EcoIndex score (0–100)
* Grade (A–G)
* Water consumption
* Greenhouse gas emissions

In this project, EcoIndex was used to evaluate the deployed version of the frontend hosted via GitHub Pages
* **GitHub Pages:**
[https://redyz13.github.io/SSE-frontend/](https://redyz13.github.io/SSE-frontend/)

---

### 🖼️ **GreenIT-Analysis**

GreenIT-Analysis is a browser extension that evaluates the environmental impact and performance characteristics of individual web pages.
For the frontend, it provides insights on:

* DOM complexity
* Media and image optimization
* CSS/JS weight
* Page loading impact
* Recommendations for reducing resource usage

Because the frontend is a Single Page Application (SPA), GreenIT-Analysis was also used to analyze different *logical views* of the application through forced reloads and navigation.

---

## 🔐 **FOSSA (License Compliance & Open-Source Governance)**

FOSSA is an automated tool integrated into the project’s CI/CD pipeline to ensure **license compliance**, detect dependency conflicts, and verify compatibility with the project’s chosen license (MIT).
It performs static analysis of all dependencies (direct and transitive) and generates:

* A complete **dependency inventory**
* License compatibility checks
* Identification of potential **legally risky libraries**

In this project, FOSSA was used to:

* Validate that all dependencies comply with MIT licensing
* Detect and handle flagged or ambiguous licenses early in CI/CD
* Ensure sustainable long-term maintainability by avoiding compliance debt

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B59104%2Fgithub.com%2Fredyz13%2FSSE-frontend.svg?type=shield&issueType=license)](https://app.fossa.com/projects/custom%2B59104%2Fgithub.com%2Fredyz13%2FSSE-frontend?ref=badge_shield&issueType=license)

---

## 🧭 **GUIDO (Community Smell Detection Tool)**

GUIDO is an academic tool developed at the University of Salerno to identify **community smells**—undesirable patterns of collaboration or communication that may lead to social or organizational debt.

GUIDO operates as an interactive chatbot that:

1. Collects information on the team structure and collaboration habits
2. Computes metrics such as **Dispersion Value**, communication redundancy, and cross-team connectivity
3. Detects communication patterns.
4. Suggests refactoring strategies for healthier, more sustainable teamwork.

---
## 🐳 Running the Frontend with Docker

### 1️⃣ Create a `.env` file

The frontend uses only one environment variable:

```
VITE_APP_BACKEND_URL=http://localhost:4000
```

If not provided, the application defaults to:

```
http://localhost:4000
```

As defined in `api.js`:

```js
export const API_BASE =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
```

---

### 2️⃣ Run the Frontend

```bash
docker compose up --build
```

This command starts:

* `frontend` → Production container

The application will be available at:

```
http://localhost/SSE-frontend
```

---

## 👥 Credits

Original frontend authors: [https://github.com/rently-unisa/front-end](https://github.com/rently-unisa/front-end)
