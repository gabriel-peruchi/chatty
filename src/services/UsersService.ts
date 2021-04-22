import { getCustomRepository } from "typeorm"

import { UsersRepository } from "../repositories/UsersRepository"

class UsersService {
    async create(email: string) {
        const usersRepository = getCustomRepository(UsersRepository)

        const userAlreadyExists = await usersRepository.findOne({ email })

        if (userAlreadyExists) return userAlreadyExists

        const user = usersRepository.create({ email })

        return usersRepository.save(user)
    }
}

export { UsersService }
