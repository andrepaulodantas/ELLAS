import React, { useEffect, useRef, useState } from "react";
import {
  DataSet,
  Network,
  Edge,
  Node,
  Data,
  Options,
} from "vis-network/standalone/esm/vis-network";
import {
  fetchInitiativesByCountry as fetchInitiatives,
  fetchPoliciesAppliedInCountries as fetchPolicies,
} from "../../services/apiService";
import { useLocation, Link } from "react-router-dom";
import { Text, Img, Heading } from "..";
import "./GraphView.css";
import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text as PdfText,
  StyleSheet,
} from "@react-pdf/renderer";

interface GraphNode extends Node {
  id: string;
  label: string;
}

interface GraphEdge extends Edge {
  id: string;
  from: string;
  to: string;
}

interface TableRow {
  label: string;
  centralNodeId: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphEdge[];
}

interface Binding {
  [key: string]: {
    value: string;
  };
}

interface ApiResponse {
  results: {
    bindings: Binding[];
  };
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    flex: 1,
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
});

interface PDFGeneratorProps {
  tableData: TableRow[];
  queryType: string;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({
  tableData,
  queryType,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <PdfText style={styles.title}>Relatório do GraphView</PdfText>
        <PdfText style={styles.subtitle}>Consulta: {queryType}</PdfText>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <PdfText style={styles.tableCell}>Node</PdfText>
            </View>
            <View style={styles.tableCol}>
              <PdfText style={styles.tableCell}>Central Node</PdfText>
            </View>
          </View>
          {tableData.map((row, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <PdfText style={styles.tableCell}>{row.label}</PdfText>
              </View>
              <View style={styles.tableCol}>
                <PdfText style={styles.tableCell}>{row.centralNodeId}</PdfText>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

interface GraphViewProps {
  queryType: string;
}

const GraphView: React.FC<GraphViewProps> = ({ queryType }) => {
  const networkContainer = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const location = useLocation();

  useEffect(() => {
    const pathToFunctionMap = {
      policies: fetchPolicies,
      initiatives: fetchInitiatives,
    };

    const loadGraphData = async (fetchFunction: () => Promise<ApiResponse>) => {
      try {
        const data = await fetchFunction();
        console.log(`Data fetched for queryType: ${queryType}`, data);
        if (data?.results?.bindings) {
          const nodes: GraphNode[] = [];
          const links: GraphEdge[] = [];
          const tableRows: TableRow[] = [];
          const centralNodeId =
            queryType === "initiatives" ? "Brazil" : "Policy";

          data.results.bindings.forEach((binding, index) => {
            const labelKey = Object.keys(binding).find(
              (key) =>
                key.includes("Name") ||
                key.includes("Type") ||
                key.includes("Results")
            );

            if (!labelKey) return;

            const label = binding[labelKey]?.value || `Node${index}`;

            if (!nodes.find((node) => node.id === label)) {
              nodes.push({ id: label, label });
            }

            if (!nodes.find((node) => node.id === centralNodeId)) {
              nodes.push({ id: centralNodeId, label: centralNodeId });
            }

            links.push({
              id: `edge_${index}`,
              from: label,
              to: centralNodeId,
            });

            tableRows.push({ label, centralNodeId });
          });

          setGraphData({ nodes, links });
          setTableData(tableRows);
        } else {
          console.error("Invalid data format:", data);
          setGraphData({ nodes: [], links: [] });
          setTableData([]);
        }
      } catch (error) {
        console.error("Error loading graph data:", error);
        setGraphData({ nodes: [], links: [] });
        setTableData([]);
      }
    };

    const fetchFunction = pathToFunctionMap[queryType] || fetchInitiatives;
    loadGraphData(fetchFunction);
  }, [location.pathname, queryType]);

  useEffect(() => {
    if (!networkContainer.current || graphData.nodes.length === 0) return;

    const nodes = new DataSet<GraphNode>(
      graphData.nodes.map((node) => ({
        id: node.id,
        label: node.label,
      }))
    );

    const edges = new DataSet<GraphEdge>(
      graphData.links.map((edge) => ({
        id: edge.id,
        from: edge.from,
        to: edge.to,
      }))
    );

    const networkData: Data = {
      nodes: nodes as any,
      edges: edges as any,
    };

    const options: Options = {
      nodes: {
        shape: "dot",
        size: 15,
        color: {
          background: "lightgreen",
          border: "blue",
        },
        font: {
          size: 12,
          color: "#000000",
          face: "Arial",
          bold: {
            color: "#000000",
          },
        },
        borderWidth: 2,
        scaling: {
          label: {
            enabled: true,
            min: 10,
            max: 14,
            drawThreshold: 5,
            maxVisible: 20,
          },
        },
      },
      edges: {
        color: "lightblue",
        width: 2,
      },
      interaction: {
        zoomView: true,
        dragView: true,
        dragNodes: true,
      },
      physics: {
        enabled: true,
        stabilization: {
          iterations: 50,
        },
        barnesHut: {
          gravitationalConstant: -8000,
          centralGravity: 0.1,
          springLength: 200,
          springConstant: 0.04,
        },
      },
      layout: {
        hierarchical: false,
        improvedLayout: false,
        randomSeed: 1,
      },
    };

    const network = new Network(networkContainer.current, networkData, options);

    network.once("stabilized", function () {
      network.focus(queryType === "initiatives" ? "Brazil" : "Policy", {
        scale: 1,
        offset: { x: 0, y: 0 },
        animation: true,
      });
    });

    network.on("click", function (params) {
      console.log("Clicked node:", params);
    });
  }, [graphData, queryType]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <header className="w-full p-3 bg-white-A700 shadow-xs fixed top-0 left-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Img
            src="images/img_logo_ellas_portal_prancheta.png"
            alt="Logo"
            className="h-12"
          />
          <nav>
            <ul className="flex items-center space-x-4">
              <li>
                <Link to="/" className="text-blue-700 hover:text-blue-900">
                  <Heading as="p">Início</Heading>
                </Link>
              </li>
              <li>
                <Link
                  to="/graph-view"
                  className="text-blue-700 hover:text-blue-900"
                >
                  <Heading as="p">Initiatives</Heading>
                </Link>
              </li>
              <li>
                <Link
                  to="/policies-by-country"
                  className="text-blue-700 hover:text-blue-900"
                >
                  <Heading as="p">Policies by Country</Heading>
                </Link>
              </li>
              <li>
                <Link
                  to="/policy-types"
                  className="text-blue-700 hover:text-blue-900"
                >
                  <Heading as="p">Policy Types</Heading>
                </Link>
              </li>
              <li>
                <Link
                  to="/policy-results"
                  className="text-blue-700 hover:text-blue-900"
                >
                  <Heading as="p">Policy Results</Heading>
                </Link>
              </li>
              <li>
                <Link
                  to="/policies-by-country-and-date"
                  className="text-blue-700 hover:text-blue-900"
                >
                  <Heading as="p">Policies by Country and Date</Heading>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div
        style={{
          flex: "1 0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          backgroundColor: "#f0f0f0",
          paddingTop: "70px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "calc(100vh - 140px)",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            position: "relative",
          }}
        >
          {graphData.nodes.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                border: "1px solid red",
                color: "red",
              }}
            >
              No data available for this query.
            </div>
          )}
          <div ref={networkContainer} className="w-full h-[600px]" />
          <div className="table-container">
            <div className="w-full overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Node</th>
                    <th className="px-4 py-2">Central Node</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "even-row" : "odd-row"}
                    >
                      <td>{row.label}</td>
                      <td>{row.centralNodeId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <PDFDownloadLink
                document={
                  <PDFGenerator tableData={tableData} queryType={queryType} />
                }
                fileName="graphview_report.pdf"
              >
                <button
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    opacity: 1,
                  }}
                >
                  Download PDF
                </button>
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full p-5 bg-gray-200 text-center">
        <Text>© 2024 Your Website</Text>
      </footer>
    </div>
  );
};

export default GraphView;
