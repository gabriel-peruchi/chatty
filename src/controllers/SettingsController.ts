import { Request, Response } from "express"

import { SettingsService } from "../services/SettingsService"

class SettingsController {
    async create(request: Request, response: Response) {
        const settingsService = new SettingsService()

        const { chat, username } = request.body

        try {
            const setting = await settingsService.create({ chat, username })
            return response.json(setting)
        } catch (error) {
            return response.status(400).json({ message: error.message })
        }
    }

    async findByUserName(request: Request, response: Response) {
        const settingsService = new SettingsService()

        const { username } = request.params

        const setting = await settingsService.findByUserName(username)

        return response.json(setting)
    }

    async update(request: Request, response: Response) {
        const settingsService = new SettingsService()

        const { username } = request.params
        const { chat } = request.body

        const setting = await settingsService.update(username, chat)

        return response.json(setting)
    }
}

export { SettingsController }
