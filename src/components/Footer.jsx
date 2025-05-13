import React from 'react';
import { Link } from 'react-router-dom';

// Import icons from a free icon library (since you may not have lucide-react installed)
// You'll need to install this package
// npm install react-icons
import { FaInstagram, FaFacebook, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCreditCard, FaTruck, FaShieldAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-green-50 border-t border-green-100">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="bg-green-100 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-green-800">Subscribe to our newsletter</h3>
              <p className="text-green-700 text-md">Get updates on new products and exclusive offers</p>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-2 rounded border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="bg-green-600  hover:bg-green-700 text-white px-6 py-2 rounded-xl transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <h4 className="text-xl font-semibold text-green-800 mb-4">Sampoornam Foods</h4>
            <p className="text-gray-600 mb-4">
              Quality groceries and food products delivered to your doorstep. We pride ourselves on offering fresh, organic, and local products.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="text-green-700 hover:text-green-800" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="https://facebook.com" className="text-green-700 hover:text-green-800" aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-green-700 hover:text-green-800" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-green-800 mb-4">Quick Links</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="text-gray-600 hover:text-green-600">Home</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-green-600">All Products</Link></li>
              <li><Link to="/categories" className="text-gray-600 hover:text-green-600">Categories</Link></li>
              <li><Link to="/deals" className="text-gray-600 hover:text-green-600">Special Deals</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-green-600">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-green-600">Contact Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-green-800 mb-4">Categories</h4>
            <ul className="space-y-1">
              <li><Link to="/category/spices" className="text-gray-600 hover:text-green-600">Sweets</Link></li>
              <li><Link to="/category/ready-to-eat" className="text-gray-600 hover:text-green-600">Namkeen</Link></li>
              <li><Link to="/category/dry-fruits" className="text-gray-600 hover:text-green-600">Chips</Link></li>
              <li><Link to="/category/pickles" className="text-gray-600 hover:text-green-600">Breakfast Items</Link></li>
              <li><Link to="/category/dairy" className="text-gray-600 hover:text-green-600"></Link>Snacky Nuts</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-green-800 mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <FaMapMarkerAlt size={18} className="mr-3 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-gray-600">123 Grocery Lane, Food City, 560001</span>
              </li>
              <li className="flex items-center">
                <FaPhone size={18} className="mr-3 text-green-600 flex-shrink-0" />
                <span className="text-gray-600">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope size={18} className="mr-3 text-green-600 flex-shrink-0" />
                <a href="mailto:info@sampoornamfoods.com" className="text-gray-600 hover:text-green-600">
                  info@sampoornamfoods.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust & Payment Info */}
        <div className="mt-12 pt-6 border-t border-green-100">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6 md:mb-0">
              <div className="flex items-center">
                <FaTruck size={20} className="mr-2 text-green-600" />
                <span className="text-gray-700">Fast Delivery</span>
              </div>
              {/* <div className="flex items-center">
                <FaShieldAlt size={20} className="mr-2 text-green-600" />
                <span className="text-gray-700">Secure Payment</span>
              </div>
              <div className="flex items-center">
                <FaCreditCard size={20} className="mr-2 text-green-600" />
                <span className="text-gray-700">Multiple Payment Options</span>
              </div> */}
            </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Sampoornam Foods. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;