import { getCustomRepository } from "typeorm"

import { MessagesRepository } from "../repositories/MessagesRepository"

interface IMessageCreate {
    admin_id?: string
    text: string
    user_id: string
}

class MessagesService {
    async create({ admin_id, text, user_id }: IMessageCreate) {
        const messagesRepository = getCustomRepository(MessagesRepository)

        const message = messagesRepository.create({
            admin_id,
            text,
            user_id
        })

        return await messagesRepository.save(message)
    }
}

export { MessagesService }
