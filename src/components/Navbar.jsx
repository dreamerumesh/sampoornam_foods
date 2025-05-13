import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useClickOutside from "../hooks/useClickOutside";
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
  X
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
import { Toaster, toast } from "react-hot-toast";

import { useProduct } from "../contexts/ProductContext";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { fetchProducts } = useProduct();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const [isCatOpen, setIsCatOpen] = useState(false);
  const [selCategory, setSelCategory] = useState("All categories");

  const dropdownRef = useClickOutside(() => setIsCatOpen(false));

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleSearchSubmit = (e, selectedCategory = category) => {
    console.log("handle search submit called");
    if (e && e.preventDefault) e.preventDefault();

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (selectedCategory === "All categories") {
      selectedCategory = "";  
    }
    fetchProducts({ search, category: selectedCategory });
    setIsSearchActive(false);
  };

  // const handleSearchSubmit = (e, selectedCategory = category) => {
  //   if (e && e.preventDefault) e.preventDefault();
  // console.log(search);

  //   const hasSearchText = search.trim() !== "";
  
  //   // Case: clear search (X icon clicked OR empty input submitted while isSearched is true)
  //   if (!hasSearchText && isSearched) {
  //     setSearch("");
  //     setIsSearched(false);
  //     fetchProducts({ category: selectedCategory });
  //     return;
  //   }
  
  //   // Case: user submits with text (new search or refine)
  //   if (hasSearchText) {
  //     setIsSearched(true);
  //     fetchProducts({ search, category: selectedCategory });
  //   }
  
  //   setIsSearchActive(false);
  // };
  
  
  

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
    setIsOpen(false);
    try{
      logout();
      toast.success("Logged out successfully");
      setTimeout(() => {
      navigate("/");
      }, 1500);
    }catch(err){
      console.log(err); 
    }
    //console.log("User logged out");
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
    //console.log(`Selected category: ${category}`);
  };

  //console.log(user);
  //console.log('isSearched', isSearched);
  const categories = [
    "All categories",
   "Sweets",
   "Namkeen",
   "Chips",
   "Breakfast Items",
   "Snacky Nuts",
  ];

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 b">
      <Toaster position="top-right" expand={true} richColors />
      <div className="container mx-auto px-1 py-2">
        {/* Desktop View */}
        <div
          className="hidden lg:flex items-center justify-between space-x-2"
          style={{ height: "38px" }}
        >
          {/* Logo */}
          <h1
            className="text-green-700 text-2xl sm:text-2xl md:text-lg lg:text-[22px] font-bold cursor-pointer"
            onClick={() => {
              fetchProducts();
              setSearch("")  // fire but don't wait
              navigate("/");
            }}
          >
            Sampoornam Foods
          </h1>

          {/* Search Bar - Desktop Only */}
          <>
  {/* Blur background */}
  {isSearchActive && (
    <div className="hidden lg:block fixed inset-0 backdrop-blur-sm bg-black/20 z-10"></div>
  )}

  {/* Search form */}
  <form
    onSubmit= {handleSearchSubmit}
    className="relative flex-grow max-w-lg z-20"
  >
    <Input
      type="text"
      name="search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onFocus={() => setIsSearchActive(true)}
      onBlur={() => setIsSearchActive(false)}
      placeholder="Search products..."
      className="w-full pr-10 pl-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
    />

    {/* Button icon toggles between search and close */}
    <button
      type="submit"
      onClick={() => handleSearchSubmit(null)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-700"
    >
      {isSearched ? <X size={20} /> : <Search size={20} />}
    </button>
  </form>
</>


          {/* Categories Select - Fixed height to prevent layout shift */}
          <div className="relative z-50 h-10" ref={dropdownRef}>
            {/* Dropdown trigger button */}
            <button
              className="inline-flex items-center justify-between w-48 h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-green-700"
              onClick={() => setIsCatOpen(!isCatOpen)}
            >
              <span className="text-[16px] text-green-700">{selCategory}</span>
              <ChevronDown
                size={16}
                className={`ml-2 transition-transform ${
                  isCatOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown content */}
            {isCatOpen && (
              <div className="absolute w-48 mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-auto">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSel(category)}
                  >
                    <span className="text-green-700">{category}</span>
                    {selCategory === category && (
                      <Check size={16} className="text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2" style={{ height: "38px" }}>
            <Button
              variant="outline"
              className="text-green-800 border-2 hover:border-green-400 transition-colors duration-200 "
              onClick={goToCart}
              disabled={user && user.isAdmin}
            >
              <ShoppingCart className="mr-2" size={20} />
              Cart
            </Button>
            <Button
              variant="outline"
              className="text-green-800 border-2 hover:border-green-400 transition-colors duration-200"
              onClick={goToHistory}
            >
              <History className="mr-2" size={20} />
              {/* {user ?'Orders':'History'} */}
              {user && user.isAdmin ? "Orders" : "History"}
            </Button>
            {!user ? (
              <Button
                variant="outline"
                className="text-green-800 border-2 hover:border-green-400 transition-colors duration-200"
                onClick={handleLogin}
              >
                <User className="mr-2" size={20} />
                Login
              </Button>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-green-800 border-2 hover:border-green-400 transition-colors duration-200"
                  >
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
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to logout?
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
          <div className="flex justify-between items-center mb-2">
            <h1
              className="text-green-700 text-2xl font-bold cursor-pointer"
              onClick={() => {
                fetchProducts();  // fire but don't wait
                setSearch("")
                navigate("/");
              }}
            >
              {" "}
              <span> &nbsp;&nbsp; Sampoornam Foods</span>
            </h1>
          </div>

          {/* Second Row - Search Bar & Menu Button */}

          <div className="flex justify-between items-center">
            <div className="relative flex-grow">
              <>
              {isSearchActive && (
    <div className="inset-0 backdrop-blur-sm bg-black/20 z-20"></div>
  )}
              <form onSubmit={isSearched ? undefined : handleSearchSubmit} 
              className="relative pl-3 ">
                <Input
                  type="text"
                  name="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus = {() => setIsSearchActive(true)}
                  onBlur = {() => setIsSearchActive(false)}
                  placeholder="Search products..."
                  className="pr-10 w-full border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-700"
                >
                  {isSearched ? <X size={20} /> : <Search size={20} />}
                </button>
              </form>
              </>
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className=" border-green-200 text-green-700 ml-2"
                  onClick={() => setIsOpen(true)}
                >
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              {/* Mobile Menu - No blur outside sheet */}
              <SheetContent
                side="right"
                className="w-[250px] overflow-y-auto bg-white"
              >
                <SheetHeader>
                  <SheetTitle className="text-green-700">Menu</SheetTitle>
                </SheetHeader>

                {/* Mobile Categories */}
                <div className="mb-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-green-700"
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  >
                    Categories
                    {isCategoriesOpen ? (
                      <ChevronDown className="ml-2" size={20} />
                    ) : (
                      <ChevronRight className="ml-2" size={20} />
                    )}
                  </Button>

                  {isCategoriesOpen && (
                    <div className="mt-2 space-y-2">
                      {categories.map((cat) => (
                        <Button
                          key={cat}
                          variant="ghost"
                          className="w-full justify-start text-green-700"
                          onClick={() => {
                            setCategory(cat);
                            handleSearchSubmit(null, cat);
                            setIsOpen(false); // Close sheet after selection
                          }}
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

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
                    {user && user.isAdmin ? "Orders" : "History"}
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
                    <div className="flex flex-col gap-2">
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
                        <DialogContent className="w-[70vw] max-w-[90vw] min-h-[20vh] p-0 rounded-2xl bg-white">
                          <DialogHeader className="p-4">
                            <DialogTitle className="font-large">
                              {user.name}
                            </DialogTitle>
                            <DialogDescription className="text-md text-gray-500">
                              {user.email}
                            </DialogDescription>
                            <div className="text-sm mt-1">
                              Status:{" "}
                              {user.isVerified ? (
                                <span className="text-green-600">Verified</span>
                              ) : (
                                <span className="text-yellow-600">
                                  Not Verified
                                </span>
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

                      {/* Logout Confirmation Dialog */}
                      <AlertDialog
                        open={isLogoutDialogOpen}
                        onOpenChange={setIsLogoutDialogOpen}
                      >
                        <AlertDialogContent className="bg-white w-[80vw] max-w-[90vw] min-h-[20vh] rounded-xl p-4">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to logout?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              You will need to login again to access your
                              account.
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
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

export { Navbar };
