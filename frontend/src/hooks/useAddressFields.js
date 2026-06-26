import { useState, useEffect, useCallback } from "react";

export default function useAddressFields(provinceId, provinces) {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [customDistrict, setCustomDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [customWard, setCustomWard] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");

  // Compile permanent address automatically from components
  useEffect(() => {
    const parts = [];
    if (streetAddress) parts.push(streetAddress);

    const wardName = selectedWard === "OTHER" ? customWard : selectedWard;
    if (wardName) parts.push(wardName);

    const districtName = selectedDistrict === "OTHER" ? customDistrict : selectedDistrict;
    if (districtName) parts.push(districtName);

    const prov = provinces.find(p => p.id == provinceId);
    if (prov) parts.push(prov.name);

    setPermanentAddress(parts.join(", "));
  }, [selectedDistrict, customDistrict, selectedWard, customWard, streetAddress, provinceId, provinces]);

  const resetAddress = useCallback(() => {
    setSelectedDistrict("");
    setCustomDistrict("");
    setSelectedWard("");
    setCustomWard("");
    setStreetAddress("");
  }, []);

  return {
    selectedDistrict, setSelectedDistrict,
    customDistrict, setCustomDistrict,
    selectedWard, setSelectedWard,
    customWard, setCustomWard,
    streetAddress, setStreetAddress,
    permanentAddress, resetAddress,
  };
}
