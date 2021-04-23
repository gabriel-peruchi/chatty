import { getCustomRepository, Repository } from "typeorm"

import { Setting } from "../entities/Setting"
import { SettingsRepository } from "../repositories/SettingsRepository"

interface ISettingsCreate {
    chat: boolean
    username: string
}

class SettingsService {
    private settingsRepository: Repository<Setting>

    constructor() {
        this.settingsRepository = getCustomRepository(SettingsRepository)
    }

    async create({ chat, username }: ISettingsCreate) {
        const userAlreadyExists = await this.settingsRepository.findOne({
            username
        })

        if (userAlreadyExists) {
            throw new Error("User already exists!")
        }

        const setting = this.settingsRepository.create({
            chat,
            username
        })

        return await this.settingsRepository.save(setting)
    }

    async findByUserName(username: string) {
        return this.settingsRepository.findOne({ username })
    }

    async update(username: string, chat: boolean) {
        return await this.settingsRepository
            .createQueryBuilder()
            .update(Setting)
            .set({ chat })
            .where("username = :username", { username })
            .execute()
    }
}

export { SettingsService }
