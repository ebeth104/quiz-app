import React, { useEffect, useState } from 'react'
import { getCategories } from '../../utils/QuizService'
import {useNavigate}  from 'react-router-dom'

const QuizStepper = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedNumQuestions, setSelectedNumQuestions] = useState("")
    const [categories, setCategories] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetchCategoryData()
    }, [])

    const fetchCategoryData = async () => {
        try {
            const categoryData = await getCategories()
            setCategories(categoryData)
        } catch (error) {
            console.error(error)
        }
    }

    const handleNext = () => {
        if (currentStep === 3) {
            if (selectedCategory && selectedNumQuestions) {
                navigate("/take-quiz", { state: { selectedNumQuestions, selectedCategory } })
            } else {
                alert("Please select a subject and number of questions.")
            }
        } else {
            setCurrentStep((prevStep) => prevStep + 1)
        }
    }

    const handlePrevious = () => {
        setCurrentStep((prevStep) => prevStep - 1)
    }

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value)
    }

    const handleNumQuestionsChange = (event) => {
        setSelectedNumQuestions(event.target.value)
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div>
                        <h3 className="text-info mb-2">I want to take a quiz on :</h3>
                        <select
                            className="form-select"
                            value={selectedCategory}
                            onChange={handleCategoryChange}>
                            <option value="">Select a category</option>
                            {categories.map((categories) => (
                                <option key={categories} value={categories}>
                                    {categories}
                                </option>
                            ))}
                        </select>
                    </div>
                )
            case 2:
                return (
                    <div>
                        <h4 className="text-info mb-2">How many questions would you like to attempt ?</h4>
                        <input
                            type="number"
                            className="form-control"
                            value={selectedNumQuestions}
                            onChange={handleNumQuestionsChange}
                            placeholder="Enter the number of questions"
                        />
                    </div>
                )
            case 3:
                return (
                    <div>
                        <h2>Confirmation</h2>
                        <p>Category: {selectedCategory}</p>
                        <p>Number of Questions: {selectedNumQuestions}</p>
                    </div>
                )
            default:
                return null
        }
    }

    const renderProgressBar = () => {
        const progress = currentStep === 3 ? 100 : ((currentStep - 1) / 2) * 100
        return (
            <div className="progress">
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}>
                    Step {currentStep}
                </div>
            </div>
        )
    }

    return (
        <section className="mt-5">
            <h3 style={{ color: "GrayText" }} className="mb-4">
                Are you ready to take a Quiz?
            </h3>
            {renderProgressBar()}
            <div className="card">
                <div className="card-body">
                    {renderStepContent()}
                    <div className="d-flex justify-content-between mt-4">
                        {currentStep > 1 && (
                            <button className="btn btn-primary" onClick={handlePrevious}>
                                Previous
                            </button>
                        )}
                        {currentStep < 3 && (
                            <button
                                className="btn btn-primary"
                                onClick={handleNext}
                                disabled={
                                    (currentStep === 1 && !selectedCategory) ||
                                    (currentStep === 2 && !selectedNumQuestions)
                                }>
                                Next
                            </button>
                        )}
                        {currentStep === 3 && (
                            <button className="btn btn-success" onClick={handleNext}>
                                Start Quiz
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default QuizStepper