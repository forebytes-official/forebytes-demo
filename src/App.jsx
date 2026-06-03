import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useRestaurant } from './hooks/useRestaurant';
import MenuPage from './pages/MenuPage';
import ViewerPage from './pages/ViewerPage';

function RootRedirect() {
  const { search } = useLocation();
  return <Navigate to={`/menu${search}`} replace />;
}

export default function App() {
  const restaurant = useRestaurant();

  useEffect(() => {
    if (!restaurant) return;
    Object.entries(restaurant.theme).forEach(([prop, value]) => {
      document.documentElement.style.setProperty(prop, value);
    });
    document.title = restaurant.name;
  }, [restaurant]);

  if (!restaurant) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<RootRedirect />} />
        <Route path="/menu"          element={<MenuPage restaurant={restaurant} />} />
        <Route path="/view/:dishKey" element={<ViewerPage restaurant={restaurant} />} />
        <Route path="*"              element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
