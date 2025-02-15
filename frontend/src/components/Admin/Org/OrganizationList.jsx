import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  PlusCircle,
  Filter,
  MoreVertical,
  Check,
  X,
} from "lucide-react";
import ConfirmationModal from "../Modals/ConformationModal";
import OrganizationRegistrationForm from "./OrganizationRegistrationForm";
import StudentListModal from "../Modals/OrgStudentList";

const OrganizationList = () => {
  const [organizations, setOrganizations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [refresh, setRefresh] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Fetch organizations on component mount or refresh
  useEffect(() => {
    fetchOrganizations();
  }, [refresh]);

  // Fetch organizations from the API
  const fetchOrganizations = async () => {
    try {
      const [orgsResponse, orgRegisterResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/organizations"),
        axios.get("http://localhost:5000/api/orgRegister"),
      ]);

      const organizationsData = orgsResponse.data.map((org) => ({
        ...org,
        collection: "organizations",
      }));
      const orgRegisterData = orgRegisterResponse.data.map((org) => ({
        ...org,
        collection: "orgRegister",
      }));

      const combinedData = [...organizationsData, ...orgRegisterData];
      setOrganizations(combinedData);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const handleOrgNameClick = async (org, e) => {
    e.stopPropagation(); // Stop event propagation to prevent row expansion
    console.log("Selected Organization:", org); // Debugging log
    setSelectedOrg(org);
    await fetchStudentsByOrgName("MITS"); // Hardcode the correct orgName for testing
  };
  
  const fetchStudentsByOrgName = async (orgName) => {
    setLoadingStudents(true);
    try {
      console.log("Fetching students for org:", orgName); // Debugging log
      const response = await axios.get(
        `http://localhost:5000/students/by-org/${encodeURIComponent(orgName)}`
      );
      console.log("Students fetched:", response.data); // Debugging log
      setStudents(response.data);
      setIsStudentModalOpen(true); // Open the modal
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Handle student modal close
  const handleCloseStudentModal = () => {
    setIsStudentModalOpen(false);
    setSelectedOrg(null);
    setStudents([]); // Clear students data
  };

  // Handle organization deletion
  const handleDelete = async (id, collection) => {
    try {
      if (collection === "organizations") {
        await axios.put(`http://localhost:5000/api/organizations/${id}`, {
          status: false,
        });
      } else if (collection === "orgRegister") {
        await axios.delete(`http://localhost:5000/api/orgRegister/${id}`);
      }
      setRefresh((prev) => !prev);
      setIsDeleteModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error disabling organization:", error);
    }
  };

  // Handle organization approval/rejection
  const handleApproval = async (id, status, collection) => {
    try {
      const endpoint =
        collection === "organizations"
          ? `http://localhost:5000/api/organizations/${id}/approval`
          : `http://localhost:5000/api/orgRegister/${id}/approve`;

      await axios.patch(endpoint, { status });
      setRefresh((prev) => !prev);
      setDropdownOpen(null);
      setIsActionModalOpen(false);
    } catch (error) {
      console.error(`Error ${status} organization:`, error);
    }
  };

  // Toggle row expansion
  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Handle action button click (approve/reject)
  const handleActionClick = (org, action) => {
    setSelectedOrg(org);
    setPendingAction(action);
    setIsActionModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (org) => {
    setSelectedOrg(org);
    setIsDeleteModalOpen(true);
  };

  // Handle register/edit button click
  const handleRegisterClick = (org) => {
    setSelectedOrg(org || null);
    setIsFormOpen(true);
  };

  // Handle form modal close
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedOrg(null);
  };

  // Get status color based on approval status
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

  // Filter organizations based on selected filter
  const filteredOrganizations = organizations.filter((org) => {
    if (filter === "all") return true;
    return org.approvalStatus === filter;
  });

  return (
    <div className="mx-2 overflow-hidden mt-8">
      {/* Header Section */}
      <div className="mt-24 rounded bg-gray-100 shadow-md px-6 py-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Filter className="mr-2 text-gray-600" size={20} />
          Manage Organizations
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={() => handleRegisterClick(null)}
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

      {/* Table Section */}
      <div className="bg-white h-[28rem] shadow-md rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Name", "Contact", "Email", "Mobile", "Join Date", "Status", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
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
                    <span
                      onClick={(e) => handleOrgNameClick(org, e)}
                      className="hover:underline cursor-pointer"
                    >
                      {org.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">{org.contactPerson}</td>
                  <td className="px-6 py-4">{org.email}</td>
                  <td className="px-6 py-4">{org.mobile}</td>
                  <td className="px-6 py-4">
                    {new Date(org.createDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        org.approvalStatus
                      )}`}
                    >
                      {org.approvalStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex space-x-4 relative">
                    {/* Edit Icon */}
                    <div className="relative group">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegisterClick(org);
                        }}
                        className="text-yellow-500 hover:text-yellow-600 transition-colors"
                      >
                        <Edit size={24} />
                      </button>
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Edit
                      </span>
                    </div>

                    {/* Delete Icon */}
                    <div className="relative group">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(org);
                        }}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={24} />
                      </button>
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Delete
                      </span>
                    </div>

                    {/* More Actions Icon */}
                    <div className="relative group">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDropdownOpen(dropdownOpen === org._id ? null : org._id);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <MoreVertical size={20} />
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

      {/* Student List Modal */}
      <StudentListModal
        isOpen={isStudentModalOpen}
        onClose={handleCloseStudentModal}
        students={students}
        loading={loadingStudents}
      />

      {/* Action Confirmation Modal */}
      <ConfirmationModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onConfirm={() =>
          handleApproval(selectedOrg._id, pendingAction, selectedOrg.collection)
        }
        title={`Confirm ${pendingAction === "approved" ? "Approval" : "Rejection"}`}
        message={`Are you sure you want to ${pendingAction} this organization?`}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDelete(selectedOrg._id, selectedOrg.collection)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this organization?"
      />

      {/* Success Confirmation Modal */}
      <ConfirmationModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onConfirm={() => setIsSuccessModalOpen(false)}
        title="Success"
        message="Organization deleted successfully!"
      />

      {/* Registration/Edit Form Modal */}
      <OrganizationRegistrationForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        selectedOrg={selectedOrg}
      />
    </div>
  );
};

export default OrganizationList;