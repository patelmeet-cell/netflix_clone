# Netflix Clone

**A feature-rich, responsive web application replicating the core browsing experience of Netflix.** Built using modern web technologies like React, TypeScript, and Material-UI, this project allows users to explore movie and TV show listings, search for specific titles, manage their watchlist, and authenticate securely using Firebase.

## ✨ Features

*   **🎬 Extensive Content Browsing**: Explore movies and TV shows categorized by genres, popularity (Trending, Top Rated), and Netflix Originals.
*   **🔍 Powerful Search**: Quickly find specific movies or TV shows using the integrated search bar.
*   **👤 User Authentication**: Secure sign-up and login functionality powered by Firebase Authentication.
*   **➕ My List**: Registered users can add or remove movies/shows from their personal watchlist.
*   **📄 Detailed Views**: Click on any title to view more details like synopsis, rating, and related content (if available via API).
*   **📱 Responsive Design**: Seamless experience across various devices (desktops, tablets, mobiles) thanks to Material-UI.
*   **🔌 Dynamic Data**: Leverages the TMDB API to fetch up-to-date movie and TV show information.

##  prerequisites

*   Node.js (v14 or higher recommended)
*   npm (v6 or higher) or yarn (v1.22 or higher)
*   A TMDB API Key (free)
*   A Firebase project configured for Authentication (free tier available)

## 🚀 Setup & Installation

1.  **Clone the repository:**
    ```bash
    https://github.com/nikpatil2123/netflix-clone.git
    cd netflix-clone
    ```

2.  **Install dependencies:**
    ```bash
    # Using npm
    npm install

    # Or using yarn
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the **root** directory of the project (next to `package.json`). Add the following environment variables, replacing the placeholder values with your actual keys obtained from TMDB and Firebase:

    ```dotenv
    # TMDB API Key
    VITE_TMDB_API_KEY=your_tmdb_api_key_here

    # Firebase Configuration
    VITE_FIREBASE_API_KEY=your_firebase_api_key_here
    VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
    VITE_FIREBASE_PROJECT_ID=your_firebase_project_id_here
    VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
    VITE_FIREBASE_APP_ID=your_firebase_app_id_here
    ```

4.  **Start the development server:**
    ```bash
    # Using npm
    npm run dev

    # Or using yarn
    yarn dev
    ```

5.  **Open the application:**
    Navigate to `http://localhost:5173` (or the port specified in your terminal) in your web browser.

## 🔑 Getting API Keys

### TMDB API
1.  Go to [The Movie Database (TMDB)](https://www.themoviedb.org/).
2.  Sign up for a free account or log in.
3.  Navigate to your account **Settings > API**.
4.  Request an API key (v3 auth).
5.  Copy your **API Key (v3 auth)** and paste it into your `.env` file as `VITE_TMDB_API_KEY`.

### Firebase
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click on "Add project" or select an existing project.
3.  Follow the setup steps for your project.
4.  In your project dashboard, navigate to **Build > Authentication**.
5.  Click "Get started" and enable the **Email/Password** sign-in method.
6.  Go back to your project overview by clicking the gear icon ⚙️ > **Project settings**.
7.  Under the "General" tab, scroll down to "Your apps".
8.  Click the web icon (`</>`) to register a new web app (or select an existing one).
9.  Give your app a nickname (e.g., "Netflix Clone Web").
10. You **don't** need to set up Firebase Hosting at this stage.
11. Click "Register app".
12. Firebase will provide you with a configuration object (`firebaseConfig`). Copy the values for `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, and `appId` into your `.env` file corresponding to the `VITE_FIREBASE_...` variables.

## 📁 Project Structure

```plaintext
netflix-clone/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, logos, etc.
│   ├── components/     # Reusable React components (Navbar, MovieCard, etc.)
│   ├── contexts/       # React Context API (e.g., AuthContext)
│   ├── hooks/          # Custom React Hooks (e.g., useMovies)
│   ├── pages/          # Page-level components (Home, Login, MovieDetails, etc.)
│   ├── services/       # API interaction logic (api.ts, firebase.ts, tmdb.ts)
│   ├── styles/         # Global styles (optional)
│   ├── types/          # TypeScript type definitions (movie.ts)
│   ├── App.tsx         # Main application component, routing setup
│   ├── main.tsx        # Entry point of the React application
│   └── config.ts       # Configuration (e.g., API base URLs - if needed)
├── .env                # Environment variables (API keys) - **Gitignored**
├── .gitignore          # Files/folders ignored by Git
├── eslint.config.js    # ESLint configuration
├── index.html          # Main HTML file template
├── package.json        # Project metadata and dependencies
├── README.md           # This file
├── tsconfig.json       # TypeScript compiler options
├── vite.config.ts      # Vite build tool configuration
└── ...                 # Other configuration files
```

## 🛠️ Technologies Used

*   **Frontend Framework**: React (v18+)
*   **Language**: TypeScript
*   **UI Library**: Material-UI (MUI)
*   **Routing**: React Router DOM
*   **State Management**: React Context API
*   **API Client**: Axios
*   **Authentication**: Firebase Authentication
*   **Movie Data**: The Movie Database (TMDB) API
*   **Build Tool**: Vite
*   **Linting**: ESLint

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the project:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix:
    ```bash
    git checkout -b feature/your-amazing-feature
    ```
3.  Make your changes and commit them with clear messages:
    ```bash
    git commit -m 'feat: Add some amazing feature'
    ```
4.  Push your changes to your forked repository:
    ```bash
    git push origin feature/your-amazing-feature
    ```
5.  Open a Pull Request (PR) to the original repository's `main` branch.

Please ensure your code follows the existing style and includes relevant updates to documentation if necessary.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details (if one exists, otherwise state the license directly).
