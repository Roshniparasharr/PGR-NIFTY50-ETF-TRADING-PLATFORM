import React from "react";

// components
import Table from "../../components/Admin/Cards/CardTable.js";  // Updated to import Table instead of CardTable

export default function Tables() {
  return (
    <>
      <div className="flex flex-wrap mt-6">
        <div className="w-full mb-12 px-15">
          <Table color="dark" />  {/* Pass 'dark' as color prop */}
        </div>
      </div>
    </>
  );
}
