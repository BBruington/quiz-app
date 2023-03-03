import { useState } from "react";
import ReactMarkdown from "react-markdown"


export default function CardBuilder() {

  const [currentCard, setCurrentCard] = useState({
    question: null,
    answer: null,
  });
  const [cardSet, setCardSet] = useState([]);

  const addNote = () => {

    cardSet.push(currentCard);
    setCurrentCard({
      question: null,
      answer: null,
    })
  }

  const editQuestion = (event) => {
    setCurrentCard({
      question: event.target.value,
      answer: currentCard.answer,  
  })}

  const editAnswer = (event) => {
    setCurrentCard({
      question: currentCard.question,
      answer: event.target.value,  
  })}

  return (
    <div className="flex w-full">

      {/* Note Card Builder */}

      <main className="flex flex-col items-center w-full">
        <div className="flex flex-col mt-10 w-4/6 items-center">
          <span className="text-sm my-2">Insert your question:</span>
          <textarea id="question"
            onChange={editQuestion}
            className="flex mb-4 p-2 w-full h-30vh border border-black" type="text">
          </textarea>
        </div>
        <div className="flex flex-col mt-10 w-4/6 items-center">
          <span className="text-sm my-2">Insert your answer:</span>
          <textarea 
            onChange={editAnswer}
            className="flex mb-4 p-2 w-full h-80 border border-black" type="text"></textarea>
        </div>

      </main>

      {/* display note */}

      <div className="flex flex-col">
        <button onClick={addNote}>Add your notecard</button>
        <span>Here is your note card</span>
        <span>{currentCard.question} current card here</span>
        <span>{currentCard.answer} current card here</span>
        {cardSet.length > 0  && cardSet.map((card) => (
          <div className="flex flex-col" key={card.question}>
            <span>card set question: {card.question}</span>
            <span>card set answer: {card.answer}</span>
          </div>
        ))}
      </div>
    </div>
  )
}