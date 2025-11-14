# UI Component Inventory

This document outlines the key UI components identified in the Portfolio Website project. The project primarily uses Tailwind CSS for styling, along with custom CSS for animations and specific visual effects.

## Design System
The project leverages **Tailwind CSS** as its primary utility-first CSS framework, enabling rapid UI development and consistent styling. Custom CSS is used to extend Tailwind's capabilities, particularly for animations, theming, and unique visual elements.

## Iconography
**Lucide Icons** are used throughout the application for various UI elements, providing a consistent and scalable set of vector icons.

## Component Categories

### 1. Layout Components
*   **Header/Navigation**: Fixed top header with branding (logo + name), primary navigation links (Skills, Projects, About Me, Testimonials), theme toggle, and contact button.
*   **Sections**: Full-width sections (`<section>`) used to divide content areas (Hero, Features, Projects, About, Testimonials, Contact).
*   **Grids**: Tailwind's grid system is extensively used for responsive layouts, particularly in the "Features" (skills cards), "Projects" (gallery), and "About" sections.
*   **Footer**: Standard footer with branding, social links, and copyright information.

### 2. Interactive Elements
*   **Buttons/Links**: Styled `<a>` and `<button>` elements with hover effects, active states, and consistent padding/border-radius. Examples include "View Projects", "Schedule a call", "Send Me a Mail", and social media links.
*   **Theme Toggle**: A button (`#themeToggle`) that switches between dark and light modes, dynamically adding/removing the `light-mode` class to the `body` and updating icon/background visibility.
*   **Input Fields**: Text input fields, such as the "Ask anything about me !" in the hero section and the chat input in `project-chat.html`.

### 3. Content Display Components
*   **Cards**: A prominent component used across multiple sections:
    *   **Skill Cards**: Display individual skills with icons, titles, and descriptions. Feature hover effects (scale, translate, glow).
    *   **Project Cards**: Image-based cards in a gallery format, showcasing projects with titles and brief descriptions. Feature hover effects (scale, overlay, translate).
    *   **Education/Certification/Interests Cards**: Display personal information in a structured card format.
    *   **Testimonial Cards**: Display quotes from collaborators with author details and avatars.
*   **Headings & Paragraphs**: Styled with custom fonts (Geist, Inter) and Tailwind's typography utilities.
*   **Images**: Used for backgrounds, project showcases, and logos. Many are externally hosted.
*   **Iframes**: Used in `project-display.html` to embed external project content.

### 4. Functional Components
*   **Contact Form**: A basic form in `index.html` for user inquiries, using a `mailto:` action.
*   **AI Chat Interface**: In `project-chat.html`, a simulated chat interface with user/AI message bubbles, input field, and send button. Includes client-side state management for the chat flow.
*   **Image Modal**: A full-screen overlay in `project-chat.html` to display larger versions of project images.

### 5. Theming and Styling
*   **Dark/Light Mode**: Implemented via a JavaScript toggle that manipulates CSS classes and image sources. Custom CSS overrides Tailwind styles for light mode.
*   **Animations**: Custom CSS animations (`fadeIn`, `slideUp`, `blurIn`, `slideLeft`) and scroll-triggered animations (`scroll-animate`).
*   **Glow Effects**: Custom CSS for subtle glow and shine effects on cards and background elements.
*   **Custom Scrollbar**: Styled scrollbars for a consistent look.

## Reusable Elements
*   **Theme Toggle Logic**: Duplicated across `index.html`, `project-chat.html`, and `project-display.html`.
*   **Card Styles**: Consistent styling for various types of cards, adapted with different content.
*   **Navigation Structure**: Similar header and sidebar navigation patterns across pages.
