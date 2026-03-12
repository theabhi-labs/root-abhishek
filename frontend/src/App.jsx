import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import BeyondTheCode from "./component/beyondTheCode.component";
import TrackerLayout from "./component/tracker/TrackerLayout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/track" element={<TrackerLayout />} />
        <Route path="/beyondTheCode" element={<BeyondTheCode />} />
      </Routes>
    </Router>
  );
}
