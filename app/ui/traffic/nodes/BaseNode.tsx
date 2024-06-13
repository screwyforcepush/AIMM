import React, { useState, useMemo } from "react";
import { Handle, Position, HandleType, NodeToolbar } from "reactflow";
import { Node, PieChartComponentProps } from "../../types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  LabelList,
} from "recharts";

interface BaseNodeProps {
  data: { label: string; nodeData: Node };
  style: React.CSSProperties;
  className: string;
  handles: { type: HandleType; position: Position }[];
  textClassName?: string;
  showTooltip: boolean;
}

const COLORS = {
  Neutral: "#8884d8",
  Positive: "#82ca9d",
  Negative: "#ff6361",
  Mixed: "#ffa600",
  Engaged: "#4caf50",
  Disengaged: "#f44336",
  Passive: "#ffeb3b",
  Low: "#8bc34a",
  Medium: "#ff9800",
  High: "#f44336",
  Progressive: "#2196f3",
  Stationary: "#9e9e9e",
} as const;

const EMOJIS = {
  Neutral: "😐",
  Positive: "😊",
  Negative: "😞",
  Mixed: "😕",
  Engaged: "🔥",
  Disengaged: "❄️",
  Passive: "🌙",
  Low: "🧘",
  Medium: "🧠",
  High: "🤯",
  Progressive: "📈",
  Stationary: "⏸️",
} as const;

type ColorKeys = keyof typeof COLORS;
type EmojiKeys = keyof typeof EMOJIS;
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  emoji,
}: {
  cx: any;
  cy: any;
  midAngle: any;
  innerRadius: any;
  outerRadius: any;
  emoji: any;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x+10}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {emoji}
    </text>
  );
};

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  title,
}) => {
  const chartData = useMemo(() => {
    return Object.entries(data).map(([key, value]) => {
      const colorKey = key as ColorKeys;
      const emojiKey = key as EmojiKeys;
      return {
        name: key,
        value,
        color: COLORS[colorKey],
        emoji: EMOJIS[emojiKey],
      };
    });
  }, [data]);

  return (
    <div className="flex flex-col items-center">
      <span className="text-sm font-semibold">{title}</span>
      <PieChart width={150} height={150}>
        <Pie
          data={chartData}
          cx={75}
          cy={75}
          labelLine={false}
          outerRadius={50}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={renderCustomizedLabel}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <RechartsTooltip formatter={(value, name) => [value, `${name}`]} />
      </PieChart>
    </div>
  );
};

const CustomTooltip: React.FC<{ nodeData: Node }> = ({ nodeData }) => (
  <div className="border border-gray-300 rounded shadow-lg bg-white text-gray-800 w-64">
    <div className="p-2">
      <div className="font-semibold">{nodeData.label}</div>
      <div>Total Cost: ${nodeData.totalCost?.toFixed(2)}</div>
      <div>Avg Cost: ${nodeData.avgCost?.toFixed(2)}</div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {nodeData.sentiment && (
        <PieChartComponent data={nodeData.sentiment} title="Sentiment" />
      )}
      {nodeData.engagement && (
        <PieChartComponent data={nodeData.engagement} title="Engagement" />
      )}
      {nodeData.cognitiveLoad && (
        <PieChartComponent
          data={nodeData.cognitiveLoad}
          title="Cognitive Load"
        />
      )}
      {nodeData.progressionStatus && (
        <PieChartComponent
          data={nodeData.progressionStatus}
          title="Progression"
        />
      )}
    </div>
  </div>
);

const BaseNode: React.FC<BaseNodeProps> = ({
  data,
  style,
  className,
  handles,
  textClassName = "",
  showTooltip,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <div className="relative">
      <div
        className={`overflow-hidden p-2 rounded h-40 cursor-pointer ${className}`}
        style={style}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        <div className={`${textClassName}`}>{data.label}</div>
        {handles.map((handle, index) => (
          <Handle
            key={index}
            type={handle.type}
            position={handle.position}
            className="!bg-gray-500 !border-none"
          />
        ))}
      </div>
      <NodeToolbar
        isVisible={tooltipVisible && showTooltip}
        position={Position.Right}
      >
        <CustomTooltip nodeData={data.nodeData} />
      </NodeToolbar>
    </div>
  );
};
export default BaseNode;
