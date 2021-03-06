let socket_admin_id = null
let emailUser = null
let socket = null

document.querySelector("#start_chat").addEventListener("click", (event) => {
    socket = io()

    const chat_help = document.getElementById("chat_help")
    chat_help.style.display = "none"

    const chat_in_support = document.getElementById("chat_in_support")
    chat_in_support.style.display = "block"

    const btn_support = document.getElementById("btn_support")
    btn_support.style.display = "none"

    const email = document.getElementById("email").value
    const text = document.getElementById("txt_help").value

    emailUser = email

    socket.on("connect", () => {
        const params = { email, text }

        socket.emit("client_first_access", params, (callback, error) => {
            if (error) return console.log(error)
            console.log(callback)
        })
    })

    socket.on("client_list_all_messages", messages => {
        const template_client = document.getElementById('message-user-template').innerHTML
        const template_admin = document.getElementById('admin-template').innerHTML

        messages.forEach(message => {
            if (!message.admin_id) {
                const rendered = Mustache.render(template_client, {
                    message: message.text,
                    email
                })

                document.getElementById("messages").innerHTML += rendered
            } else {
                const rendered = Mustache.render(template_admin, {
                    message_admin: message.text
                })

                document.getElementById("messages").innerHTML += rendered
            }
        })
    })

    socket.on("admin_send_to_client", message => {
        socket_admin_id = message.socket_id

        const templateAdmin = document.getElementById("admin-template").innerHTML

        const rendered = Mustache.render(templateAdmin, {
            message_admin: message.text
        })

        document.getElementById("messages").innerHTML += rendered
    })
})

document.querySelector("#close_chat").addEventListener("click", (event) => {
    const chat_in_support = document.getElementById("chat_in_support")
    chat_in_support.style.display = "none"

    const btn_support = document.getElementById("btn_support")
    btn_support.style.display = "flex"

    socket.emit("client_close_support")
})

document.getElementById('send_message_button').addEventListener('click', (event) => {
    const text = document.getElementById("message_user")

    if (!text.value) return

    const params = {
        text: text.value,
        socket_admin_id
    }

    socket.emit("client_send_to_admin", params)

    const templateClient = document.getElementById("message-user-template").innerHTML

    const rendered = Mustache.render(templateClient, { message: text.value, email: emailUser })

    document.getElementById("messages").innerHTML += rendered

    text.value = ""
})
