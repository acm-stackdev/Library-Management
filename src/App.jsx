import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import BookDetails from "./pages/BookDetails";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/layout/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import UserManagement from "./pages/admin/UserManagement";
import RoleManagement from "./pages/admin/RoleManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import SubscriptionManagement from "./pages/admin/SubscriptionManagement";
import BookLoanManagement from "./pages/admin/BookLoanManagement";
import UserLayout from "./components/layout/UserLayout";
import UserProfile from "./pages/user/UserProfile";
import UserWishlist from "./pages/user/UserWishlist";
import UserLoans from "./pages/user/UserLoans";
import AuthorManagement from "./pages/admin/AuthorManagement";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="authors" element={<AuthorManagement />} />
              <Route path="roles" element={<RoleManagement />} />
              <Route path="bookloans" element={<BookLoanManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route
                path="subscriptions"
                element={<SubscriptionManagement />}
              />
            </Route>
            <Route path="/profile" element={<UserLayout />}>
              <Route index element={<UserProfile />} />
              <Route path="wishlist" element={<UserWishlist />} />
              <Route path="loans" element={<UserLoans />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
