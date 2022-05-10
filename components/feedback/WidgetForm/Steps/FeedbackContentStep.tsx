import Image from 'next/image'
import { ArrowLeft } from 'phosphor-react'
import { FormEvent, useState } from 'react'
import { FeedbackType, feedbackTypes } from '..'
import { api } from '../../../../lib/api'
import { CloseButton } from '../../CloseButton'
import { Loading } from '../../Loading'
import { ScreenshotButton } from '../ScreenshotButton'

interface FeedbackContentStepProps {
  feedbackType: FeedbackType
  onFeedbackRestartRequested: () => void
  onFeedbackSent: () => void
}

export function FeedbackContentStep({
  feedbackType,
  onFeedbackRestartRequested,
  onFeedbackSent,
}: FeedbackContentStepProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [isSensingFeedback, setIsSensingFeedback] = useState(false)
  {
    /*avoid creating useState with loading as an name */
  }
  const feedbackTypeInfo = feedbackTypes[feedbackType]

  async function handleSubmitFeedback(event: FormEvent) {
    event.preventDefault()

    setIsSensingFeedback(true)

    await api.post('/feedbacks', {
      screenshot,
      comment,
      type: feedbackType,
    })

    setIsSensingFeedback(false)
    onFeedbackSent()
  }

  return (
    <>
      <div>
        <button
          title="Back to menu where you can select the type of feedback"
          type="button"
          className="absolute top-5 left-5 text-zinc-400 hover:text-zinc-100"
          onClick={onFeedbackRestartRequested}
        >
          <ArrowLeft weight="bold" className="h-4 w-4" />
        </button>
        <span className="flex items-center gap-2 text-xl leading-6">
          <Image
            src={feedbackTypeInfo.image.source}
            alt={feedbackTypeInfo.image.alt}
            className="h-6 w-6"
          />
          {feedbackTypeInfo.title}
        </span>
        <CloseButton />
      </div>
      <form onSubmit={handleSubmitFeedback} className="my-4 w-full">
        <textarea
          className="min-h-[112px] w-full min-w-[304px] resize-none rounded-md border-zinc-600 bg-transparent text-sm text-zinc-100 placeholder-zinc-400 scrollbar scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="Describe with details what is happening..."
          onChange={(event) => setComment(event.target.value)}
        />
        <footer className="mt-2 flex gap-2">
          <ScreenshotButton
            screenshot={screenshot}
            onScreenshotTook={setScreenshot}
          />
          <button
            type="submit"
            disabled={comment.length === 0 || isSensingFeedback}
            className="flex flex-1 items-center justify-center rounded-md border-transparent bg-brand-500 p-2 text-sm transition-colors hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-500"
          >
            {isSensingFeedback ? <Loading /> : 'Send Feedback'}
          </button>
        </footer>
      </form>
    </>
  )
}
