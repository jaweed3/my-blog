---
title: mini-microservice
slug: mini-microservice
description: A deliberately small event-driven order service in Go — transactional outbox, NATS JetStream consumers, and a SQLite database per service.
excerpt: 'A compact Go reference for event-driven microservices — transactional outbox, NATS JetStream, one SQLite database per service, and a shared contract module.'
coverImage: images/features/mini-microservice.png
date: 2026-09-23
tags:
  - Distributed Systems
  - Go
  - Event-Driven
techStack:
  - Go
  - NATS JetStream
  - SQLite
  - Cobra
github: https://github.com/jaweed3/mini-microservice
status: active
featured: false
hidden: false
impact: Keeps the outbox pattern honest by staying small enough to read end to end — the whole event flow fits in one screen of code
stats:
  - value: '5'
    label: 'Modules'
  - value: 'Outbox'
    label: 'Delivery Guarantee'
  - value: '1 / Service'
    label: 'Own Database'
problem: Most microservice examples are too large to read, and the interesting part — what actually happens between writing to your database and another service finding out — is buried under infrastructure code.
results:
  - 'Transactional outbox: order + outbox row written in one transaction, so no lost events'
  - 'NATS JetStream provides durable delivery with an explicit consumer per read model'
  - 'One SQLite database per service — real data isolation, zero infra to run locally'
  - 'Shared `contract` module holds the OrderEvent type, so producer and consumer agree by construction'
  - 'Cobra CLI client for driving the API without curl'
outcome: A whole event-driven architecture you can hold in your head, which is the only way the outbox pattern actually gets understood
---

## Problem

Event-driven microservices get taught through infrastructure. The diagrams show a message broker, a service mesh, three databases and a schema registry, and by the time you reach the one interesting question — _how do you guarantee the event actually gets published?_ — an hour has gone and nothing has run.

The dual write is the actual problem. Write to your database, then publish to the broker. If the process dies between those two steps, the order exists and the event does not, and you find out from a customer instead of a dashboard.

## Approach

Stay small enough that the whole flow fits on one screen:

```
POST /order
   └─ writes order + outbox row  ── in ONE transaction
          └─ relay publishes order.created / order.updated  → stream ORDERS
                 ├─ audit-service     (durable consumer, append-only log)
                 └─ order-exporter    (read-model consumer)
```

**The transactional outbox is the whole point.** The order row and the outbox row commit together. Either both exist or neither does — so there is no window where the order succeeded and the event vanished. The relay then publishes from the outbox, and JetStream's durability plus the idempotent consumer covers the other direction.

## Modules

| Module           | Role                                           |
| ---------------- | ---------------------------------------------- |
| `order-service`  | HTTP API + outbox relay (`orders.db`)          |
| `audit-service`  | Durable consumer, append-only log (`audit.db`) |
| `order-exporter` | Read-model consumer (`order-exporter.db`)      |
| `order-cli`      | Cobra CLI client                               |
| `contract`       | Shared `OrderEvent` type                       |

**SQLite per service** is the choice that makes this runnable. Each service genuinely owns its data and nothing else can reach in, but there is no database to install — which is the difference between reading this and running it.

**A shared `contract` package** means the event type is defined once and imported by both producer and consumers, so a breaking change is a compile error instead of a 3am integration bug.

## Running it

Needs Go 1.26 and `nats-server`:

```sh
nats-server -js &
cd order-service    && PORT=3333 NATS_URL=nats://127.0.0.1:4222 go run .
cd ../audit-service && NATS_URL=nats://127.0.0.1:4222 go run .
cd ../order-exporter && NATS_URL=nats://127.0.0.1:4222 go run .
```

One broker, three processes, no containers. GPL-2.0.
