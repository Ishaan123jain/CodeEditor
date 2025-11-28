import { Routes, Route, Navigate } from "react-router-dom";
import Room from "./features/room/Room";

function App() {
  // Generate random room ID
  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  return (
    <Routes>
      {/* Auto-redirect root to a random room */}
      <Route path="/" element={<Navigate to={`/room/${generateRoomId()}`} replace />} />

      {/* Actual room page */}
      <Route path="/room/:roomId" element={<Room />} />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to={`/room/${generateRoomId()}`} replace />} />
    </Routes>
  );
}

export default App;
