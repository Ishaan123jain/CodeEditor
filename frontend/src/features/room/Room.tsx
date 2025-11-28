import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setCode } from "../../store";
import { requestAutocomplete } from "../../api";

const AUTOCOMPLETE_DELAY = 600;

export default function Room() {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const code = useSelector((state: RootState) => state.code.value);

  const wsRef = useRef<WebSocket | null>(null);
  const autocompleteTimeout = useRef<NodeJS.Timeout | null>(null);

  const [suggestion, setSuggestion] = useState("");

  /** WebSocket Setup */
  useEffect(() => {
    if (!roomId) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "code_update") {
        dispatch(setCode(data.code));
      }
    };

    return () => ws.close();
  }, [roomId, dispatch]);

  /** Editor Change Handler */
  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || "";
    dispatch(setCode(newCode));

    wsRef.current?.send(
      JSON.stringify({
        type: "code_update",
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
