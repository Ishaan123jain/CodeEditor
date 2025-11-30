import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setCode } from "../../store";
import { createRoom, requestAutocomplete } from "../../api";

const AUTOCOMPLETE_DELAY = 600;

export default function Room() {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const code = useSelector((state: RootState) => state.code.value);

  const wsRef = useRef<WebSocket | null>(null);
  const autocompleteTimeout = useRef<NodeJS.Timeout | null>(null);

  const [suggestion, setSuggestion] = useState("");


  useEffect(() => {
    if (!roomId) return;

    const createRoomIfNotExists = async () => {
      console.log("Creating room:", roomId);

      try {
        const res = await createRoom(roomId); 
        console.log("Room creation response:", res);
      } catch (err) {
        console.error("Failed to create room ➤", err);
      }
    };

    createRoomIfNotExists();
  }, [roomId]);

  
  useEffect(() => {
    if (!roomId) return;
    console.log("Connecting WebSocket:", roomId);

    const ws = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "init") dispatch(setCode(data.code));
      if (data.type === "update") dispatch(setCode(data.code));
    };

    ws.onerror = (err) => console.log("WS ERROR:", err);
    ws.onclose = () => console.log("WS CLOSED");

    return () => ws.close();
  }, [roomId, dispatch]);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || "";
    dispatch(setCode(newCode));

    wsRef.current?.send(
      JSON.stringify({
        type: "sync",
        code: newCode
      })
    );

    if (autocompleteTimeout.current)
      clearTimeout(autocompleteTimeout.current);

    autocompleteTimeout.current = setTimeout(async () => {
      const result = await requestAutocomplete(newCode);
      setSuggestion(result.suggestion || "");
    }, AUTOCOMPLETE_DELAY);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Code Editor */}
      <div style={{ flex: 3 }}>
        <Editor
          height="100vh"
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
        />
      </div>

      {/* Suggestion Panel */}
      <div
        style={{
          flex: 1,
          background: "#151515",
          padding: "1rem",
          color: "white",
          fontFamily: "monospace"
        }}
      >
        <h3>AI Suggestion</h3>
        <pre>{suggestion || "Waiting for input..."}</pre>
      </div>
    </div>
  );
}
