import React, { useContext } from "react";
import { AdminDataContext } from "../contexts/AdminContext";
import ProfileCard from "../components/ProfileCard";

const AdminProfile = () => {

  const { admin } =
    useContext(AdminDataContext);

  return (
    <ProfileCard
      name={`${admin.name.firstName} ${admin.name.lastName}`}
      email={admin.email}
      contactNumber={admin.contactNumber}
      role="Admin"
    />
  );
};

export default AdminProfile;