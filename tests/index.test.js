import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { generatePdf, genTime } from "../src/utils"
import { PDFDocument } from "pdf-lib"

const certificate = readFileSync(
	join(__dirname, "../", "attestation-officielle", "src", "certificate.pdf")
)
const [creationDate, creationHour, datesortie, heuresortie] = genTime()
const profile = {
	lastname: "Dupont",
	firstname: "Camille",
	birthday: "01/01/1970",
	placeofbirth: "Paris",
	address: "99 avenue de France",
	zipcode: "75001",
	city: "Paris",
	creationDate,
	creationHour,
	datesortie,
	heuresortie,
	reasons: ["achats_culturel_cultuel", "sport_animaux"],
}
const canvasImage = `data:image/png;base64,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KzNLElmEc1b5d3U+VPHgILIWyNMVq1yykOwtzQBvrrYERwOiSYAAAQIECLwoYAaHTwIBAgQIEJhWIMmPvU3sadpXVTu3yiyqZPbHkYokP/pIEiTt3AaT/VOXT9UAftAMImtyfKDZ1iRAgAABAgQIvCAgweGDQIAAAQIEVlcgszOy5kd/20tft7e/ZD2QvG7s8r86YB5/m3iki367rRe9COqb69xHK/prPFntPDrWOhyFoBAgQIAAAQIvCUhwvGShRYAAAQIE1lHg/Bp0FkNN0iORWR99u68vrr5FlSyCerAit+kM68eqLwmJsy2/qAN8pDnIN6p9Z7OtSYAAAQIECBBY6KrveAkQIECAAIHVEMijVa+peE9X9+0kQ/qZEdUcvTxRR7y/4r6KA139QNVZt2Qr5XP14u82b0hSJbf1PNn0aRIgQIAAAQIbLmAGx4Z/AFw+AQIECGy0wIV19Vnw9OqKfgHUvs6tIYsoJ+qgWUfj5xWZmZFIwuKVSmagHKm4rHnRl6v99WZbkwABAgQIENhwAQmODf8AuHwCBAgQIDBHIEmFKypy+0tbp91vZ2ZIHpN7NuX5enNmeNzdRRIfeerLsHypOr7WdJrF0WBoEiBAgAABAue4RcWHgAABAgQIENi2QP5QkiRHZoHMiku2ceTn6j15kssfusgtLolnKg5VvLGiL9+sxhf7DTUBAgQIECBAgAABAgQIECBAYGyBJD/2VNxW8ZWKH1UkQZEZGye3EYdnvCe3u3ymQiFAgAABAgQIECBAgAABAgQILFUga3vcUfHtinsrMmNjOwmP/j1JctxeoRAgQIAAAQIECBAgQIAAAQIEJhO4vM6cBEUSHnnSynYSHgfrfQoBAgQIECCw4QIWGd3wD4DLJ0CAAAECKyZwaY3nxor9FTd08d6qd1XMK4/XjkU99WXeOfUTIECAAAECBAgQIECAAAECBLYkcH69+oMVn6/4TsXPKvpbVO6q9s0VCgECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQWLLA/wHZuR6KlZDiqQAAAABJRU5ErkJggg==`

test("Generate time", () => {
	const dateReg = /\d{2}\/\d{2}\/\d{4}/
	const timeReg = /\d{2}h\d{2}/

	expect(creationDate).toMatch(dateReg)
	expect(creationHour).toMatch(timeReg)
	expect(datesortie).toMatch(dateReg)
	expect(heuresortie).toMatch(timeReg)
})

test("Generate PDF", async () => {
	// Generate the PDF then load it back into PDF-LIB to manipulate it
	const pdf = await PDFDocument.load(
		await generatePdf(profile, profile.reasons, certificate, canvasImage)
	)

	expect(pdf instanceof PDFDocument).toEqual(true)
	expect(pdf.getPages().length).toEqual(2)

	writeFileSync(join("./", "tests", "test.pdf"), await pdf.save())
})
