export default class Graph {
    private edges: any = {};
    private nodes: Array<any> = [];

    // private constructor
    private constructor() {}

    // object inilizer
    static newInstance(): Graph {
        return new Graph();
    }

    // settet
    setNodes(nodes: any) {
        this.nodes = nodes;
    }
    setEdges(edges: any) {
        this.edges = edges;
    }

    // covert MongoObj To CareerObj
    covertMongoObjToGraphObj(mongoObj: any) {
        if (!mongoObj) return undefined;
        const ObjectMap = new Map(Object.entries(mongoObj.graph));
        const graphObj = Graph.newInstance();
        graphObj.setNodes(ObjectMap.get("nodes"));
        graphObj.setEdges(ObjectMap.get("edges"));
        return graphObj;
    }

    addNode(node: string) {
        this.nodes.push(node);
        this.edges[node] = [];
    }

    addEdge(node1: string, node2: string, weight: any = 1) {
        this.edges[node1].push({ node: node2, weight: weight });
        this.edges[node2].push({ node: node1, weight: weight });
    }

    addDirectedEdge(node1: any, node2: any, weight: any = 1) {
        this.edges[node1].push({ node: node2, weight: weight });
    }

    display() {
        let graph = "";
        this.nodes.forEach(node => {
            graph +=
                node +
                "->" +
                this.edges[node].map((n: any) => n.node).join(", ") +
                "\n";
        });
        return graph;
    }

    isExist(parentNode: string) {
        return this.nodes.filter((node: string) => {
            return node === parentNode;
        }).length !== 0
            ? true
            : false;
    }

    search(node: string) {
        return this.edges[node].map((n: any) => n.node);
    }
}
