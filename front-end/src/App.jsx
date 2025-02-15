import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatBox from "./components/ChatBox";
import { StartMessage } from "./pages/StartMessaging";
import StartMessaging from "./pages/StartMessaging";
import ProfileCard from "./components/ProfileCard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/account/register" element={<Register />} />

        <Route path="/startMessaging" element={<StartMessaging />}>
          <Route index element={<StartMessage />} />
          <Route path="chat/:username/:userId/:chatId/:onlineStatus" element={<ChatBox />} />
          <Route path="profile/:id" element={<ProfileCard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;