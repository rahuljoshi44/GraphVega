import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import {
	Typography,
	Paper,
	Grid,
	Container
} from "@material-ui/core";

const TabsSkeleton = () => {
  return (
    <Paper>
			<Container>
				<Grid container spacing={1}>
					<Grid item sm={6}>
						<Typography variant="h3">
							<Skeleton animation="none" />
						</Typography>
					</Grid>
					<Grid item sm={6}>
						<Typography variant="h3">
							<Skeleton animation="none" />
						</Typography>
					</Grid>
				</Grid>
			</Container>
    </Paper>
  );
};
export default TabsSkeleton;