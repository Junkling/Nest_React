import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {orElseThrow} from "../../db/db.utils";
import {UserRequest} from "../../type/user/UserRequest";
import {toUserResponse, UserResponse} from "../../type/user/UserResponse";
import {LoginRequest} from "../../type/user/LoginRequest";
import * as bcrypt from 'bcrypt';
import {JwtUtilsService} from "../jwt/jwt.service";
import {LanguageService} from "../languages/languages.service";
import {
    entityToUserLanguageResponse,
    toUserLanguageResponse,
    UserLanguageResponse
} from "../../type/user/UserLanguageResponse";
import {entityToUserChatRoomResponse, UserChatRoomResponse} from "../../type/user/UserChatRoomResponse";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
        , private readonly jwtService: JwtUtilsService
        , private readonly languageService: LanguageService) {
    }

    async findAll(): Promise<UserLanguageResponse[]> {
        const userResult = await this.userRepository.find({relations: ['boardList', 'nativeLanguages', 'wishLanguages', 'wishLanguages.language', 'nativeLanguages.language']});
        const result = userResult.map(entityToUserLanguageResponse);
        return result;

    }

    async findOne(id: number): Promise<UserLanguageResponse> {
        // async findOne(id: number): Promise<User> {
        const [user] = await Promise.all([orElseThrow(await this.userRepository.findOne({
            where: {id},
            relations: ['boardList', 'nativeLanguages', 'wishLanguages', 'wishLanguages.language', 'nativeLanguages.language']
        }), () => new NotFoundException(`해당 리소스를 찾지 못했습니다. ID = ${id}`))]);
        return entityToUserLanguageResponse(user);
    }

    async findUserChatRoom(id: number): Promise<UserChatRoomResponse[]> {
        // async findOne(id: number): Promise<User> {
        const [user] = await Promise.all([orElseThrow(await this.userRepository.findOne({
            where: {id},
            relations: ['userChatRoom', 'userChatRoom.chatRoom']
        }), () => new NotFoundException(`해당 리소스를 찾지 못했습니다. ID = ${id}`))]);
        console.log(`user.chatRoom = ${user.userChatRoom.map(i => i.chatRoom.id)} , ${user.userChatRoom.map(i => i.chatRoom.roomName)}`);

        const list: UserChatRoomResponse[] = user.userChatRoom.map(userChatRoom =>
            entityToUserChatRoomResponse(userChatRoom.chatRoom)
        );

        return list;
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async create(req: UserRequest): Promise<UserLanguageResponse> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.password, saltRounds);  // 비밀번호 해시

        const saved = await this.userRepository.save(new User(req.username, hashedPassword, req.name, req.age, req.introduce, req.gender));
        const nativeLanguages = await this.languageService.saveNativeLanguages(saved, req.nativeLanguageIds);
        const wishLanguages = await this.languageService.saveWishLanguages(saved, req.wishLanguageIds);

        const userResult = toUserResponse(saved);

        return toUserLanguageResponse(userResult, nativeLanguages, wishLanguages);
    }

    async login(req: LoginRequest): Promise<{ token: string, userResponse: UserResponse }> {
        const find = await this.userRepository.findOne({where: {username: req.username}, relations: ['boardList']});
        const user = orElseThrow(find, () => new NotFoundException(`해당 리소스를 찾지 못했습니다.`));

        const pwCheck = await bcrypt.compare(req.password, user.password);
        if (!pwCheck) throw new UnauthorizedException('패스워드가 일치하지 않습니다.');

        // JWT 생성 (토큰에 userId와 user의 name을 포함)
        const token = this.jwtService.generateJwt(user.id, user.name);
        const userResponse = toUserResponse(user);
        return {token, userResponse};
    }

}
