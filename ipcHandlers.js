const {
	Patient,
	Diagnosis,
	Disease,
	Symptom,
	Medication,
	Medicine,
} = require("./database/schemas");

const getPatients = async (event, ipcMain) => {
	const patients = await Patient.find({})
		.sort({ name: 1, dateAdded: -1 })
		.populate("diagnosis.disease")
		.populate("medications.medicine")
		.populate({ path: "appointments", populate: { path: "patient" } })
		.populate({ path: "visitHistory", populate: { path: "patient" } });
	console.log(patients);
	return event.reply("patients", JSON.stringify(patients));
};

const getPatient = async (event, arg) => {
	const patient = await Patient.findById(arg)
		.populate("diagnosis.disease")
		.populate("medications.medicine")
		.populate({
			path: "appointments",
			populate: { path: "patient" },
		})
		.populate({
			path: "visitHistory",
			populate: { path: "patient" },
		});
	return event.reply("patient", JSON.stringify(patient));
};

// Creation functions

// Check the uniqueness of the syymptom and return the symptom if it exists
const checkSymptom = async (symptom) => {
	const foundSymptom = await Symptom.findOne({ name: symptom });
	if (foundSymptom) {
		return foundSymptom;
	}
	return null;
};
// Check the uniqueness of the diagnosis and return the diagnosis if it exists
const checkDisease = async (disease) => {
	const foundDisease = await Disease.findOne({ name: disease });
	if (foundDisease) {
		return foundDisease;
	}
	return null;
};
// Check the uniqueness of the medicine and return the medicine if it exists
const checkMedicine = async (medicine) => {
	const foundMedicine = await Medicine.findOne({ name: medicine });
	if (foundMedicine) {
		return foundMedicine;
	}
	return null;
};

const createPatient = async (event, arg) => {
	const { diagnosis, medications, symptoms } = arg;

	// Unique Symptoms
	const newSymptoms = await Promise.all(
		symptoms.map(async (symptom) => {
			let newSymptom = await checkSymptom(symptom.toLowerCase());
			if (!newSymptom) {
				newSymptom = await Symptom.create({
					name: symptom.toLowerCase(),
				});
			}
			return newSymptom;
		})
	);

	// Format Diagnosis
	const newDiagnosis = await Promise.all(
		diagnosis.map(async (disease) => {
			let newDisease = await checkDisease(disease.name.toLowerCase());
			try {
				if (!newDisease) {
					newDisease = await Disease.create({
						name: disease.name.toLowerCase(),
					});
				}
			} catch (err) {
				console.log(err);
				throw err;
			}
			return { disease: newDisease._id, date: disease.date };
		})
	);

	// Format Medications
	const newMedications = await Promise.all(
		medications.map(async (medication) => {
			let medicine = checkMedicine(medication.name.toLowerCase());
			if (!medicine) {
				medicine = await Medicine.create({
					name: medication.name.toLowerCase(),
				});
			}
			return {
				medicine: medicine._id,
				dosage: medication.dosage,
				frequency: medication.frequency,
			};
		})
	);

	const diagnoses = await Diagnosis.insertMany(newDiagnosis);
	const addMedications = await Medication.insertMany(newMedications);
	const patient = await Patient.create({
		...arg,
		diagnosis: diagnoses,
		medications: addMedications,
		symptoms: newSymptoms,
	});

	return event.reply("patient-created", JSON.stringify(patient));
};

module.exports = { getPatients, createPatient, getPatient };
