import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Menu,
  Search,
  ShoppingCart,
  History,
  User,
  LogOut,
  Check,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useProduct } from "../contexts/ProductContext";
import { useAuth } from "../contexts/AuthContext";

const Navbar2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { fetchProducts } = useProduct();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const [isCatOpen, setIsCatOpen] = useState(false);
  const [selCategory, setSelCategory] = useState("All categories");

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleSearchSubmit = (e, selectedCategory = category) => {
    if (e && e.preventDefault) e.preventDefault();
    fetchProducts({ search, category: selectedCategory });
    setIsSearchActive(false);
  };

  const handleLogin = () => {
    navigate("/login");
  };
  const goToHistory = () => {
    navigate("/history");
  };
  const goToCart = () => {
    navigate("/cart");
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setIsLogoutDialogOpen(false);
    logout();
    navigate("/");
    console.log("User logged out");
  };

  useEffect(() => {
    if (shouldSubmit && selCategory) {
      handleSearchSubmit(null, selCategory);
      setShouldSubmit(false); // reset flag
    }
  }, [shouldSubmit, selCategory]);

  const handleSel = (category) => {
    setSelCategory(category);
    setIsCatOpen(false);
    setShouldSubmit(true); // trigger useEffect
    console.log(`Selected category: ${category}`);
  };

  //console.log(user);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-1 py-1 lg:py-2">
        {/* Desktop View */}
        <div
          className="hidden lg:flex items-center justify-between space-x-4"
          style={{ height: "38px" }}
        >
          {/* Logo */}
          <h1
            className="text-green-700 text-2xl font-bold cursor-pointer"
            onClick={() => {
              fetchProducts();  // fire but don't wait
              navigate("/");
            }}
          >
            Sampoornam Foods
          </h1>

          {/* Search Bar - Desktop Only */}

          {/* Categories Select - Fixed height to prevent layout shift */}

          {/* Action Buttons */}
          <div className="flex space-x-2" style={{ height: "38px" }}>
            <Button
              variant="outline"
              className="text-green-700 border-2 hover:border-green-400 transition-colors duration-200"
              onClick={goToCart}
            >
              <ShoppingCart className="mr-2" size={20} />
              Cart
            </Button>
            <Button
              variant="outline"
              className="text-green-700 border-2 hover:border-green-400 transition-colors duration-200" 
              onClick={goToHistory}
            >
              <History className="mr-2" size={20} />
              History
            </Button>
            {!user ? (
              <Button
                variant="outline"
                className="text-green-700 border-2 hover:border-green-400 transition-colors duration-200"
                onClick={handleLogin}
              >
                <User className="mr-2" size={20} />
                Login
              </Button>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="text-green-700 border-2 hover:border-green-400 transition-colors duration-200">
                    <User className="mr-2" size={20} />
                    Profile
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" side="bottom" align="end">
                  <div className="p-4 border-b border-gray-200">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-xs mt-1">
                      Status:{" "}
                      {user.isVerified ? (
                        <span className="text-green-600">Verified</span>
                      ) : (
                        <span className="text-yellow-600">Not Verified</span>
                      )}
                    </div>
                  </div>
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setIsLogoutDialogOpen(true)}
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Logout Confirmation Dialog */}
            <AlertDialog
              open={isLogoutDialogOpen}
              onOpenChange={setIsLogoutDialogOpen}
            >
              <AlertDialogContent className="bg-white"  aria-describedby={undefined}>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to Logout?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    You will need to login again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden">
          {/* First Row - Logo */}
          <div className="flex justify-between items-center ">
            <h1
              className="text-green-700 text-2xl font-bold cursor-pointer"
              onClick={() => {
                fetchProducts();  // fire but don't wait
                navigate("/");
              }}
            >
              {" "}
              <span> &nbsp;&nbsp; Sampoornam Foods</span>
            </h1>

            {/* Second Row - Search Bar & Menu Button */}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetTrigger asChild>
    <Button
      variant="outline"
      size="icon"
      className="text-green-700 ml-2"
    >
      <Menu size={24} />
    </Button>
  </SheetTrigger>

  <SheetContent side="right" className="w-[250px] overflow-y-auto bg-white">
    <SheetHeader>
      <SheetTitle className="text-green-700">Menu</SheetTitle>
    </SheetHeader>

    {/* Action Buttons */}
    <div className="space-y-2">
      <Button
        className="w-full text-green-700"
        variant="outline"
        onClick={() => {
          setIsOpen(false);
          goToCart();
        }}
      >
        <ShoppingCart className="mr-2" size={20} />
        Cart
      </Button>

      <Button
        className="w-full text-green-700"
        variant="outline"
        onClick={() => {
          setIsOpen(false);
          goToHistory();
        }}
      >
        <History className="mr-2" size={20} />
        History
      </Button>

      {!user ? (
        <Button
          variant="outline"
          className="w-full text-green-700"
          onClick={handleLogin}
        >
          <User className="mr-2" size={20} />
          Login
        </Button>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full text-green-700"
              >
                <User className="mr-2" size={20} />
                Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[70vw] max-w-[90vw] p-0 rounded-3xl bg-white min-h-[20vh]" aria-describedby={undefined} >
              <DialogHeader className="p-4 border-gray-200">
                <DialogTitle className="font-medium">{user.name}</DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  {user.email}
                </DialogDescription>
                <div className="text-xs mt-1">
                  Status:{" "}
                  {user.isVerified ? (
                    <span className="text-green-600">Verified</span>
                  ) : (
                    <span className="text-red-600">Not Verified</span>
                  )}
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Button
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            variant="outline"
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            <LogOut className="mr-2" size={20} />
            Logout
          </Button>
        </div>
      )}
    </div>
  </SheetContent>

  {/* AlertDialog rendered outside to prevent aria-hidden issues */}
  <AlertDialog
    open={isLogoutDialogOpen}
    onOpenChange={setIsLogoutDialogOpen}
  >
    <AlertDialogContent className="bg-white w-[85%] sm:w-[85%] md:w-[90%] lg:w-[60%] xl:w-[60%] rounded-3xl " aria-describedby={undefined}>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure you want to Logout?
        </AlertDialogTitle>
        <AlertDialogDescription>
          You will need to login again to access your account.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
        >
          Logout
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</Sheet>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;

export { Navbar2 };
