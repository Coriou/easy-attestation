import QRCode from "qrcode"

export function generateQR(text) {
	const opts = {
		errorCorrectionLevel: "M",
		type: "image/png",
		quality: 0.92,
		margin: 1,
	}
	return QRCode.toDataURL(text, opts)
}
