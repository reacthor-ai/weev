interface AgentCardProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>> // This type allows you to pass an SVG icon component
  title: string
  subtitle: string
}

export const AgentCard: React.FC<AgentCardProps> = ({
  icon: Icon,
  title,
  subtitle
}) => {
  return (
    <div className="flex flex-col text-center items-center cursor-pointer">
      <div className="flex flex-col items-center space-y-2 p-3 bg-[#27272a] rounded-xl">
        <div className="flex items-center justify-center w-6 h-6 bg-[#17171c] rounded-md">
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="text-center mt-2">
        <p className="text-sm font-medium text-white">
          {title}
          <br />
          {subtitle}
        </p>
      </div>
    </div>
  )
}
