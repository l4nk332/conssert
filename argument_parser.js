function isArg(arg, lookup) {
  return lookup.hasOwnProperty(arg)
}

function parseArgs(rawArgs) {
  const ARG_MAP = {
    LOCAL_DEV: {name: 'LOCAL_DEV'},
    PORT: {name: 'PORT', singleValue: true},
    IGNORE: {name: 'IGNORE', multiValue: true},
    HELP: {name: 'HELP'}
  }

  const ARG_LOOKUP = {
    '--local-dev': ARG_MAP.LOCAL_DEV,
    '-l': ARG_MAP.LOCAL_DEV,
    '--port': ARG_MAP.PORT,
    '-p': ARG_MAP.PORT,
    '--ignore': ARG_MAP.IGNORE,
    '-i': ARG_MAP.IGNORE,
    '--help': ARG_MAP.HELP,
    '-h': ARG_MAP.HELP
  }

  return [...rawArgs].reduce((collected, rawArg) => {
    if (!isArg(rawArg, ARG_LOOKUP) && !collected.length) return collected

    const lastArgCollection = collected.slice(-1)[0]
    const restArgCollection = collected.slice(0, -1)

    return (
      isArg(rawArg, ARG_LOOKUP)
        ? [...collected, [rawArg]]
        : [...restArgCollection, [...lastArgCollection, rawArg]]
    )
  }, []).reduce((argStruct, [arg, ...values]) => ({
    ...argStruct,
    [ARG_LOOKUP[arg].name]: (
      values.length === 0
        ? true
        : values.length === 1
          ? values[0]
          : values
    )
  }), {})
}

module.exports = parseArgs
