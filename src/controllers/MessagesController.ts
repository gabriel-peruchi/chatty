import { Request, Response } from "express"

import { MessagesService } from "../services/MessagesService"

class MessagesController {
    async create(request: Request, response: Response) {
        const messagesService = new MessagesService()

        const { admin_id, text, user_id } = request.body

        const message = await messagesService.create({
            admin_id,
            text,
            user_id
        })

        return response.json(message)
    }

    async showByUser(request: Request, response: Response) {
        const messageService = new MessagesService()

        const { id } = request.params

        const messagesByUser = await messageService.listByUser(id)

        return response.json(messagesByUser)
    }
}

export { MessagesController }
