type PromptDisplayProps = {
  elements: any[]
  variables: any
}

export const PromptDisplay = ({ elements, variables }: PromptDisplayProps) => {
  const generateJSON = () => {
    const messages = elements.map(el => {
      if (el.type === 'message') {
        return [el.value.role, el.value.text]
      }
      if (el.type === 'placeholder') {
        return { placeholder: el.value }
      }
      return null
    })

    return {
      messages,
      variables: {
        ...variables
      }
    }
  }

  const jsonOutput = generateJSON()

  return (
    <div>
      <h2 className="text-lg font-medium">Generated JSON</h2>
      <pre className="bg-black text-white p-4 rounded-lg">
        {JSON.stringify(jsonOutput, null, 2)}
      </pre>
    </div>
  )
}
