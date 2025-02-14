import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronRight, Edit, Trash2, PlusCircle, Filter, Check, X } from "lucide-react";
import ConfirmationModal from "../Modals/ConformationModal";

const OrganizationList = ({ onRegisterClick }) => {
  const [organizations, setOrganizations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [refresh, setRefresh] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);

  useEffect(() => {
    fetchOrganizations();
  }, [refresh]);

  const fetchOrganizations = async () => {
    try {
      const [orgsResponse, orgRegisterResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/organizations"),
        axios.get("http://localhost:5000/api/orgRegister"),
      ]);

      const organizationsData = orgsResponse.data.map((org) => ({ ...org, collection: "organizations" }));
      const orgRegisterData = orgRegisterResponse.data.map((org) => ({ ...org, collection: "orgRegister" }));

      const combinedData = [...organizationsData, ...orgRegisterData];
      setOrganizations(combinedData);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const handleDelete = async (id, collection) => {
    if (!window.confirm("Are you sure you want to disable this organization?")) return;
    try {
      if (collection === "organizations") {
        await axios.put(`http://localhost:5000/api/organizations/${id}`, { status: false });
      } else if (collection === "orgRegister") {
        await axios.delete(`http://localhost:5000/api/orgRegister/${id}`);
      }
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error disabling organization:", error);
    }
  };

  const handleApproval = async (id, status, collection) => {
    try {
      const endpoint = collection === "organizations"
        ? `http://localhost:5000/api/organizations/${id}/approval`
        : `http://localhost:5000/api/orgRegister/${id}/approve`;

      await axios.patch(endpoint, { status });
      setRefresh((prev) => !prev);
      setDropdownOpen(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error(`Error ${status} organization:`, error);
    }
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleActionClick = (org, action) => {
    setSelectedOrg(org);
    setPendingAction(action);
    setIsModalOpen(true);
  };

  const getStatusColor = (approvalStatus) => {
    switch (approvalStatus) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredOrganizations = organizations.filter((org) => {
    if (filter === "all") return true;
    return org.approvalStatus === filter;
  });

  return (
    <div className="mx-2 overflow-hidden mt-8">
      <div className="mt-24 rounded bg-gray-100 shadow-md px-6 py-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Filter className="mr-2 text-gray-600" size={20} />
          Manage Organizations
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={() => onRegisterClick(null)}
            className="flex items-center bg-lightBlue-600 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            <PlusCircle className="mr-2" size={16} />
            Register New
          </button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
          >
            <option value="all">All Organizations</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white h-[28rem] shadow-md rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Name", "Contact", "Email", "Mobile", "Join Date", "Status", "Actions"].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrganizations.map((org) => (
              <React.Fragment key={org._id}>
                <tr
                  onClick={() => toggleRow(org._id)}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                    expandedRow === org._id ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 flex items-center">
                    {expandedRow === org._id ? (
                      <ChevronDown className="mr-2 text-gray-500" size={16} />
                    ) : (
                      <ChevronRight className="mr-2 text-gray-500" size={16} />
                    )}
                    {org.name}
                  </td>
                  <td className="px-6 py-4">{org.contactPerson}</td>
                  <td className="px-6 py-4">{org.email}</td>
                  <td className="px-6 py-4">{org.mobile}</td>
                  <td className="px-6 py-4">{new Date(org.createDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(org.approvalStatus)}`}>
                      {org.approvalStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex space-x-4 relative">
                    {/* Edit Icon with Tooltip */}
                    <div className="relative group">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRegisterClick(org);
                        }}
                        className="text-yellow-500 hover:text-yellow-600 transition-colors"
                      >
                        <Edit size={24} />
                      </button>
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Edit
                      </span>
                    </div>

                    {/* Delete Icon with Tooltip */}
                    <div className="relative group">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(org._id, org.collection || "organizations");
                        }}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={24} />
                      </button>
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Delete
                      </span>
                    </div>

                    {/* More Actions Icon with Tooltip and Dropdown */}
                    <div className="relative group">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDropdownOpen(dropdownOpen === org._id ? null : org._id);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <ChevronDown size={20} />
                      </button>
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        More Actions
                      </span>
                      {dropdownOpen === org._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionClick(org, "approved");
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white cursor-pointer"
                          >
                            <Check className="mr-2" size={16} />
                            Approve
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionClick(org, "rejected");
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white cursor-pointer"
                          >
                            <X className="mr-2" size={16} />
                            Reject
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedRow === org._id && (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-md shadow-sm">
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">Address</p>
                          <p className="text-sm text-gray-800">{org.address}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">Website</p>
                          <p className="text-sm text-gray-800">{org.website}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">Created By</p>
                          <p className="text-sm text-gray-800">{org.createdBy}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">Last Updated</p>
                          <p className="text-sm text-gray-800">
                            {new Date(org.updateDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleApproval(selectedOrg._id, pendingAction, selectedOrg.collection)}
        message={`Are you sure you want to ${pendingAction} this organization?`}
      />
    </div>
  );
};

export default OrganizationList;