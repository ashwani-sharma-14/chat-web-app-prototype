import { useEffect } from "react";
import Routes from "./routes/Routes";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { checkAuth, theme } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div>
      <Routes />
    </div>
  );
}

export default App;
