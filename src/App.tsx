import AppRoutes from './routes/AppRoutes'
import './global.css'
import AutoRedirect from './routes/AuthoRedirect';

function App() {
  return (
    <>
      <AutoRedirect />
      <AppRoutes />
    </>
  );
}

export default App
