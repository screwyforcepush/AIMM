import { Node, NodeMessage } from "../../types";
import NodeDetails from "../util/NodeDetails";
import MessageDetails from "../util/MessageDetails";


interface NodeInspectorProps {
  node: Node;
  nodeMessages: NodeMessage[];
  setInspectThread: Function;
}

export default function NodeInspector({ node, nodeMessages, setInspectThread }: NodeInspectorProps) {
 
  return (
    <div className="react-flow__devtools-changelogger">
      <div className="react-flow__devtools-title text-xl">Step Inspector</div>
      <div>
        <div>{node.type}: {node.description}</div>

      </div>
      <NodeDetails nodeData={node} className=""/>

      <div className="message-details-container">
        {nodeMessages.map((message, index) => (
          <MessageDetails key={index} message={message} setInspectThread={setInspectThread} />
        ))}
      </div>
      <pre style={{ 
        whiteSpace: 'pre-wrap', 
        wordWrap: 'break-word' 
      }}>
        {/* {JSON.stringify(node, null, 2)}
        {JSON.stringify(nodeMessages, null, 2)} */}
      </pre>
    </div>
  );
}
