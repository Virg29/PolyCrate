import { Node } from "../components/NodeSelector/"

export const mockNodes: Record<string, Array<Node>> = {
  "ATK": [{ "name": "E0", status: "active" }],
  "LTK": [{ "name": "E0", status: "active" }, { "name": "E1", status: "active" }],
  "OTK": [{ "name": "E0", status: "inactive" }]
}