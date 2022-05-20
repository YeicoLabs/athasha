
function downloadJson(data, prefix, ext) {
    const json = JSON.stringify(data, null, 2)
    downloadText(json, prefix, ext)
}

function downloadText(data, prefix, ext) {
    const element = document.createElement('a')
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    const filename = now.toISOString().replaceAll("-", "").replaceAll(":", "").replaceAll(".", "")
    element.setAttribute('href', 'data:text/plaincharset=utf-8,' + encodeURIComponent(data))
    element.setAttribute('download', `${prefix}-${filename}.${ext}`)
    element.style.display = 'none'
    element.click()
}

function uploadJson(ext, callback) {
    const input = document.createElement('input')
    input.setAttribute('accept', `.${ext}`)
    input.type = 'file'
    input.onchange = _ => {
        const files = Array.from(input.files)
        const reader = new FileReader()
        reader.addEventListener('load', (event) => {
            const uri = event.target.result
            //data:application/jsonbase64,XXXXX....
            const base64 = uri.substring(uri.indexOf(",") + 1)
            const json = atob(base64)
            const data = JSON.parse(json)
            callback(data)
        })
        reader.readAsDataURL(files[0])
    }
    input.click()
}

const licenseExtension = "athasha.license.json"
const backupExtension = "athasha.backup.json"

export default {
    licenseExtension,
    backupExtension,
    downloadText,
    downloadJson,
    uploadJson,
}
