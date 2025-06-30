import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [backgroundUrl, setBackgroundUrl] = useState('/bg.png');

  useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://github.com/Cognigy/Webchat/releases/latest/download/webchat.js";

  script.onload = async () => {
    const chat = await window.initWebchat(
      "https://endpoint-trial.cognigy.ai/cc8beae4015ba44f1b497a9d5edb25380d9ac1fd3ba59fc0ca200e5102a5bf96",
      {
        settings: {
          // startBehavior: "injection",
          disableLocalEcho: true,
          enableUnreadMessageBadge: true,
          enableAPI: true,
        }
      }
    );

    window.cognigyWebchat = chat;

    chat.registerAnalyticsService((event) => {
      console.log("analytics event:", event);

      if (
        event.type === "action" &&
        event.payload?.type === "postback" &&
        typeof event.payload.payload === "string" &&
        event.payload.payload.match(/^\/.*\.(png|jpg|jpeg|webp)$/i)
      ) {
        const url = event.payload.payload;
        console.log("bg triggered by postback:", url);
        setBackgroundUrl(url);
      }
    });

    console.log("Cognigy Webchat initialized", chat);

    chat.client.on("input", (message) => {
      console.log("Received input message:", message);
    });

    chat.client.on("output", (message) => {
      const payload = message?.data?.payload;

      if (message?.data?.type !== "custom" || !payload?._event) return;

      if (payload._event === "background_change" && typeof payload.url === "string") {
        setBackgroundUrl(payload.url);
      }

      const text = message?.text;

      if (typeof text === "string" && text.startsWith("background_change::")) {
        const url = text.split("background_change::")[1];
        if (url) {
          console.log("Background change via postback:", url);
          setBackgroundUrl(url);
        }
      }

      chat.client.on("input", (message) => {
        const text = message?.text;

        if (typeof text === "string" && text.startsWith("background_change::")) {
          const url = text.split("background_change::")[1];
          if (url) {
            console.log("Background change via postback (input):", url);
            setBackgroundUrl(url);
          }
        }
      });

      if (payload._event === "resize_webchat" && typeof payload.width === "number") {

        const webchatWindow = document.getElementById("webchatWindow");

        if (webchatWindow) {
          webchatWindow.style.width = `${payload.width}px`;
          webchatWindow.style.transition = "width 0.3s ease";
        } else {
          console.warn("No #webchatWindow found in DOM yet");
        }
      }
    });
  };

  document.body.appendChild(script);
  return () => {
    document.body.removeChild(script);
  };
}, []);

  return (
    <div
      style={{
        backgroundImage: `url('${backgroundUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}

export default App;
