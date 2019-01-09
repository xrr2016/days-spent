#!/usr/bin/env node

const dayjs = require('dayjs')

const isLeapYear = require('dayjs/plugin/isLeapYear')
const CliProgress = require('cli-progress')
const chalk = require('chalk')

const DAYS_IN_WEEK = 7
const flags = ['y', 'm', 'w']

let flag = process.argv[2]
const isFlagsIncludeFlag = flags.includes(flag)

if (!isFlagsIncludeFlag) {
  flag = 'y'
}

dayjs.extend(isLeapYear)

function calc (flag) {
  const D = dayjs()
  let total, remain, spend, text

  switch (flag) {
    case 'y':
      text = '今年'
      total = D.isLeapYear() ? 366 : 365
      remain = -D.diff(D.endOf('year'), 'day')
      spend = total - remain
      break
    case 'm':
      text = '本月'
      total = D.daysInMonth()
      remain = -D.diff(D.endOf('month'), 'day')
      spend = total - remain
      break
    case 'w':
      text = '本周'
      total = DAYS_IN_WEEK
      remain = -D.diff(D.endOf('week'), 'day') + 1
      spend = DAYS_IN_WEEK - remain
      break
  }

  return { total, remain, spend, text }
}

const result = calc(flag)
const barOptions = {
  format:
    chalk.white(`${result.text}进度: `) +
    chalk.green('{value}/{total} ') +
    chalk.green('{bar} ') +
    chalk.green('{percentage}% ') +
    chalk.white('剩余: ') +
    chalk.green(result.remain) +
    chalk.white(' 天'),
  barCompleteChar: '\u2587',
  barIncompleteChar: '\u2591',
  fps: 5,
  hideCursor: null
}

const bar = new CliProgress.Bar(barOptions)

bar.start(result.total, 0)

const timer = setInterval(function () {
  bar.increment(1)

  if (bar.value >= result.spend) {
    bar.stop()
    clearInterval(timer)
  }
}, 20)
