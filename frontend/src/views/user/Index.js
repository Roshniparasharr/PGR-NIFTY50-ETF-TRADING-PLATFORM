import React, { useEffect, useState } from "react";
import IndexNavbar from "../../components/User/Navbars/IndexNavbar.js";
import Footer from "../../components/User/Footers/Footer.js";
import Table from "../../components/User/Cards/CardTable.js"; // Import is correct

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by verifying token in localStorage
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Convert token existence to boolean
  }, []);

  return (
    <>
      <IndexNavbar fixed />
      <section className="header relative pt-16 flex h-screen max-h-screen overflow-auto">
        <div className="container mx-auto items-center flex flex-wrap">
          <div className="w-full px-4">
            <div className="pt-32 sm:pt-0 text-center">
              <h2 className="font-semibold text-4xl text-blueGray-600">
                Nifty Market Updates
              </h2>
              {/* Show the Table only if the user is logged in */}
              {isAuthenticated ? (
                <div className="mt-8">
                  <Table color="light" />
                </div>
              ) : (
                <p className="text-red-500 text-lg mt-4">
                  Please log in to view Nifty Data.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
     
    </>
  );
}
