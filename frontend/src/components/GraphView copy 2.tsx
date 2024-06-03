import React, { useEffect, useState } from "react";
import { fetchInitiatives } from "../services/apiService"; // Adjust the import path as needed
import { Graph } from "react-d3-graph";

const GraphView: React.FC = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    const loadInitiatives = async () => {
      try {
        const query = `
          PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          SELECT ?initiativeName ?countryName WHERE {
            ?initiative a Ellas:Initiative.
            ?initiative rdfs:label ?initiativeName.
            ?initiative Ellas:created_in ?country.
            ?country rdfs:label ?countryName.
            FILTER(?countryName="Brazil"@en).
          }
        `;
        const data = await fetchInitiatives(query);

        if (data && data.results && data.results.bindings) {
          const nodes: { id: string }[] = [];
          const links: { source: string; target: string }[] = [];

          data.results.bindings.forEach((binding: any) => {
            const initiativeName = binding.initiativeName.value;
            const countryName = binding.countryName.value;

            if (!nodes.find(node => node.id === initiativeName)) {
              nodes.push({ id: initiativeName });
            }
            if (!nodes.find(node => node.id === countryName)) {
              nodes.push({ id: countryName });
            }

            links.push({ source: initiativeName, target: countryName });
          });

          console.log("Loaded graph data:", { nodes, links });
          setGraphData({ nodes, links });
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error loading initiatives:", error);
      }
    };

    loadInitiatives();
  }, []);

  const myConfig = {
    nodeHighlightBehavior: true,
    node: {
      color: "lightgreen",
      size: 500,
      highlightStrokeColor: "blue",
      fontSize: 12,
    },
    link: {
      highlightColor: "lightblue",
    },
    height: 800,
    width: 1200,
    d3: {
      alphaTarget: 0.05,
      gravity: -200,
      linkLength: 200,
      linkStrength: 1,
    },
    panAndZoom: true,
    collapsible: true,
    directed: true,
  };

  // Function to handle click events on nodes
  const onClickNode = function (nodeId: string) {
    console.log(`Clicked node ${nodeId}`);
    // Check if the node already exists
    const newNodeId = `${nodeId}-child`;
    if (graphData.nodes.find(node => node.id === newNodeId)) {
      console.error(`Node ${newNodeId} already exists`);
      return;
    }

    const newNodes = graphData.nodes.concat({ id: newNodeId });
    const newLinks = graphData.links.concat({ source: nodeId, target: newNodeId });

    setGraphData({
      nodes: newNodes,
      links: newLinks
    });
  };

  // Function to handle click events on links
  const onClickLink = function (source: string, target: string) {
    console.log(`Clicked link between ${source} and ${target}`);
  };

  // Ensure we only render the graph when we have valid data
  const hasValidData = graphData.nodes.length > 0 && graphData.links.length > 0;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <div style={{ height: '800px', width: '1200px', backgroundColor: 'white', padding: '5px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h1>Graph View</h1>
        {hasValidData ? (
          <Graph
            id="graph-id" // id is mandatory
            data={graphData}
            config={myConfig}
            onClickNode={onClickNode}
            onClickLink={onClickLink}
            onMouseOverNode={(nodeId) => console.log(`Mouse over node ${nodeId}`)}
            onMouseOutNode={(nodeId) => console.log(`Mouse out node ${nodeId}`)}
            onMouseOverLink={(source, target) => console.log(`Mouse over in link between ${source} and ${target}`)}
            onMouseOutLink={(source, target) => console.log(`Mouse out link between ${source} and ${target}`)}
          />
        ) : (
          <div>Loading graph data...</div>
        )}
      </div>
    </div>
  );
};

export default GraphView;

// Add this empty export to make the file a module
export {};
