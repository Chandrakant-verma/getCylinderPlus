import React, { useContext } from "react";
import { CaptainDataContext } from "../contexts/CaptainContext";
import ProfileCard from "../components/ProfileCard";

const CaptainProfile = () => {

  const { captain } =
    useContext(CaptainDataContext);

  return (
    <ProfileCard
      name={`${captain.name.firstName} ${captain.name.lastName}`}
      email={captain.email}
      address={captain.address}
      contactNumber={captain.contactNumber}
      branch={captain.branch?.branchName}
      role="Captain"
    />
  );
};

export default CaptainProfile;