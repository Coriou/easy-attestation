import { generateQR } from "./qr"
import { PDFDocument, StandardFonts } from "pdf-lib"

const ys = {
	travail: 578,
	achats: 533,
	sante: 477,
	famille: 435,
	handicap: 396,
	sport_animaux: 358,
	convocation: 295,
	missions: 255,
	enfants: 211,
}

export async function generatePdf(profile, reasons, pdfBase, canvasImage) {
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

	const {
		lastname,
		firstname,
		birthday,
		placeofbirth,
		address,
		zipcode,
		city,
		// datesortie,
		// heuresortie,
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

	const existingPdfBytes = pdfBase

	const pdfDoc = await PDFDocument.load(existingPdfBytes)

	// set pdf metadata
	pdfDoc.setTitle("COVID-19 - Déclaration de déplacement")
	pdfDoc.setSubject("Attestation de déplacement dérogatoire")
	pdfDoc.setKeywords([
		"covid19",
		"covid-19",
		"attestation",
		"déclaration",
		"déplacement",
		"officielle",
		"gouvernement",
	])
	pdfDoc.setProducer("DNUM/SDIT")
	pdfDoc.setCreator("")
	pdfDoc.setAuthor("Ministère de l'intérieur")

	const page1 = pdfDoc.getPages()[0]

	const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
	const drawText = (text, x, y, size = 11) => {
		page1.drawText(text, { x, y, size, font })
	}

	drawText(`${firstname} ${lastname}`, 119, 696)
	drawText(birthday, 119, 674)
	drawText(placeofbirth, 297, 674)
	drawText(`${address} ${zipcode} ${city}`, 133, 652)

	reasons.split(", ").forEach(reason => {
		drawText("x", 84, ys[reason], 18)
	})

	let locationSize = getIdealFontSize(font, profile.city, 83, 7, 11)

	if (!locationSize) {
		alert(
			"Le nom de la ville risque de ne pas être affiché correctement en raison de sa longueur. " +
				'Essayez d\'utiliser des abréviations ("Saint" en "St." par exemple) quand cela est possible.'
		)
		locationSize = 7
	}

	drawText(city, 105, 177, locationSize)
	drawText(`${datesortie}`, 91, 153, 11)
	drawText(`${heuresortie}`, 264, 153, 11)

	const generatedQR = await generateQR(data)

	const qrImage = await pdfDoc.embedPng(generatedQR)

	page1.drawImage(qrImage, {
		x: page1.getWidth() - 156,
		y: 100,
		width: 92,
		height: 92,
	})

	if (canvasImage) {
		const signature = await pdfDoc.embedPng(canvasImage)
		page1.drawImage(signature, {
			x: 125,
			y: 100,
			width: 200,
			height: 25,
		})
	}

	pdfDoc.addPage()
	const page2 = pdfDoc.getPages()[1]
	page2.drawImage(qrImage, {
		x: 50,
		y: page2.getHeight() - 350,
		width: 300,
		height: 300,
	})

	const pdfBytes = await pdfDoc.save()

	return pdfBytes
}

function getIdealFontSize(font, text, maxWidth, minSize, defaultSize) {
	let currentSize = defaultSize
	let textWidth = font.widthOfTextAtSize(text, defaultSize)

	while (textWidth > maxWidth && currentSize > minSize) {
		textWidth = font.widthOfTextAtSize(text, --currentSize)
	}

	return textWidth > maxWidth ? null : currentSize
}
