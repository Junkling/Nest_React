import {Body, Controller, Get, Post} from "@nestjs/common";
import {LanguageService} from "./languages.service";
import {LanguagesRequest} from "../../type/languages/LanguagesRequest";
import {LanguagesResponse} from "../../type/languages/LanguagesResponse";

@Controller('languages')
export class LanguagesController {
    constructor(private readonly languageService: LanguageService) {
    }

    @Post()
    create(@Body() req: LanguagesRequest): Promise<LanguagesResponse> {
        return this.languageService.create(req);
    }

    @Get()
    findAll(): Promise<LanguagesResponse[]> {
        return this.languageService.findAll();
    }
}