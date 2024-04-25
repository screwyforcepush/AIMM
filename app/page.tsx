import OpenAIAssistant from "@/app/ui/openai-assistant";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-100 to-gray-50 flex flex-col md:flex-row">
      <div className="flex-1 d-flex flex-column justify-content-center py-12 px-4 sm:px-6 lg:flex-1 lg:px-8 bg-white/95 backdrop-blur-md shadow-2xl">
        <div className="mx-auto max-w-md space-y-6">
          <div>
            <h1 className="text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-500">
              AIMM
            </h1>
            <p className="mt-2 text-center text-xl text-gray-700">
              Embark on your AI journey
            </p>
            <hr className="my-6 border-gray-300" />
            <p className="text-md text-gray-600">
              Let Aimme be your compass in navigating AI integration.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:flex-unset lg:px-8 bg-gray-200/90 backdrop-blur-md shadow-2xl">
        <div className="mx-auto max-w-4xl w-full p-8 bg-white rounded-lg border border-gray-300 shadow-lg overflow-auto transition-transform duration-300 ease-in-out hover:scale-[1.01] hover:shadow-xl">
          <OpenAIAssistant
            assistantId="asst_F0BXMk3wkyyTWBYzjonmQpTe"
            greeting={`🚀 Hello! I'm *Aimme Pointsout*, a master AI architect, strategist, and engineer.\n\nToday, I'm here to assist with a detailed assessment of your business' *AI Maturity Model* (AIMM).\n\nAre you ready to **start the assessment?** 🚀
            `}
            messageLimit={20}
          />
        </div>
      </div>
    </main>
  );
}
