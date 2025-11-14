# Deployment Guide: Portfolio Website

This document outlines the deployment process for the Portfolio Website project. As a static website, deployment is straightforward and primarily involves serving the project files through a web server or a static site hosting service.

## 1. Deployment Architecture

The Portfolio Website is a **static site**. This means it consists entirely of client-side files (HTML, CSS, JavaScript, images) that do not require server-side processing or a database.

## 2. Deployment Process

### Option 1: Static Site Hosting Services (Recommended)

Many services are optimized for hosting static websites and provide easy deployment, global CDNs, and custom domain support.

**Examples**:
*   **GitHub Pages**: Ideal for projects hosted on GitHub.
*   **Vercel**: Excellent for frontend frameworks, but also supports static sites.
*   **Netlify**: Offers continuous deployment from Git repositories, custom domains, and more.
*   **Cloudflare Pages**: Similar to Netlify and Vercel, with Cloudflare's CDN benefits.
*   **AWS S3 + CloudFront**: For more control and scalability on AWS.

**General Steps for Static Site Hosting**:
1.  **Push to Git Repository**: Ensure your project code (including the `brownfield/` directory, `Images/`, `README.md`, `LICENSE`) is pushed to a Git repository (e.g., GitHub, GitLab, Bitbucket).
2.  **Connect Hosting Service**: Connect your chosen static site hosting service to your Git repository.
3.  **Configure Build (if any)**: For this project, there is no build step. You would typically configure the service to deploy directly from the `brownfield/` directory or the root of your repository if all files are there.
4.  **Deploy**: The service will automatically deploy your site. Subsequent pushes to your Git repository can trigger automatic redeployments.

### Option 2: Traditional Web Server

You can also deploy the site on a traditional web server (e.g., Apache, Nginx).

**Steps**:
1.  **Transfer Files**: Copy all project files (the contents of `brownfield/`, `Images/`, `index.html`, `LICENSE`, `README.md` from the root) to the web server's document root directory (e.g., `/var/www/html/` for Apache or Nginx).
2.  **Configure Web Server**: Ensure your web server is configured to serve static HTML files.
    *   For **Apache**, ensure `mod_rewrite` is enabled (if using clean URLs, though not applicable here) and `DirectoryIndex` includes `index.html`.
    *   For **Nginx**, configure a `server` block to point to your project directory.
3.  **Access**: Your website will be accessible via the server's IP address or domain name.

## 3. Environment Configuration

There are no specific environment variables or server-side configurations required for this project. All configurations (like image paths) are hardcoded or relative paths within the HTML/CSS/JS.

## 4. CI/CD Pipeline

No explicit CI/CD pipeline is configured within the project. For static site hosting services (Option 1), continuous deployment is often built-in, where every push to a specified branch triggers a new deployment.

## 5. Asset Management

*   **Local Assets**: Images in the `Images/` directory should be deployed alongside the HTML files.
*   **External Assets**: Some images (e.g., `hero_dark_focus.jpg`) are linked directly from GitHub (`https://raw.githubusercontent.com/vansh-fyi/portfolio2.0/main/Images/`). These do not need to be deployed with the project as they are fetched directly by the browser from their hosted location.
*   **Third-party Libraries**: Tailwind CSS and Lucide Icons are loaded via CDNs, so they do not require local deployment. Unicorn Studio is also loaded via a CDN.

## 6. Rollback Strategy

In case of deployment issues, the rollback strategy is to revert to a previous working commit in your Git repository and trigger a redeployment. Static site hosting services typically manage previous deployments, allowing for quick rollbacks.
