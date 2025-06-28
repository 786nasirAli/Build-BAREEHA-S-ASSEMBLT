import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "../context/CartContext";
import { Toaster } from "react-hot-toast";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <Component {...pageProps} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              style: {
                background: "#059669",
              },
            },
            error: {
              duration: 4000,
              style: {
                background: "#DC2626",
              },
            },
          }}
        />
      </CartProvider>
    </SessionProvider>
  );
}
