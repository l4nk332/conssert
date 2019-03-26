function parseArgs(rawArgs) {
  const ARG_MAP = {
    LOCAL_DEV: {name: 'LOCAL_DEV'},
    PORT: {name: 'PORT', takesValue: true},
    IGNORE: {name: 'IGNORE', takesValue: true},
    HELP: {name: 'HELP'}
  }

  const ARG_LOOKUP = {
    '--local-dev': ARG_MAP.LOCAL_DEV,
    '-p': ARG_MAP.PORT,
    '--port': ARG_MAP.PORT,
    '-i': ARG_MAP.IGNORE,
    '--ignore': ARG_MAP.IGNORE
  }

  const copiedRawArgs = [...rawArgs]

  function isLongForm(param) {
    return param.startsWith('--')
  }

  return copiedRawArgs.reduce((parsed, rawArg, idx, srcArr) => {
    if (isLongForm(rawArg)) {
      const [arg, value = true] = rawArg.split('=')
      if (ARG_LOOKUP.hasOwnProperty(arg)) {
        parsed[ARG_LOOKUP[arg].name] = value
      }
    } else if (ARG_LOOKUP.hasOwnProperty(rawArg)) {
      const parsedArg = ARG_LOOKUP[rawArg]
      const value = parsedArg.takesValue ? srcArr.splice(idx + 1, 1)[0] : true
      parsed[parsedArg.name] = value
    }

    return parsed
  }, {})
}

module.exports = parseArgs
