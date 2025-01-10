import React from "react";

// Define o tipo de dado para as linhas da tabela
type DataTableProps = {
  data: any[];
  dynamicFields: string[];
  exportTableDataToCSV: (data: any[], fields: string[]) => void;
};

const DataTable: React.FC<DataTableProps> = ({
  data,
  dynamicFields,
  exportTableDataToCSV,
}) => {
  return (
    <div className="mt-8 p-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-center mb-4 text-lg font-bold">Data Table</h2>
        <button
          className="w-[38px] h-[38px] flex items-center justify-center cursor-pointer rounded-[0px] bg-gray-700 text-white"
          onClick={() => exportTableDataToCSV(data, dynamicFields)}
        >
          <img
            src="images/img_botao_icone_30px_1.svg"
            alt="Download CSV"
            loading="lazy"
            className="w-full h-full"
          />
        </button>
      </div>
      <div className="table-container overflow-y-auto max-h-[500px] border border-gray-300 rounded-md">
        <table className="w-full bg-white border-collapse table-fixed">
          <thead className="bg-pink-100 sticky top-0 z-10">
            <tr>
              <th className="w-[10%] text-left p-3">Country</th>
              <th className="w-[32%] text-left p-3">Name</th>
              {dynamicFields.map((field) => (
                <th key={field} className="w-[8%] text-left p-3">
                  {field
                    .replace(/_/g, " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-purple-100" : "bg-white"
                } border-b border-gray-300`}
              >
                <td className="p-3 break-words overflow-hidden whitespace-pre-wrap text-left">
                  {item.country}
                </td>
                <td className="p-3 break-words overflow-hidden whitespace-pre-wrap text-left">
                  {item.name}
                </td>
                {dynamicFields.map((field) => (
                  <td
                    key={field}
                    className="p-3 break-words overflow-hidden whitespace-pre-wrap text-left"
                  >
                    {item[field] || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
