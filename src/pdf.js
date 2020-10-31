import React, { useEffect, useState } from "react"
import { generatePdf } from "./utils"
import { Document, Page } from "react-pdf/dist/esm/entry.parcel"
import { useLocalStorage } from "react-use-storage"
import certificate from "./certificate.pdf"

const PDF = () => {
	const [pdf, setPDF] = useState({ blob: false, bytes: false })
	const [formData] = useLocalStorage("easyAttestformData")
	const [canvasImage] = useLocalStorage("easyAttestsignatureImage")

	useEffect(() => {
		genCertificate(formData, canvasImage)
	}, [formData, canvasImage])

	const genCertificate = (formData, canvasImage) => {
		const profile = {
			lastname: formData?.nom || "",
			firstname: formData?.prenom || "",
			birthday: formData?.dateNaissance || "",
			placeofbirth: formData?.lieuNaissance || "",
			address: formData?.adresse || "",
			zipcode: formData?.codePostal || "",
			city: formData?.ville || "",
		}

		generatePdf(profile, "achats", certificate, canvasImage)
			.then(([bytes, blob]) => {
				blob = window.URL.createObjectURL(blob)
				setPDF({ bytes, blob })
			})
			.catch(console.error)
	}

	return (
		<>
			{pdf.bytes && (
				<a href={pdf.blob} className="btn btn-primary" target="_blank">
					Télécharger
				</a>
			)}

			{pdf.bytes && (
				<Document file={{ data: pdf.bytes }}>
					<Page pageNumber={1} />
					<Page pageNumber={2} />
				</Document>
			)}
		</>
	)
}

export default PDF
