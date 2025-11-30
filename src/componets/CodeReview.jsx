import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';
import { GoogleGenAI } from "@google/genai";
import Editor from '@monaco-editor/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    BugAntIcon,
    WrenchScrewdriverIcon,
    ClipboardDocumentIcon,
    CheckIcon,
    SparklesIcon,
    ShieldCheckIcon,
    PaperAirplaneIcon,
    XMarkIcon,
    PlayIcon
} from '@heroicons/react/24/outline';
import './Css/CodeReview.css';

const CodeReview = () => {
    const [code, setCode] = useState(`//Write your code here...

function authenticateUser(username, password) {
   if (username && password) {
        const query = "SELECT * FROM users WHERE username='" + username + "'";
        return executeQuery(query);
    }
    return false;
}`);
    const [language, setLanguage] = useState("javascript");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState("");
    const [showInteraction, setShowInteraction] = useState(false);
    const [userQuery, setUserQuery] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [fixedCode, setFixedCode] = useState("");
    const [copied, setCopied] = useState(false);
    const [codeOutput, setCodeOutput] = useState("");
    const [fixLoading, setFixLoading] = useState(false);
    const fixedCodeRef = useRef(null);

    const apiKey = import.meta.env.VITE_API_KEY;


    const handleReview = async () => {
        if (!apiKey) {
            alert("Please add your API key");
            return;
        }
        setLoading(true);
        setResponse("");
        setFixedCode("");
        setChatHistory([]);
        setShowInteraction(false);
        try {
            const genAI = new GoogleGenAI({
                apiKey: apiKey,
                dangerouslyAllowBrowser: true,
                apiVersion: 'v1'
            });
            const prompt = `Review this ${language} code for security, performance, and best practices:\n\n${code}`;
            const result = await genAI.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt
            });
            const text = result.text;
            setResponse(text);
            setShowInteraction(true);
        } catch (error) {
            console.error('Review error:', error);
            setResponse(`Error: ${error.message || 'Failed to generate review'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleInteraction = async () => {
        if (!userQuery.trim() || !apiKey) return;

        const currentQuery = userQuery;
        setUserQuery("");

        // Add user message to chat history
        setChatHistory(prev => [...prev, { type: 'user', message: currentQuery }]);
        setLoading(true);

        try {
            const genAI = new GoogleGenAI({
                apiKey: apiKey,
                dangerouslyAllowBrowser: true,
                apiVersion: 'v1'
            });
            const prompt = `Code: ${code}\nPrevious Review: ${response}\nQuestion: ${currentQuery}`;
            const result = await genAI.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt
            });
            const text = result.text;

            // Add AI response to chat history
            setChatHistory(prev => [...prev, { type: 'ai', message: text }]);
        } catch (error) {
            console.error('Interaction error:', error);
            setChatHistory(prev => [...prev, { type: 'ai', message: 'Error: Failed to get response' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleFixCode = async () => {
        if (!apiKey) return;
        setFixLoading(true);
        try {
            const genAI = new GoogleGenAI({
                apiKey: apiKey,
                dangerouslyAllowBrowser: true,
                apiVersion: 'v1'
            });
            const prompt = `Fix this ${language} code:\n${code}\nReturn only the corrected code.`;
            const result = await genAI.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt
            });
            let text = result.text;
            text = text.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
            setFixedCode(text);
            setTimeout(() => {
                if (fixedCodeRef.current) {
                    fixedCodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 100);
        } catch (error) {
            console.error('Fix code error:', error);
            setFixedCode("// Error generating fixed code");
        } finally {
            setFixLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(fixedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const applyToEditor = () => {
        setCode(fixedCode);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRunCode = async () => {
        setCodeOutput('Running code...');

        try {
            if (language === 'javascript') {
                // Local JavaScript execution
                let output = '';
                const originalLog = console.log;

                console.log = (...args) => {
                    output += args.map(arg =>
                        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                    ).join(' ') + '\n';
                };

                try {
                    const result = new Function(code)();
                    console.log = originalLog;

                    if (output.trim()) {
                        setCodeOutput(output.trim());
                    } else if (result !== undefined) {
                        setCodeOutput('Return value: ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)));
                    } else {
                        setCodeOutput('Code executed successfully (no output)');
                    }
                } catch (execError) {
                    console.log = originalLog;
                    setCodeOutput('Runtime Error: ' + execError.message);
                }
            } else {
                // Use free Piston API for other languages
                const languageMap = {
                    python: 'python',
                    java: 'java',
                    cpp: 'cpp',
                    csharp: 'csharp'
                };

                const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        language: languageMap[language] || language,
                        version: '*',
                        files: [{
                            content: code
                        }]
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    const output = result.run?.stdout || result.run?.stderr || 'No output';
                    setCodeOutput(output);
                } else {
                    setCodeOutput(`Error: Failed to execute ${language} code`);
                }
            }
        } catch (error) {
            setCodeOutput('Error: ' + error.message);
        }
    };

    return (
        <div className="code-review-page">
            <Navbar />
            <div className="main-content">
                <div className="editor-section">
                    <div className="toolbar">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="language-select"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                            <option value="csharp">C#</option>
                        </select>
                        <div className="actions">
                            <button onClick={handleReview} disabled={loading} className="btn-primary">
                                {loading ? (
                                    <>
                                        <SparklesIcon className="icon animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <BugAntIcon className="icon" />
                                        Review Code
                                    </>
                                )}
                            </button>
                            <button onClick={handleRunCode} className="btn-secondary">
                                <PlayIcon className="icon" />
                                Run Code
                            </button>
                            {response && (
                                <button onClick={handleFixCode} disabled={fixLoading} className="btn-secondary">
                                    {fixLoading ? (
                                        <>
                                            <SparklesIcon className="icon animate-spin" />
                                            Fixing...
                                        </>
                                    ) : (
                                        <>
                                            <WrenchScrewdriverIcon className="icon" />
                                            Fix Code
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="editor-container">
                        <Editor
                            height="70vh"
                            defaultLanguage="javascript"
                            language={language}
                            value={code}
                            theme="vs-dark"
                            onChange={(value) => setCode(value)}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                        />
                    </div>
                </div>

                {codeOutput && (
                    <div className="code-output-box">
                        <div className="output-header">
                            <span>Code Output</span>
                            <button onClick={() => setCodeOutput("")} className="close-output-btn">
                                <XMarkIcon className="icon" />
                            </button>
                        </div>
                        <div className="output-content">
                            <pre>{codeOutput}</pre>
                        </div>
                    </div>
                )}

                <div className="output-section">
                    {loading && !response ? (
                        <div className="skeleton-loader">
                            <div className="loading-indicator">
                                <SparklesIcon className="loading-spinner" />
                                <span>Analyzing code...</span>
                            </div>
                            <div className="skeleton-header">
                                <div className="skeleton-icon"></div>
                                <div className="skeleton-title"></div>
                            </div>
                            <div className="skeleton-content">
                                <div className="skeleton-line long"></div>
                                <div className="skeleton-line medium"></div>
                                <div className="skeleton-line short"></div>
                                <div className="skeleton-line long"></div>
                                <div className="skeleton-line medium"></div>
                            </div>
                        </div>
                    ) : response ? (
                        <>
                            <div className="response-container">
                                <div className="review-header">
                                    <div className="header-left">
                                        <ShieldCheckIcon className="icon" />
                                        <span>AI Code Review</span>
                                    </div>
                                    <div className="review-stats">
                                        <span className="stat-badge">✨ Analysis Complete</span>
                                    </div>
                                </div>
                                <div className="markdown-body">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ node, inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '');
                                                if (!inline && match) {
                                                    const codeString = String(children).replace(/\n$/, '');
                                                    return (
                                                        <div className="code-block-wrapper">
                                                            <div className="code-block-header">
                                                                <span className="code-language">{match[1]}</span>
                                                                <div className="code-actions">
                                                                    <button
                                                                        onClick={() => {
                                                                            setCode(codeString);
                                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                        }}
                                                                        className="code-action-btn apply"
                                                                    >
                                                                        <WrenchScrewdriverIcon className="icon" />
                                                                        Apply to Editor
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(codeString);
                                                                        }}
                                                                        className="code-action-btn copy"
                                                                    >
                                                                        <ClipboardDocumentIcon className="icon" />
                                                                        Copy
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <SyntaxHighlighter
                                                                style={vscDarkPlus}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                customStyle={{ margin: 0, borderRadius: '0 0 8px 8px' }}
                                                                {...props}
                                                            >
                                                                {codeString}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            }
                                        }}
                                    >
                                        {response}
                                    </ReactMarkdown>
                                </div>

                                {fixedCode && (
                                    <div ref={fixedCodeRef} className="fixed-code-box">
                                        <div className="box-header">
                                            <span>Fixed Code</span>
                                            <div className="header-actions">
                                                <button onClick={applyToEditor} className="apply-btn">
                                                    <WrenchScrewdriverIcon className="icon" />
                                                    Apply to Editor
                                                </button>
                                                <button onClick={copyToClipboard} className="copy-btn">
                                                    {copied ? <CheckIcon className="icon" /> : <ClipboardDocumentIcon className="icon" />}
                                                    {copied ? "Copied!" : "Copy"}
                                                </button>
                                            </div>
                                        </div>
                                        <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ margin: 0, borderRadius: '0 0 8px 8px' }}>
                                            {fixedCode}
                                        </SyntaxHighlighter>
                                    </div>
                                )}
                            </div>

                            {showInteraction && (
                                <div className="interaction-box">
                                    <div className="interaction-header">
                                        <span>Ask Follow-up Questions</span>
                                        <button
                                            onClick={() => {
                                                setShowInteraction(false);
                                                setChatHistory([]);
                                            }}
                                            className="close-chat-btn"
                                        >
                                            <XMarkIcon className="icon" />
                                        </button>
                                    </div>

                                    {(chatHistory.length > 0 || loading) && (
                                        <div className="chat-history">
                                            {chatHistory.map((chat, index) => (
                                                <div key={index} className={`chat-message ${chat.type}`}>
                                                    <div className="message-content">
                                                        {chat.type === 'user' ? (
                                                            <p>{chat.message}</p>
                                                        ) : (
                                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                {chat.message}
                                                            </ReactMarkdown>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {loading && (
                                                <div className="chat-message ai">
                                                    <div className="message-content loading">
                                                        <div className="typing-indicator">
                                                            <span></span>
                                                            <span></span>
                                                            <span></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="interaction-input">
                                        <input
                                            type="text"
                                            placeholder="Ask about the code..."
                                            value={userQuery}
                                            onChange={(e) => setUserQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && !loading && userQuery.trim() && handleInteraction()}
                                        />
                                        <button
                                            onClick={handleInteraction}
                                            disabled={loading || !userQuery.trim()}
                                            className="send-btn"
                                        >
                                            <PaperAirplaneIcon className="icon" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="placeholder-state">
                            <div className="placeholder-icon">
                                <SparklesIcon className="large-icon" />
                            </div>
                            <h3>Ready for Code Review</h3>
                            <p>Click "Review Code" to get AI-powered analysis</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CodeReview;