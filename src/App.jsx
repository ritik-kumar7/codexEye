import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './componets/Home'
import CodeReview from './componets/CodeReview'

const App = () => {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/code-review" element={<CodeReview />} />
            </Routes>
        </div>
    )
}

export default App