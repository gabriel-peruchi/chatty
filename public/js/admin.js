const socket = io()
let connectionsUsers = []

socket.on("admin_list_all_users", connections => {
    connectionsUsers = connections
    document.getElementById("list_users").innerHTML = ""

    const template = document.getElementById("template").innerHTML

    connections.forEach(connection => {
        const rendered = Mustache.render(template, {
            id: connection.user_id,
            email: connection.user.email
        })

        document.getElementById("list_users").innerHTML += rendered
    })
})

function call(user_id) {
    const connectionUser = connectionsUsers.find(connection => connection.user_id === user_id)

    const template = document.getElementById("admin_template").innerHTML

    const rendered = Mustache.render(template, {
        id: connectionUser.user_id,
        email: connectionUser.user.email
    })

    document.getElementById("supports").innerHTML += rendered

    const params = {
        user_id: connectionUser.user_id
    }

    socket.emit("admin_user_in_support", params)

    socket.emit("admin_list_messages_by_user", params, messages => {
        const divMessagesByUser = document.getElementById(`allMessages${connectionUser.user_id}`)

        messages.forEach(message => {
            const divMessage = document.createElement('div')

            if (!message.admin_id) {
                divMessage.className = "admin_message_client"
                divMessage.innerHTML = `<span>${connectionUser.user.email}<span/>`
                divMessage.innerHTML += `<span>${message.text}<span/>`
                divMessage.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format('DD/MM/YYYY HH:mm:ss')}<span/>`
            } else {
                divMessage.className = "admin_message_admin"
                divMessage.innerHTML = `Atendente: <span>${message.text}<span/>`
                divMessage.innerHTML += `<span class="admin_date">${dayjs(message.created_at).format('DD/MM/YYYY HH:mm:ss')}<span/>`
            }

            divMessagesByUser.appendChild(divMessage)
        })
    })
}

function sendMessage(user_id) {
    const text = document.getElementById(`send_message_${user_id}`)

    const params = {
        text: text.value,
        user_id
    }

    socket.emit("admin_send_message", params)

    const divMessages = document.getElementById(`allMessages${user_id}`)

    const divMessage = document.createElement('div')
    divMessage.className = "admin_message_admin"
    divMessage.innerHTML = `Atendente: <span>${params.text}<span/>`
    divMessage.innerHTML += `<span class="admin_date">${dayjs().format('DD/MM/YYYY HH:mm:ss')}<span/>`

    divMessages.appendChild(divMessage)
    text.value = ""
}

socket.on("admin_receive_message", data => {
    const divMessage = document.createElement('div')

    divMessage.className = "admin_message_client"
    divMessage.innerHTML = `<span>${data.user.email}<span/>`
    divMessage.innerHTML += `<span>${data.message.text}<span/>`
    divMessage.innerHTML += `<span class="admin_date">${dayjs(data.message.created_at).format('DD/MM/YYYY HH:mm:ss')}<span/>`

    const divMessagesByUser = document.getElementById(`allMessages${data.user.id}`)
    divMessagesByUser.appendChild(divMessage)
})

socket.on("admin_client_close_support", params => {
    const divMessage = document.createElement('div')

    divMessage.className = "admin_message_client message_close_support"
    divMessage.innerHTML = `<span>${params.user.email}<span/>`
    divMessage.innerHTML += `<span>Encerrou o suporte.<span/>`

    const divMessagesByUser = document.getElementById(`allMessages${params.user.id}`)
    divMessagesByUser && divMessagesByUser.appendChild(divMessage)
})