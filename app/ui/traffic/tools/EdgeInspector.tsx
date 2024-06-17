import { Edge } from "../../types";
import { AiOutlineRight } from "react-icons/ai";


interface NodeInspectorProps {
  edge: Edge;
  setInspectThread: Function;
}

export default function EdgeInspector({ edge, setInspectThread }: NodeInspectorProps) {
  return (
    <div className="react-flow__devtools-changelogger">
      <div className="react-flow__devtools-title text-xl">Transition Inspector</div>
      <div>
        <div>
          {edge.source} → {edge.target}
        </div>
        <div>Frequeny: {edge.trafficVolume}</div>
        <div>
          Threads:
          {edge.thread_ids.map((threadId, index) => (
            <div key={index}>
                        <div
            className="font-semibold flex justify-between cursor-pointer"
            onClick={() => setInspectThread(threadId)}
          >
            <div>{threadId}</div>
            <AiOutlineRight className="text-2xl"/>
          </div>
            </div>

          ))}
        </div>
      </div>
      {/* {JSON.stringify(edge)} */}
    </div>
  );
}
