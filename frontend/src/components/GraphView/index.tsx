import React, { useRef, useCallback, useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

interface Node {
  id: string;
  label: string;
  [key: string]: any;
}

interface Edge {
  source: string;
  target: string;
  [key: string]: any;
}

interface GraphViewProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick?: (node: Node) => void;
  onEdgeClick?: (edge: Edge) => void;
}

const GraphView: React.FC<GraphViewProps> = ({
  nodes,
  edges,
  onNodeClick,
  onEdgeClick,
}) => {
  const graphRef = useRef<ForceGraph2D>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      setMounted(false);
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const handleNodeClick = useCallback(
    (node: Node) => {
      if (onNodeClick) {
        onNodeClick(node);
      }
    },
    [onNodeClick]
  );

  const handleLinkClick = useCallback(
    (edge: Edge) => {
      if (onEdgeClick) {
        onEdgeClick(edge);
      }
    },
    [onEdgeClick]
  );

  if (!mounted) {
    return (
      <div
        ref={containerRef}
        className="w-full h-[600px] border border-gray-200 rounded-lg"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-[600px] border border-gray-200 rounded-lg"
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={{ nodes, links: edges }}
        nodeLabel="label"
        nodeColor={() => "#1a73e8"}
        linkColor={() => "#999"}
        onNodeClick={handleNodeClick}
        onLinkClick={handleLinkClick}
        nodeRelSize={6}
        linkWidth={1}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
};

export default GraphView;
