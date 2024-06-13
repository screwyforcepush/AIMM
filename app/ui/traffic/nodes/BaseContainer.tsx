import React from 'react';
import { Node } from "../../types";


const BaseContainer: React.FC<{ data: { label: string; children: Node[] }, style: React.CSSProperties, className: string }> = ({ data, style, className }) => {
  return (
    <div className={`${className} border border-black p-2 rounded`} style={style}>
      <div className="overflow-hidden">{data.label}</div>
    </div>
  );
};

export default BaseContainer;
