import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import {
	Typography,
	Grid,
	Card,
	CardContent,
} from "@material-ui/core";

const AccordionSkeleton = () => {
  return (
		<Card>
			<CardContent>
				<Grid container>
					<Grid item sm={2}>
						<Typography variant="h7">
							<Skeleton animation="none" />
						</Typography>
					</Grid>
					<Grid item sm={9}></Grid>
					<Grid item sm={1}>
						<Grid container>
							<Grid item sm={8}></Grid>
							<Grid item sm={4}>
								<Skeleton variant="circle" animation="none" width={25} height={25}/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
		
  );
};
export default AccordionSkeleton;