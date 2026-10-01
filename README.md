# 🍳 Culina - Smart Meal Planner

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
**Live Demo:** [https://meal-planner-jwcaybpsz-macawesome23s-projects.vercel.app](https://meal-planner-jwcaybpsz-macawesome23s-projects.vercel.app)

Culina is a beautifully designed, full-stack Next.js web application that helps users discover new recipes, organize their weekly meal plans, and sync their digital kitchen across all their devices.

![Culina Preview](https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200&h=400)

## ✨ Features

- **Modern Authentication**: Secure login via Firebase, supporting **Google OAuth**, **Phone Number (OTP with SMS)**, and standard Email/Password.
- **Recipe Discovery**: Browse and search through thousands of high-quality recipes powered by the **Edamam Recipe API**, complete with dietary filters, calorie counts, and macro tracking.
- **Smart Calendar**: Interactively plan your week by adding recipes to specific days (Monday-Sunday) in a beautifully animated UI.
- **Cloud State Sync**: Your weekly plan, saved favorites, and fridge ingredients are globally managed by **Redux Toolkit** and instantly synced to the cloud via **Upstash Redis**. Log in on any device and pick up right where you left off.
- **Premium UI/UX**: Built with **Tailwind CSS** and **Framer Motion**, featuring glassmorphism elements, high-resolution dynamic Unsplash imagery, buttery smooth page transitions, and real-time **react-hot-toast** notifications.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Server-Side API Routes)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + redux-persist
- **Database / Cache**: [Upstash Redis](https://upstash.com/)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **External Data**: [Edamam API](https://developer.edamam.com/edamam-recipe-api)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/meal-planner.git
cd meal-planner
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root of your project and add the following keys. You will need to create free accounts on Edamam and Upstash to get these keys.

```env
# Edamam Recipe API
EDAMAM_APP_ID=your_edamam_app_id
EDAMAM_APP_KEY=your_edamam_app_key

# Upstash Redis
UPSTASH_REDIS_REST_URL=your_upstash_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
```

*(Note: Firebase Authentication keys are safely exposed to the client in `src/lib/firebase.ts` and do not require .env configuration for this setup).*

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## 🧪 Testing the SMS Phone Login

If you want to test the Firebase Phone Login without using real SMS quota, you can use the pre-configured Firebase test number.
- **Phone Number**: `+1 650-555-1234`
- **OTP Code**: `123456`

## 🌍 Deployment

This project is optimized for deployment on **Vercel**. 
Simply link your GitHub repository to Vercel, paste your `.env.local` variables into the Vercel dashboard, and deploy!

---
*Designed & Built for modern home chefs.*
