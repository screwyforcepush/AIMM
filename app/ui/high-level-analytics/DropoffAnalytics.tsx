/* eslint-disable max-classes-per-file */
import React, { useEffect, useState, useRef } from 'react';
import { DropoffPoint } from '../types';
import { Treemap, Tooltip } from 'recharts';


interface DropoffProps {
  dropoff_points: Record<string, DropoffPoint>;
}

interface TreeNode {
  name: string;
  size: number;
  children?: TreeNode[];
}


const CustomizedContent = (props: any) => {
  const { root, depth, x, y, width, height, index, colors, name, value } = props;
  
  const lines = [];

  if (name){
    let line: string[] = [];    
    const words = [(index + 1).toString()+". "].concat(name.split(' '));
    words.forEach((word) => {
      if ((line + word).length < 18) {
        line.push(word);
      } else {
        lines.push(line.join(' '));
        line = [word];
      }
    });
    lines.push(line.join(' '));
  }
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill:
            depth < 2
              ? colors(value)
              : "#ffffff00",
          stroke: "#fff",
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10)
        }}
      />
      {depth === 1 ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={16}
        >
          {lines.map((line, i) => (
            <tspan x={x + width / 2} dy={i !== 0 ? "1.2em" : "0"} key={i}>{line}</tspan>
          ))}
          {/* {index + 1}. {name} */}
        </text>
      ) : null}
      {/* {depth === 1 ? (
        <text x={x + 4} y={y + 18} fill="#fff" fontSize={16} fillOpacity={0.9}>
          {index + 1}
        </text>
      ) : null} */}
    </g>
  );
};

const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    console.log("payload",payload)
    return (
      <div className="custom-tooltip" style={{ 
        backgroundColor: '#2d3748', 
        padding: '10px', 
        border: '1px solid #4a5568', 
        borderRadius: '5px', 
        color: '#fff', 
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.15)'
      }}>
        <p style={{ margin: '0', fontWeight: 'bold' }}>{`Step : ${payload[0].payload.name}`}</p>
        <p style={{ margin: '0', color: '#a0aec0' }}>{`Dropoffs: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};


const DropoffAnalytics: React.FC<DropoffProps> = ({ dropoff_points }) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }

    // Set the width initially
    handleResize();

    // Update the width when the window is resized
    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const data = Object.entries(dropoff_points).map(([segment, { total_count, steps }]) => ({
      name: segment,
      size: total_count,
      children: Object.entries(steps).map(([step, count]) => ({
        name: step,
        size: count,
      })),
    }));
    setTreeData(data);
  }, [dropoff_points]);

  console.log("treedata",treeData)
  // Define a color scale function

  // Find the maximum size for the color scale
  const maxSize = Math.max(...treeData.flatMap(node => node.size));

  function interpolateColor(minColor: number[], maxColor: number[], maxDepth: number, depth: number): string {
    const ratio = depth / maxDepth;
    const hex = (color: number) => {
      const code = Math.round(color).toString(16);
      return code.length < 2 ? `0${code}` : code;
    };
    
    return `#${hex(minColor[0] + (maxColor[0] - minColor[0]) * ratio)}${hex(minColor[1] + (maxColor[1] - minColor[1]) * ratio)}${hex(minColor[2] + (maxColor[2] - minColor[2]) * ratio)}`;
  }
  

  const colorScale = (max: number) => {
    return (size: number) => {
      return interpolateColor([29, 78, 216], [6, 182, 212], max ,size )
    }
  }



  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Dropoffs:</h2>
      <div ref={containerRef}>
        <Treemap
          width={containerWidth}
          height={400}
          data={treeData}
          type='flat'
          dataKey="size"
          stroke="#fff"
          fill="#8884d8"
          isAnimationActive={false}
          content={<CustomizedContent colors={colorScale(maxSize)} />}
        >
                <Tooltip content={<CustomTooltip />} />

        </Treemap>
      </div>
    </div>
  );
};

export default DropoffAnalytics;
