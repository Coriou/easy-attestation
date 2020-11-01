import React, { useRef } from "react"
import { Button } from "reactstrap"
import CanvasDraw from "react-canvas-draw"
import { useLocalStorage } from "react-use-storage"

const Signature = () => {
	const canvas = useRef(null)
	const [canvasData, setCanvasData, removeCanvasData] = useLocalStorage(
		"easyAttestsignatureData"
	)
	const [canvasImage, setCanvasImage, removeCanvasImage] = useLocalStorage(
		"easyAttestsignatureImage"
	)
	const exportImage = ({ canvas }) => {
		try {
			let canvasToExport = canvas.drawing

			let context = canvasToExport.getContext("2d")

			let width = canvasToExport.width
			let height = canvasToExport.height

			let storedImageData = context.getImageData(0, 0, width, height)
			var compositeOperation = context.globalCompositeOperation
			context.globalCompositeOperation = "destination-over"
			let imageData = canvasToExport.toDataURL(`image/png`)
			context.clearRect(0, 0, width, height)
			context.putImageData(storedImageData, 0, 0)
			context.globalCompositeOperation = compositeOperation

			return imageData
		} catch (error) {
			console.error(error)
		}
	}

	const clearSignature = () => {
		if (canvas.current) canvas.current.clear()
		removeCanvasData()
		removeCanvasImage()
	}

	return (
		<>
			<CanvasDraw
				hideGrid
				onChange={c => {
					setCanvasData(c.getSaveData())
					if (canvas.current) setCanvasImage(exportImage(canvas.current))
				}}
				lazyRadius={0}
				brushRadius={2}
				brushColor="#000"
				saveData={canvasData || `{"lines":[],"width":"100%","height":100}`}
				immediateLoading={true}
				ref={canvas}
				canvasHeight={100}
				canvasWidth="100%"
			/>
			<Button onClick={clearSignature} className="float-right">
				Effacer signature
			</Button>
		</>
	)
}

export default Signature
