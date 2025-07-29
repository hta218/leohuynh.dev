import Link from 'next/link'
import type { CommandResult } from '../types'

const TIME_IS_URL = 'https://time.is/Hanoi'
const MY_TIMEZONE = 'Asia/Ho_Chi_Minh'
const MY_TIMEZONE_OFFSET = 7 * -60 // UTC+7

function getCurrentActivity(hour: number, isWeekend: boolean): string {
  if (isWeekend) {
    if (hour >= 6 && hour < 9) {
      return 'having breakfast, working on side projects, or learning english'
    }
    if (hour >= 9 && hour < 21) {
      return 'spending time with family, or working on side projects'
    }
    if (hour >= 21 && hour < 23.5) {
      return 'side projects, watching sport games, or cuddling with my wife'
    }
    if (hour >= 23.5 || hour < 6) {
      return 'sleeping'
    }
  } else {
    // Weekday schedule
    if (hour >= 6 && hour < 9) {
      return 'bringing my son to school, having breakfast, learning english, or working on side projects'
    }
    if (hour >= 9 && hour < 17) {
      return 'at work'
    }
    if (hour >= 17 && hour < 21) {
      return 'bonding with my son or playing volleyball/football'
    }
    if (hour >= 21 && hour < 23.5) {
      return 'side projects, watching sport games, or cuddling with my wife'
    }
    if (hour >= 23.5 || hour < 6) {
      return 'sleeping'
    }
  }

  return '...'
}

function getTimeInfo() {
  let date = new Date()
  let visitorTimezoneOffset = date.getTimezoneOffset()
  let hoursDiff = (visitorTimezoneOffset - MY_TIMEZONE_OFFSET) / 60

  let diffText =
    hoursDiff === 0
      ? 'same time'
      : hoursDiff > 0
        ? `${hoursDiff}h ahead`
        : `${hoursDiff * -1}h behind`

  let time = new Intl.DateTimeFormat('en-US', {
    timeZone: MY_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)

  // Get hour in 24-hour format for activity determination
  let hour24 = Number.parseInt(
    new Intl.DateTimeFormat('en-US', {
      timeZone: MY_TIMEZONE,
      hour: '2-digit',
      hour12: false,
    }).format(date),
  )

  // Check if it's weekend
  let dayOfWeek = date.toLocaleDateString('en-US', {
    timeZone: MY_TIMEZONE,
    weekday: 'long',
  })
  let isWeekend = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday'

  let currentActivity = getCurrentActivity(hour24, isWeekend)

  return { time, diffText, currentActivity }
}

export const execute = async (): Promise<CommandResult> => {
  let { time, diffText, currentActivity } = getTimeInfo()

  return {
    lines: [
      {
        type: 'component',
        component: () => (
          <div>
            current time in my place:{' '}
            <Link
              href={TIME_IS_URL}
              className="hover:underline underline-offset-4"
              target="_blank"
            >
              <strong>{time}</strong>
            </Link>{' '}
            <span data-terminal-info>(utc+7 - indochina time)</span>
          </div>
        ),
      },
      {
        type: 'component',
        component: () => (
          <div>
            you are <strong>{diffText}</strong> of my time.
          </div>
        ),
      },
      {
        type: 'output',
        content: `what I'm probably doing right now: ${currentActivity}`,
      },
    ],
  }
}
