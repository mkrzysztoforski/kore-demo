import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [backgroundUrl, setBackgroundUrl] = useState('/bg.png');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://github.com/Cognigy/Webchat/releases/latest/download/webchat.js";

    script.onload = async () => {
      const chat = await window.initWebchat(
        "https://endpoint-trial.cognigy.ai/cc8beae4015ba44f1b497a9d5edb25380d9ac1fd3ba59fc0ca200e5102a5bf96",
        {
          settings: {
            disableLocalEcho: true,
            enableUnreadMessageBadge: true,
            enableAPI: true,
          }
        }
      );

      window.cognigyWebchat = chat;

      // Obsługa zmiany tła i koszyka
      chat.registerAnalyticsService((event) => {
        if (
          event.type === "action" &&
          event.payload?.type === "postback" &&
          typeof event.payload.payload === "string" &&
          event.payload.payload.match(/^\/.*\.(png|jpg|jpeg|webp)$/i)
        ) {
          setBackgroundUrl(event.payload.payload);
        }

        if (
          event.type === "webchat/incoming-message" &&
          event.payload?.data?._event === "show_cart" &&
          Array.isArray(event.payload.data.cart)
        ) {
          setCart(event.payload.data.cart);
          setShowCart(true);
        }
      });

      // Obsługa custom payload (resize, etc.)
      chat.client.on("output", (message) => {
        const payload = message?.data?.payload;

        if (message?.data?.type !== "custom" || !payload?._event) return;

        if (payload._event === "resize_webchat" && typeof payload.width === "number") {
          const webchatWindow = document.getElementById("webchatWindow");
          if (webchatWindow) {
            webchatWindow.style.width = `${payload.width}px`;
            webchatWindow.style.transition = "width 0.3s ease";
          }
        }

        if (payload._event === "background_change" && typeof payload.url === "string") {
          setBackgroundUrl(payload.url);
        }
      });
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Ekran koszyka na cały ekran
  if (showCart) {
    return (
      <div style={{
        backgroundColor: '#fff',
        width: '100vw',
        height: '100vh',
        padding: '2rem',
        boxSizing: 'border-box',
        fontFamily: 'sans-serif'
      }}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo.svg" alt="Logo" style={{ height: '30px' }} />
          <h1>Your Cart</h1>
        </header>
        <main style={{ maxWidth: '800px', margin: '0 auto' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cart.map((item, index) => {
              const fakePrice = Math.floor(Math.random() * (120 - 40 + 1)) + 40;
              return (
                <li
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    borderBottom: '1px solid #ddd',
                    paddingBottom: '1rem'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      marginRight: '1rem'
                    }}
                  />
                  <div>
                    <strong>{item.title}</strong><br />
                    Price: {fakePrice} £<br />
                    Quantity: 1
                  </div>
                </li>
              );
            })}
          </ul>
          <h2 style={{ textAlign: 'center' }}>Total: 000 £</h2>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={() => setShowCart(false)}
              style={{
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Back to store
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Widok ze zmiennym tłem
  return (
    <div
      style={{
        backgroundImage: `url('${backgroundUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
        position: 'relative'
      }}
    />
  );
}

export default App;
