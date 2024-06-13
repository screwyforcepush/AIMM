import { Node, Edge, NodeMessage, Thread, TrafficGraph, Sentiment, Role, Engagement, CognitiveLoad, ProgressionStatus, UserMessage, AssistantMessage } from '../types';

//TODO mock for now, this should be pre calculated when building the dataset
const costConversion = 80000;
const initNode: Node = {
    id: 'initialise',
    label: 'Initialise',
    type: 'system',
};

const exitNode: Node = {
    id: 'exit',
    label: 'Exit',
    type: 'system',
};

const mergeNodes = (nodes: Node[], baseNodes: Node[] = [initNode, exitNode]): Node[] => {
    let mergedNodes= baseNodes;
    for (let node of nodes) {
        let existingNode = mergedNodes.find((n) => n.id === node.id);
        if (existingNode) {
            if (existingNode.message_ids && node.message_ids) {
                existingNode.message_ids.push(...node.message_ids)
            } else if (node.message_ids) {
                existingNode.message_ids = node.message_ids;
            }

            existingNode.totalCost = (existingNode.totalCost || 0) + (node.totalCost || 0);
            existingNode.avgCost = (existingNode.totalCost > 0 ? existingNode.totalCost : 1) / (existingNode.message_ids?.length || 1);

            if (node.sentiment) {
                existingNode.sentiment = existingNode.sentiment || {};
                for (let sentiment in node.sentiment) {
                    existingNode.sentiment[sentiment as Sentiment] = (existingNode.sentiment?.[sentiment as Sentiment] || 0) + (node.sentiment?.[sentiment as Sentiment] || 0);
                }
            }
            if (node.engagement) {
                existingNode.engagement = existingNode.engagement || {};
                for (let engagement in node.engagement) {
                    existingNode.engagement[engagement as Engagement] = (existingNode.engagement?.[engagement as Engagement] || 0) + (node.engagement?.[engagement as Engagement] || 0);
                }
            }
            if (node.cognitiveLoad) {
                existingNode.cognitiveLoad = existingNode.cognitiveLoad || {};
                for (let cognitiveLoad in node.cognitiveLoad) {
                    existingNode.cognitiveLoad[cognitiveLoad as CognitiveLoad] = (existingNode.cognitiveLoad?.[cognitiveLoad as CognitiveLoad] || 0) + (node.cognitiveLoad?.[cognitiveLoad as CognitiveLoad] || 0);
                }
            }
            if (node.progressionStatus) {
                existingNode.progressionStatus = existingNode.progressionStatus || {};
                for (let progressionStatus in node.progressionStatus) {
                    existingNode.progressionStatus[progressionStatus as ProgressionStatus] = (existingNode.progressionStatus?.[progressionStatus as ProgressionStatus] || 0) + (node.progressionStatus?.[progressionStatus as ProgressionStatus] || 0);
                }
            }
        } else {
            mergedNodes.push(node);
        }
    }
    return mergedNodes;
}

const mergeEdges = (edges: Edge[]): Edge[] => {
    let mergedEdges: Edge[] = [];
    for (let edge of edges) {
        let existingEdge = mergedEdges.find((e) => e.source === edge.source && e.target === edge.target);
        if (existingEdge) {
            existingEdge.trafficVolume = existingEdge.trafficVolume + edge.trafficVolume;
            existingEdge.thread_ids.push(...edge.thread_ids);
        } else {
            mergedEdges.push(edge);
        }
    }
    return mergedEdges;
}

export function buildTrafficGraph(threads: Thread[]): TrafficGraph {


    let tempNodes: Node[] = [];
    let tempEdges: Edge[] = [];
    let nodeMessages: NodeMessage[] = [];

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
                let response_sentiment: Sentiment | null = user_response? user_response.assessment.sentiment: null;
                let msg_cognitiveLoad: CognitiveLoad = assistant_message.assessment.cognitive_load;
                let response_engagement: Engagement | null = user_response? user_response.assessment.engagement: null;
                let progressionStatus: ProgressionStatus = assistant_message.assessment.progression_status;


                let node_thread: NodeMessage = {
                    thread_id: thread_id,
                    message_id: message_id,
                    user_prompt: user_prompt,
                    assistant_message: assistant_message,
                    user_response: user_response,
                    message_cost: message_cost,
                    run_total_cost: run_totalCost,
                };
                nodeMessages.push(node_thread);

                let node: Node;
                let node_base={
                    message_ids: [node_thread.message_id],
                    totalCost: run_totalCost,
                    avgCost: run_totalCost,
                    ...(response_sentiment ? { sentiment: { [response_sentiment]: 1 } } : {}), 
                    cognitiveLoad: { [msg_cognitiveLoad]: 1 },
                    ...(response_engagement ? { engagement: { [response_engagement]: 1 } } : {}),
                    progressionStatus: { [progressionStatus]: 1 },
                }
                if (assistant_message.assessment.deviation_trigger){
                    node = {
                        id: assistant_message.assessment.deviation_trigger,
                        label: assistant_message.assessment.deviation_trigger,
                        type: 'deviation',
                        ...node_base,
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
                            id: `${assistant_message.assessment.milestone_details.name} - ${step}`,
                            label: step,
                            type: assistant_message.assessment.milestone_details.name,
                            description: assistant_message.assessment.milestone_details.description,
                            ...node_base,
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



    let trafficGraph: TrafficGraph = {
        nodes: mergeNodes(tempNodes),
        edges: mergeEdges(tempEdges),
        nodeMessages: nodeMessages,
    };
    return trafficGraph;
}