---
projectId: syno-assess
project_name: SynoAssess
client: Synoriq
role: "Product Design Trainee (Collaborator)"
timeline: "2021 (Pandemic EdTech Surge)"
platform: "Web Application (Two-Sided Assessment Platform)"
design_principle: "Jakob's Law (Familiarity > Novelty)"
key_features: ["Proctoring/Anti-Cheat UI", "Google Forms-style Builder", "Question Bank Library", "Destructive Action Safety"]
tech_stack: ["Figma"]
key_achievements:
  - "Designed secure Two-Sided Assessment Platform"
  - "Implemented Google Forms-style linear builder"
  - "Created robust Anti-Cheating UI"
process: "Jakob's Law application & Iterative Refinement"
related_documents: ["personal_bio.md", "project_synofin_lms.md"]
---

# Case Study: SynoAssess – Balancing Simplicity & Security

## Key Achievements & Contributions
- **Two-Sided Platform**: Designed distinct interfaces for Admins (Simplicity) and Students (Security/Integrity).
- **Adoption Strategy**: Leveraged **Jakob's Law** to mimic Google Forms, drastically reducing the learning curve for non-technical teachers.
- **Security UI**: Engineered a robust Anti-Cheating interface with proctoring alerts, focus tracking, and copy-paste blocks.
- **Scalability**: Designed a Question Bank system allowing institutions to reuse and categorize content efficiently.

## Process
*See Section 2 & 3 below*

## 1. Context: The EdTech Surge
During the 2021 surge in online learning, Synoriq needed a platform for creating and grading online tests.
* **The Team:** Vansh worked alongside a Senior Designer.
* **The Challenge:** Designing a **Two-Sided Platform** that had to be:
    1.  **Simple** for creators (Admins/Teachers).
    2.  **Robust & Secure** for test-takers (Students).

## 2. The "Google Forms" Directive (Jakob's Law)
The project began with a clear directive from the CEO: **"Avoid complex dashboards. Make it feel like Google Forms."**
* **The Rationale:** Most institutions in India were already using Google Forms. By mimicking that workflow, Synoriq leveraged **Jakob's Law**—users prefer sites that work the same way as sites they already know.
* **The Pivot:** Vansh’s initial design used a mix of pre-made sets to generate links quickly. However, based on the CEO’s feedback, he scrapped this and redesigned the flow to be a **linear, step-by-step builder**.
* **The Result:** Admins could add sections and question types in a clean, linear fashion, drastically reducing the learning curve for non-technical teachers.

## 3. The Student Experience: Security First
While the Admin side was about simplicity, the Student side was about **Integrity**.
* **Anti-Cheating UI:** Vansh designed a comprehensive set of popups and notifications to enforce rules:
    * **Video Surveillance:** Built-in proctoring UI.
    * **Copy-Paste Blocks:** Visual feedback when a user tries to copy content.
    * **Focus Tracking:** Alerts when a user switches tabs.
* **The Exam Interface:** Featured a prominent timer and a simple question navigator to reduce test anxiety while maintaining strict controls.

## 4. The Question Bank
A key business goal was scalability.
* **The Library:** Vansh designed an interface for Admins to store, categorize, and analyze questions based on **Difficulty Levels**. This allowed institutions to build preset exams from a repository rather than typing questions from scratch every time.

## 5. The Micro-Interaction Lesson: Button Hierarchy
This project provided a critical lesson in **Safety UX** regarding "Destructive Actions" (e.g., Deleting a Test).

### The Mistake
Vansh’s early design used two buttons of equal visual weight (e.g., Blue "Cancel" and Red-Bordered "Delete").

### The Mentorship
The Senior Designer pointed out that this equality increases the risk of accidental deletion.

### The Fix
Vansh iterated on the design to establish clear **Visual Dominance**:
* **Delete:** Became a **Filled, Primary Button** (Red) to signal finality and danger.
* **Cancel:** Became a Ghost/Text Button to recede into the background.
* **The "X" Factor:** He also added a "Close" (X) button at the top right—again leveraging Jakob's Law—to give users a familiar "escape hatch" from the modal.

## 6. Outcome
* **Deliverables:** A complete **High-Fidelity UI** for both Admin and Student portals, a **Component Library** (timers, date pickers), and an **Interactive Prototype** for internal pitching.
* **The Lesson:** SynoAssess was a masterclass in balancing **High-Level Vision** (The CEO's strategy) with **Low-Level Detail** (Button hierarchy), proving that a product is defined by how it handles its smallest interactions.