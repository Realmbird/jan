import { activeBotAtom } from '@/_helpers/atoms/Bot.atom'
import { useAtomValue } from 'jotai'
import React, { useEffect, useState } from 'react'
import ExpandableHeader from '../ExpandableHeader'
import { useDebouncedCallback } from 'use-debounce'
import useUpdateBot from '@/_hooks/useUpdateBot'
import ProgressSetting from '../ProgressSetting'
import { set } from 'react-hook-form'

const delayBeforeUpdateInMs = 1000

const BotSetting: React.FC = () => {
  const activeBot = useAtomValue(activeBotAtom)
  const [temperature, setTemperature] = useState(0)
  const [maxTokens, setMaxTokens] = useState(0)
  const [frequencyPenalty, setFrequencyPenalty] = useState(0)
  const [presencePenalty, setPresencePenalty] = useState(0)

  useEffect(() => {
    if (!activeBot) return
    setMaxTokens(activeBot.maxTokens ?? 0)
    setTemperature(activeBot.customTemperature ?? 0)
    setFrequencyPenalty(activeBot.frequencyPenalty ?? 0)
    setPresencePenalty(activeBot.presencePenalty ?? 0)
  }, [activeBot?._id])

  const { updateBot } = useUpdateBot()

  const debouncedTemperature = useDebouncedCallback((value) => {
    if (!activeBot) return
    if (activeBot.customTemperature === value) return
    updateBot(activeBot, { customTemperature: value })
  }, delayBeforeUpdateInMs)

  const debouncedMaxToken = useDebouncedCallback((value) => {
    if (!activeBot) return
    if (activeBot.maxTokens === value) return
    updateBot(activeBot, { maxTokens: value })
  }, delayBeforeUpdateInMs)

  const debouncedFreqPenalty = useDebouncedCallback((value) => {
    if (!activeBot) return
    if (activeBot.frequencyPenalty === value) return
    updateBot(activeBot, { frequencyPenalty: value })
  }, delayBeforeUpdateInMs)

  const debouncedPresencePenalty = useDebouncedCallback((value) => {
    if (!activeBot) return
    if (activeBot.presencePenalty === value) return
    updateBot(activeBot, { presencePenalty: value })
  }, delayBeforeUpdateInMs)

  const debouncedSystemPrompt = useDebouncedCallback((value) => {
    if (!activeBot) return
    if (activeBot.systemPrompt === value) return
    updateBot(activeBot, { systemPrompt: value })
  }, delayBeforeUpdateInMs)

  if (!activeBot) return null

  return (
    <div className="my-3 flex flex-col">
      <ExpandableHeader
        title="BOT SETTINGS"
        expanded={true}
        onClick={() => {}}
      />

      <div className="mx-2 mt-3 flex flex-shrink-0 flex-col gap-4">
        {/* System prompt */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            System prompt
          </label>
          <div className="mt-2">
            <textarea
              rows={4}
              name="comment"
              id="comment"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={activeBot.systemPrompt}
              onChange={(e) => debouncedSystemPrompt(e.target.value)}
            />
          </div>
        </div>

        <ProgressSetting
          title="Max tokens"
          min={0}
          max={4096}
          step={1}
          value={maxTokens}
          onValueChanged={(value) => debouncedMaxToken(value)}
        />

        <ProgressSetting
          min={0}
          max={1}
          step={0.01}
          title="Temperature"
          value={temperature}
          onValueChanged={(value) => debouncedTemperature(value)}
        />

        <ProgressSetting
          title="Frequency penalty"
          value={frequencyPenalty}
          min={0}
          max={1}
          step={0.01}
          onValueChanged={(value) => debouncedFreqPenalty(value)}
        />

        <ProgressSetting
          min={0}
          max={1}
          step={0.01}
          title="Presence penalty"
          value={presencePenalty}
          onValueChanged={(value) => {
            setPresencePenalty(value)
            debouncedPresencePenalty(value)
          }}
        />
      </div>
    </div>
  )
}

export default BotSetting