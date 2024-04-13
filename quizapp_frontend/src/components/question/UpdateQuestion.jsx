import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getQuestionById, updateQuestion, getCategories } from "../../utils/QuizService"

const UpdateQuestion = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const [category, setCategory] = useState("")
	const [categoryOptions, setCategoryOptions] = useState([""])
	const [questionType, setQuestionType] = useState("")
	const [question, setQuestion] = useState("")
	const [choice, setChoice] = useState([""])
	const [correctAnswers, setCorrectAnswers] = useState("")
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		fetchQuestion()
	}, [])

	const fetchQuestion = async () => {
		try {
			const questionToUpdate = await getQuestionById(id)
			if (questionToUpdate) {
				setCategory(questionToUpdate.category)
				setQuestionType(questionToUpdate.questionType)
				setQuestion(questionToUpdate.question)
				setChoice(questionToUpdate.choice)
				setCorrectAnswers(questionToUpdate.correctAnswers)
			}
			setIsLoading(false)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		fetchCategories()
	}, [])

	const fetchCategories = async () => {
		try {
			const categoryData = await getCategories()
			setCategoryOptions(categoryData)
		} catch (error) {
			console.error(error)
		}
	}

	const handleQuestionChange = (e) => {
		setQuestion(e.target.value)
	}

	const handleChoiceChange = (index, e) => {
		const updatedChoices = [...choice]
		updatedChoices[index] = e.target.value
		setChoice(updatedChoices)
	}

	const handleCorrectAnswerChange = (e) => {
		setCorrectAnswers(e.target.value)
	}

	const handleUpdate = async (e) => {
		e.preventDefault()
		try {
			const updatedQuestion = {
				questionType,
				category,
				question,
				choice,
				correctAnswers: correctAnswers
					.toString()
					.split(",")
					.map((answer) => answer.trim())
			}
			await updateQuestion(id, updatedQuestion)
			navigate("/all-quizzes")
		} catch (error) {
			console.error(error)
		}
	}

	if (isLoading) {
		return <p>Loading...</p>
	}

	return (
		<div className="container">
			<h4 className="mt-5" style={{ color: "GrayText" }}>
				Update Quiz Question
			</h4>
			<div className="col-8">
				<form onSubmit={handleUpdate}>
					<div className="form-group">
						<label className="form-label text-info">Question Type</label>
						<select
							id="question-type"
							value={questionType}
							onChange={(event) => setQuestionType(event.target.value)}
							className="form-control">
							<option value="single">Single Choice</option>
							<option value="multiple">Multiple Choices</option>
						</select>
						<label className="form-label text-info">Category</label>
						<select
							id="category"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="form-control">
							<option value="">Select Category</option>
							{categoryOptions.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
						<label className="text-info">Question:</label>
						<textarea
							className="form-control"
							rows={4}
							value={question}
							onChange={handleQuestionChange}>
                        </textarea>
					</div>

					<div className="form-group">
						<label className="text-info">Choices:</label>
						{choice?.map((choice, index) => (
							<input
								key={index}
								type="text"
								className="form-control mb-4"
								value={choice}
								onChange={(e) => handleChoiceChange(index, e)}
							/>
						))}
					</div>

					<div className="form-group">
						<label className="text-info">Correct Answer(s):</label>
						<input
							type="text"
							className="form-control mb-4"
							value={correctAnswers}
							onChange={handleCorrectAnswerChange}
						/>
					</div>

					<div className="btn-group">
						<button type="submit" className="btn btn-sm btn-outline-warning">
							Update question
						</button>
						<Link to={"/all-quizzes"} className="btn btn-outline-primary ml-2">
							Back to all questions
						</Link>
					</div>
				</form>
			</div>
		</div>
	)
}

export default UpdateQuestion