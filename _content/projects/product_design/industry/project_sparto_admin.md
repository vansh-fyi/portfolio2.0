---
project_name: Sparto Admin Panel
client: Partlink Solutions
role: Lead Product Designer
timeline: April 2025 - July 2025
platform: Web / Desktop Enterprise Application
key_features: ["Request Editing & Triage", "User Profile Management", "Notification Control", "Data Export"]
design_strategy: "Task-Based UX over Metric-Heavy Dashboard"
related_documents: [project_sparto_app.md, project_sparto_brand.md]
---

# Case Study: Sparto Admin Panel (The Enterprise Brain)

## 1. Context: The "Backstage" Engine
While the Sparto Mobile App was the "Request Generator" for mechanics, the **Sparto Admin Panel** was the engine required to process those requests. It serves as the central command center for the Sparto operations team to manage the marketplace, quote prices, and handle logistics.

## 2. The Design Philosophy: Task-Centric vs. Metric-Centric
One of Vansh’s defining decisions was the dashboard strategy.
* **The Anti-Pattern:** Most admin panels default to "Vanity Dashboards"—screens full of floating charts and graphs that look pretty but offer little immediate utility to an operations manager.
* **The Vansh Approach:** He deliberately avoided a localized dashboard with "floating metrics."
* **The Solution:** The dashboard was designed to be strictly **Task-Based**.
    * Instead of "Total Revenue Graphs," the user sees "Pending Requests" and "Actionable Orders."
    * The UI prioritizes **Data Tables** and **Workflows** over visualization, ensuring the team spends time *working*, not just *viewing*.

## 3. Information Architecture & Navigation
The application features a persistent **Side Navigation Bar** to allow rapid switching between five distinct operational contexts.

### A. Request Management (The Core Engine)
This is the most complex module, handling the "Request-Based" nature of the business.
* **The Workflow:** When a user requests a part (e.g., "Brake pad for Swift 2010"), it appears here.
* **Deep Dive & Edit:** Admins can view full request details and, crucially, **edit them**. (e.g., If a mechanic types "Brake pd" instead of "pad", the admin can correct it before processing).
* **Chat & Context:** The admin can chat directly with the user to clarify details.
* **Quoting System:** The admin has a nuanced interface to input the **Price**, add specific **Taxes**, and generate a final Quote to send back to the user’s app.

### B. Order & Returns Management
Once a quote is accepted, it moves to Order Management.
* **Order Processing:** Handles the logistics of shipping and status updates (Packed, Shipped, Delivered).
* **Returns:** A dedicated section to manage the reverse logistics if a part is incompatible or defective.

### C. User Management (The CRM)
* **Full Profile Access:** Admins can view **every detail** of a user profile, including their request history, order history, and contact info.
* **Edit Capabilities:** Admins can update user details manually if a customer requests a change (e.g., fixing a wrong phone number).
* **Search & Filter:** Nuanced search capabilities to find specific mechanics or customers.
* **Data Portability:** Built-in features to **Download Reports** (User lists, Order history) as **Excel** or **PDF** files for offline accounting.

### D. Notification Management
* **Automation:** The system handles automatic transactional alerts (e.g., "Order Shipped").
* **Manual Overrides:** Admins can edit notification copy or send manual broadcasts to specific segments of users.

## 4. Design System Adaptation: Mobile to Desktop
Vansh extended the **Atomic Design System** created for the Mobile App but optimized it for the desktop environment.

* **The "Precision" Shift:**
    * **Mobile Logic:** Large touch targets for thumbs.
    * **Desktop Logic:** Smaller buttons and tighter spacing for precise mouse cursors.
* **Input Fields:** The "Compact Field" height became the standard here. Since desktop screens have more real estate, Vansh used these reduced-height fields to pack more data into the tables, reducing the need for vertical scrolling.
* **Consistency:** The **Red/Black brand identity** was maintained, ensuring that the Admin Panel felt like part of the same family as the consumer app.

## 5. Deliverables
* **High-Fidelity Prototype:** A fully interactive simulation of the quoting and order processing flows.
* **Component Library:** A desktop-specific extension of the Sparto Design System.