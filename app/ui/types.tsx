// Enums for repetitive string literals
export enum Role {
  User = "user",
  Assistant = "assistant",
}

export enum Complexity {
  Simple = "Simple",
  Moderate = "Moderate",
  Complex = "Complex",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

export enum Sentiment {
  Neutral = "Neutral",
  Positive = "Positive",
  Negative = "Negative",
  Mixed = "Mixed",
}

export enum Engagement {
  Engaged = "Engaged",
  Disengaged = "Disengaged",
  Passive = "Passive",
}

export enum CognitiveLoad {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export enum ProgressionStatus {
  Progressive = "Progressive",
  Stationary = "Stationary",
}

export enum MilestoneRelevance {
  Focused = "Focused",
  Unfocused = "Unfocused",
  MinorDeviation = "Minor Deviation",
  None = "None",
  MajorDeviation = "Major Deviation",
}

// MilestoneDetails Type
export type MilestoneDetails = {
  name: string;
  description: string;
  steps: string[];
};

interface BaseMessage<T> {
  role: Role;
  message: string;
  tokens: number;
  assessment: T;
}

interface UserMessage
  extends BaseMessage<{
    init: boolean | null;
    prompt_hack_attempt: boolean | null;
    intent:
      | "Confirmation"
      | "Inquiry"
      | "Direction"
      | "Feedback"
      | "Other"
      | null;
    milestone_relevance: MilestoneRelevance | null;
    complexity: Complexity | null;
    sentiment: Sentiment | null;
    engagement: Engagement | null;
  }> {
  role: Role.User;
}

interface AssistantMessage
  extends BaseMessage<{
    milestone_details: MilestoneDetails | null;
    cognitive_load: CognitiveLoad | null;
    milestone_relevance: MilestoneRelevance | null;
    deviation_trigger:
      | "Prompt Hack Attempt"
      | "User Tangent"
      | "Irrelevant Response"
      | null;
    progression_status: ProgressionStatus | null;
  }> {
  role: Role.Assistant;
}


export type Thread = {
  thread_id: string;
  messages: (UserMessage | AssistantMessage)[];
  started_time: string;
  finished_time: string;
  model: string;
  cog_load_majority: CognitiveLoad;
  sentiment_majority: Sentiment | null;
  engagement_majority: Engagement | null;
  highest_step: {
    milestone: string;
    step: string;
  } | null;
  message_count: number;
  engagement_duration: number;
  tokens: number;
  email: string | null;
};

// Type for Total Statistics
export type TotalStatistics = {
  thread_count: number;
  engagement_duration: number;
  message_count: number;
  tokens: number;
  highest_thread_tokens: number;
  leads: number;
};

// Additional types for high-level analytics and traffic visualization components
export type HighLevelAnalyticsComponentProps = {
    totalStatistics: TotalStatistics;
    aggregateStatistics: AggregateStatistics;
  };

// Type for Dropoff Point
export type DropoffPoint = {
  total_count: number;
  steps: Record<string, number>;
};

// Type for Aggregate Statistics
export type AggregateStatistics = {
  message_count: number;
  engagement_duration: number;
  tokens: number;
  cognitive_load: CognitiveLoad;
  sentiment: Sentiment;
  engagement: Engagement;
  dropoff_point: Record<string, DropoffPoint>;
};


export type ThreadGraph = {
  nodes: Array<{
    id: string;
    label: string;
    tokens: number;
    averageTokens: number;
  }>;
  edges: Array<{
    source: string;
    target: string;
    trafficVolume: number;
  }>;
};

export interface TrafficVisualizationComponentProps {
    traffic_graph: ThreadGraph[]; // replace with the actual type
    searchQuery: string;
  }

// New types for nodes and edges to support the traffic visualization feature
export type Node = {
  id: string;
  label: string;
  totalTokens: number;
  averageTokens: number;
};

export type Edge = {
  source: string;
  target: string;
  trafficVolume: number;
};


// Parent Type for Assistant Data
export type AssistantData = {
    total: TotalStatistics;
    aggregate: AggregateStatistics;
    threads: Thread[];
  };
  
// Helper functions to validate enums and properties
  
function validateProperty<T>(data: any, propName: string, typeName: string, parser?: (value: any) => T): T {
const value = data[propName];
if (value == null || (parser ? !parser(value) : typeof value !== typeName)) {
    throw new Error(`Invalid ${propName}: ${value}`);
}
return value;
}
  
  // Parsing for enums
function parseEnum<T extends Record<string, unknown>>(value: any, enumObject: T): T[keyof T] {
  if (!Object.values(enumObject).includes(value)) {
    throw new Error(`Invalid enum value: ${value}`);
  }
  return value as T[keyof T];
}

// Parsing for MilestoneDetails
function parseMilestoneDetails(data: any): MilestoneDetails {
  return {
    name: validateProperty(data, 'name', 'string'),
    description: validateProperty(data, 'description', 'string'),
    steps: validateProperty(data, 'steps', 'object', steps => steps.map((step: string) => typeof step === 'string' ? step : null)),
  };
}

// Parsing for BaseMessage
function parseBaseMessage<T>(data: any, parseAssessment: (data: any) => T): BaseMessage<T> {
  return {
    role: parseEnum(validateProperty(data, 'role', 'string'), Role),
    message: validateProperty(data, 'message', 'string'),
    tokens: validateProperty(data, 'tokens', 'number'),
    assessment: parseAssessment(validateProperty(data, 'assessment', 'object')),
  };
}

// Parsing for UserMessage
function parseUserMessage(data: any): UserMessage {
  return {
    ...parseBaseMessage(data, assessment => ({
    init: assessment['init'] ? validateProperty(assessment, 'init', 'boolean') : null,
    prompt_hack_attempt: assessment['prompt_hack_attempt'] ? validateProperty(assessment, 'prompt_hack_attempt', 'boolean') : null,
    intent: assessment['intent'] ? validateProperty(assessment, 'intent', 'string') : null,
    milestone_relevance: assessment['milestone_relevance'] ? parseEnum(validateProperty(assessment, 'milestone_relevance', 'string'), MilestoneRelevance) : null,
    complexity: assessment['complexity'] ? parseEnum(validateProperty(assessment, 'complexity', 'string'), Complexity) : null,
    sentiment: assessment['sentiment'] ? parseEnum(validateProperty(assessment, 'sentiment', 'string'), Sentiment) : null,
    engagement: assessment['engagement'] ? parseEnum(validateProperty(assessment, 'engagement', 'string'), Engagement) : null,
    })),
    role: Role.User
  };
}

// Parsing for AssistantMessage
function parseAssistantMessage(data: any): AssistantMessage {
  return {
    ...parseBaseMessage(data, assessment => ({
    milestone_details: assessment['milestone_details'] ? validateProperty(assessment, 'milestone_details', 'object', parseMilestoneDetails) : null,
    cognitive_load: assessment['cognitive_load'] ? parseEnum(validateProperty(assessment, 'cognitive_load', 'string'), CognitiveLoad) : null,
    milestone_relevance: assessment['milestone_relevance'] ? parseEnum(validateProperty(assessment, 'milestone_relevance', 'string'), MilestoneRelevance) : null,
    deviation_trigger: assessment['deviation_trigger'] ? validateProperty(assessment, 'deviation_trigger', 'string') : null,
    progression_status: assessment['progression_status'] ? parseEnum(validateProperty(assessment, 'progression_status', 'string'), ProgressionStatus) : null,
    })),
    role: Role.Assistant
  };
}

// Parsing for Thread
function parseThread(data: any): Thread {
  return {
    thread_id: validateProperty(data, 'thread_id', 'string'),
    messages: validateProperty(data, 'messages', 'object', messages => messages.map((message: AssistantMessage | UserMessage) => message.role === Role.User ? parseUserMessage(message) : parseAssistantMessage(message))),
    started_time: validateProperty(data, 'started_time', 'string'),
    finished_time: validateProperty(data, 'finished_time', 'string'),
    model: validateProperty(data, 'model', 'string'),
    cog_load_majority: parseEnum(validateProperty(data, 'cog_load_majority', 'string'), CognitiveLoad),
    sentiment_majority: parseEnum(validateProperty(data, 'sentiment_majority', 'string'), Sentiment),
    engagement_majority: parseEnum(validateProperty(data, 'engagement_majority', 'string'), Engagement),
    highest_step: validateProperty(data, 'highest_step', 'object'),
    message_count: validateProperty(data, 'message_count', 'number'),
    engagement_duration: validateProperty(data, 'engagement_duration', 'number'),
    tokens: validateProperty(data, 'tokens', 'number'),
    email: data['email'] ? validateProperty(data, 'email', 'string'): null,
  };
}

// Parsing for TotalStatistics
function parseTotalStatistics(data: any): TotalStatistics {
  return {
    thread_count: validateProperty(data, 'thread_count', 'number'),
    engagement_duration: validateProperty(data, 'engagement_duration', 'number'),
    message_count: validateProperty(data, 'message_count', 'number'),
    tokens: validateProperty(data, 'tokens', 'number'),
    highest_thread_tokens: validateProperty(data, 'highest_thread_tokens', 'number'),
    leads: validateProperty(data, 'leads', 'number'),
  };
}

// Parsing for DropoffPoint
function parseDropoffPoint(data: any): DropoffPoint {
  return {
    total_count: validateProperty(data, 'total_count', 'number'),
    steps: validateProperty(data, 'steps', 'object'),
  };
}

// Parsing for AggregateStatistics
function parseAggregateStatistics(data: any): AggregateStatistics {
  return {
    message_count: validateProperty(data, 'message_count', 'number'),
    engagement_duration: validateProperty(data, 'engagement_duration', 'number'),
    tokens: validateProperty(data, 'tokens', 'number'),
    cognitive_load: parseEnum(validateProperty(data, 'cognitive_load', 'string'), CognitiveLoad),
    sentiment: parseEnum(validateProperty(data, 'sentiment', 'string'), Sentiment),
    engagement: parseEnum(validateProperty(data, 'engagement', 'string'), Engagement),
    dropoff_point: validateProperty(data, 'dropoff_point', 'object', dropoff_point => Object.fromEntries(Object.entries(dropoff_point).map(([key, value]) => [key, parseDropoffPoint(value)]))),
  };
}

// Main parser for AssistantData
export function parseAssistantData(data: any): AssistantData {
  return {
    total: parseTotalStatistics(validateProperty(data, 'total', 'object')),
    aggregate: parseAggregateStatistics(validateProperty(data, 'aggregate', 'object')),
    threads: validateProperty(data, 'threads', 'object', threads => threads.map(parseThread)),
  };
}