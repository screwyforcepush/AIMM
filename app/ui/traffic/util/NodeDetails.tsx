import PieChartComponent from "./PieChart";
import { Node } from "../../types";


const NodeDetails: React.FC<{ nodeData: Node, className: string }> = ({ nodeData, className }) => (
    <div className={className}>
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

  export default NodeDetails;