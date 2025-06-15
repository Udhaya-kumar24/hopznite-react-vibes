
import React from 'react';
import { Link } from 'react-router-dom';
import { Music } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Music className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-white">Hopznite</span>
            </Link>
            <p className="text-sm pr-8">
              Connecting the global entertainment industry.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="hover:text-white transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-white transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors text-sm">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors text-sm">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors text-sm">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-white transition-colors text-sm">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-sm">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            © 2025 Hopznite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
