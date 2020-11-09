process.env.TZ = "Europe/Paris"

const { generatePdf } = require("../src/utils")
const { readFileSync } = require("fs")
const { join } = require("path")

const certificate = readFileSync(
	join(__dirname, "../", "attestation-officielle", "src", "certificate.pdf")
)

module.exports = async (req, res) => {
	let data = req.body

	if (!data)
		return res.json({
			error: true,
			message: "Utilisez le formulaire pour générez un PDF",
		})

	const canvasImage = data.signature || false

	const profile = {
		lastname: data.nom || "",
		firstname: data.prenom || "",
		birthday: data.dateNaissance || "",
		placeofbirth: data.lieuNaissance || "",
		address: data.adresse || "",
		zipcode: data.codePostal || "",
		city: data.ville || "",
	}

	generatePdf(profile, "achats", certificate, canvasImage)
		.then(bytes => {
			res.setHeader("Content-Type", "application/pdf")
			return res.send(Buffer.from(bytes))
		})
		.catch(console.error)
}
