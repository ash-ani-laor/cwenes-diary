import { QuestionPanelReadonly } from 'src/components/GodsAsking/Protocol/QuestionPanelReadonly'
import StageBoxReadonly from 'src/components/GodsAsking/Protocol/StageBoxReadonly'

const DivinationReadonlyView = ({ divination, onSymbolClick }) => {
  if (!divination) return null

  // Если symbols/links/stage хранятся внутри layout
  const symbols = divination.symbols || divination.layout?.symbols || []
  const links = divination.links || divination.layout?.links || []
  // const stage = divination.stage || divination.layout?.stage || undefined

  return (
    <div className="flex flex-col gap-4">
      <QuestionPanelReadonly
        question={divination.question}
        questionFixedTime={divination.questionFixedTime}
        tags={divination.tags}
      />
      <StageBoxReadonly symbols={symbols} links={links} />
    </div>
  )
}

export default DivinationReadonlyView
