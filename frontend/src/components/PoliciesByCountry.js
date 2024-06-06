import React, { useEffect, useState } from "react";
import { fetchPolicies } from "../services/apiService";

const PoliciesByCountry = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchPolicies();
      setData(result.results.bindings);
    };
    loadData();
  }, []);

  return (
    <div>
      <h1>Policies by Country</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {item.policyName.value} - {item.countryName.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PoliciesByCountry;
