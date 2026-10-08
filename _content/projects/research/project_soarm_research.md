---
projectId: soarm-research
project_name: SoARM Research (VLAs, Multimodal LLMs and a Low-Cost Robot Arm)
role: Independent Researcher
timeline: July 2026 - Present
platform: Robotics Research (physics simulation and a real robot arm)
research_question: "How do vision-language-action models and multimodal LLMs relate to real robots, and how can they be optimised?"
key_features: ["SO-ARM101 in LIBERO/MuJoCo", "OpenVLA-OFT and pi0 Evaluation", "Fine-Tuning on Collected Demonstrations", "1:1 Digital Twin", "Real-Hardware Control with a Safety Validator", "Cross-Backend Benchmark"]
tech_stack: ["Python", "PyTorch", "MuJoCo", "robosuite", "LIBERO", "OpenVLA-OFT", "pi0 / pi0.5", "SmolVLA", "LeRobot", "Hugging Face", "Weights & Biases", "Google Colab"]
key_achievements:
  - "Built a simulation pipeline where two different VLA models drive the same robot arm through one shared interface"
  - "Collected 120 demonstrations and fine-tuned OpenVLA-OFT on them"
  - "Found and documented a flaw in his own first benchmark, and planned a redesigned evaluation"
  - "Connected a VLA to a real SO-ARM101 arm with a safety validator and full per-step logging"
process: "Phased research roadmap with documented experiments, tests and findings"
---

# SoARM Research: VLAs, Multimodal LLMs and a Low-Cost Robot Arm

## Overview
Alongside his work at Tapforce, Vansh is an independent robotics researcher. This project is the main body of that research. It studies how **Vision-Language-Action (VLA) models**, **large language models** and **robots** relate to each other, and how to optimise them, with the longer-term aim of building toward **physics-aware general intelligence**. Vansh hopes to pursue a PhD soon.

The platform is the SO-ARM101 (SOARM), a low-cost open-source robot arm, studied first in physics simulation and then on the real arm.

## The Research Question
A VLA takes a camera image and a text instruction such as "pick up the black bowl" and outputs robot movements. Most are trained on one kind of robot. This research asks how well they transfer to a different body, how multimodal LLMs compare to purpose-built VLAs for controlling a physical arm, and what it takes to make either work reliably and safely.

## Stage 1: A Simulation Pipeline
Vansh built an environment where the SO-ARM101 runs inside LIBERO, a robot-learning benchmark built on MuJoCo physics. He converted the arm's hardware design files into a simulated robot, then wrote the loop that shows the model a camera image, gets an action back, moves the simulated arm, and checks for success.

Two VLAs, **OpenVLA-OFT** and **pi0**, plug into that loop through one shared interface, so the surrounding code does not care which model is running.

**First result:** with no training on this arm, both models scored 0% task success. That was the expected baseline, because the checkpoints were trained on a different robot. In the videos the arm moved toward the right object and opened the gripper at roughly the right moment, so the high-level plan transferred while precise grasping did not.

## Stage 2: Data, Spatial Awareness and Fine-Tuning
- **Demonstrations:** 120 scripted and keyboard-teleoperated demonstrations were collected for the arm.
- **Spatial awareness:** Multiple camera views and a depth-based 3D localisation pipeline, which matched the simulator's ground truth to within about 2 cm.
- **Fine-tuning:** OpenVLA-OFT was fine-tuned with LoRA on the collected demonstrations, with training curves and before/after evaluation tracked in Weights & Biases.
- **A finding about the benchmark itself:** A review showed that 3 of the 4 evaluation tasks were passing trivially at the moment the objects spawned. Vansh recorded the flaw and planned a redesigned benchmark instead of reporting misleading numbers. That redesign is currently on hold while the real-hardware work goes first.

## Stage 3: The Real Arm
The research then moved to real hardware:
- **Digital twin:** The robot model was rebuilt so the simulated and real arms match one to one, including the gripper and wrist joints.
- **Real control:** An SO-101-native VLA, **SmolVLA**, was connected to the physical arm over a LeRobot bridge.
- **Safety:** A safety validator limits motion, and every step's inputs and outputs are logged.
- **Latency:** A bug where the bridge re-sent a full observation on every tick was diagnosed and fixed.
- **An early lesson:** A first experiment prompting a general-purpose multimodal LLM with robot context did not work well, which narrowed the research to two focused workstreams.

## Stage 4 (Current): A Cross-Backend Benchmark
The current milestone is a head-to-head comparison of more than a dozen control backends on one real task, a pen transfer, scored with a published failure taxonomy:
- **VLA-style backends** that output robot actions directly, including Gemini Robotics, pi0 / pi0.5, ACT and OpenVLA.
- **MLLM-style backends** where a multimodal LLM returns raw JSON actions, including Claude and open models, with its reasoning captured for analysis.

Restoring the safety validator's conservative limits is deliberately the last step, once all backends are running.

## Status
Ongoing. The simulation and real-hardware infrastructure is built and tested, and the cross-backend benchmark is in progress. Final results have not been published yet.
