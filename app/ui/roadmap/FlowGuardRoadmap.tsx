import React, { useState } from 'react';

const roadmapData = [
  {
    id: 1,
    title: "Foundation: LLM Gateway",
    description: "Enable executions to deliver by removing pain points.",
    details: [
      "Unified interface for all LLM providers",
      "Resiliency through retries and fallback logic",
      "Cost controls and caching"
    ]
  },
  {
    id: 2,
    title: "Dev Tooling: LLM Engineering Platform",
    description: "Offer observability dev-tool features supporting multiple LLM providers.",
    details: [
      "Team collaboration features",
      "Latency and token tracking",
      "Traces, logs, and prompt management"
    ]
  },
  {
    id: 3,
    title: "AI Initiative Analytics: Product Insight Platform",
    description: "Analyze AI systems within the context of business objectives.",
    details: [
      "Measure AI system performance against objectives",
      "Track cost per objective conversion",
      "Visualize AI system shape and divergences"
    ]
  },
  {
    id: 4,
    title: "Value Activation: AI Product Optimisation",
    description: "Future options for optimizing AI products and delivering outcomes.",
    details: [
      "Fine-tuning and system-tuning",
      "Predictive analytics and model downgrade",
      "Security features: PII masking, guardrails, attack interception"
    ]
  }
];

const Card = ({ children, className, ...props }: { children: React.ReactNode, className: string }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`} {...props}>
    {children}
  </div>
);

const RoadmapItem = ({ item, index }: { item: any, index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-8 relative">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-200"></div>
      <div className="flex items-start">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold z-10 shadow-lg mt-1">
          {index + 1}
        </div>
        <div className="ml-4 flex-grow">
          <Card className="border border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
            <div 
              className="p-4 cursor-pointer bg-gradient-to-r from-blue-50 to-white"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <h3 className="text-lg font-semibold text-blue-800 flex justify-between items-center">
                {item.title}
                <span className="text-blue-500">
                  {isExpanded ? '▼' : '▶'}
                </span>
              </h3>
            </div>
            <div 
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-4">
                <p className="mb-2 text-gray-600">{item.description}</p>
                <ul className="list-disc pl-5">
                  {item.details.map((detail: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700 mb-1">{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const FlowGuardRoadmap = () => {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">FlowGuard Product Roadmap</h2>
      <div className="relative pl-4">
        {roadmapData.map((item, index) => (
          <RoadmapItem key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default FlowGuardRoadmap;