'use client';

import '@fontsource/roboto/500.css';
import { Button, colors, Grid2, LinearProgress, Typography } from '@mui/material';
import { useState } from 'react';

export default function Shipment() {

	const [progress, setProgress] = useState(30);

	const [shipment, setShipment] = useState("병아리콩");
	const [incoterms, setIncoterms] = useState("FOB");
	const [currentShipment, setCurrentShipment] = useState("선적정보");

	return (<div>
		<Typography variant="h4" gutterBottom sx={{ mt: 2,  ml: 2}}>
        상세 보기
		</Typography>
		<Typography variant="h6" gutterBottom sx={{ mb: 0,  ml: 2}}>
        운송중
		</Typography>
		<LinearProgress color="secondary" value={progress} variant="determinate" />
		<Grid2 container spacing={4} sx={{ mt: 2, ml: 2 }}>
			<Grid2 item xs={6}>
				<Typography className='.MuiTypography-alignJustify' variant="h6"  gutterBottom>
					선적명
				</Typography>
			</Grid2>
			<Grid2 item xs={6}>
				<Typography className='.MuiTypography-alignJustify' variant="h6" gutterBottom>
					{ shipment }
				</Typography>
			</Grid2>
			<Grid2 item xs={3}>
				<Typography className='.MuiTypography-alignJustify' variant="h6" gutterBottom>
		  			인코텀즈
				</Typography>
			</Grid2>
			<Grid2 item xs={6}>
				<Typography className='.MuiTypography-alignJustify' variant="h6" gutterBottom>
					{ incoterms }
				</Typography>
			</Grid2>
		</Grid2>


		<Grid2 container spacing={4} sx={{ mt: 2, ml: 2 }}>
          <Grid2 item lg={2} md={3} sm={4} xs={10}>
		<Button
					variant="contained"
					fullWidth
			className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors m-5"
			color={currentShipment !== "선적정보" ? "primary" : "info"}
			onClick={() => {
				setCurrentShipment("선적정보");
			}}
		>
			선적정보
				</Button>
				</Grid2>
          <Grid2 item lg={2} md={3} sm={4} xs={10}>
		<Button
			variant="contained"
					fullWidth
			className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors m-5"
			color={currentShipment !== "서류정보" ? "primary" : "info"}
			onClick={() => {
				setCurrentShipment("서류정보");
			}}
		>
			서류정보
				</Button>
				</Grid2>
          <Grid2 item lg={2} md={3} sm={4} xs={10}>
		<Button
			variant="contained"
					fullWidth
			className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors m-5"
			color={currentShipment !== "화물정보" ? "primary" : "info"}
			onClick={() => {
				setCurrentShipment("화물정보");
			}}
		>
			화물정보
				</Button>
				</Grid2>
          <Grid2 item lg={2} md={3} sm={4} xs={10}>
		<Button
			variant="contained"
			className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors m-5"
			color={currentShipment !== "히스토리" ? "primary" : "info"}
			onClick={() => {
				setCurrentShipment("히스토리");
			}}
		>
			히스토리
				</Button>
				</Grid2>
		</Grid2>

	</div>);
}
