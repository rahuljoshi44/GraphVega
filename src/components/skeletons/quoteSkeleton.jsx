import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import {
	Typography,
	Card,
	CardContent,
	Grid
} from "@material-ui/core";

const QuoteSkeleton = () => {
  return (
    <Card>
      <CardContent>
        <Grid container>
					<Grid item sm={5}>
						<Typography variant="body2">
							Use the search bar on the top to lookup an underlying!
							{/* <Skeleton animation="none" /> */}
						</Typography>
					</Grid>
					<Grid item sm={4}></Grid>
					<Grid item sm={3}>
						<Typography variant="h5">
							<Skeleton animation="none" />
						</Typography>
					</Grid>

				</Grid>
      </CardContent>
    </Card>
  );
};
export default QuoteSkeleton;