---
name: project Overview Writer
description: Write project overview for developer to understand the project
---



Analyze the provided GitHub repository and generate a concise, business-friendly **Project Overview** document as **project_overview.md**

The goal is to help a new developer, manager, interviewer, or stakeholder quickly understand the project without reading the entire codebase.

Analyze the actual source code, architecture, APIs, dependencies, configuration files, and project structure. Do not simply summarize the README.

Keep the output short, practical, and easy to scan. Focus only on the most important information.

Use the following format:

# Project Overview: <Project Name>

## What It Does

A 1–2 paragraph summary explaining:

* The purpose of the project
* The problem it solves
* The intended users
* The primary value it delivers

## How It Works

Briefly describe the main workflow in 4–8 bullet points:

* Request/input flow
* Core processing logic
* Data sources
* Output generation

## Architecture

Summarize the system in a few bullets:

* Main services/components
* Technologies/frameworks used
* Communication between components

## Key Dependencies

List only critical dependencies such as:

* Databases
* External APIs
* Required datasets/files
* Third-party services

## Setup Requirements

Provide only the essential requirements needed to run the project:

* Important files
* Environment variables
* Startup commands
* Critical configuration

## Key Highlights

Provide 5–8 high-value bullet points covering:

* Unique capabilities
* Scalability or performance considerations
* Automation features
* Important architectural decisions
* Critical limitations or dependencies

### Rules

* Maximum length: ~500–800 words.
* Avoid repeating information across sections.
* Prioritize important insights over implementation details.
* Explain technical concepts in plain English.
* Mention only code-backed findings.
* Ignore minor utilities, helper functions, and boilerplate.
* Focus on what a new engineer or manager must know within 5 minutes.
* Write in a professional but concise style.

Output only the completed Project Overview document.
