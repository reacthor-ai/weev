let count = 1
const features = [
  {
    id: count++,
    title: 'ChatLLM',
    content:
      'ChatLLM supercharges your chat platforms, providing instant, accurate responses that mimic human conversation, enhancing customer engagement and satisfaction.'
  },
  {
    id: count++,
    title: 'AI Agents',
    content:
      'Deploy our AI Agents to automate repetitive tasks, optimize customer interactions, and streamline operations, freeing up your team for higher-value work.'
  },
  {
    id: count++,
    title: 'Language AI',
    content:
      'Harness our Language AI to break language barriers in real-time, analyze sentiments, and power speech-driven interfaces, improving communication and accessibility.'
  },
  {
    id: count++,
    title: 'Langchain',
    content:
      'Integrate Langchain to enhance your applications with superior language understanding, enabling smarter responses and content generation tailored to user needs.'
  },
  {
    id: count++,
    title: 'Fine tuning',
    content:
      'Utilize our fine-tuning service to adapt AI models to your industry’s unique challenges, ensuring they deliver precise, context-aware insights and actions.'
  },
  {
    id: count++,
    title: 'Marketing and Sales AI',
    content:
      'Transform your marketing and sales with AI that predicts trends, personalizes campaigns, and optimizes customer journeys, significantly boosting your ROI.'
  },
  {
    id: count++,
    title: 'LlamaIndex',
    content:
      'Implement LlamaIndex for rapid, efficient data retrieval from large datasets, essential for dynamic content delivery and real-time decision-making.'
  },
  {
    id: count++,
    title: 'Embeddings',
    content:
      'Leverage our embeddings technology to analyze and process text data at scale, enabling nuanced understanding and smarter, context-driven applications.'
  }
]

export default function Features() {
  return (
    <section className="flex flex-col pb-8 items-center justify-center text-center">
      <div className="bg-[#0e0e0e] text-[#f6f6f6] p-8 rounded-lg max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="text-left">
          <h2 className="text-6xl font-bold">WHAT WE PROVIDE</h2>
          <p className="mt-6 text-lg">
            Unleash the power of ReacthorAI for your business.
          </p>
          <div className="mt-12 relative">
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map(feature => {
            return (
              <div
                key={feature.id}
                className="text-left bg-[#0d0d0d] border border-[#1b1b1b] p-6 rounded-lg space-y-4"
              >
                <DotIcon className="h-8 w-8 text-[#fbb034]" />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p>{feature.content}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function BarChartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  )
}

function DotIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12.1" cy="12.1" r="1" />
    </svg>
  )
}

function GaugeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  )
}
