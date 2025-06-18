import React, { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
  const script1 = document.createElement('script');
  script1.src = 'https://cdn.jsdelivr.net/npm/kore-web-sdk@11.14.1/dist/umd/kore-web-sdk-umd-chat.min.js';
  script1.async = true;

  script1.onload = () => {
    if (window.KoreChatSDK) {
      window.KoreChatSDK.chatConfig.botOptions.API_KEY_CONFIG.KEY = 'd899143953bf4a23a082b0de3502f7273a934aedc2804987a16d2ce0fdc6e5b0stfd';
      new window.KoreChatSDK.chatWindow().show(window.KoreChatSDK.chatConfig);
    } else {
      console.error('KoreChatSDK not found on window');
    }
  };

  document.body.appendChild(script1);

  return () => {
    document.body.removeChild(script1);
  };
}, []);

  return (
    <div
      style={{
        backgroundImage: `url('/bg.png')`,
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
