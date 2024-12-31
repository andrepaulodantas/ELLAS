import React, { useEffect, useState } from "react";
import { fetchPolicyResults } from "../services/apiService";

const PolicyResults = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchPolicyResults();
      setData(result.results.bindings);
    };
    loadData();
  }, []);

  return (
    <div>
      <h1>Policy Results</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {item.policyName.value} - {item.policyResults.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PolicyResults;
