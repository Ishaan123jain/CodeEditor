import { Routes, Route, Navigate } from "react-router-dom";
import Room from "./features/room/Room";

function App() {
    const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/room/${generateRoomId()}`} replace />} />

      <Route path="/room/:roomId" element={<Room />} />

      <Route path="*" element={<Navigate to={`/room/${generateRoomId()}`} replace />} />
    </Routes>
  );
}

export default App;
