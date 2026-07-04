import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MealProvider } from './context/MealContext';
import { CommunityProvider } from './context/CommunityContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import OnboardingModal from './components/OnboardingModal';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import RecipeDetail from './pages/RecipeDetail';
import MealPlanner from './pages/MealPlanner';
import MealTracker from './pages/MealTracker';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Auth from './pages/Auth';
import AddRecipe from './pages/AddRecipe';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <OnboardingModal />
    </div>
  );
}

function AuthLayout({ children }) {
  return (
    <div style={{ width: '100%' }}>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <MealProvider>
          <CommunityProvider>
            <ToastProvider>
              <Routes>
                {/* Auth page without sidebar */}
                <Route path="/auth" element={
                  <AuthLayout>
                    <Auth />
                  </AuthLayout>
                } />

                {/* All other pages with sidebar */}
                <Route path="/*" element={
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/explore" element={<Explore />} />
                      <Route path="/add-recipe" element={<AddRecipe />} />
                      <Route path="/recipe/:id" element={<RecipeDetail />} />
                      <Route path="/planner" element={<MealPlanner />} />
                      <Route path="/tracker" element={<MealTracker />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/community" element={<Community />} />
                    </Routes>
                  </AppLayout>
                } />
              </Routes>
            </ToastProvider>
          </CommunityProvider>
        </MealProvider>
      </AuthProvider>
    </Router>
  );
}
