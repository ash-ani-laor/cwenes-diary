import StageBox from 'src/components/GodsAsking/Protocol/StageBox'

const DivinationReadonlyView = ({ divination, onSymbolClick }) => {
  if (!divination) return null
  return (
    <div className="flex flex-col gap-4">
      <QuestionPanel
        question={divination.question}
        questionFixedTime={divination.questionFixedTime}
        tags={divination.tags}
      />
      <StageBox
        stage={divination.stage}
        symbols={divination.symbols}
        readOnly={true}
        onSymbolClick={onSymbolClick}
      />
    </div>
  )
}
export default DivinationReadonlyView
