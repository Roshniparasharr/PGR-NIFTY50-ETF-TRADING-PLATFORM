import React from "react";

// components

import Table from "../../components/Common/CardTable.js"; 

export default function Tables() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        {/* <div className="w-full mb-12 px-4">
          <Table />
        </div> */}
        <div className="w-full mb-12 px-4">
          <Table color="dark" />
        </div>
      </div>
    </>
  );
}
