import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom"; // Import useHistory

export default function Register() {
  const history = useHistory(); // Initialize useHistory
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Registration successful! Redirecting to login...");
        setTimeout(() => history.push("/login"), 2000); // Redirect using useHistory
      } else {
        setMessage(data.message || "❌ Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-6/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-6 py-6">
              <div className="text-center mb-3">
                <h6 className="text-blueGray-500 text-sm font-bold">Sign up</h6>
              </div>
              <hr className="mt-6 border-b-1 border-blueGray-300" />
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              {message && <p className="text-center text-green-600">{message}</p>}
              
              <form onSubmit={handleSubmit}>
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                    placeholder="Name"
                    required
                  />
                </div>
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 bg-white rounded text-sm shadow w-full"
                    placeholder="Password"
                    required
                  />
                </div>

                <div className="text-center mt-6">
                  <button
                    type="submit"
                    className="bg-blueGray-800 text-white text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg w-full"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Already have an account? (Left side) */}
          <div className="flex flex-wrap mt-6 relative">
            <div className="w-1/2">
              <Link to="/auth/login" className="text-blueGray-200">
                <small>Already have an account? Log in</small>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
