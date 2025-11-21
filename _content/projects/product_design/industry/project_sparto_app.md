---
project_name: Sparto Mobile App
client: Partlink Solutions
role: Lead Product Designer (Freelance/Contract)
timeline: April 2025 - July 2025
tech_stack: [Flutter, Figma, Lottie, Atomic Design]
project_type: B2C/B2B Mobile Application (0 to 1 Build)
key_metrics: ["Reduced Task Time by 50% (70s to 30s)", "Created Scalable Atomic Design System"]
related_documents: [project_sparto_admin.md, project_sparto_brand.md]
---

# Case Study: Sparto Mobile App (The Request-Based Engine)

## 1. Context & Origin (The "0 to 1" Build)
Sparto was a greenfield project initiated by two co-founders who approached Vansh Grover with nothing but an idea.
* **The Concept:** An on-demand, request-based marketplace for automotive spare parts in India.
* **The Gap:** Unlike standard e-commerce (Amazon/Flipkart) where users search for standardized items, the auto parts market is fragmented. Users (Mechanics) often need specific, hard-to-find parts for older models and don't have SKUs. They need to "request" a part and get a custom quote.
* **The Arrangement:** At the time, Vansh was the Director of Design at DriQ Health. To maintain high ethical standards, he formally requested permission from the DriQ CEO to moonlight on this project. The CEO agreed, valuing Vansh’s transparency.

## 2. User Research: The "Mechanic's Mental Model"
Vansh conducted on-site research, visiting local garages and observing mechanics to understand their environment.
* **Visual Language:** He noticed that the majority of local mechanic shops and oil brands (Castrol, Servo) utilized **Red and Black** signage. This was the "color of trust" in this industry.
* **Digital Literacy:** Mechanics were not tech-wizards, but they were heavy users of WhatsApp and basic social apps.
* **The "Greasy Hand" Problem:** Users often use phones with dirty hands or in a rush. Complex navigation or tiny touch targets would fail.
* **Navigation Habits:** Mechanics were accustomed to **Bottom Navigation Bars** (common in the apps they used daily). They expected the primary tools to be within thumb's reach, not hidden in top tabs or hamburger menus.

## 3. The Design Process: From Physics to Pixels

### Phase A: Wireframing & Logic
Vansh applied his systematic "Physics" approach to the design.
1.  **Analog Start:** He began with pencil sketches on **dot-grid paper**, mapping out user flows physically before touching software.
2.  **Low-Fi to Mid-Fi:** Created structural wireframes to define the "Request Flow" logic.
3.  **Tech Alignment:** Collaborated early with the freelance development agency (who were using **Flutter**) to ensure designs were feasible within the budget and timeline.

### Phase B: Atomic Design System
To ensure consistency across the User App and the upcoming Admin Panel, Vansh built a strict **Atomic Design System**.
* **Atoms:** Typography scales, Color Variables (Red #FF0000 acc. to brand, Black), Input Fields, Shadow variables.
* **Molecules:** Form groups, Request Cards, Notification toasters.
* **Organisms:** The "Request Part" widget, Order History lists.
* **Animation:** Integrated **Lottie JSON** files for smooth loading states and success interactions, making the app feel premium despite being an MVP.

## 4. The "Messy Middle": Challenges & Conflicts

### Conflict 1: The "Clutter" Bias (Founders vs. Vansh)
* **The Issue:** The founders were influenced by a competitor app ("Koovers") which had a dense, cluttered UI with zero whitespace. They believed "more information per square inch = better."
* **The Friction:** They felt Vansh’s initial high-fidelity inputs were "too tall" and required too much scrolling.
* **The Resolution:** Vansh educated them on **Cognitive Load** and the importance of whitespace for readability. He compromised by slightly reducing field heights to fit more data above the fold, but stood firm on maintaining breathing room to prevent user error.

### Conflict 2: Navigation (Developer vs. Designer)
* **The Issue:** The developer wanted to use **Top Tab Navigation** for switching between "Requests" and "Orders" (likely easier to implement in their specific widget structure).
* **The Defense:** Vansh argued that this broke the user's mental model. Based on his research, mechanics expected a **Bottom Nav**.
* **The Fix:** Leveraging his own coding knowledge, Vansh explained the Flutter logic required to implement the Bottom Nav, bridging the gap between design intent and engineering execution.

## 5. Optimization: The 50% Efficiency Jump
The most critical phase was the Usability Testing of the MVP prototype.

### The Problem
Initial testing showed the "Onboarding + Make a Request" flow took users an average of **60 to 70 seconds**.
* **Diagnosis:** This was too slow for a mechanic working in a fast-paced shop. The friction point was excessive data entry during sign-up and a complex request form.

### The Solution
Vansh initiated a "Rapid Iteration Sprint":
1.  **Slash Onboarding:** Removed email/password requirements. Switched to a **Phone Number + Name only** flow (OTP based).
2.  **Simplify Requests:** Reduced the number of mandatory fields in the part request form.
3.  **Visual Cues:** Added clearer steppers to show progress.

### The Result
* **Metric Achieved:** The average Time-on-Task dropped to **30 seconds**.
* **Impact:** A **50% decrease** in friction, making the app viable for on-the-job use.

## 6. Final Handoff
Vansh delivered:
* A complete High-Fidelity Prototype.
* A comprehensive **Developer Handoff Document** with annotations for every interaction.
* The full **Atomic Design Library** (which would later serve as the foundation for the Admin Panel).