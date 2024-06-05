import { Node, Edge, NodeThread, Thread, ThreadGraph, Sentiment, Role, Engagement, CognitiveLoad, ProgressionStatus, UserMessage, AssistantMessage } from '../types';

//TODO mock for now, this should be pre calculated when building the dataset
const costConversion = 80000;
const initNode: Node = {
    id: 'initialise',
    label: 'Initialise',
    type: 'System',
};

const exitNode: Node = {
    id: 'exit',
    label: 'Exit',
    type: 'System',
};

// export type NodeThread = {
//     thread_id: string;
//     message_id: string;
//     user_prompt: UserMessage;
//     assistant_message: AssistantMessage;
//     user_response: UserMessage | null;
//     message_cost: number;
//     run_total_cost: number;
//   };

// // New types for nodes and edges to support the traffic visualization feature
// export type Node = {
//     id: string;
//     label: string;
//     type: string;
//     totalCost: number;
//     avgCost: number;
//     avgSentiment: Sentiment;
//     avgEngagement: Engagement;
//     avgCognitiveLoad: CognitiveLoad;
//     avgProgressionStatus: ProgressionStatus;
//     threads: Array<NodeThread>;
//   };
// };

// export type Edge = {
//   source: string;
//   target: string;
//   trafficVolume: number;
//   thread_ids: Array<string>;
// };

const mergeNodes = (nodes: Node[]): Node[] => {
    let mergedNodes: Node[] = [];
    for (let node of nodes) {
        let existingNode = mergedNodes.find((n) => n.id === node.id);
        if (existingNode) {
            if (existingNode.threads && node.threads) {
                existingNode.threads.push(...node.threads)
            }
        } else {
            mergedNodes.push(node);
        }
    }
    return mergedNodes;
}

export function buildTrafficGraph(threads: Thread[]): ThreadGraph {
    let threadGraph: ThreadGraph = {
        nodes: [initNode, exitNode],
        edges: [],
    };

    let tempNodes: Node[] = [];
    let tempEdges: Edge[] = [];

    for (let thread of threads) {
        let thread_id = thread.thread_id;
        let prev_node = initNode;
        let run_totalCost = 0;
        for(let i = 0; i < thread.messages.length; i++) {

            let message = thread.messages[i];


            if(message.role == Role.Assistant) {
                // TODO need to add messageID at data generation
                // let message_id = message.message_id;

                let user_prompt = i > 0 ? thread.messages[i - 1] as UserMessage: null;
                let user_response = i < thread.messages.length - 1 ? thread.messages[i + 1] as UserMessage : null;
                let assistant_message = message as AssistantMessage;

                let message_id = thread_id+i;
                let message_cost = message.tokens/costConversion;
                run_totalCost += message_cost;

                let node_thread: NodeThread = {
                    thread_id: thread_id,
                    message_id: message_id,
                    user_prompt: user_prompt,
                    assistant_message: assistant_message,
                    user_response: user_response,
                    message_cost: message_cost,
                    run_total_cost: run_totalCost,
                };

                let node: Node;
                if (assistant_message.assessment.deviation_trigger){
                    node = {
                        id: assistant_message.assessment.deviation_trigger,
                        label: assistant_message.assessment.deviation_trigger,
                        type: 'deviation',
                        threads: [node_thread],
                    };
                    tempNodes.push(node);
                    tempEdges.push({
                        source: prev_node.id,
                        target: node.id,
                        trafficVolume: 1,
                        thread_ids: [thread_id],
                    });
                    prev_node = node;
                }
                if (assistant_message.assessment.milestone_details){
                    for(let step of assistant_message.assessment.milestone_details.steps){
                        node = {
                            id: `${assistant_message.assessment.milestone_details.name}-${step}`,
                            label: step,
                            type: assistant_message.assessment.milestone_details.name,
                            description: assistant_message.assessment.milestone_details.description,
                            threads: [node_thread],
                        };
                        tempNodes.push(node);
                        tempEdges.push({
                            source: prev_node.id,
                            target: node.id,
                            trafficVolume: 1,
                            thread_ids: [thread_id],
                        });
                        prev_node = node;
                    }
                }
            }
          }
          tempEdges.push({
            source: prev_node.id,
            target: exitNode.id,
            trafficVolume: 1,
            thread_ids: [thread_id],
        });


    }


        let nodes: Node[] = [];
        let edges: Edge[] = [];
        let threadNodes: NodeThread[] = [];

    return threadGraph;
}