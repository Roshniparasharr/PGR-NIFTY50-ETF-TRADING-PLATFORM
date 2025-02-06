import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom"; // Using useHistory for navigation
import IndexDropdown from "../Dropdowns/IndexDropdown.js";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const history = useHistory(); // Replace useNavigate with useHistory

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Convert token existence to boolean
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    setIsAuthenticated(false);
    history.push("/auth/login"); // Redirect to home
  };

  return (
    <>
      <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-4 py-3 navbar-expand-lg bg-blue-900 shadow-lg bg-white">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              to="/"
              className="text-black text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
            >
              <i className="fas fa-briefcase mr-2 text-xl"></i>
              StockSphere
            </Link>
            <button
              className="cursor-pointer text-white text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" +
              (navbarOpen ? " block" : " hidden")
            }
            id="navbar-links"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto space-x-6">
              {/* New Navigation Links */}
              <li className="flex items-center">
                <Link
                  to="/"
                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                >
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <Link
                  to="/about"
                  className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                >
                  About
                </Link>
              </li>
              <li className="flex items-center">
                <Link
                  to="/contact"
                className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                >
                  Contact
                </Link>
              </li>
              <li className="flex items-center">
                <Link
                  to="/services"
                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                >
                  Services
                </Link>
              </li>

              {/* <li className="flex items-center">
                <IndexDropdown />
              </li> */}

              {/* Conditional Rendering for Login, Register, and Logout */}
              {isAuthenticated ? (
                <li className="flex items-center">
                  <button
                    className="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </li>
              ) : (
                <>
                  <li className="flex items-center">
                    <Link
                      to="/auth/login" // Updated path
                      className="bg-lightBlue-500 text-white active:bg-lightBlue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                    >
                      <i className="fas fa-sign-in-alt"></i> Login
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <Link
                      to="/auth/register"
                      className="bg-red-500 text-white active:bg-green-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:bg-green-700 hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                    >
                      <i className="fas fa-user-plus mr-1"></i> Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}