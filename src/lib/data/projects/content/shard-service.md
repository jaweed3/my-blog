---
title: Sharded Storage Service
slug: shard-service
description: A plan-to-production architecture for horizontally sharded storage — consistent-hash router, shard registry with heartbeats, and async replica lag via RabbitMQ.
excerpt: Architecture for horizontal database sharding in Java — a consistent-hashing router, a shard registry with heartbeat health, and replicas that catch up asynchronously over RabbitMQ.
coverImage: images/features/shard-service.png
date: 2026-09-27
tags:
  - Distributed Systems
  - Backend
  - Architecture
techStack:
  - Java
  - Maven
  - RabbitMQ
  - PostgreSQL
github: https://github.com/jaweed3/shardService
status: wip
featured: false
hidden: false
impact: Documents the shard/routing/replication design as a phased build with a definition of done per phase, rather than a big-bang rewrite
stats:
  - value: '5'
    label: 'Services in Topology'
  - value: 'Consistent Hashing'
    label: 'Routing Strategy'
  - value: 'Async'
    label: 'Replication Path'
problem: A single database stops being enough on both axes at once — data volume and write throughput. Vertical scaling answers one of them expensively, and horizontal sharding answers both at the cost of every query needing to know where its data lives.
results:
  - 'Router resolves shard ownership via consistent hashing with virtual nodes'
  - 'Shard registry holds the shard map and health, updated by heartbeat'
  - 'Shard nodes publish write/delete events; a replica node replays them asynchronously via RabbitMQ'
  - 'Synchronous request path, asynchronous replication path — deliberately separated'
  - 'Each phase in the README has an explicit verification step'
outcome: A written architecture others can follow, with the sync/async boundary made explicit so consistency tradeoffs are visible rather than implied
---

## Problem

One database eventually fails on two fronts independently: the data gets too large, and the write throughput gets too high. Both usually arrive together.

Vertical scaling handles one of them, expensively, and eventually stops. Horizontal sharding handles both — but introduces the problem that every request now needs to know which shard owns its key, and that routing layer becomes load-bearing infrastructure you have to get right before anything else works.

## Architecture

```
client → [router:8080] ──(poll map)──→ [registry:8081]
             │  ──forward──→ [shard-node-0:8082] → DB shard0 ┐
             │  ──forward──→ [shard-node-1:8083] → DB shard1 ├─ Postgres (1 container, 3 DB)
             │  ──forward──→ [shard-node-2:8084] → DB shard2 ┘
             │                    │ publish write/delete
             │                    ↓
             │              [RabbitMQ:5672] → [replica:8085] → DB replica
```

Solid lines are synchronous. Dashed lines are heartbeat and map polling. The queue carries asynchronous replication.

Three choices do most of the work:

**Consistent hashing with virtual nodes** in the router decides shard ownership, so adding or removing a shard moves only its share of keys rather than remapping the whole space.

**A shard registry separate from the router** holds the map and health. The router polls it rather than hardcoding topology, which means shard membership can change without redeploying the thing every request passes through.

**Replication is deliberately off the request path.** Shard nodes publish write and delete events; a replica node consumes and catches up asynchronously. The request path stays synchronous and simple; replica lag becomes an explicit, measurable tradeoff instead of a hidden one buried in the write path.

## Status

**WIP — and honestly labelled as such.** The repository currently runs as a single-process monolith with two in-memory H2 databases. The README is the plan to production, not a report of what is deployed.

What is useful here is the sequencing: the README walks through ordered milestones where each phase has a clear verification step, so the architecture is something you can build incrementally rather than a rewrite you either attempt fully or not at all.
