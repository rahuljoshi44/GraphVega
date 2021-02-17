import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import {
	Typography,
	Grid
} from "@material-ui/core";

const SelectSkeleton = () => {
  return (
    <>
			<Grid container spacing={2}>
				<Grid item sm={8}></Grid>
				<Grid item sm={2}>
					<Typography variant="h4">
						<Skeleton animation="none" />
					</Typography>
				</Grid>
				<Grid item sm={2}>
					<Typography variant="h4">
						<Skeleton animation="none" />
					</Typography>
				</Grid>
			</Grid>
			<Grid container>
				<Grid sm={4}>
					<Typography variant="h5">
						<Skeleton animation="none" />
					</Typography>
				</Grid>
			</Grid>
    </>
  );
};
export default SelectSkeleton;