# 🤖 CodeRevier - AI-Powered Code Review Assistant

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

CodeRevier is a modern, intelligent code review and optimization tool powered by Google's Gemini AI. It helps developers analyze, debug, and optimize their code in real-time with a beautiful, developer-friendly interface.

## ✨ Features

- **🤖 AI Code Analysis**: Get instant feedback on security, performance, and best practices.
- **🛠️ Auto-Fix**: Automatically generate corrected code snippets to fix bugs and improve quality.
- **💬 Interactive Chat**: Ask follow-up questions about your code and get context-aware answers.
- **💻 Smart Editor**: Built-in Monaco Editor (VS Code like) with syntax highlighting for multiple languages.
- **▶️ Code Execution**: Run JavaScript locally and execute Python, Java, C++, and C# via Piston API.
- **📱 Mobile Responsive**: Fully optimized for mobile devices with smooth touch scrolling.
- **🎨 Modern UI**: Sleek, dark-themed interface with glassmorphism effects and smooth animations.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: TailwindCSS & Custom CSS
- **AI Engine**: Google Gemini (via `@google/generative-ai`)
- **Code Editor**: `@monaco-editor/react`
- **Syntax Highlighting**: `react-syntax-highlighter`
- **Markdown Rendering**: `react-markdown` & `remark-gfm`
- **Icons**: Heroicons

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ritik-kumar7/codexEye.git
   cd codexEye
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add your API key:
   ```env
   VITE_API_KEY=your_google_gemini_api_key_here
   ```
   > **Note:** Do not wrap your API key in quotes.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   Visit `http://localhost:5173` to see the app in action.

## 📖 Usage

1. **Select Language**: Choose your programming language from the dropdown (JS, Python, Java, etc.).
2. **Write/Paste Code**: Enter your code in the editor.
3. **Review**: Click **"Review Code"** to get a detailed analysis.
4. **Fix**: If issues are found, click **"Fix Code"** to get an AI-corrected version.
5. **Run**: Click **"Run Code"** to execute the code and see the output.
6. **Chat**: Use the chat interface at the bottom to ask specific questions about the code.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ 
