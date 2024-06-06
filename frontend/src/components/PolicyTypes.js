import React, { useEffect, useState } from "react";
import { fetchPolicyTypes } from "../services/apiService";

const PolicyTypes = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchPolicyTypes();
      setData(result.results.bindings);
    };
    loadData();
  }, []);

  return (
    <div>
      <h1>Policy Types</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.policyType.value}</li>
        ))}
      </ul>
    </div>
  );
};

export default PolicyTypes;
