import React from "react";
import IndexNavbar from "../Navbars/IndexNavbar";
import Footer from "../Footers/Footer";
import Stock from "../../../assets/stock.jpg"; // Ensure this path is correct

const AboutHero = () => {
  return (
    <>
      <IndexNavbar />

      {/* About Us Section */}
      <div className="bg-[#0e1628] min-h-screen grid items-center justify-center px-6 py-20">
        <div >
          
          {/* Left - Content */}
          <div className="text-black">
            <h1 className="text-4xl font-bold mb-6">About Us</h1>
            <p className="text-lg leading-relaxed opacity-80">
              This project was created to empower individuals to make informed investment
              decisions and navigate the complexities of the stock market with confidence.
            </p>
            <p className="text-lg leading-relaxed opacity-80 mt-4">
              The mission is to democratize access to financial information and provide tools and
              resources that enable investors of all levels to succeed in their financial goals.
            </p>
            <p className="text-lg leading-relaxed opacity-80 mt-4">
              This project offers Comprehensive Market Analysis, Educational Resources, 
              Powerful Tools, and Community Support.
            </p>
          </div>

          {/* Right - Image */}
          

        </div>
      </div>

      <Footer />
    </>
  );
};

export default AboutHero;