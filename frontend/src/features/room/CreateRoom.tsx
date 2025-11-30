import { createRoom } from "../../api";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const navigate = useNavigate();

  async function handleCreateRoom() {
    const data = await createRoom();   // backend creates room
    console.log("Backend response:", data);
    navigate(`/room/${data.roomId}`); // use backend roomId
  }

  return (
    <button onClick={handleCreateRoom}>
      Create Room
    </button>
  );
}
