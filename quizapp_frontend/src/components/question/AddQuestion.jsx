import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { createQuestion, getCategories } from '../../utils/QuizService'

const AddQuestion = () => {
	const [question, setQuestionText] = useState("")
	const [questionType, setQuestionType] = useState("single")
	const [choice, setChoice] = useState([""])
	const [correctAnswers, setCorrectAnswers] = useState([""])
	const [category, setCategory] = useState("")
	const [newCategory, setNewCategory] = useState("")
	const [categoryOptions, setCategoryOptions] = useState([""])

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

	const handleAddChoice = () => {
		const lastChoice = choice[choice.length - 1]
		const lastChoiceLetter = lastChoice ? lastChoice.charAt(0) : "A"
		const newChoiceLetter = String.fromCharCode(lastChoiceLetter.charCodeAt(0) + 1)
		const newChoice = `${newChoiceLetter}. `
		setChoice([...choice, newChoice])
	}

	const handleRemoveChoice = (index) => {
		setChoice(choice.filter((choice, i) => i !== index))
	}

	const handleChoiceChange = (index, value) => {
		setChoice(choice.map((choice, i) => (i === index ? value : choice)))
	}

	const handleCorrectAnswerChange = (index, value) => {
		setCorrectAnswers(correctAnswers.map((answer, i) => (i === index ? value : answer)))
	}

	const handleAddCorrectAnswer = () => {
		setCorrectAnswers([...correctAnswers, ""])
	}

	const handleRemoveCorrectAnswer = (index) => {
		setCorrectAnswers(correctAnswers.filter((answer, i) => i !== index))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const result = {
				question,
				questionType,
				choice,
				correctAnswers: correctAnswers.map((answer) => {
					const choiceLetter = answer.charAt(0).toUpperCase()
					const choiceIndex = choiceLetter.charCodeAt(0) - 65
					return choiceIndex >= 0 && choiceIndex < choice.length ? choiceLetter : null
				}),
                category
			}

			await createQuestion(result)

			setQuestionText("")
			setQuestionType("single")
			setChoice([""])
			setCorrectAnswers([""])
			setCategory("")
		} catch (error) {
			console.error(error)
		}
	}

	const handleAddCategory = () => {
		if (newCategory.trim() !== "") {
			setCategory(newCategory.trim())
			setCategoryOptions([...categoryOptions, newCategory.trim()])
			setNewCategory("")
		}
	}

	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-md-6  mt-5">
					<div className="card">
						<div className="card-header">
							<h5 className="card-title">Add New Question</h5>
						</div>
						<div className="card-body">
							<form onSubmit={handleSubmit} className="p-2">
								<div className="mb-3">
									<label htmlFor="category" className="form-label text-info">
										Select a Category
									</label>
									<select
										id="category"
										value={category}
										onChange={(e) => setCategory(e.target.value)}
										className="form-control">
										<option value="">Select Category</option>
										<option value={"New"}>Add New</option>
										{categoryOptions.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
									</select>
								</div>

								{category === "New" && (
									<div className="mb-3">
										<label htmlFor="new-category" className="form-label text-info">
											Add New Category
										</label>
										<input
											type="text"
											id="new-category"
											value={newCategory}
											onChange={(event) => setNewCategory(event.target.value)}
											className="form-control"
										/>
										<button
											type="button"
											onClick={handleAddCategory}
											className="btn btn-outline-primary mt-2">
											Add Category
										</button>
									</div>
								)}
								<div className="mb-3">
									<label htmlFor="question-text" className="form-label text-info">
										Question
									</label>
									<textarea
										className="form-control"
										rows={4}
										value={question}
										onChange={(e) => setQuestionText(e.target.value)}></textarea>
								</div>
								<div className="mb-3">
									<label htmlFor="question-type" className="form-label text-info">
										Question Type
									</label>
									<select
										id="question-type"
										value={questionType}
										onChange={(event) => setQuestionType(event.target.value)}
										className="form-control">
										<option value="single">Single Choice</option>
										<option value="multiple">Multiple Choices</option>
									</select>
								</div>
								<div className="mb-3">
									<label htmlFor="choices" className="form-label text-primary">
										Choices
									</label>
									{choice.map((choice, index) => (
										<div key={index} className="input-group mb-3">
											<input
												type="text"
												value={choice}
												onChange={(e) => handleChoiceChange(index, e.target.value)}
												className="form-control"
											/>
											<button
												type="button"
												onClick={() => handleRemoveChoice(index)}
												className="btn btn-outline-danger">
												Remove Choice
											</button>
										</div>
									))}
									<button
										type="button"
										onClick={handleAddChoice}
										className="btn btn-outline-primary">
										Add Choice
									</button>
								</div>
								{questionType === "single" && (
									<div className="mb-3">
										<label htmlFor="answer" className="form-label text-success">
											Correct Answer(s)
										</label>
										<input
											type="text"
											className="form-control"
											id="answer"
											value={correctAnswers[0]}
											onChange={(e) => handleCorrectAnswerChange(0, e.target.value)}
										/>
									</div>
								)}
								{questionType === "multiple" && (
									<div className="mb-3">
										<label htmlFor="answer" className="form-label text-success">
											Correct Answer(s)
										</label>
										{correctAnswers.map((answer, index) => (
											<div key={index} className="d-flex mb-2">
												<input
													type="text"
													className="form-control me-2"
													value={answer}
													onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
												/>
												{index > 0 && (
													<button
														type="button"
														className="btn btn-danger"
														onClick={() => handleRemoveCorrectAnswer(index)}>
														Remove Correct Answer
													</button>
												)}
											</div>
										))}
										<button
											type="button"
											className="btn btn-outline-info"
											onClick={handleAddCorrectAnswer}>
											Add Correct Answer
										</button>
									</div>
								)}

								{!correctAnswers.length && <p>Please enter at least one correct answer.</p>}

								<div className="btn-group">
									<button type="submit" className="btn btn-outline-success mr-2">
										Save Question
									</button>
									<Link to={"/all-quizzes"} className="btn btn-outline-primary ml-2">
										Back to existing questions
									</Link>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AddQuestion