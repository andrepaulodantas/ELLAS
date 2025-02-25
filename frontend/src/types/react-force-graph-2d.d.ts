declare module "react-force-graph-2d" {
  import { Component } from "react";

  interface GraphData {
    nodes: Array<{
      id: string;
      [key: string]: any;
    }>;
    links: Array<{
      source: string;
      target: string;
      [key: string]: any;
    }>;
  }

  interface ForceGraph2DProps {
    graphData: GraphData;
    nodeLabel?: string | ((node: any) => string);
    nodeColor?: string | ((node: any) => string);
    linkColor?: string | ((link: any) => string);
    onNodeClick?: (node: any, event: any) => void;
    onLinkClick?: (link: any, event: any) => void;
    nodeRelSize?: number;
    linkWidth?: number;
    linkDirectionalParticles?: number;
    linkDirectionalParticleSpeed?: number;
    width?: number;
    height?: number;
    ref?: any;
    [key: string]: any;
  }

  export default class ForceGraph2D extends Component<ForceGraph2DProps> {}
}
