<h1 align="center">Flavr</h1>
<h3 align="center">Neobrutalist Restaurant Evaluation & Discovery Platform</h3>

<p align="center">
  A bold, high-contrast platform for transparent restaurant evaluation. <strong>Flavr</strong> combines a striking Neobrutalist design aesthetic with advanced statistical processing to provide food lovers with unbiased rankings, while granting restaurant owners an intuitive CRUD dashboard to manage their presence and engage with their community.
</p>

<p align="center">
  <a href="https://flavr-frontend-7f4unumgt-monkass-projects.vercel.app/">
    <img src="https://img.shields.io/badge/Live_Demo-View_Project-success?style=for-the-badge" alt="Live Demo" />
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License" />
  </a>
</p>

---

### ✨ Core Features

* **Bayesian Rating System:** Uses an advanced statistical ranking algorithm (similar to IMDb) to calculate weighted ratings, preventing new or low-volume entries with a few 5-star reviews from unfairly skewing the top leaderboards.
* **Granular Owner Dashboard:** A secure control panel enabling verified restaurant owners to manage operational parameters such as operating hours, accurate geolocations, and dynamic business data.
* **Role-Based Access Control (RBAC):** Strict server-side authorization patterns that isolate administrative routes, ensuring only authenticated and verified owners can execute mutations on their business profiles.
* **Review Management & Engagement:** Facilitates community trust by allowing verified owners to officially respond to user-generated feedback and address customer reviews.

---

### 🛠️ Tech Stack

**Frontend Framework & Architecture**
<p align="left">
  <img src="https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="Shadcn UI" />
</p>

**Data Modeling & Cloud Infrastructure**
<p align="left">
  <img src="https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
</p>

**Authentication & Cloud Infrastructure**
<p align="left">
  <img src="https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="NextAuth.js" />
  <img src="https://img.shields.io/badge/OAuth_2.0-EB5424?style=for-the-badge&logo=auth0&logoColor=white" alt="OAuth 2.0" />
  <img src="https://img.shields.io/badge/Cloudinary_API-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
</p>

---

### 📸 Application Showcase

<p align="center">
  <img src="images/0.PNG" width="48%" />
  <img src="images/1.PNG" width="48%" />
</p>
<p align="center">
  <img src="images/2.PNG" width="48%" />
  <img src="images/3.PNG" width="48%" />
</p>
<p align="center">
  <img src="images/4.PNG" width="48%" />
  <img src="images/5.PNG" width="48%" />
</p>
<p align="center">
  <img src="images/6.PNG" width="48%" />
  <img src="images/7.PNG" width="48%" />
</p>
<p align="center">
  <img src="images/8.PNG" width="48%" />
  <img src="images/9.PNG" width="48%" />
</p>
<p align="center">
  <img src="images/10.PNG" width="97%" />
</p>

---

### 🚀 Getting Started

**1. Clone the repository:**
```bash
git clone https://github.com/filipposobrijanu/flavr.git
cd flavr
```

**2. Install project dependencies:**
```bash
npm install
```

**3. Configure Environment Variables:**
Create a `.env` file in your root folder and configure your database and media parameters:
```env
DATABASE_URL="..."
DIRECT_URL="..."
NEXT_PUBLIC_GOOGLE_CLIENT_ID="..."
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

**4. Synchronize Database Schema:**
```bash
npx prisma db push
```

**5. Launch the local development server:**
```bash
npm run dev
```
