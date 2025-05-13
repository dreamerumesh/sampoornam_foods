import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import { HistoryProvider } from './contexts/HistoryContext';
import { AddressProvider } from './contexts/AddressContext';
import MainLayout from "./layouts/MainLayout";
import MainLayout2 from "./layouts/MainLayout2";
import IntroAnimation from './components/IntroAnimation'; // Import the IntroAnimation component

// Import components
import ProductList from './pages/ProductList';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HistoryPage from './pages/HistoryPage';
import AddressSection from './components/AddressSection';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import NotFound from './pages/NotFound'; // Assuming you have a NotFound component



const PrivateRoute = ({ children, adminOnly = false }) => {
const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

function AppContent() {
  const [showIntro, setShowIntro] = useState(false); // Start as false until we check
  const [animationFinished, setAnimationFinished] = useState(false);
  const effectRan = useRef(false); // Track if effect has already run to prevent double execution
  
  const handleAnimationComplete = () => {
    // Mark animation as completed before hiding it
    setAnimationFinished(true);
    // Then hide the intro with a slight delay to ensure no visual gaps
    setTimeout(() => {
      setShowIntro(false);
    }, 100);
  };
  
  // Check if first visit to show intro animation
  useEffect(() => {
    // Fetch products on mount
    // Protection against StrictMode double-execution
    if (effectRan.current === true && process.env.NODE_ENV === 'development') {
      // Skip on second render in development with StrictMode
      return;
    }
    
    // Mark that the effect has run
    effectRan.current = true;
    
    // Use sessionStorage for development purposes - shows animation once per browser session
    const hasVisited = sessionStorage.getItem('hasVisitedSampoornam');
    
    if (hasVisited === 'true') {
      // Skip animation for returning visitors in this session
      setShowIntro(false);
      setAnimationFinished(true);
    } else {
      // Set flag for future visits
      sessionStorage.setItem('hasVisitedSampoornam', 'true');
      setShowIntro(true);
      setAnimationFinished(false);
    }
    
    // Cleanup function - important for StrictMode
    return () => {
      // This helps with StrictMode unmount-remount cycle
      effectRan.current = true;
    };
  }, []); // Empty dependency array ensures this runs only once on mount
  
  return (
    <>
      {/* Show animation with z-index to be on top */}
      {showIntro && (
        <IntroAnimation onAnimationComplete={handleAnimationComplete} />
      )}
      
      {/* Always render the app, but only make it visible after animation finishes */}
      <div 
        className="min-h-screen bg-green-50"
        style={{ 
          visibility: !showIntro || animationFinished ? 'visible' : 'hidden',
          position: animationFinished || !showIntro ? 'relative' : 'absolute'
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<ProductList />} />
            
          </Route>
          
          <Route element={<MainLayout2 />}>
          <Route path="/product/:productId" element={<ProductDetail />} />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />
            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <HistoryPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/address"
              element={
                <PrivateRoute>
                  <AddressSection />
                </PrivateRoute>
              }
            />
          </Route>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<OTPVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <HistoryProvider>
              <AddressProvider>
                <AppContent />
              </AddressProvider>
            </HistoryProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;




// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
// import { ProductProvider } from './contexts/ProductContext';
// import { CartProvider } from './contexts/CartContext';
// import { HistoryProvider } from './contexts/HistoryContext';
// import { AddressProvider } from './contexts/AddressContext';
// import MainLayout from "./layouts/MainLayout";
// import MainLayout2 from "./layouts/MainLayout2";
// // Import components
// import ProductList from './pages/ProductList';
// import Navbar from './components/Navbar';

// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/Regis<Route path="/reset-password" element={<RterPage';
// import OTPVerificationPage from './pages/OTPVerificationPage';
// import ForgotPasswordPage from './pages/ForgotPasswordPage';
// import ResetPasswordPage from './pages/ResetPasswordPage';
// import HistoryPage from './pages/HistoryPage';
// import AddressSection from './components/AddressSection';
// import Cart from './pages/Cart';

// import ProductDetail from './pages/ProductDetail';


// const PrivateRoute = ({ children, adminOnly = false }) => {
//   const { user, isAuthenticated } = useAuth();
  
//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }
  
//   if (adminOnly && user.role !== 'admin') {
//     return <Navigate to="/" />;
//   }
  
//   return children;
// };

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <ProductProvider>
//           <CartProvider>
//             <HistoryProvider>
//               <AddressProvider>
//             <div className="min-h-screen bg-green-50">
//                {/* <Navbar /> */}
              
//               <Routes>
//                 {/* Public Routes */}
//                 <Route element={<MainLayout />}>
//                 <Route path="/" element={<ProductList />} />
//                 <Route path="/product/:productId" element={<ProductDetail />} />
                
//                 </Route>
//                 <Route element={<MainLayout2 />}>
//                 <Route path="/cart" element={<Cart />} />
//                 <Route path="/history" element={<HistoryPage />}/>
//                 </Route>
                
                
//                 <Route path="/login" element={<LoginPage />} />
//                 <Route path="/register" element={<RegisterPage />} />
//                 <Route path="/verify-otp" element={<OTPVerificationPage />} />
//                 <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//                 <Route path="/reset-password" element={<ResetPasswordPage />} />

                
//                 <Route path="/address" element={<AddressSection />}/>
                
                
                
//                 {/* Admin Routes */}
//                 <Route 
//                   path="/admin/products" 
//                   element={
//                     <PrivateRoute adminOnly={true}>
//                       <ProductList adminMode={true} />
//                     </PrivateRoute>
//                   } 
//                 />
//               </Routes>
//             </div>
//               </AddressProvider>
//             </HistoryProvider>
//           </CartProvider>
//         </ProductProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;
