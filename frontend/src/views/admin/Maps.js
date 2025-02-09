import React from "react";

// components


import MapExample from "../../components/Admin/Maps/MapExample.js";

export default function Maps() {
  return (
    <>
      <div className="flex flex-wrap mt-24">
        <div className="w-full px-4 mt-32">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <MapExample />
          </div>
        </div>
      </div>
    </>
  );
}
