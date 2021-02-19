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

const GreeksChart = (props) => {
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
			<YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft', textAnchor: 'middle' }}/>
			<Tooltip />
			<Legend />
			<Line type="monotone" dataKey="delta" stroke="rgba(0, 123, 255, 1)" />
			<Line type="monotone" dataKey="gamma" stroke="rgba(255, 230, 70, 1)" />
			<Line type="monotone" dataKey="theta" stroke="rgba(40, 167, 69, 1)" />
			<Line type="monotone" dataKey="vega" stroke="rgba(255, 7, 58, 1)" />

		</LineChart>
	)
}

export default GreeksChart;