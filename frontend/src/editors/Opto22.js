import Check from './Check'

function config() {
    return {
        setts: setts(),
        inputs: [input()]
    }
}

function setts() {
    return {
        type: "Snap",
        host: "127.0.0.1",
        port: "502",
        period: "10",
        slave: "1",
    }
}

function input(index) {
    return {
        code: "01",
        module: "0",
        number: "0",
        name: `Input ${1 + (index || 0)}`
    }
}

const labels = {
    type: "Product Family",
    host: "Hostname/IP Address",
    port: "TCP Port",
    period: "Period (ms)",
    slave: "Slave Address",
    input: {
        code: "Input Type",
        module: "Module Number",
        number: "Point Number",
        name: "Input Name",
    },
    inputs: {
        code: (i) => `Input ${i + 1} Type`,
        module: (i) => `Input ${i + 1} Module Number`,
        number: (i) => `Input ${i + 1} Point Number`,
        name: (i) => `Input ${i + 1} Name`,
    },
}

const hints = {
    type: "Select product family from list",
    host: "Non empty hostname or IP address",
    port: "Non empty integer [0, 65535]",
    period: "Non empty integer > 0",
    slave: "Non empty integer [0, 255]",
    inputs: {
        code: (i) => `Select the input type from list`,
        module: (i) => `Non empty integer [0, 15]`,
        number: (i) => `Non empty integer [0, 3]`,
        name: (i) => `Non empty input name`,
    }
}

const checks = {
    type: function (value) {
        Check.isString(value, labels.type)
        Check.notEmpty(value, labels.type)
    },
    host: function (value) {
        Check.isString(value, labels.host)
        Check.notEmpty(value, labels.host)
    },
    port: function (value) {
        Check.isString(value, labels.port)
        Check.notEmpty(value, labels.port)
        Check.isInteger(value, labels.port)
        Check.isGE(value, labels.port, 0)
        Check.isLE(value, labels.port, 65535)
    },
    period: function (value) {
        Check.isString(value, labels.period)
        Check.notEmpty(value, labels.period)
        Check.isInteger(value, labels.period)
        Check.isGT(value, labels.period, 0)
    },
    slave: function (value) {
        Check.isString(value, labels.slave)
        Check.notEmpty(value, labels.slave)
        Check.isInteger(value, labels.slave)
        Check.isGE(value, labels.slave, 0)
        Check.isLE(value, labels.slave, 255)
    },
    inputs: {
        code: function (index, value) {
            Check.isString(value, labels.inputs.code(index))
            Check.notEmpty(value, labels.inputs.code(index))
        },
        module: function (index, value) {
            Check.isString(value, labels.inputs.module(index))
            Check.notEmpty(value, labels.inputs.module(index))
            Check.isGE(value, labels.inputs.module(index), 0)
            Check.isLE(value, labels.inputs.module(index), 15)
        },
        number: function (index, value) {
            Check.isString(value, labels.inputs.number(index))
            Check.notEmpty(value, labels.inputs.number(index))
            Check.isGE(value, labels.inputs.number(index), 0)
            Check.isLE(value, labels.inputs.number(index), 3)
        },
        name: function (index, value) {
            Check.isString(value, labels.inputs.name(index))
            Check.notEmpty(value, labels.inputs.name(index))
        },
    },
}

function validator({ setts, inputs }) {
    Check.hasProp(setts, "Setts", "type")
    Check.hasProp(setts, "Setts", "host")
    Check.hasProp(setts, "Setts", "port")
    Check.hasProp(setts, "Setts", "period")
    Check.hasProp(setts, "Setts", "slave")
    checks.type(setts.type)
    checks.host(setts.host)
    checks.port(setts.port)
    checks.period(setts.period)
    checks.slave(setts.slave)
    Check.isArray(inputs, "Inputs")
    Check.nonZeroLength(inputs, "Inputs")
    inputs.forEach((input, index) => {
        Check.hasProp(input, labels.inputs.code(index), "code")
        checks.inputs.code(index, input.code)
        Check.hasProp(input, labels.inputs.module(index), "module")
        checks.inputs.module(index, input.module)
        Check.hasProp(input, labels.inputs.number(index), "number")
        checks.inputs.number(index, input.number)
        Check.hasProp(input, labels.inputs.name(index), "name")
        checks.inputs.name(index, input.name)
    })
}

export default {
    config,
    setts,
    input,
    labels,
    hints,
    checks,
    validator,
}