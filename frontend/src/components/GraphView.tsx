import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import { fetchInitiatives, fetchPolicies, fetchPolicyTypes, fetchPolicyResults, fetchPoliciesByCountryAndDate } from "../services/apiService"; // Ajuste o caminho conforme necessário
import { useLocation, Link } from "react-router-dom";
import { Text, Img, Heading } from "../components";

const GraphView: React.FC<{ queryType: string }> = ({ queryType }) => {
  const graphContainer = useRef(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const location = useLocation();

  useEffect(() => {
    const pathToFunctionMap: Record<string, () => Promise<any>> = {
      "policiesByCountry": fetchPolicies,
      "policyTypes": fetchPolicyTypes,
      "policyResults": fetchPolicyResults,
      "policiesByCountryAndDate": fetchPoliciesByCountryAndDate,
      "initiatives": fetchInitiatives,
    };

    const loadGraphData = async (fetchFunction: () => Promise<any>) => {
      try {
        const data = await fetchFunction();
        console.log(`Data fetched for queryType: ${queryType}`, data);
        if (data && data.results && data.results.bindings) {
          const nodes: { id: string; label: string }[] = [];
          const links: { from: string; to: string }[] = [];
          const centralNodeId = queryType === 'initiatives' ? "Brazil" : "Policy";

          data.results.bindings.forEach((binding: any, index: number) => {
            const labelKey = Object.keys(binding).find(key => key.includes('Name') || key.includes('Type') || key.includes('Results'));
            const label = binding[labelKey]?.value || `Node${index}`;

            if (!nodes.find(node => node.id === label)) {
              nodes.push({ id: label, label });
            }

            if (!nodes.find(node => node.id === centralNodeId)) {
              nodes.push({ id: centralNodeId, label: centralNodeId });
            }

            links.push({ from: label, to: centralNodeId });
          });

          setGraphData({ nodes, links });
        } else {
          console.error("Invalid data format:", data);
          setGraphData({ nodes: [], links: [] }); // Reset graph data if no data is fetched
        }
      } catch (error) {
        console.error("Error loading graph data:", error);
        setGraphData({ nodes: [], links: [] }); // Reset graph data if there's an error
      }
    };

    loadGraphData(pathToFunctionMap[queryType] || fetchInitiatives);
  }, [location.pathname, queryType]);

  useEffect(() => {
    if (graphData.nodes.length === 0 || graphData.links.length === 0) return;

    const nodes = new DataSet(graphData.nodes);
    const edges = new DataSet(graphData.links);

    const data = { nodes, edges };
    const options = {
      nodes: {
        shape: "dot",
        size: 15,
        color: {
          background: "lightgreen",
          border: "blue"
        },
        font: {
          size: 12,
          color: "#000000",
          face: "Arial",
          bold: {
            color: "#000000"
          },
        },
        borderWidth: 2,
        scaling: {
          label: {
            enabled: true,
            min: 10,
            max: 14,
            drawThreshold: 5,
            maxVisible: 20
          },
        }
      },
      edges: {
        color: "lightblue",
        width: 2
      },
      interaction: {
        zoomView: true,
        dragView: true,
        dragNodes: true // Allow nodes to be draggable
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

    const network = new Network(graphContainer.current, data, options);

    network.once('stabilized', function () {
      network.focus(queryType === 'initiatives' ? "Brazil" : "Policy", {
        scale: 1,
        offset: { x: 0, y: 0 },
        animation: true,
      });
    });

    network.on("click", function (params) {
      console.log("Clicked node:", params);
    });
  }, [graphData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <header className="w-full p-3 bg-white-A700 shadow-xs fixed top-0 left-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Img src="images/img_logo_ellas_portal_prancheta.png" alt="Logo" className="h-12"/>
          <nav>
            <ul className="flex items-center space-x-4">
              <li><Link to="/" className="text-blue-700 hover:text-blue-900"><Heading as="p">Início</Heading></Link></li>
              <li><Link to="/graph-view" className="text-blue-700 hover:text-blue-900"><Heading as="p">Initiatives</Heading></Link></li>
              <li><Link to="/policies-by-country" className="text-blue-700 hover:text-blue-900"><Heading as="p">Policies by Country</Heading></Link></li>
              <li><Link to="/policy-types" className="text-blue-700 hover:text-blue-900"><Heading as="p">Policy Types</Heading></Link></li>
              <li><Link to="/policy-results" className="text-blue-700 hover:text-blue-900"><Heading as="p">Policy Results</Heading></Link></li>
              <li><Link to="/policies-by-country-and-date" className="text-blue-700 hover:text-blue-900"><Heading as="p">Policies by Country and Date</Heading></Link></li>
            </ul>
          </nav>
        </div>
      </header>
      <div style={{ flex: '1 0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', backgroundColor: '#f0f0f0', paddingTop: '70px' }}>
        <div style={{ width: '100%', height: 'calc(100vh - 140px)', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', position: 'relative' }}>
          {graphData.nodes.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', border: '1px solid red', color: 'red' }}>
              No data available for this query.
            </div>
          )}
          <div ref={graphContainer} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
      <footer className="w-full p-5 bg-gray-200 text-center">
        <Text>© 2024 Your Website</Text>
      </footer>
    </div>
  );
};

export default GraphView;
