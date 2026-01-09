import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Navbar from "./components/Navbar";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-3 sm:p-4 md:p-6 flex flex-col">

        <Navbar />

        <AppRoutes />
        <ChatWidget />

      </div>
    </BrowserRouter>
  );
}
