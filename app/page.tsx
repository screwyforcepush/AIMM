import OpenAIAssistant from "@/app/ui/openai-assistant";


export default function Home() {
  return (
    <main>
      <div className="mx-auto mb-12 max-w-lg text-center">
        <div className="m-4">
          <h1 className="mb-4 text-5xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl">AIMM</h1>
          <div className="mb-6 text-normal font-normal text-gray-500">
            Get around it
          </div>
        </div>
        <OpenAIAssistant 
          assistantId="asst_F0BXMk3wkyyTWBYzjonmQpTe"
          greeting={`🚀 Hello! I'm *Aimme Pointsout*, a master AI architect, strategist, and engineer.\n\nToday, I'm here to assist with a detailed assessment of your business' *AI Maturity Model* (AIMM).\n\nAre you ready to **start the assessment?** 🚀
            `}
          messageLimit={20}
        />
      </div>
    </main>
  );
}
