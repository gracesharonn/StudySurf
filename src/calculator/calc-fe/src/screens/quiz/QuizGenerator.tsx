import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './quiz.css';

const QuizGenerator = () => {
  const [textContent, setTextContent] = useState('');
  const [quizLevel, setQuizLevel] = useState('easy');
  const [quiz, setQuiz] = useState<any>(null);
  const [correctAnswers, setCorrectAnswers] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleGenerateQuiz = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8900/quiz/generate', {
        text_content: textContent,
        quiz_level: quizLevel,
      });

      setQuiz(response.data.quiz);
      setCorrectAnswers(response.data.correct_answers); // Ensure the API sends the correct answers.
      setResult(null); // Reset the result when a new quiz is generated.
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = () => {
    if (!correctAnswers) return;

    let score = 0;
    Object.keys(correctAnswers).forEach((key) => {
      if (correctAnswers[key] === 'correct') {
        score += 1;
      }
    });

    setResult(score);
  };

  return (
    <div className="quiz-generator">
      {/* Back Button */}
      <button className='back-button' onClick={() => navigate('/')}>Back</button>

      <h1>Quiz Generator</h1>
      <textarea
        placeholder="Paste the content here"
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
      />
      <select value={quizLevel} onChange={(e) => setQuizLevel(e.target.value)}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <button className='generate-btn' onClick={handleGenerateQuiz} disabled={loading}>
        Generate Quiz
      </button>

      {loading && <p>Generating quiz...</p>}

      {quiz && (
        <div className="quiz-questions">
          <h2>Generated Quiz:</h2>
          {quiz.split("\n").map((question: string, index: number) => {
            return (
              <div key={index} className="quiz-question">
                <p>{question}</p>
                {/* Replace with dynamic API options */}
                <div className="quiz-option">{`Option A`}</div>
                <div className="quiz-option">{`Option B`}</div>
                <div className="quiz-option">{`Option C`}</div>
                <div className="quiz-option">{`Option D`}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;
