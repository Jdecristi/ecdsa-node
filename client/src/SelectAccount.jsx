import { useEffect, useState } from "react";
import server from "./server";
import { useECDSA } from "./context";

const SelectAccount = ({ value, exclude, setValue }) => {
  const { accounts } = useECDSA();

  const selectAbleAccount = exclude
    ? accounts[0].filter(({ address }) => address !== exclude)
    : accounts[0];

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <select
      className="select"
      value={value || "Select address here"}
      onChange={handleChange}
    >
      <option value="Select address here" disabled>
        Select address here
      </option>
      {selectAbleAccount.map(({ address }) => (
        <option key={address} value={address}>
          {address}
        </option>
      ))}
    </select>
  );
};

export { SelectAccount };
