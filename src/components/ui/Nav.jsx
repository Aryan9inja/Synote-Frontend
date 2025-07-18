import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "./logo.jsx";
import Button from "./button.jsx";
import ThemeButton from "./themeButton.jsx";
import { Link } from "react-router-dom";
import LogoutButton from "./logoutButton.jsx";
import { useSelector } from "react-redux";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <header className="fixed top-0 left-0 z-50 w-full h-20 sm:h-24 bg-light-background dark:bg-gray-900 px-4 sm:px-8 flex items-center justify-between transition-colors duration-300">
      {/* Brand + Tooltip */}
      <div className="relative group cursor-pointer flex items-center text-2xl sm:text-3xl font-Exo-2 font-medium italic text-blue-400">
        Synote
        <Logo width="22" className="ml-2 mt-1 sm:w-[25px]" />
      </div>

      {/* Desktop Nav Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        <ThemeButton />
        {isAuthenticated ? (
          <LogoutButton />
        ) : (
          <>
            <Link to={"/register"}>
              <Button
                bgColor="bg-transparent hover:text-gray-500 dark:bg-transparent"
                textColor="text-black dark:text-white"
                className="font-semibold"
              >
                Get Started
              </Button>
            </Link>
            <Link to={"/login"}>
              <Button
                bgColor="bg-blue-400 hover:bg-blue-500"
                className="font-semibold text-white"
              >
                Login
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <div className="md:hidden flex items-center">
        <ThemeButton />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-4 text-gray-800 dark:text-white"
          aria-label="Toggle Menu"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-20 sm:top-24 left-0 w-full bg-light-background dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-4 px-6 flex flex-col space-y-4 md:hidden">
          {isAuthenticated ? (
            <LogoutButton />
          ) : (
            <>
              <Link to={"/register"}>
                <Button
                  bgColor="bg-transparent hover:text-gray-500 dark:bg-transparent"
                  textColor="text-black dark:text-white"
                  className="font-semibold w-full text-left"
                >
                  Get Started
                </Button>
              </Link>
              <Link to={"/login"}>
                <Button
                  bgColor="bg-blue-400 hover:bg-blue-500"
                  className="font-semibold text-white w-full text-left"
                >
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Nav;
