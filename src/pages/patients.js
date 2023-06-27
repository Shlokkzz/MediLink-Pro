import { Box, Button, Typography } from "@mui/material";
import SideBar from "../components/sideBar";
import usePatients from "../hooks/usePatients";
import { useMemo, useState } from "react";
const electron = window.require("electron");
const { ipcRenderer } = electron;

const Patients = () => {
	const { patients, patientsLoaded } = usePatients();
	const [selectedFilter, setSelectedFilter] = useState("All");
	const patientList = useMemo(() => {
		return patients.filter((patient) => {
			if (selectedFilter == "All") {
				return true;
			} else if (selectedFilter == "Active") {
				return patient.active;
			}
		});
	}, [patients, selectedFilter]);

	const handleAddPatient = () => {
		ipcRenderer.send("add-patient");
	};
	return (
		<div>
			<SideBar
				type="patients"
				selectedFilter={selectedFilter}
				setSelectedFilter={setSelectedFilter}
				handleAddPatient={handleAddPatient}
			/>

			{/* <h1>Dashboard</h1> */}
			<Box
				sx={{
					top: "72px",
					position: "absolute",
					left: "80px",
					width: "calc(100vw - 112px)",
					height: "100%",
					backgroundColor: "#f5f5f5",
					padding: "1rem",
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography variant="h3">Patients</Typography>
					<Box sx={{ display: "flex", gap: "1rem" }}>
						{patientList.length > 0 && (
							<Typography variant="h6">
								{patientList.length}{" "}
								{selectedFilter == "All" ? "Patients" : "Active Patients"}
							</Typography>
						)}
						{patientList.map((patient) => {
							return (
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										gap: "0.5rem",
									}}
								>
									<Typography variant="body1">{patient.name}</Typography>
									<Typography variant="body2">{patient.phone}</Typography>
								</Box>
							);
						})}
					</Box>
				</Box>
			</Box>
		</div>
	);
};

export default Patients;
