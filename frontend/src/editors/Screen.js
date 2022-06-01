import Check from './Check'
import Merge from "../tools/Merge"
import Label from '../controls/Label.js'
import Analog from '../controls/Analog.js'
import { v4 as uuidv4 } from 'uuid'

const controlMap = {}
controlMap[Label.type] = Label
controlMap[Analog.type] = Analog

function merge(target) {
    const _initial = config()
    Merge(_initial, target)
    Merge(_initial.setts, target.setts, (name, value) => checks[name](value))
    target.controls.forEach((target, index) => {
        const _initial = control(index) //new uuid each time
        Merge(_initial, target, (name, value) => cchecks[name](value))
        Merge(_initial.setts, target.setts, (name, value) => cschecks[name](value))
        const initial = controlMap[target.type]
        if (initial.merge) {
            target.data = initial.merge(target.data)
        }
    })
    return target
}

function config() {
    return {
        setts: setts(),
        controls: [],
        inputs: [],
    }
}

function setts() {
    return {
        password: "",
        period: "25",
        scale: 'fit',
        align: 'center',
        width: '640',
        height: '480',
        gridX: '160',
        gridY: '120',
        bgColor: "#ffffff",
        hvColor: "#808080",
    }
}

function control() {
    return {
        id: uuidv4(),
        type: "none",
        setts: csetts(),
        data: {},
    }
}

function selected() {
    return {
        index: -1,
        control: {},
    }
}

function csetts() {
    return {
        posX: '0',
        posY: '0',
        width: '1',
        height: '1',
        title: "Click to Set Value",
        input: "",
        output: "",
        click: "Fixed Value",
        value: "0",
        prompt: "Enter Value",
    }
}

const labels = {
    password: "Access Password",
    period: "Period (ms)",
    scale: "Scale",
    align: "Align",
    width: "Width",
    height: "Height",
    gridX: "Grid X",
    gridY: "Grid Y",
    bgColor: "Background",
    hvColor: "Hover",
}

const hints = {
    password: "Optional access password",
    period: "Non empty integer update period > 0",
    scale: "Select scale from list",
    align: "Select alignment from list",
    width: "Non empty integer > 0",
    height: "Non empty integer > 0",
    gridX: "Non empty integer > 0",
    gridY: "Non empty integer > 0",
    bgColor: "Non empty backgroung color #RRGGBB",
    hvColor: "Non empty hover color #RRGGBB",
}

const clabels = {
    posX: "Position X",
    posY: "Position Y",
    width: "Width",
    height: "Height",
    title: "Tooltip",
    input: "Input",
    output: "Output",
    click: "On Click",
    value: "Fixed Value",
    prompt: "Value Prompt",
}

const chints = {
    posX: "Non empty integer >= 0",
    posY: "Non empty integer >= 0",
    width: "Non empty integer > 0",
    height: "Non empty integer > 0",
    title: "Optional tooltip",
    input: "Select optional input from list",
    output: "Select optional output from list",
    click: "Select on click action",
    value: "Non empty fixed value number",
    prompt: "Non empty value prompt",
}

const cchecks = {
    id: function (value) {
        Check.isString(value, labels.posX)
        Check.notEmpty(value, labels.posX)
    },
    type: () => { },
    setts: () => { },
    data: () => { },
}

const cschecks = {
    posX: function (value) {
        Check.isString(value, labels.posX)
        Check.notEmpty(value, labels.posX)
        Check.isInteger(value, labels.posX)
        Check.isGE(value, labels.posX, 0)
    },
    posY: function (value) {
        Check.isString(value, labels.posY)
        Check.notEmpty(value, labels.posY)
        Check.isInteger(value, labels.posY)
        Check.isGE(value, labels.posY, 0)
    },
    width: function (value) {
        Check.isString(value, labels.width)
        Check.notEmpty(value, labels.width)
        Check.isInteger(value, labels.width)
        Check.isGE(value, labels.width, 1)
    },
    height: function (value) {
        Check.isString(value, labels.height)
        Check.notEmpty(value, labels.height)
        Check.isInteger(value, labels.height)
        Check.isGE(value, labels.height, 1)
    },
    title: function (value) {
        Check.isString(value, labels.title)
    },
    input: function (value) {
        Check.isString(value, labels.input)
    },
    output: function (value) {
        Check.isString(value, labels.output)
    },
    click: function (value) {
        Check.isString(value, labels.click)
        Check.notEmpty(value, labels.click)
    },
    value: function (value) {
        Check.isString(value, labels.value)
        Check.notEmpty(value, labels.value)
    },
    prompt: function (value) {
        Check.isString(value, labels.prompt)
        Check.notEmpty(value, labels.prompt)
    },
}

function fixCSetts(curr) {
    const next = {}
    const init = csetts()
    Object.keys(curr).forEach((k) => {
        const value = curr[k]
        try {
            cschecks[k](value)
            next[k] = value
        } catch (ex) {
            next[k] = init[k]
        }
    })
    return next
}

const checks = {
    password: function (value) {
        Check.isString(value, labels.password)
        //Check.notEmpty(value, labels.password)
    },
    period: function (value) {
        Check.isString(value, labels.period)
        Check.notEmpty(value, labels.period)
        Check.isInteger(value, labels.period)
        Check.isGE(value, labels.period, 1)
    },
    scale: function (value) {
        Check.isString(value, labels.scale)
        Check.notEmpty(value, labels.scale)
    },
    align: function (value) {
        Check.isString(value, labels.align)
        Check.notEmpty(value, labels.align)
    },
    width: function (value) {
        Check.isString(value, labels.width)
        Check.notEmpty(value, labels.width)
        Check.isInteger(value, labels.width)
        Check.isGE(value, labels.width, 1)
    },
    height: function (value) {
        Check.isString(value, labels.height)
        Check.notEmpty(value, labels.height)
        Check.isInteger(value, labels.height)
        Check.isGE(value, labels.height, 1)
    },
    gridX: function (value) {
        Check.isString(value, labels.gridX)
        Check.notEmpty(value, labels.gridX)
        Check.isInteger(value, labels.gridX)
        Check.isGE(value, labels.gridX, 1)
    },
    gridY: function (value) {
        Check.isString(value, labels.gridY)
        Check.notEmpty(value, labels.gridY)
        Check.isInteger(value, labels.gridY)
        Check.isGE(value, labels.gridY, 1)
    },
    bgColor: function (value) {
        Check.isString(value, labels.bgColor)
        Check.notEmpty(value, labels.bgColor)
        Check.isColor(value, labels.bgColor)
    },
    hvColor: function (value) {
        Check.isString(value, labels.hvColor)
        Check.notEmpty(value, labels.hvColor)
        Check.isColor(value, labels.hvColor)
    },
}

function validator({ setts, controls }) {
    Check.hasProp(setts, "Setts", "password")
    Check.hasProp(setts, "Setts", "period")
    Check.hasProp(setts, "Setts", "scale")
    Check.hasProp(setts, "Setts", "align")
    Check.hasProp(setts, "Setts", "width")
    Check.hasProp(setts, "Setts", "height")
    Check.hasProp(setts, "Setts", "gridX")
    Check.hasProp(setts, "Setts", "gridY")
    Check.hasProp(setts, "Setts", "bgColor")
    Check.hasProp(setts, "Setts", "hvColor")
    checks.password(setts.password)
    checks.period(setts.period)
    checks.scale(setts.scale)
    checks.align(setts.align)
    checks.width(setts.width)
    checks.height(setts.height)
    checks.gridX(setts.gridX)
    checks.gridY(setts.gridY)
    checks.bgColor(setts.bgColor)
    checks.bgColor(setts.hvColor)
    Check.isArray(controls, "Controls")
    controls.forEach((control, index) => {
        const clabel = `Control ${index + 1} type ${control.type}`
        Check.hasProp(control.setts, clabel, "posX")
        cschecks.posX(control.setts.posX)
        Check.hasProp(control.setts, clabel, "posY")
        cschecks.posY(control.setts.posY)
        Check.hasProp(control.setts, clabel, "width")
        cschecks.width(control.setts.width)
        Check.hasProp(control.setts, clabel, "height")
        cschecks.height(control.setts.height)
        Check.hasProp(control.setts, clabel, "title")
        cschecks.title(control.setts.title)
        Check.hasProp(control.setts, clabel, "input")
        cschecks.input(control.setts.input)
        Check.hasProp(control.setts, clabel, "output")
        cschecks.output(control.setts.output)
        Check.hasProp(control.setts, clabel, "click")
        cschecks.click(control.setts.click)
        Check.hasProp(control.setts, clabel, "value")
        cschecks.value(control.setts.value)
        Check.hasProp(control.setts, clabel, "prompt")
        cschecks.prompt(control.setts.prompt)
        const initial = controlMap[control.type]
        const validate = initial.validate
        if (validate) validate(control)
    })
}

export default {
    merge,
    selected,
    config,
    setts,
    control,
    csetts,
    labels,
    hints,
    checks,
    validator,
    clabels,
    chints,
    cchecks: cschecks,
    fixCSetts,
}
