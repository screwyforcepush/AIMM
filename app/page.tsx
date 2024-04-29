import OpenAIAssistant from "@/app/ui/openai-assistant";
import { RadarChart } from "@/app/ui/openai-assistant";

export default function Home() {
  return (
<div className="min-h-screen bg-gradient-to-r from-blue-100 to-gray-50 flex flex-col justify-between">
  <main className="flex flex-1 flex-col md:flex-row">      <div className="flex-1 d-flex flex-column justify-content-center py-12 px-4 sm:px-6 lg:flex-1 lg:px-8 bg-white/95 backdrop-blur-md shadow-2xl">
        <div className="mx-auto max-w-md space-y-6">
          <div>
            <h1 className="text-6xl font-bold leading-tight ">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600">AIM</span><span className="text-cyan-500">Me</span>
            </h1>
            <p className="mt-2 text-center text-xl text-gray-700">
              AI Maturity Model: Business Assessment
            </p>
            <hr className="my-6 border-gray-300" />
            <p className="text-md text-gray-600">
            Understanding your organization&apos;s current AI capabilities is crucial in today&apos;s tech-driven market.<br></br><br></br>Drawing upon established frameworks by industry leaders like <em>IBM</em> and <em>Accenture</em>, we offer assessment through a tailored questionnaire. This tool is designed to pinpoint your operational strengths and areas for growth in AI. 
            </p>
          </div>
          <RadarChart assessment_arr={[2,3,2,2,4,1]} business_name="Example Company" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:flex-unset lg:px-8 bg-gray-200/90 backdrop-blur-md shadow-2xl">
        <div className="mx-auto max-w-4xl w-full p-2 bg-white rounded-lg border border-gray-300 shadow-lg overflow-auto transition-transform duration-300 ease-in-out">
          <OpenAIAssistant
            assistantId="asst_F0BXMk3wkyyTWBYzjonmQpTe"
            greeting={`🚀 Hello! I'm *Aimme Pointsout*, a master AI architect, strategist, and engineer.\n\nToday, I would like to ask you a few questions and in return I will provide you with a your business' AI Maturity Model (AIMM). Are you ready to discover how AI can elevate your operations?\n\nType **'Begin'** to start the 5min assessment! Feel free to answer the questions conversationally… 🚀
            `}
            messageLimit={50}
          />
        </div>
      </div>
      </main>
      <footer className="w-full py-4 bg-gray-900 text-gray-400 text-center text-sm">
  <a href="https://www.linkedin.com/in/alexsavagedata/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-300">
    Connect on LinkedIn
  </a>
</footer>
    </div>
  );
}
