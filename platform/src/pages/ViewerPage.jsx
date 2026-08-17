import { useParams, Navigate } from 'react-router-dom';
import ARViewer from '../components/ARViewer';

export default function ViewerPage({ restaurant }) {
  const { dishKey } = useParams();
  const dish = restaurant.dishes.find(d => d.key === dishKey);

  if (!dish) return <Navigate to="/menu" replace />;

  return <ARViewer dish={dish} />;
}
