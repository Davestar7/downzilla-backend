import * as pk from "@devmehq/email-validator-js"

async function emailValidator(email) {
    try {
        const out = await pk.verifyEmailDetailed(email)

        return {
            ok: out.wellFormed && out.validDomain && !out.disposable,
            details: out
        }
    } catch (e) {
        return {
            ok: false,
            details: e.message
        }
    }
}
export default emailValidator