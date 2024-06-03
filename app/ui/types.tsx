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
    init: boolean;
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

// Refactored Thread Type
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

// Parent Type for Assistant Data
export type AssistantData = {
  total: TotalStatistics;
  aggregate: AggregateStatistics;
  threads: Thread[];
};
