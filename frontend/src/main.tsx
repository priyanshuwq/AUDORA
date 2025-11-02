import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./providers/AuthProvider.tsx";
import { loadSongsToLocalStorage } from "./lib/localSongLoader";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function MissingKeyNotice() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-800 p-6">
      <div className="max-w-xl rounded-lg shadow-md bg-white p-6">
        <h1 className="text-2xl font-semibold mb-2">Missing Clerk publishable key</h1>
        <p className="mb-4">
          The environment variable <code>VITE_CLERK_PUBLISHABLE_KEY</code> is not set.
          The app will render a read-only notice instead of bootstrapping authentication.
        </p>
        <p className="mb-4">
          To enable authentication, create a <code>.env</code> file at the project root and add
          <br />
          <code>VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key</code>
        </p>
        <p className="text-sm text-neutral-600">You can still use React DevTools and other debugging tools while this notice is visible.</p>
      </div>
    </div>
  );
}

async function bootstrap() {
  await loadSongsToLocalStorage();

  const root = createRoot(document.getElementById("root")!);

  if (!PUBLISHABLE_KEY) {
    // Don't throw — render a helpful notice so the app doesn't crash during development.
    // This allows React DevTools to attach and avoids an uncaught exception in the console.
    // Also log a clear message for developers.
    // eslint-disable-next-line no-console
    console.error(
      "Missing Publishable Key: set VITE_CLERK_PUBLISHABLE_KEY in your environment to enable Clerk authentication."
    );
    root.render(
      <StrictMode>
        <MissingKeyNotice />
      </StrictMode>
    );
    return;
  }

  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </ClerkProvider>
    </StrictMode>
  );
}

// temporary debug
console.log('import.meta.env:', import.meta.env);
console.log('VITE_CLERK_PUBLISHABLE_KEY:', import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

bootstrap();
