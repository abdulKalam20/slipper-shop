import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between">
      <Link to="/" className="font-bold text-lg">
        🩴 Slipper Shop
      </Link>
      <div className="flex gap-6 text-sm">
        <Link to="/">All</Link>
        <Link to="/category/slippers">Slippers</Link>
        <Link to="/category/sweeper">Sweeper</Link>
        <Link to="/category/tea-powder">Tea Powder</Link>
        <Link to="/admin/login" className="opacity-70">
          Admin
        </Link>
      </div>
    </nav>
  );
}
