import Log from "../tools/Log"

function initial() {
  return {
    id: "",
    name: "",
    type: "",
    status: {},
    inames: [],
    ivalues: {},
    onames: [],
    ovalues: {},
  }
}

function clone_object(object) {
  return Object.assign({}, object)
}

function reducer(state, { name, args, self }) {
  switch (name) {
    case "view": {
      const next = clone_object(state)
      next.id = args.id
      next.name = args.name
      next.type = args.type
      next.status = {}
      next.inames = args.inames
      next.onames = args.onames
      next.ivalues = {}
      next.ovalues = {}
      args.ivalues.forEach(point => {
        next.ivalues[point.name] = point.value
      })
      args.ovalues.forEach(point => {
        next.ovalues[point.name] = point.value
      })
      return next
    }
    case "status": {
      const next = clone_object(state)
      next.status = args
      return next
    }
    case "input": {
      const next = clone_object(state)
      next.ivalues[args.name] = args.value
      return next
    }
    case "output": {
      const next = clone_object(state)
      next.ovalues[args.name] = args.value
      return next
    }
    case "close": {
      return initial()
    }
    default:
      Log.log("Unknown mutation", name, args, self)
      return state
  }
}

const exports = { initial, reducer }

export default exports
