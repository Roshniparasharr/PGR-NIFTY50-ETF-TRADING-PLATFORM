import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronRight, Edit, Trash2, PlusCircle, Filter } from "lucide-react";
import CardStats from "../../components/Admin/Cards/CardStats";

const QueriesPage = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [refresh, setRefresh] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, [refresh]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };


  const [orgCount, setOrgCount] = useState(0);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchContacts();
    fetchOrgCount();
    fetchUsers();
  }, [refresh]);

  const fetchOrgCount = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/organizations");
      setOrgCount(response.data.length);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "disabled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    return user.status === filter;
  });

  const userCount = contacts.length;

  return (
    <div className="mt-12 overflow-hidden">
            <div className="bg-lightBlue-600 md:pt-32 pb-32 pt-12">
              <div className="px-4 mx-auto w-full">
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-4">
                    <CardStats
                      statSubtitle="REGISTERED USERS"
                      statTitle={userCount.toString()}
                      statArrow="up"
                      statPercent="100"
                      statPercentColor="text-emerald-500"
                      statDescription="Total users registered"
                      statIconName="fas fa-users"
                      statIconColor="bg-pink-500"
                    />
                  </div>
                  <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-4">
                    <CardStats
                      statSubtitle="REGISTERED ORGANIZATIONS"
                      statTitle={orgCount.toString()}
                      statArrow="up"
                      statPercent="100"
                      statPercentColor="text-emerald-500"
                      statDescription="Total organizations registered"
                      statIconName="fas fa-building"
                      statIconColor="bg-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 mx-4 -mt-48">
            <div className="mt-24 rounded bg-gray-100 shadow-md px-6 py-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Filter className="mr-2 text-gray-600" size={20} />
          Manage Queries
        </h2>
      </div>
      
      <div className="bg-white h-[30rem] shadow-md rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Name', 'Email', 'Mobile', 'Type', 'Description', 'Join Date', 'Actions'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contacts.map((contact) => (
              <React.Fragment key={contact._id}>
                <tr 
                  onClick={() => toggleRow(contact._id)}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                    expandedRow === contact._id ? 'bg-gray-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 flex items-center">
                    {expandedRow === contact._id ? (
                      <ChevronDown className="mr-2 text-gray-500" size={16} />
                    ) : (
                      <ChevronRight className="mr-2 text-gray-500" size={16} />
                    )}
                    {contact.name}
                  </td>
                  <td className="px-6 py-4">{contact.email}</td>
                  <td className="px-6 py-4">{contact.mobile}</td>
                  <td className="px-6 py-4">{contact.type}</td>
                  <td className="px-6 py-4">{contact.desc}</td>
                  <td className="px-6 py-4">
                    {new Date(contact.createDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(contact._id);
                      }}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
                {expandedRow === contact._id && (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-md shadow-sm">
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">Created Date</p>
                          <p className="text-sm text-gray-800">{new Date(contact.createDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">Last Updated</p>
                          <p className="text-sm text-gray-800">
                            {new Date(contact.updateDate).toLocaleDateString()}
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
            </div>

    </div>
  );
};

export default QueriesPage;