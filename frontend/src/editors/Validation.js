function checkRange(value, min, max) {
    value = parseInt(`${value}`)
    if (max === undefined) {
        return min <= value
    }
    return min <= value && value <= max
}

function checkNotBlank(value) {
    return `${value}`.trim().length > 0
}

function checkBoolean(value) {
    return typeof (value) === "boolean"
}

function fixInputValue(e, value, prev) {
    if (e) {
        const t = e.target
        if (t.tagName.toLowerCase() === "input") {
            const tt = t.getAttribute("type").toLowerCase()
            if (["range", "number"].includes(tt)) {
                value = Number(value) //empty space to zero
                if (t.hasAttribute("min")) {
                    const min = t.getAttribute("min")
                    if (value < Number(min)) {
                        value = prev
                    }
                }
                if (t.hasAttribute("max")) {
                    const max = t.getAttribute("max")
                    if (value > Number(max)) {
                        value = prev
                    }
                }
            }
            if (t.hasAttribute("pattern")) {
                if (!t.checkValidity()) {
                    value = prev
                }
            }
        }
    }
    return `${value}`
}

export {
    checkRange,
    checkNotBlank,
    checkBoolean,
    fixInputValue,
}