---
title: Yapping — anonymous venting on Nostr
slug: yapping
description: An anonymous, anti-buzzer, anti-censorship venting app built on the Nostr protocol — no central server that can be switched off.
excerpt: Anonymous Indonesian-language venting app on Nostr — identity is a cryptographic key you hold, not an account on someone's server. Live at yapping.my.id.
coverImage: images/features/yapping.png
date: 2026-08-16
tags:
  - Web3
  - Privacy
  - Social
techStack:
  - Svelte
  - Nostr
  - Ink
github: https://github.com/jaweed3/suara
status: active
featured: true
hidden: false
impact: Replaces platform trust with protocol guarantees — anonymity and uncensorability come from cryptography and relay topology, not from a company's policy
stats:
  - value: 'Nostr'
    label: 'Underlying Protocol'
  - value: 'MIT'
    label: 'License'
  - value: 'yapping.my.id'
    label: 'Live'
problem: The conversations most worth having safely are the ones platforms are least able to host safely. Centralized platforms can be shut down, can shadowban silently, and concentrate moderation power in one company that can be compelled to hand over accounts.
results:
  - 'Anonymity is structural: identity is a cryptographic key held by the user, not an account row on a server'
  - 'Relays store no durable trace that can be handed to a third party'
  - 'Multi-relay publishing means no single server can take content down'
  - 'Three feed lenses — Following / Latest / Trusted — with Trusted tuned via Web of Trust to dampen spam and buzzer accounts'
  - 'Threads and replies, localized for Indonesian-language conversation'
outcome: Ships a working, deployed product where the privacy and censorship-resistance claims are structural properties of the protocol rather than terms-of-service promises
---

## Problem

The things people most need to say — toxic workplaces, family pressure, bad relationships, criticism of the government — are exactly the things that get punished on centralized platforms. Those platforms are architecturally single points of failure: one server can be disabled, one algorithm can bury a post without explanation, one company can be compelled to hand over an identity.

Terms of service promising not to do that are worth nothing, because the capability is still there.

## Solution

Yapping is built on **Nostr**, an open social protocol with no central server:

```
You write → event signed with YOUR key → published to many relays
                                                        ↓
                              Other relays in the Nostr network can also
                              read it (protocol is universal)
```

That single design choice is the whole product. Your identity is a cryptographic key in your hands, not a row in someone's database. Relays forward content but hold nothing durable that could be subpoenaed. Publishing to multiple relays means taking content down requires taking down the network.

## Structural guarantees, not promises

| Claim                     | Mechanism                                                            |
| ------------------------- | -------------------------------------------------------------------- |
| Anonymous any time        | Relays keep no durable trace that could be handed over               |
| Your key is your identity | Cryptographic key held by you, not an account on a company server    |
| No secret shadowbans      | Transparent rules; free to switch feed, relay, or client             |
| Heard, not judged         | `#curhat` feed and per-topic communities, not a hostile debate floor |

The Trusted feed is where the Web of Trust work shows up: it is tuned so spam and buzzer accounts fade out automatically, without disturbing genuine content. That is the hard part of anonymous social — abuse resistance without a moderation team, because anonymous design removes the accountability that moderation depends on.

## Details

Threads and replies like the platforms people already know, localized for Indonesian-language conversation. MIT licensed, deployed at **yapping.my.id**.
