import React from 'react';
import { Link } from 'react-router-dom';
import './landing.css';

import quizIcon from '@/assets/images/icons/quiz-icon.svg';
import calculatorIcon from '@/assets/images/icons/calculator-icon.svg';
import scannerIcon from '@/assets/images/icons/scanner-icon.png';


const LandingPage: React.FC = () => {
  return (
    <div>

      {/* Features Section */}
      
      <div className="features">
        {/* Quiz Generate */}
        <Link to='/quiz'>
          <div className="feature-box">
          <img src={quizIcon} alt="Quiz Generate Icon" />
            <h1>Quiz Generator</h1>
          </div>
        </Link>

        {/* Smart Calculator */}
        <Link to="/home"> {/* Navigate to the calculator page */}
          <div className="feature-box">
          <img src={calculatorIcon} alt="Smart Calculator Icon" />
            <h1>Smart Calculator</h1>
          </div>
        </Link>

        {/* Scanner */}
        <Link to="/ocr">
          <div className="feature-box">
          <img src={scannerIcon} alt="OCR Scanner Icon" />
            <h1>OCR Scanner</h1>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
