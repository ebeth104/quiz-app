import React, { useState, useEffect } from "react";
import { deleteQuestion, getAllQuestions } from "../../utils/QuizService";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const GetAllQuiz = () => {
  const [questions, setQuestions] = useState([
    { id: "", question: "", correctAnswers: [], choice: [] }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuestionDeleted, setIsQuestionDeleted] = useState(false);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await getAllQuestions();
      setQuestions(data);
      console.log(data)
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await deleteQuestion(id);
      setQuestions(questions.filter((question) => question.id !== id));
      setIsQuestionDeleted(true);
      setDeleteSuccessMessage("Deleted question successfully.");
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      setDeleteSuccessMessage("");
    }, 4000);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <section className="container">
      <div className="row mt-5">
        <div className="col-md-6 mb-2 md-mb-0" style={{ color: "GrayText" }}>
          <h4>All Quiz Questions</h4>
        </div>
        <div className="col-md-4 d-flex justify-content-end">
          <Link to={"/create-quiz"}>
            <FaPlus /> Add Question
          </Link>
        </div>
        <hr />
        {isQuestionDeleted && <div className="alert alert-success">{deleteSuccessMessage}</div>}
        {questions.map((question, index) => (
          <div key={question.id}>
            <pre>
              <h4 style={{ color: "GrayText" }}>
                {`${index + 1}. ${question.question}`}
              </h4>
            </pre>
            <ul>
              {question.choice?.map((choice, index) => (
                <li key={index}>{choice}</li>
              ))}
            </ul>
            <p className="text-success">
              Correct Answer(s): {question.correctAnswers}
            </p>
            <div className="btn-group mb-4">
              <Link to={`/update-quiz/${question.id}`}>
                <button className="btn btn-sm btn-outline-warning mr-2">
                  Edit Question
                </button>
              </Link>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                Delete Question
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GetAllQuiz;
