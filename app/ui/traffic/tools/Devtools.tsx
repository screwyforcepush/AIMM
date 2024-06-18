import { Node, Edge, NodeMessage, Thread } from "../../types";
import { useState, useEffect } from "react";
import { AiOutlineLeft, AiOutlineRight, AiOutlineClose } from "react-icons/ai";

import NodeInspector from "./NodeInspector";
import EdgeInspector from "./EdgeInspector";

interface DevToolsProps {
  edge: Edge | null;
  node: Node | null;
  nodeMessages: NodeMessage[];
  threads: Thread[];
  setFilterThreadId: Function;
  setSelectedNode: Function;
  setSelectedEdge: Function;
}

export default function DevTools({
  edge,
  node,
  nodeMessages,
  threads,
  setFilterThreadId,
  setSelectedNode,
  setSelectedEdge,
}: DevToolsProps) {
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [inspectThread, setInspectThread] = useState(null);
  const [foundThread, setFoundThread] = useState<Thread | null>(null);

  useEffect(() => {
    if (inspectThread) {
      const thread =
        threads.find((thread) => thread.thread_id === inspectThread) || null;
      setFoundThread(thread);
      setFilterThreadId(inspectThread);
    } else {
      setFilterThreadId(null);
    }
  }, [inspectThread, threads, setFilterThreadId]);

  useEffect(() => {
    setIsPanelVisible(true);
  }, [edge, node]);

  const filteredNodeMessages = node?.message_ids
    ? nodeMessages.filter((message) =>
        node.message_ids?.includes(message.message_id)
      )
    : [];

  return (
    <div>
      <div>
        {!isPanelVisible && (node || edge) && (
          <button
            onClick={() => setIsPanelVisible(true)}
            className="absolute left-0 text-gray-600 p-2 text-2xl text-bold z-50"
          >
            <AiOutlineRight />
          </button>
        )}
        <div className="flex">
          <div
            className={`react-flow__devtools w-full md:w-1/3 z-50 transition-all ease-in-out duration-500 bg-gray-800 text-white p-4 h-screen overflow-y-auto border-r transform ${
              isPanelVisible && (node || edge)
                ? "translate-x-0"
                : "-translate-x-full"
            }`}
          >
            {node && (
              <NodeInspector
                node={node}
                nodeMessages={filteredNodeMessages}
                setInspectThread={setInspectThread}
              />
            )}
            {edge && (
              <EdgeInspector edge={edge} setInspectThread={setInspectThread} />
            )}
          </div>
          {isPanelVisible && !inspectThread && (node || edge) && (
            <div className="self-start z-50">
              <button
                onClick={() => {
                  setIsPanelVisible(!isPanelVisible);
                  setSelectedNode(null);
                  setSelectedEdge(null);
                }}
                className={`text-gray-600 p-2 text-2xl text-bold h-auto`}
              >
                <AiOutlineLeft />
              </button>
            </div>
          )}
          {inspectThread && (
            <div
              className={`react-flow__devtools w-full  md:w-1/3  z-50 transition-all ease-in-out duration-500 bg-gray-800 text-white p-4 h-screen overflow-y-auto border-r`}
            >
              <div className="text-xl">Thread Inspector</div>

              {inspectThread}
              {foundThread &&
                foundThread.messages.map((message, index) => (
                  <div className="py-2" key={index}>
                    <strong>{message.role}:</strong> {message.message}
                  </div>
                ))}
            </div>
          )}
          {isPanelVisible && inspectThread && (node || edge) && (
            <div className="self-start z-50">
              <button
                onClick={() => setInspectThread(null)}
                className={`text-gray-600 p-2 text-2xl text-bold h-auto`}
              >
                <AiOutlineClose />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
