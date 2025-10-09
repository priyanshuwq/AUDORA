import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback, useUser } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import BrowsePage from "./pages/browse/BrowsePage";
import LibraryPage from "./pages/library/LibraryPage";
import RoomsPage from "./pages/rooms/RoomsPage";

import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";
import { useEnhancedRoomStore } from "./stores/useEnhancedRoomStore";
import { useEffect } from "react";

function App() {
  const { user } = useUser();
  const { initSocket } = useEnhancedRoomStore();

  // Initialize socket connection when user is signed in
  useEffect(() => {
    if (user) {
      initSocket();
    }
  }, [user, initSocket]);

  return (
    <>
      <Routes>
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback
              signUpForceRedirectUrl={"/auth-callback"}
            />
          }
        />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
