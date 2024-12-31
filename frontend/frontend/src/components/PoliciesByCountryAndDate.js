import React, { useEffect, useState } from "react";
import { fetchPoliciesByCountryAndDate } from "../services/apiService";

const PoliciesByCountryAndDate = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchPoliciesByCountryAndDate();
      setData(result.results.bindings);
    };
    loadData();
  }, []);

  return (
    <div>
      <h1>Policies in Bolivia, Brazil, and Peru Since 2015</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {item.policyName.value} - {item.countryName.value} ({item.start_date.value})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PoliciesByCountryAndDate;
