import React from 'react';
import './Css/HeroSection.css';
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();
    const handleGetStarted = () => {
        navigate('/code-review');

    }
    return (
        <div className="hero-section">
            <div className="hero-content">
                <div className="badge">
                    <SparklesIcon className="badge-icon" />
                    <span>AI-Powered Code Analysis</span>
                </div>
                <h1>Elevate Your Code Quality with <span className="gradient-text">CodexEye</span></h1>
                <p>
                    Instant, intelligent code reviews powered by advanced AI.
                    Detect bugs, optimize performance, and learn best practices in real-time.
                </p>
                <div className="hero-actions">
                    <button onClick={handleGetStarted} className="btn-hero-primary">
                        Get Started <ArrowRightIcon className="icon-sm" />
                    </button>
                    {/* <button className="btn-hero-secondary">View Demo</button> */}
                </div>
            </div>
            <div className="hero-visual">
                <div className="code-card">
                    <div className="card-header">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                    </div>
                    <div className="card-body">
                        <div className="line"><span className="keyword">function</span> <span className="function">optimize</span>(code) {'{'}</div>
                        <div className="line indent">  <span className="keyword">return</span> <span className="variable">AI</span>.<span className="method">analyze</span>(code);</div>
                        <div className="line">{'}'}</div>
                        <div className="line comment">// AI: Optimization complete. 🚀</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroSection;