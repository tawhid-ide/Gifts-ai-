# Gifts AI 🎁
Find the perfect gift for anyone in seconds using AI.

Gifts AI is a modern web application that leverages the power of Google's Gemini 1.5 Flash model to provide personalized gift recommendations based on user preferences, budget, and occasion.

## 🚀 Live Demo
Visit the live demo app: [giftsai.netlify.app](https://giftsai.netlify.app)

## ✨ Features
- **AI-Powered Recommendations:** Uses state-of-the-art AI to analyze recipient details and suggest real products available on Amazon.
- **High Personalization:** Go beyond categories with "Custom Notes" to specify unique hobbies or personality traits.
- **Aesthetic UI:** A clean, minimal interface built with Tailwind CSS and Framer Motion.
- **Responsive Design:** Works perfectly on Desktop, Tablet, and Mobile devices.
- **Theme Support:** Switch between **Dark Mode** (default) and **Light Mode**.
- **Direct Feedback:** Integrated feedback system using Netlify Forms to collect user suggestions and bug reports.

## 🛠️ Setup & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- A [Google AI Studio](https://aistudio.google.com/) account for a Gemini API Key.

### 2. Environment Variables
To get the AI working and set up your custom branding, you need to provide a few environment variables.

1. Create a `.env` file in the root directory.
2. Add your keys:
   ```env
   # Required for AI functionality
   GEMINI_API_KEY=your_actual_api_key_here

   # Affiliate Settings
   VITE_AMAZON_TAG=your_amazon_affiliate_id

   # Custom Branding & Assets (Optional - defaults provided)
   VITE_LOGO_URL=your_logo_image_url
   VITE_FAVICON_URL=your_favicon_url
   VITE_APPLE_TOUCH_ICON_URL=your_apple_icon_url
   VITE_OG_IMAGE_URL=your_facebook_og_image_url
   VITE_TWITTER_IMAGE_URL=your_twitter_card_image_url
   ```

### 3. Asset & Branding Management
This application is designed to be fully customizable via environment variables. You can update your branding without touching the source code:

- **Logo:** Set `VITE_LOGO_URL` to your hosted logo image. If not set, it defaults to a built-in icon.
- **Affiliate ID:** Set `VITE_AMAZON_TAG` to your Amazon Associates tracking ID to earn commissions.
- **Favicon:** Set `VITE_FAVICON_URL` for the browser tab icon.
- **Social Previews:** Set `VITE_OG_IMAGE_URL` and `VITE_TWITTER_IMAGE_URL` to control how your site looks when shared on social media.
- **Apple Icon:** Set `VITE_APPLE_TOUCH_ICON_URL` for devices that pin the app to the home screen.

*Quick Tip: You can host your images on services like Blogger, Imgur, or Cloudinary for high reliability.*

### 4. Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Deployment (Netlify Guide)
This app is optimized for Netlify deployment.
1. Create a new site on **Netlify** from your GitHub repository.
2. Go to **Site Settings > Environment Variables**.
3. Add the following variables:
   - `GEMINI_API_KEY`: Your API key from Google AI Studio.
   - `VITE_AMAZON_TAG`: Your Amazon Affiliate Tracking ID.
   - `VITE_LOGO_URL`: URL for your brand logo.
   - `VITE_FAVICON_URL`: URL for your tab icon.
   - `VITE_APPLE_TOUCH_ICON_URL`: URL for Apple home screen icon.
   - `VITE_OG_IMAGE_URL`: Image displayed when shared on Facebook/LinkedIn.
   - `VITE_TWITTER_IMAGE_URL`: Image displayed when shared on Twitter/X.
4. Netlify will automatically build and deploy your site when you push changes to GitHub.

## 📝 Example Usage
If you're looking for a gift for a "Friend" in their "20s" for a "Housewarming" with an interest in "Art" and a note saying "They just moved into a minimalist apartment," Gifts AI might suggest:
- **Product:** Minimalist Ceramic Váse Set
- **Reason:** Matches their new apartment aesthetic and artistic interest.
- **Amazon Link:** Automatically generated search link.

## 🛠️ Built With
- **Framework:** [React 18](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **AI Model:** [Google Gemini 1.5 Flash](https://ai.google.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)

---
Created by [Tawhid Islam](https://github.com/tawhid-ide)
