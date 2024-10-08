import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Languages} from "./languages.entity";
import {Repository} from "typeorm";
import {NativeLanguages} from "./native-languages.entity";
import {WishLanguages} from "./wish-languages.entity";
import {LanguagesRequest} from "../../type/languages/LanguagesRequest";
import {LanguagesResponse, toLanguagesResponse} from "../../type/languages/LanguagesResponse";
import {User} from "../users/user.entity";
import {toWishLanguagesResponse, WishLanguagesResponse} from "../../type/languages/WishLanguagesResponse";
import {NativeLanguagesResponse, toNativeLanguagesResponse} from "../../type/languages/NativeLanguagesResponse";

@Injectable()
export class LanguageService {
    constructor(
        @InjectRepository(Languages) private readonly languageRepository: Repository<Languages>,
        @InjectRepository(NativeLanguages) private readonly nativeLanguageRepository: Repository<NativeLanguages>,
        @InjectRepository(WishLanguages) private readonly wishLanguagesRepository: Repository<WishLanguages>,
    ) {
    }

    async create(req: LanguagesRequest): Promise<LanguagesResponse> {
        const saved = await this.languageRepository.save(new Languages(req.code, req.name));
        return toLanguagesResponse(saved);
    }

    async findAll(): Promise<LanguagesResponse[]> {
        const findEntity = await this.languageRepository.find();
        return findEntity.map(toLanguagesResponse);
    }

    async saveWishLanguages(user: User, wishLanguageIds: number[]): Promise<WishLanguagesResponse[]> {
        const wishLanguages = await Promise.all(
            wishLanguageIds.map((id) => this.languageRepository.findOne({where: {id}})),
        );
        const savedWishLanguages = await Promise.all(
            wishLanguages
                .filter((e): e is Languages => e !== undefined)  // undefined 필터링
                .map((e) => this.wishLanguagesRepository.save(new WishLanguages(user, e)))
        );
        const result = savedWishLanguages.map(toWishLanguagesResponse);

        return result;
    }

    async saveNativeLanguages(user: User, nativeLanguageIds: number[]): Promise<NativeLanguagesResponse[]> {
        const nativeLanguages = await Promise.all(
            nativeLanguageIds.map((id) => this.languageRepository.findOne({where: {id}})),
        );
        const saved = await Promise.all(
            nativeLanguages.filter((e): e is Languages => e !== undefined)
                .map((e) => this.nativeLanguageRepository.save(new NativeLanguages(user, e)))
        );
        const result = saved.map(toNativeLanguagesResponse);

        return result;
    }
}