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
}

export { SettingsController }
