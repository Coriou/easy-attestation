import { PDFDocument } from "pdf-lib"

const { generateQR } = require("../attestation-officielle/src/js/util")
const generatePdfOriginal = require("../attestation-officielle/src/js/pdf-util")
	.generatePdf

// The official generatePdf implementation relies on fetch() and Blob
// We don't need those browser methods, so I inject them as dummy polyfills
global.fetch = bytes =>
	new Promise(resolve => {
		const obj = {
			arrayBuffer: () => bytes,
		}
		return resolve(obj)
	})
class Blob {
	constructor([bytes]) {
		this.bytes = bytes
	}
}
global.Blob = Blob

export async function applySignature(pdf, image) {
	if (!image) return pdf

	const pdfDoc = await PDFDocument.load(pdf)
	const page1 = pdfDoc.getPages()[0]
	const signature = await pdfDoc.embedPng(image)
	page1.drawImage(signature, {
		x: 125,
		y: 100,
		width: 200,
		height: 25,
	})
	return await pdfDoc.save()
}

export async function replaceQR(pdf, profile) {
	if (!profile) return pdf

	const {
		lastname,
		firstname,
		birthday,
		placeofbirth,
		address,
		zipcode,
		city,
		datesortie,
		heuresortie,
		creationDate,
		creationHour,
		reasons,
	} = profile

	const data = [
		`Cree le: ${creationDate} a ${creationHour}`,
		`Nom: ${lastname}`,
		`Prenom: ${firstname}`,
		`Naissance: ${birthday} a ${placeofbirth}`,
		`Adresse: ${address} ${zipcode} ${city}`,
		`Sortie: ${datesortie} a ${heuresortie}`,
		`Motifs: ${reasons}`,
	].join(";\n ")

	const pdfDoc = await PDFDocument.load(pdf)
	const page1 = pdfDoc.getPages()[0]
	const generatedQR = await generateQR(data)
	const qrImage = await pdfDoc.embedPng(generatedQR)

	page1.drawImage(qrImage, {
		x: page1.getWidth() - 156,
		y: 100,
		width: 92,
		height: 92,
	})
	// pdfDoc.addPage()
	const page2 = pdfDoc.getPages()[1]
	page2.drawImage(qrImage, {
		x: 50,
		y: page2.getHeight() - 350,
		width: 300,
		height: 300,
	})

	return await pdfDoc.save()
}

export function genTime() {
	const rightNow = new Date()

	const fakeCreateDate = new Date(
		new Date().setMinutes(rightNow.getMinutes() - 17)
	)
	const fakeSortieDate = new Date(
		new Date().setMinutes(rightNow.getMinutes() - 12)
	)

	const creationDate = fakeCreateDate.toLocaleDateString("fr-FR")
	const creationHour = fakeCreateDate
		.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
		.replace(":", "h")

	const datesortie = fakeSortieDate.toLocaleDateString("fr-FR")
	const heuresortie = fakeSortieDate
		.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
		.replace(":", "h")

	return [creationDate, creationHour, datesortie, heuresortie]
}

export async function generatePdf(profile, reasons, certificate, canvasImage) {
	// Use the original generatePdf function
	const { bytes } = await generatePdfOriginal(profile, reasons, certificate)
	let PDF = bytes

	// Manipulate the PDF to apply a signature and replace the QR with correct times
	PDF = await applySignature(PDF, canvasImage)
	PDF = await replaceQR(PDF, profile)

	return PDF
}
