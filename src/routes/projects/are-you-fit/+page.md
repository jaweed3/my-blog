---
title: AreUFit
slug: are-you-fit
description: AI-powered resume analyzer that matches candidates to job descriptions with personalized improvement recommendations.
excerpt: Automates resume screening with AI — parses PDF/DOCX resumes, matches skills to job descriptions, and delivers actionable improvement suggestions.
coverImage:
date: 2025-03-22
tags:
  - NLP
  - HR Tech
  - AI
techStack:
  - Python
  - FastAPI
  - SpaCy
  - scikit-learn
  - SQLite
github: https://github.com/jaweed3/are-you-fit
status: active
featured: false
hidden: false
impact: Automates resume screening with AI — matching candidates to jobs in seconds instead of hours
problem: HR teams spend hours manually screening resumes against job descriptions, applying inconsistent criteria and introducing unconscious bias into the hiring pipeline
results:
  - "Parse PDF and DOCX resumes automatically with PyMuPDF + python-docx"
  - "TF-IDF vectorization + cosine similarity for objective skill matching"
  - "Personalized improvement suggestions with skill gap analysis"
  - "Course recommendations for missing skills"
outcome: Accelerates hiring pipelines by automating initial resume screening with objective, data-driven candidate-job matching
---

## Problem

Recruitment teams face a scalability crisis:
- **Hours wasted**: Screening 100+ resumes per position manually
- **Inconsistent criteria**: Different reviewers weigh different factors
- **Unconscious bias**: Human reviewers are susceptible to bias in initial screening
- **Slow time-to-hire**: Top candidates are lost while HR works through the pile

Junior and mid-level positions receive hundreds of applications — the bottleneck is always the same: initial screening.

## Solution

AreUFit automates the initial screening with AI:
1. **Upload resume** (PDF/DOCX) — automatically parsed and structured
2. **Enter job description** — system analyzes requirements
3. **Instant match score** — TF-IDF + NLP-based skill matching
4. **Actionable insights** — specific skills to develop, course recommendations

## Business Impact

| Before | After |
|--------|-------|
| 15-30 minutes per resume for initial screen | 2-3 seconds per resume — fully automated |
| Inconsistent criteria across reviewers | Objective, reproducible scoring algorithm |
| High risk of unconscious bias | Data-driven matching based on job requirements |
| 2-3 weeks time-to-hire for positions | Initial screening done in hours, not days |

## Results

- **Automated parsing** of PDF and DOCX resumes
- **Skill matching** using TF-IDF vectorization + SpaCy NLP
- **Match score** with granular skill gap breakdown
- **Personalized recommendations** — specific courses and skills to develop
- **SQLite-backed** — persistent storage for candidate tracking
- **FastAPI backend** — easy to integrate with existing HR systems
