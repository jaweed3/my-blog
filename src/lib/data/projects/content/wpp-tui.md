---
title: wpp-tui
slug: wpp-tui
description: A terminal-based WhatsApp client with chat, archive, rename, poll decryption and event logging — built on Baileys and Ink.
excerpt: WhatsApp in the terminal — chat, archive, rename, poll decryption and event logging, built on the reverse-engineered web protocol with Ink for the TUI.
date: 2026-07-26
tags:
  - Developer Tools
  - CLI
  - TypeScript
techStack:
  - TypeScript
  - Baileys
  - Ink
  - pnpm
github: https://github.com/jaweed3/wpp-tui
status: active
featured: false
hidden: false
impact: Puts WhatsApp in the terminal for anyone who lives there — the CLI surface where it is actually usable alongside a real work session
stats:
  - value: 'npm'
    label: 'Published Package'
  - value: 'Ink'
    label: 'React for Terminal'
  - value: 'GPL-3.0'
    label: 'License'
problem: WhatsApp has no terminal client, and no third-party desktop client has ever been more than a wrapper that still needs the web session. For people who keep a long-running terminal open all day, there is no way to check messages without alt-tabbing away from whatever they are actually doing.
results:
  - 'Full chat and send from the terminal — no browser session required'
  - 'Archive and rename conversations without leaving the TUI'
  - 'Poll decryption, so polls are readable instead of showing as opaque notifications'
  - 'Event logging — message traffic is written to disk as structured events'
  - 'Published to npm as a global CLI (`npm i -g wpp-tui`)'
outcome: The only part of WhatsApp most people cannot do from anywhere else — check messages without opening a browser — turned into a terminal-native workflow
---

## Problem

There is no terminal WhatsApp client. Every third-party desktop app is a wrapper that still requires an active web session, which means a browser login and a Chromium process running in the background.

For anyone who keeps a terminal open all day, the cost of checking a message is not small: alt-tab, find the window, deal with the tab strip. Small cost, dozens of times a day.

## Approach

Built on two libraries that make this practical:

- **[Baileys](https://github.com/WhiskeySockets/Baileys)** — the reverse-engineered WhatsApp Web protocol, maintained as a proper Node library
- **[Ink](https://github.com/vadimdemedes/ink)** — React for the terminal, so components, state and layout work the way they do on the web

Ink is the reason this is more than a `readline` loop. Chat lists, conversation views and the poll renderer are components with state, not escape sequences assembled by hand.

## Features

| Feature         | Why it matters                                        |
| --------------- | ----------------------------------------------------- |
| Chat and send   | The core loop, terminal-native                        |
| Archive         | The most-used action on every other client            |
| Rename          | Fixing contacts without leaving the TUI               |
| Poll decryption | Polls are actually readable, not opaque notifications |
| Event logging   | Message traffic written to disk as structured events  |

**Poll decryption** is the feature that makes it more than a novelty. Polls are common in Indonesian group chats and effectively unreadable everywhere else — the media is encrypted separately and clients just render "poll" with no content.

**Event logging** turns the client into something scriptable. Message traffic lands on disk as structured events, so anything downstream can consume it without screen-scraping.

## Install

```bash
npm install -g wpp-tui    # global CLI
npx wpp-tui               # or run directly
```

Or from source, using a pnpm workspace:

```bash
git clone https://github.com/jaweed3/wpp-tui
cd wpp-tui
pnpm install
pnpm dev
```

Published to npm, GPL-3.0, with a `CHANGELOG.md`, tests and a Makefile.
