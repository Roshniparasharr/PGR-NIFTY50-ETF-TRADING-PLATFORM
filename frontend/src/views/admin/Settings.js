import React from "react";

// components

import CardSettings from "../../components/Admin/Cards/CardSettings.js";
import CardProfile from "../../components/Admin/Cards/CardProfile.js";

export default function Settings() {
  return (
    <>
      <div className="flex flex-wrap mt-24">
        <div className="w-full lg:w-8/12 px-4 mt-32">
          <CardSettings />
        </div>
        <div className="w-full lg:w-4/12 px-4 mt-16">
          <CardProfile />
        </div>
      </div>
    </>
  );
}
