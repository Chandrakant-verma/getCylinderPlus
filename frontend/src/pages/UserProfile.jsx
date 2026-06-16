import React, { useContext } from "react";
import { UserDataContext } from "../contexts/UserContxt";
import ProfileCard from "../components/ProfileCard";

const UserProfile = () => {

  const { user } =
    useContext(UserDataContext);

  return (
    <ProfileCard
      name={`${user.name.firstName} ${user.name.lastName}`}
      email={user.email}
      address={user.address}
      contactNumber={user.contactNumber}
      branch={user.branch?.branchName}
      role="User"
    />
  );
};

export default UserProfile;