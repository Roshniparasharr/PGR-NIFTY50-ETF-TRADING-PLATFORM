import React from "react";
import { Link } from "react-router-dom";
import IndexNavbar from "../Navbars/IndexNavbar";
import Footer from "../Footers/Footer";

export default function ContactPage() {
  return (
    <>
     <IndexNavbar />
      <section className="relative pt-32 lg:pt-16 flex h-auto overflow-auto">
        <div className="container mx-auto flex flex-wrap items-center justify-between px-6">
          {/* Left Section: Text */}
          <div className="w-full md:w-1/2 text-left">
            <h1 className="text-3xl md:text-5xl font-bold text-black mb-4">
              Get in Touch with StockSphere
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Have questions or need support? Contact us today and we’ll be happy to help! 
              Stay ahead in the stock market with our real-time updates and expert guidance.
            </p>
            <p className="text-lg md:text-xl text-gray-700 mb-4">
              Email us at: 
              <Link to="mailto:support@stocksphere.com" className="text-blue-500"> support@stocksphere.com </Link>
            </p>
            <p className="text-lg md:text-xl text-gray-700 mb-4">
              Call us at: <span className="text-blue-500">+1 (800) 123-4567</span>
            </p>
            <div className="flex gap-4">
              <Link to="/learn">
                <button className="bg-gray-300 text-black px-6 py-3 font-bold rounded-md text-sm md:text-lg">
                  LEARN MORE
                </button>
              </Link>
              <Link to="/contact">
                <button className="bg-blue-600 text-white px-6 py-3 font-bold rounded-md text-sm md:text-lg">
                  CONTACT US
                </button>
              </Link>
            </div>
          </div>

          {/* Right Section: Image */}
          <div className="w-full md:w-1/2 mt-12 md:mt-0">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCF1RGFSZVgHxCRTjizHzDzpqDNny80uff-A&s" // Replace with relevant stock market image
              alt="Stock Market"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}