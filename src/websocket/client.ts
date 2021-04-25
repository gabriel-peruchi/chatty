import { io } from "../app"
import { ConnectionsService } from "../services/ConnectionsService"
import { MessagesService } from "../services/MessagesService"
import { UsersService } from "../services/UsersService"

interface IParams {
    text: string
    email: string
}

io.on("connect", async (socket) => {
    const connectionsService = new ConnectionsService()
    const usersService = new UsersService()
    const messagesService = new MessagesService()

    socket.on("client_first_access", async (params) => {
        const socket_id = socket.id
        const { text, email } = params as IParams

        const user = await usersService.create(email)
        const user_id = user.id

        const connection = await connectionsService.findByUserId(user_id)

        if (connection) {
            connection.socket_id = socket_id
            await connectionsService.create(connection)
        } else {
            await connectionsService.create({ socket_id, user_id })
        }

        await messagesService.create({ text, user_id })

        const allMessagesByUser = await messagesService.listByUser(user_id)
        socket.emit("client_list_all_messages", allMessagesByUser)

        const allConnetcionsWithoutAdmin = await connectionsService.findAllWithoutAdmin()
        io.emit("admin_list_all_users", allConnetcionsWithoutAdmin)

    })

    socket.on("client_send_to_admin", async (params) => {
        const { text, socket_admin_id } = params

        const socket_id = socket.id

        const { user_id } = await connectionsService.findBySocketId(socket_id)

        const message = await messagesService.create({ text, user_id })

        io.to(socket_admin_id).emit("admin_receive_message", {
            message,
            socket_id
        })
    })
})
