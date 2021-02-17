import React from "react";
import {
  Line,
	LineChart,
	Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
} from "recharts";

const IVSkewChart = (props) => {
	return(
		<LineChart
			width={900}
			height={500}
			data={props.data}
			margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
		>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="strike">
				<Label value="Strike price" offset={0} position="insideBottom"/>
			</XAxis>
			<YAxis label={{ value: 'Implied Volatility', angle: -90, position: 'insideLeft', textAnchor: 'middle' }}/>
			<Tooltip />
			<Legend />
			<Line type="monotone" dataKey="iv" stroke="#002366" />
		</LineChart>
	)
}

export default IVSkewChart;