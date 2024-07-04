import React, { useState } from 'react';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { Typography, Paper, Collapse, IconButton } from '@mui/material';
import { ChevronRight, ChevronDown } from 'lucide-react';

const roadmapData = [
  {
    title: "1. Foundation: LLM Gateway",
    description: "Enable executions to deliver by removing pain points. Manage all LLM providers, provide resiliency, and control costs.",
    completed: true
  },
  {
    title: "2. Dev Tooling: LLM Engineering Platform",
    description: "Offer observability dev-tool features. Team collaboration, latency, token, traces, logs, prompt management, evals.",
    completed: true
  },
  {
    title: "3. AI Initiative Analytics: AI Product Insight Platform",
    description: "Analyse AI systems within business context. Measure performance, track costs, identify friction points, visualize system shape.",
    completed: false
  },
  {
    title: "4. Value Activation: AI Product Optimisation",
    description: "Future opportunities for delivering customer outcomes and reducing costs.",
    completed: false,
    options: [
      "Fine-tuning",
      "System-tuning",
      "Predictive analytics",
      "Model downgrade",
      "Prompt compression",
      "PII masking",
      "Guardrails",
      "Brand-safe",
      "LLM deviation re-routing",
      "Attack interception"
    ]
  }
];

const RoadmapItem = ({ item, isLast }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot color={item.completed ? "success" : "primary"} />
        {!isLast && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" component="h1">
            {item.title}
          </Typography>
          <Typography>{item.description}</Typography>
          {item.options && (
            <div>
              <IconButton
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
                aria-label="show more"
              >
                {expanded ? <ChevronDown /> : <ChevronRight />}
              </IconButton>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Typography variant="subtitle1">Future Options:</Typography>
                <ul>
                  {item.options.map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ul>
              </Collapse>
            </div>
          )}
        </Paper>
      </TimelineContent>
    </TimelineItem>
  );
};

const FlowGuardRoadmap = () => {
  return (
    <div className="p-4">
      <Typography variant="h4" component="h1" gutterBottom>
        FlowGuard Product Roadmap
      </Typography>
      <Timeline position="alternate">
        {roadmapData.map((item, index) => (
          <RoadmapItem key={index} item={item} isLast={index === roadmapData.length - 1} />
        ))}
      </Timeline>
    </div>
  );
};

export default FlowGuardRoadmap;