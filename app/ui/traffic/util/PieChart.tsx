import React, { useMemo } from "react";
import { PieChartComponentProps } from "../../types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  LabelList,
} from "recharts";

import { AttributeKeys, ATTRIBUTES } from "./const";

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
        const attributeKey = key as AttributeKeys;
        return {
          name: key,
          value,
          color: ATTRIBUTES[attributeKey].color,
          emoji: ATTRIBUTES[attributeKey].emoji,
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

  export default PieChartComponent