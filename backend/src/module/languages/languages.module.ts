import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Languages} from "./languages.entity";
import {WishLanguages} from "./wish-languages.entity";
import {NativeLanguages} from "./native-languages.entity";
import {LanguageService} from "./languages.service";
import {LanguagesController} from "./languages.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Languages, WishLanguages, NativeLanguages])
    ],
    providers: [LanguageService],
    controllers: [LanguagesController],
    exports: [LanguageService],
})
export class LanguagesModule {}