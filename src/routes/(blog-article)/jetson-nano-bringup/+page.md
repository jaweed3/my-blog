---
slug: jetson-nano-bringup
title: 'Jetson Nano B01 Bring-Up: 13.8GB Image, Failed Flash, and a Hung Splash Screen'
date: 2026-09-16T08:00:00.000Z
excerpt: 'Board-only Jetson Nano P3450 B01, 64GB microSD, JetPack 4.6. Etcher failed, dd at 5.7MB/s, first boot stuck on NVIDIA logo. What was normal, what was actually broken.'
tags:
  - Edge ML
  - Jetson Nano
  - Embedded
  - Case Study
keywords:
  - Jetson Nano B01
  - JetPack 4.6
  - P3450
  - board bring-up
hidden: false
---

A senior lent me a bare Jetson Nano board. No jumper, no barrel PSU, no box. Just the PCB: `Model P3450`, `945-13450-0000-100` — the 4GB B01, Tegra X1 Maxwell. This is the bring-up log.

## Identify before you flash

`P3450` + `945-13450-0000-100` = Jetson Nano Developer Kit B01 (4GB). Not an Orin Nano. That distinction decides everything: this board tops out at JetPack 4.x. A JetPack 6 image will never boot here.

The silkscreen settles the power question too: `ADD JUMPER TO DISABLE uUSB PWR`. No jumper = microUSB power (default). Jumper on J48 = barrel jack. With no jumper in hand, microUSB it is.

## The image

Official JetPack 4.6 SD image: zip ~6-7GB, extracted `sd-blob-b01.img` = 13.82GB. That size is correct — don't "fix" it. 64GB UHS-I card is comfortable (official minimum for this board is 32GB).

## Flash failure that wasn't

BalenaEtcher threw "unexpected error" after a long flash. The card looked dead. It wasn't:

- `file sd-blob-b01.img` → valid DOS/MBR boot sector, not corrupt.
- `diskutil list` → the 64GB card showed Linux partitions + 13.8GB + 53.3GB free. That's the Jetson layout. A totally failed flash shows empty FAT32.

Etcher on macOS commonly trips during verification (OS remount fights, reader glitch) after the data already landed. Lesson: inspect the partition table before reflashing.

## The reflash

`dd` is the reliable path:

```bash
diskutil list external        # confirm the ~67GB disk, never the 251GB internal
diskutil unmountDisk /dev/disk6
sudo dd if=~/Downloads/sd-blob-b01.img of=/dev/rdisk6 bs=4m status=progress
diskutil eject /dev/disk6
```

Reader straight into the Mac, no hub, `caffeinate -dims` in another terminal so the Mac can't sleep. At 5.7MB/s on a cheap reader this takes ~40 minutes. Don't touch it.

## The hung splash screen

First boot: NVIDIA logo, green LED on, no spinner, no Ubuntu text. 10 minutes. 15. Still logo.

This is where you have to know the boot sequence instead of feeling it. CBoot shows a static logo with no loading animation while it inits hardware, loads the kernel, and — on first boot — expands 14GB to fill the 64GB card. Silence is normal. Heating heatsink + lit keyboard = the SoC is working.

Hang vs normal, cold checklist:

1. Green LED stable (not flickering dead).
2. Monitor has signal (not "no signal").
3. Heatsink warming up.
4. Caps Lock test: if the toggle light responds, the kernel is alive and you're just impatient.

My verdict rule: first boot gets 25 minutes on a 64GB card. Past that with a dead Caps Lock = corrupt SD (that Etcher failure finally billing me) → reflash via `dd`, strip USB down to HDMI + keyboard, power last.

## Power honesty

MicroUSB (5V⎓2A spec) boots and set-ups fine. It does not benchmark fine. Boot spikes + WiFi + HDMI already eat the margin; undervoltage throttles silently and your latency numbers turn noisy. For setup and functional porting: microUSB OK. For numbers that go in a paper: barrel 5V⎓4A (5.5×2.1mm, center-positive) + J48 jumper + MAXN mode, or don't publish the numbers.

This Nano answers reviewer point 5 ("if any second board is available, replicate one configuration") — one config, DS-CNN fp32, CPU-only, same protocol. No GPU, no TensorRT. That's a future-work sentence, not this revision's scope.
