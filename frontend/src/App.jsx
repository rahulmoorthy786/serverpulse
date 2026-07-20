import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ServerDetails from "./pages/ServerDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/servers/:id"
          element={<ServerDetails />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
