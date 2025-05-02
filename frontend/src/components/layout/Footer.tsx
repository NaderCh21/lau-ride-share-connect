
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-lau-green text-white py-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Share a Ride</h3>
            <p className="text-sm">
              A carpooling platform for LAU students to share rides safely and conveniently.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/rides" className="text-sm hover:underline">
                  Find Rides
                </Link>
              </li>
              <li>
                <Link to="/rides/create" className="text-sm hover:underline">
                  Offer a Ride
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:underline">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm mb-2">
              For support or assistance:
            </p>
            <a
              href="mailto:support@sharearide.lau.edu"
              className="text-sm hover:underline block mb-2"
            >
              support@sharearide.lau.edu
            </a>
            <p className="text-sm">
              Lebanese American University<br />
              Beirut, Lebanon
            </p>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Share a Ride - Lebanese American University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
