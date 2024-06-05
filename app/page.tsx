'use client'
import OpenAIAssistant from "@/app/ui/openai-assistant";
import { RadarChart } from "@/app/ui/openai-assistant";
import DataViz from '@/app/ui/dataviz';
import React, { useState } from 'react';

export default function Home() {
  const [showDataViz, toggleDataViz] = useState(false);
  const [password, setPassword] = useState('klnook');

  const handleClick = () => {
    const enteredPassword = prompt('Enter password');
    if (enteredPassword === password) {
      toggleDataViz(!showDataViz);
    } else {
      alert('Incorrect password');
    }
  };
  return (
    <div >
      <main className="min-h-screen bg-gradient-to-r from-blue-100 to-gray-50 flex flex-col justify-between">
      {!showDataViz && 
        <div className="h-full flex flex-1 flex-col md:flex-row">
          <div className="flex-1 d-flex flex-column justify-content-center py-12 px-4 sm:px-6 lg:flex-1 lg:px-8 bg-white/95 backdrop-blur-md shadow-2xl">
            <div className="mx-auto max-w-4xl space-y-6">
              <div>
                <h1 className="text-6xl font-bold leading-tight ">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600">
                    AIM
                  </span>
                  <span className="text-cyan-500">Me</span>
                </h1>
                <p className="mt-2 text-center text-xl text-gray-700">
                  AI Maturity Model: Business Assessment
                </p>
                <hr className="my-6 border-gray-300" />
                <p className="text-md text-gray-600">
                  Understanding your organization&apos;s current AI capabilities
                  is crucial in today&apos;s tech-driven market.<br></br>
                  <br></br>Drawing upon established frameworks by industry leaders
                  like <em>IBM</em> and <em>Accenture</em>, we offer assessment
                  through a tailored questionnaire. This tool is designed to
                  pinpoint your operational strengths and areas for growth in AI.
                </p>
              </div>
              <div className="flex">
                <RadarChart
                  assessment_arr={[3, 2, 3, 4, 3, 3]}
                  business_name="Example Company"
                />
                <div className="hidden lg:block relative ml-4 h-[330px] overflow-hidden">
                  {" "}
                  <p>
                    Assessment of AI Maturity Model for Example Company:<br></br>
                    <br></br>
                    <strong>Strategy and Vision:</strong> You mentioned AI is
                    strategic and well-funded in your organization, indicating a
                    clear vision and commitment. However, the actual integration
                    into production appears cautious. Stage: 3<br></br>
                    <strong>Data Management:</strong> Data quality is described as
                    just okay with notable noise, suggesting challenges in
                    leveraging data as a strategic asset fully. Stage: 2<br></br>
                    <strong>Technology and Infrastructure:</strong> You’re
                    leveraging major AIaaS and have experimented with models in
                    production, hosted on Databricks. This shows a good level of
                    technological readiness, though not yet fully optimized.
                    Stage: 3<br></br>
                    <strong>People and Culture:</strong> There is a dedicated
                    training program by AI specialists, which points to a strong
                    AI-adaptive workforce and an AI-ready culture. Stage: 4
                    <br></br>
                    Governance and Ethics: The presence of a change management
                    board suggests sound governance, though it also introduces
                    delays in AI solution delivery, indicating a focus on risk
                    management that could hinder agility. Stage: 3<br></br>
                    Performance and Scalability: Monitoring is done through
                    service provider dashboards, showing an awareness and active
                    management but perhaps not a full optimization or proprietary
                    monitoring solution in place yet. Stage: 3
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
                </div>
              </div>
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
        </div>
        
        }
        <button 
          onClick={handleClick}
          className="fixed top-0 right-0 m-4 bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white font-bold py-2 px-4 rounded z-10"
        >
          {showDataViz ? 'Aimme' : 'DataViz'}
        </button>
        {showDataViz && <DataViz />}
      </main>
      <footer className="w-full py-4 bg-gray-900 text-gray-400 text-center text-sm">
        Connect with the founders on linkedin:&nbsp;&nbsp;|&nbsp;&nbsp;
        <a
          href="https://www.linkedin.com/in/alexsavagedata/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors duration-300"
        >
          Alex
        </a>{" "}
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <a
          href="https://www.linkedin.com/in/myks/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors duration-300"
        >
          Myk
        </a>
      </footer>
    </div>
  );
}
