# Development Guide: Portfolio Website

This document outlines the development setup and workflow for the Portfolio Website project. Given its nature as a static HTML/CSS/JavaScript site, the development process is straightforward and does not require complex build tools or environments.

## 1. Prerequisites

To work on this project, you primarily need:
*   A modern web browser (e.g., Chrome, Firefox, Edge, Safari) for viewing the project.
*   A text editor or Integrated Development Environment (IDE) for editing code (e.g., VS Code, Sublime Text, Atom).

## 2. Project Structure

The core development files are located in the `brownfield/` directory.
*   `index.html`: The main homepage of the portfolio.
*   `project-chat.html`: A page featuring an AI chat interface.
*   `project-display.html`: A page designed to display individual projects, often embedding external content.

Supporting assets like images are located in the `Images/` directory.

## 3. Local Development Setup

No specific installation steps or environment configurations are required beyond having a web browser and a text editor.

To view the project locally:
1.  **Clone the repository**: If you haven't already, clone the project repository to your local machine.
    ```bash
    git clone [repository-url]
    cd portfolio2.0
    ```
2.  **Open HTML files**: Navigate to the `brownfield/` directory and open any of the `.html` files directly in your web browser. For example, drag `index.html` into your browser window or right-click and select "Open with...".

## 4. Making Changes

*   **HTML**: Edit the `.html` files directly to modify content, structure, or add new sections.
*   **CSS**: The project uses Tailwind CSS via a CDN. Custom styles are embedded directly within `<style>` tags in the HTML files. To add or modify styles, you can:
    *   Use Tailwind CSS utility classes directly in your HTML.
    *   Add or modify custom CSS rules within the `<style>` tags.
*   **JavaScript**: JavaScript code is embedded directly within `<script>` tags in the HTML files. Modify these scripts to change interactive behaviors, form logic, or theme toggling.

## 5. Build Process

There is **no formal build process** for this project. The HTML, CSS, and JavaScript files are served as-is.

## 6. Running Tests

No automated tests or testing frameworks are configured for this project. Manual testing by opening the HTML files in a browser and interacting with the UI is the primary method of verification.

## 7. Common Development Tasks

*   **Adding a new page**: Create a new `.html` file in the `brownfield/` directory and link it from existing navigation.
*   **Updating content**: Directly edit the relevant `.html` file.
*   **Modifying styles**: Adjust Tailwind classes or custom CSS in the `<style>` tags.
*   **Changing interactive behavior**: Modify the JavaScript code in the `<script>` tags.
*   **Adding images**: Place image files in the `Images/` directory (or link to external sources) and reference them in your HTML.

## 8. Code Style and Conventions

*   **HTML**: Standard HTML5 structure.
*   **CSS**: Primarily Tailwind CSS classes. Custom CSS is used for animations and overrides.
*   **JavaScript**: Vanilla JavaScript, often embedded directly.

Consistency with existing code is recommended when making modifications.
