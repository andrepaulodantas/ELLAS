import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import { fetchInitiatives } from "../services/apiService"; // Ajuste o caminho conforme necessário

const GraphView: React.FC = () => {
  const graphContainer = useRef(null);
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
          const nodes: { id: string; label: string }[] = [];
          const links: { from: string; to: string }[] = [];
          const brazilNodeId = "Brazil";

          data.results.bindings.forEach((binding: any) => {
            const initiativeName = binding.initiativeName.value;

            if (!nodes.find(node => node.id === initiativeName)) {
              nodes.push({ id: initiativeName, label: initiativeName });
            }

            if (!nodes.find(node => node.id === brazilNodeId)) {
              nodes.push({ id: brazilNodeId, label: brazilNodeId });
            }
            links.push({ from: initiativeName, to: brazilNodeId });
          });

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

  useEffect(() => {
    if (graphData.nodes.length === 0 || graphData.links.length === 0) return;

    const nodes = new DataSet(graphData.nodes);
    const edges = new DataSet(graphData.links);

    const data = { nodes, edges };
    const options = {
      nodes: {
        shape: "dot",
        size: 15, // Diminuir o tamanho dos nós
        color: {
          background: "lightgreen",
          border: "blue"
        },
        font: {
          size: 12, // Diminuir o tamanho da fonte
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
        dragNodes: true
      },
      physics: {
        enabled: true,
        stabilization: {
          iterations: 50, // Reduzir o número de iterações para estabilizar mais rapidamente
        },
        barnesHut: {
          gravitationalConstant: -8000, // Aumentar a gravidade para espalhar mais os nós
          centralGravity: 0.1, // Diminuir a gravidade central para evitar a proximidade
          springLength: 200, // Aumentar o comprimento das molas para um layout mais espalhado
          springConstant: 0.04,
        },
      },
      layout: {
        hierarchical: false, // Desativar layout hierárquico
        improvedLayout: false,
        randomSeed: 1, // Seed para garantir que os nós estejam ao redor do nó central
      },
    };

    const network = new Network(graphContainer.current, data, options);

    network.once('stabilized', function () {
      network.focus("Brazil", {
        scale: 1,
        offset: { x: 0, y: 0 },
        animation: true,
      });
    });

    network.on("click", function (params) {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const newNodeId = `${nodeId}-child`;
        if (nodes.get(newNodeId)) {
          console.error(`Node ${newNodeId} already exists`);
          return;
        }
        nodes.add({ id: newNodeId, label: newNodeId });
        edges.add({ from: nodeId, to: newNodeId });
      }
    });
  }, [graphData]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f0f0', padding: '10px' }}>
      <div style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', position: 'relative' }}>
        <h1 style={{ textAlign: 'center', margin: '10px 0' }}>Graph View</h1>
        <div ref={graphContainer} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default GraphView;
