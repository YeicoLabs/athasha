import Check from './Check'

function config() {
    return {
        setts: setts(),
        columns: [column("DateTime")],
    }
}

function setts() {
    return {
        database: "sqlserver",
        dbpass: "",
        connstr: "",
        command: "",
        password: "",
        ymin: "0",
        ymax: "100",
        lineWidth: "1",
    }
}

function column(name) {
    return { name: name || "", color: "#000000" }
}

const labels = {
    database: "Database",
    dbpass: "Database Password",
    password: "Dataplot Password",
    connstr: "Connection String",
    command: "SQL Command",
    ymin: "Plot Minimum Y Value",
    ymax: "Plot Maximum Y Value",
    lineWidth: "Plot Line Width",
    columns: {
        name: (i) => `Column ${i + 1} Name`,
        color: (i) => `Column ${i + 1} Color`,
    }
}

const hints = {
    database: "The type of database",
    dbpass: "Optional database password",
    password: "Optional dataplot password",
    connstr: "Non empty connection string for your DB\nUse ${PASSWORD} to insert the Database Password\nConsult your TI specialist\nSee https://www.connectionstrings.com/",
    command: "An SQL select command, function or store procedure call\nUse @FROM and @TO to reference the start and end of the date range\nFirst returned column must be DateTime\nConsult your TI specialist",
    ymin: "Non empty number",
    ymax: "Non empty number",
    lineWidth: "Non empty integer > 0",
    columns: {
        name: (i) => "Non empty column name",
        color: (i) => "Non empty column color #RRGGBB",
    }
}

const checks = {
    database: function (value) {
        Check.isString(value, labels.database)
        Check.notEmpty(value, labels.database)
    },
    dbpass: function (value) {
        Check.isString(value, labels.dbpass)
        //Check.notEmpty(value, labels.dbpass)
    },
    password: function (value) {
        Check.isString(value, labels.password)
        //Check.notEmpty(value, labels.password)
    },
    connstr: function (value) {
        Check.isString(value, labels.connstr)
        Check.notEmpty(value, labels.connstr)
    },
    command: function (value) {
        Check.isString(value, labels.command)
        Check.notEmpty(value, labels.command)
    },
    ymin: function (value) {
        Check.isString(value, labels.ymin)
        Check.notEmpty(value, labels.ymin)
        Check.isNumber(value, labels.ymin)
    },
    ymax: function (value) {
        Check.isString(value, labels.ymax)
        Check.notEmpty(value, labels.ymax)
        Check.isNumber(value, labels.ymax)
    },
    lineWidth: function (value) {
        Check.isString(value, labels.lineWidth)
        Check.notEmpty(value, labels.lineWidth)
        Check.isInteger(value, labels.lineWidth)
        Check.isGT(value, labels.lineWidth, 0)
    },
    columns: {
        name: function (index, value) {
            Check.isString(value, labels.columns.name(index))
            Check.notEmpty(value, labels.columns.name(index))
        },
        color: function (index, value) {
            Check.isString(value, labels.columns.color(index))
            Check.notEmpty(value, labels.columns.color(index))
            Check.isColor(value, labels.columns.color(index))
        },
    }
}

function validator({ setts, columns }) {
    Check.hasProp(setts, "Setts", "database")
    Check.hasProp(setts, "Setts", "dbpass")
    Check.hasProp(setts, "Setts", "connstr")
    Check.hasProp(setts, "Setts", "command")
    Check.hasProp(setts, "Setts", "ymin")
    Check.hasProp(setts, "Setts", "ymax")
    Check.hasProp(setts, "Setts", "lineWidth")
    checks.database(setts.database)
    checks.dbpass(setts.dbpass)
    checks.connstr(setts.connstr)
    checks.command(setts.command)
    checks.ymin(setts.ymin)
    checks.ymax(setts.ymax)
    checks.lineWidth(setts.lineWidth)
    Check.isArray(columns, "Columns")
    Check.nonZeroLength(columns, "Columns")
    columns.forEach((column, index) => {
        Check.hasProp(column, labels.columns.name(index), "name")
        checks.columns.name(index, column.name)
        Check.hasProp(column, labels.columns.name(index), "color")
        checks.columns.color(index, column.color)
    })
}

export default {
    config,
    setts,
    column,
    labels,
    hints,
    checks,
    validator,
}