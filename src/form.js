import React, { cloneElement, memo } from "react"
import {
	Container,
	Row,
	Col,
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	FormText,
} from "reactstrap"
import Joi from "joi"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import Cleave from "cleave.js/react"
import { useLocalStorage } from "react-use-storage"
import Signature from "./signature"

const schema = Joi.object({
	prenom: Joi.string().min(3).required(),
	nom: Joi.string().min(3).required(),
	dateNaissance: Joi.string().min(10).max(10).required(),
	lieuNaissance: Joi.string().min(3).required(),
	adresse: Joi.string().min(3).required(),
	ville: Joi.string().min(3).required(),
	codePostal: Joi.string().regex(/^\d+$/).min(5).max(5).required(),
})

const FormInput = memo(
	({
		name,
		displayName,
		placeholder,
		type = "text",
		children,
		errors,
		register,
	}) => {
		// Display help or error message
		const helpOrError = (key, placeholder) => {
			let message = ""

			if (errors[key]) {
				const error = errors[key]
				if (error.type === "string.empty" || error.type === "any.required")
					message = "Ce champ est requis"
				else if (error.type === "string.max") message = "Trop long"
				else if (error.type === "string.min") message = "Trop court"
				else if (error.type === "any.only") message = "Valeur interdite"
				else message = "Mauvais format"
			}

			return message ? (
				<FormText color="danger">{message}</FormText>
			) : (
				<FormText color="secondary">
					<b>Exemple</b>: {placeholder}
				</FormText>
			)
		}

		return (
			<FormGroup>
				<Label for={name}>{displayName}</Label>
				{children ? (
					cloneElement(children, {
						type: type,
						name: name,
						id: name,
						key: `formInput_${name}`,
						placeholder: placeholder,
						htmlRef: register,
						autoComplete: "off",
					})
				) : (
					<Input
						type={type}
						name={name}
						id={name}
						key={`formInput_${name}`}
						placeholder={placeholder}
						innerRef={register}
						autoComplete="off"
					/>
				)}
				{helpOrError(name, placeholder)}
			</FormGroup>
		)
	}
)

const ProfilForm = () => {
	const [formData, setFormData] = useLocalStorage("easyAttestformData")
	const { register, handleSubmit, errors, getValues } = useForm({
		mode: "onSubmit",
		reValidateMode: "onSubmit",
		defaultValues: formData,
		resolver: joiResolver(schema),
	})

	// Handle form submit
	const onSubmit = data => {
		setFormData(data)
		return false
	}

	return (
		<Container>
			<Form
				onSubmit={handleSubmit(wtv => {
					setFormData(Object.assign({}, formData, getValues()))
					onSubmit(wtv)
				})}
				autoComplete="off"
			>
				<Row>
					<Col>
						<FormInput
							name="prenom"
							displayName="Prénom"
							placeholder="Camille"
							register={register}
							errors={errors}
						/>

						<FormInput
							name="nom"
							displayName="Nom"
							placeholder="Dupont"
							register={register}
							errors={errors}
						/>
					</Col>

					<Col>
						<FormInput
							name="dateNaissance"
							displayName="Date de naissance"
							placeholder="01/01/1970"
							register={register}
							errors={errors}
						>
							<Cleave
								options={{
									blocks: [2, 2, 4],
									delimiter: "/",
									numericOnly: true,
								}}
								className="form-control"
								value={formData?.["dateNaissance"]}
							/>
						</FormInput>

						<FormInput
							name="lieuNaissance"
							displayName="Lieu de naissance"
							placeholder="Paris"
							register={register}
							errors={errors}
						/>
					</Col>
				</Row>

				<Row>
					<Col>
						<FormInput
							name="adresse"
							displayName="Adresse"
							placeholder="99 avenue de France"
							register={register}
							errors={errors}
						/>

						<FormInput
							name="ville"
							displayName="Ville"
							placeholder="Paris"
							register={register}
							errors={errors}
						/>

						<FormInput
							name="codePostal"
							displayName="Code postal"
							placeholder="75001"
							register={register}
							errors={errors}
						/>
					</Col>
				</Row>

				<Row>
					<Col>
						<Label>Signature</Label>
						<Signature />
					</Col>
				</Row>

				<Row>
					<Col>
						<Button type="submit" color="primary" className="mt-4">
							GÉNÉRER ATTESTATION
						</Button>
					</Col>
				</Row>
			</Form>
		</Container>
	)
}

export default ProfilForm
