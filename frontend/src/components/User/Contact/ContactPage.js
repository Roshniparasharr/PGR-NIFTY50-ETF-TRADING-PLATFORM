import React from "react";
import { Link } from "react-router-dom";
import IndexNavbar from "../Navbars/IndexNavbar";
import Footer from "../Footers/Footer";
import StockP from "../../../assets/p-stock.jpg";

export default function ContactPage() {
  return (
    <>
      <IndexNavbar />

      {/* Contact Section */}
      <div className="bg-[#0e1628] min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-20">
        {/* Left - Content */}
        <div className="text-black md:w-1/2 px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6  text-blueGray-800">
            Get in Touch with StockSphere
          </h1>
          <p className="text-lg leading-relaxed opacity-80">
            Have questions or need support? Contact us today, and we’ll be happy to help! 
            Stay ahead in the stock market with our real-time updates and expert guidance.
          </p>
          <p className="text-lg leading-relaxed opacity-80 mt-4">
            Email us at: 
            <Link to="mailto:support@stocksphere.com" className="text-blueGray-500 font-semibold"> support@stocksphere.com </Link>
          </p>
          <p className="text-lg leading-relaxed opacity-80 mt-2">
            Call us at: <span className="text-blueGray-500 font-semibold">+1 (800) 123-4567</span>
          </p>
          <div className="flex gap-4 mt-6">
            
            
          </div>
        </div>

        {/* Right - Image */}
        <div className="md:w-1/2 px-6 mt-12 md:mt-0">
          <img
            src={StockP}
            alt="Stock Market"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
