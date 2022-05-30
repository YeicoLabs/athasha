import React from 'react'
import Badge from 'react-bootstrap/Badge'
import Clipboard from "../tools/Clipboard"
import Types from './Types'

function statusTitle(item, status) {
    if (!item.enabled) {
        return "Disabled"
    }
    if (!status.type) {
        return "Enabled"
    }
    return status.msg
}

function statusMsg(item) {
    if (!item.enabled) {
        return "Disabled"
    }
    return "Enabled"
}

function statusBg(item, status) {
    if (!item.enabled) {
        return "secondary"
    }
    switch (status.type) {
        case "success": return "success"
        case "warn": return "warning"
        case "error": return "danger"
        default: return "primary"
    }
}

function statusOnClick(status) {
    Clipboard.copyText(status.msg)
}

function Status({ item, status }) {
    return (
        <Badge pill bg={statusBg(item, status)} title={statusTitle(item, status)}
            onClick={() => statusOnClick(status)} className='ms-2 user-select-none'>
            {statusMsg(item)}
        </Badge>
    )
}

function enabledClass(item) {
    return item.enabled ?
        "fw-normal" : "fst-italic"
}

function Name({ item }) {
    return <span className='align-middle user-select-none'>{item.name}</span>
}

function Entry({ item, status }) {
    return <>
        <img src={Types.icon(item.type)} width="20"
            alt={item.type} className='me-2' />
        <Name item={item} />
        <Status item={item} status={status} />
    </>
}

function Td({ item, status }) {
    return <td className={enabledClass(item)} title={item.id}>
        <Entry item={item} status={status} />
    </td>
}

function onView(item) {
    const page = item.type.toLowerCase()
    window.open(`${page}.html?id=${item.id}`, '_blank').focus();
}

function onEdit(item) {
    window.open(`editor.html?id=${item.id}`, '_blank').focus();
}

const exports = {
    Status,
    Entry,
    Name,
    Td,
    onView,
    onEdit,
}

export default exports