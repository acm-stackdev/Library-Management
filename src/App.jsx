import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import BookDetails from "./pages/BookDetails";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book/:id" element={<BookDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
