# Madhumitha N.S. — Portfolio

Personal portfolio website for a **Blockchain Developer | Web3 | Solidity** profile, showcasing projects, experience, education, certifications and a working contact form.

- **Live demo:** https://portfolio-madhumithans5.vercel.app
- **GitHub repository:** https://github.com/madhumitha200616-sketch/madhumitha-portfolio

## Features
- Responsive layout for mobile, tablet and desktop
- Animated hero section with typed roles and scroll-reveal effects
- Sections: Home, About, Skills, Featured Projects, Experience, Education, Certifications, Contact
- Downloadable resume (PDF)
- Working contact form powered by EmailJS (no mail app needed)
- Contact form safeguards: validation, honeypot spam field, 30-second send cooldown, request timeout

## Technologies
- HTML5, CSS3, vanilla JavaScript (no build step)
- [Remixicon](https://remixicon.com/) icons via CDN
- [EmailJS](https://www.emailjs.com/) (REST API) for the contact form
- Deployed on [Vercel](https://vercel.com/)

## Featured Projects
- **[ElixSwap](https://elixswap.com)** — Multi-Chain Decentralized Trading Platform (Solidity, ethers.js, Foundry, EVM)
- **[Nexora DEX](https://nexora-dex-two.vercel.app/)** — Decentralized Exchange on Ethereum Sepolia (Solidity, Uniswap V3, OpenZeppelin, ERC-20)
- **[TeamChain Wallet](https://teamchain-wallet.vercel.app/)** — Web3 ERC-20 Hub & Wallet Management (Ethereum, ERC-20, Sepolia)
- **[ATS Engine](https://ats-engine-dev.vercel.app/)** — AI-Powered Applicant Tracking System & Resume Parser (Full Stack)
- **[AI GPU Cost Monitor](https://ai-gpu-cost-monitor.vercel.app/)** — AI Compute Spend Analytics Dashboard (Full Stack)
- **BlackBox Accident Detection System** — IoT accident-detection research with blockchain storage, presented at NCTIACS-26

## Project structure
```
index.html
robots.txt
assets/
  css/styles.css            # theme variables at the top
  js/main.js                # menu, typed roles, active links, scroll reveal
  js/contact-form.js        # contact form validation and sending
  js/emailjs-config.js      # EmailJS public configuration
  img/                      # portrait and project images
  MADHUMITHA_ns.pdf         # resume used by the Download Resume buttons
```

## Run locally
No installation is needed.

1. Clone the repository:
   ```bash
   git clone https://github.com/madhumitha200616-sketch/madhumitha-portfolio.git
   cd madhumitha-portfolio
   ```
2. Serve the folder (recommended so the contact form works):
   ```bash
   python3 -m http.server 8000
   ```
3. Open http://localhost:8000 in your browser.

## EmailJS setup (contact form)
The form sends email directly from the browser using three **public** values stored in `assets/js/emailjs-config.js`:

| Value | Where to find it |
|---|---|
| Service ID | EmailJS > Email Services |
| Template ID | EmailJS > Email Templates |
| Public Key | EmailJS > Account > General |

Template variables used: `{{from_name}}`, `{{from_email}}`, `{{message}}`, `{{sent_at}}`, `{{reply_to}}`.

**Security notes**
- These three values are designed by EmailJS to be public in browser code.
- Never add your EmailJS **Private Key**, Gmail password or SMTP password to this repository.
- In the EmailJS dashboard, restrict allowed domains to your live site and enable rate limits.

## Deployment
Hosted on Vercel as a static site (no build command, root directory is the repository root).

## Contact
- GitHub: https://github.com/madhumitha200616-sketch
- LinkedIn: https://www.linkedin.com/in/madhumitha-n-s-6089762a3
- Email: madhumitha200616@gmail.com
