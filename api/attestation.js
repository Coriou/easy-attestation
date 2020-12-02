process.env.TZ = "Europe/Paris"

const { genTime, generatePdf } = require("../src/utils")
const { readFileSync } = require("fs")
const { join } = require("path")

const certificate = readFileSync(
	join(__dirname, "../", "attestation-officielle", "src", "certificate.pdf")
)

// const raisons = {
// travail: 553,
// achats_culturel_cultuel: 482,
// sante: 434,
// famille: 410,
// handicap: 373,
// sport_animaux: 349,
// convocation: 276,
// missions: 252,
// enfants: 228,
// }

module.exports = async (req, res) => {
	let data = req.body

	if (!data)
		return res.json({
			error: true,
			message: "Utilisez le formulaire pour générez un PDF",
		})

	const canvasImage = data.signature || false

	const [creationDate, creationHour, datesortie, heuresortie] = genTime()

	const profile = {
		lastname: data.nom || "",
		firstname: data.prenom || "",
		birthday: data.dateNaissance || "",
		placeofbirth: data.lieuNaissance || "",
		address: data.adresse || "",
		zipcode: data.codePostal || "",
		city: data.ville || "",
		creationDate,
		creationHour,
		datesortie,
		heuresortie,
		reasons: data.raisons || "achats",
	}

	generatePdf(profile, profile.reasons, certificate, canvasImage)
		.then(bytes => {
			res.setHeader("Content-Type", "application/pdf")
			return res.send(Buffer.from(bytes))
		})
		.catch(console.error)
}
