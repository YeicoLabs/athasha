import sha1 from 'sync-sha1/rawSha1'
import { v4 as uuidv4 } from 'uuid'

function initial() { return { token: "", proof: "" } }

function encode(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = sha1(msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function api(key) {
    key = "athasha." + key
    function fetch() {
        const session = localStorage.getItem(key)
        return session ? JSON.parse(session) : initial()
    }

    function remove() {
        localStorage.removeItem(key)
    }

    function create(password) {
        const token = uuidv4();
        const proof = encode(`${token}:${password}`);
        const session = { token, proof }
        localStorage.setItem(key, JSON.stringify(session))
        return session
    }
    return {
        fetch,
        remove,
        create,
    }
}

const exports = {
    api,
    initial,
}

export default exports
