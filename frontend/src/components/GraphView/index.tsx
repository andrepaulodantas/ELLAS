import React, { useEffect, useState, useRef } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";

interface Node {
  id: string;
  label: string;
}

interface Edge {
  from: string;
  to: string;
}

interface TableRow {
  label: string;
  centralNodeId: string;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

interface GraphViewProps {
  data: any;
  centralNodeId: string;
}

const GraphView: React.FC<GraphViewProps> = ({ data, centralNodeId }) => {
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    edges: [],
  });
  const [tableRows, setTableRows] = useState<TableRow[]>([]);
  const networkContainer = useRef<HTMLDivElement>(null);
  const network = useRef<Network | null>(null);

  useEffect(() => {
    if (!data || !data.results || !data.results.bindings) return;

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const rows: TableRow[] = [];

    data.results.bindings.forEach((binding: any, index: number) => {
      const labelKey = Object.keys(binding).find((key) =>
        key.includes("Results")
      );

      if (labelKey) {
        const label = binding[labelKey]?.value || `Node${index}`;

        if (!nodes.find((node) => node.id === label)) {
          nodes.push({ id: label, label });
        }

        if (!nodes.find((node) => node.id === centralNodeId)) {
          nodes.push({ id: centralNodeId, label: centralNodeId });
        }

        edges.push({ from: label, to: centralNodeId });
        rows.push({ label, centralNodeId });
      }
    });

    setGraphData({ nodes, edges });
    setTableRows(rows);
  }, [data, centralNodeId]);

  useEffect(() => {
    if (networkContainer.current && graphData.nodes.length > 0) {
      const nodes = new DataSet(graphData.nodes);

      const options = {
        nodes: {
          shape: "dot",
          size: 16,
          font: {
            size: 12,
            color: "#333",
          },
          borderWidth: 2,
          color: {
            background: "#97C2FC",
            border: "#2B7CE9",
            highlight: {
              background: "#D2E5FF",
              border: "#2B7CE9",
            },
          },
        },
        edges: {
          width: 2,
          color: {
            color: "#848484",
            highlight: "#848484",
            hover: "#848484",
          },
          smooth: {
            enabled: true,
            type: "continuous",
            roundness: 0.5,
          },
        },
        physics: {
          stabilization: false,
          barnesHut: {
            gravitationalConstant: -80000,
            springConstant: 0.001,
            springLength: 200,
          },
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
        },
      };

      network.current = new Network(
        networkContainer.current,
        { nodes },
        options
      );
    }

    return () => {
      if (network.current) {
        network.current.destroy();
        network.current = null;
      }
    };
  }, [graphData]);

  return (
    <div className="flex flex-col gap-6">
      <div
        ref={networkContainer}
        className="w-full h-[500px] border border-gray-200 rounded-lg"
      ></div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Node
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Connected To
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableRows.map((row, index) => (
              <tr
                key={`${row.label}-${index}`}
                className={index % 2 === 0 ? "even-row" : "odd-row"}
              >
                <td className="px-6 py-4 whitespace-nowrap">{row.label}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {row.centralNodeId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GraphView;
