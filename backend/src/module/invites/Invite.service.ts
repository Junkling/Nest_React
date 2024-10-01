import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Invite} from "./invites.entity";
import {Repository} from "typeorm";
import {User} from "../users/user.entity";
import {NativeLanguages} from "../languages/native-languages.entity";
import {WishLanguages} from "../languages/wish-languages.entity";
import {Languages} from "../languages/languages.entity";
import {orElseThrow} from "../../db/db.utils";
import {toUserResponse, UserResponse} from "../../type/user/UserResponse";
import {InviteRequest} from "../../type/invites/InviteRequest";
import {InviteStatus} from "../../type/invites/InviteStatus";

@Injectable()
export class InviteService {

    constructor(
        @InjectRepository(Invite) private readonly inviteRepository: Repository<Invite>
        , @InjectRepository(User) private readonly userRepository: Repository<User>
        , @InjectRepository(NativeLanguages) private readonly nativeLanguageRepository: Repository<NativeLanguages>
        , @InjectRepository(Languages) private readonly languagesRepository: Repository<Languages>
        , @InjectRepository(WishLanguages) private readonly wishLanguageRepository: Repository<WishLanguages>) {
    }

    //Todo : 이미 요청 보낸 유저는 제외하는 로직 추가해야 함
    async searchUserForLanguageExchange(
        userId: number,
        wishLanguageId: number,
    ): Promise<UserResponse[]> {
        // 1. 요청한 유저의 숙련 언어 가져오기
        const find = await this.userRepository.findOne({
            where: {id: userId},
            relations: ['nativeLanguages', 'nativeLanguages.language'],
        });
        const requestingUser = orElseThrow(find, () => new NotFoundException('유저 정보를 찾을 수 없습니다.'));


        const requestingUserNativeLanguageIds = requestingUser.nativeLanguages.map(
            (nativeLanguage) => {
                return nativeLanguage.language.id;
            },
        );
        // 2. 요청한 언어(wishLanguageId)에 숙련된 유저들 찾기
        // const nativeSpeakers = await this.nativeLanguageRepository
        //     .createQueryBuilder('native')
        //     .leftJoinAndSelect('native.user', 'user')
        //     .where('native.language.id = :wishLanguageId', { wishLanguageId })
        //     .andWhere('user.matchOpenStatus = true') // 매칭 상태가 열려있는 유저만 검색
        //     .getMany();
        const nativeSpeakers = await this.nativeLanguageRepository.find({
            where: {
                language: {id: wishLanguageId},  // 언어 ID로 필터링
                user: {matchOpenStatus: true}  // 매칭 상태가 열려있는 사용자만
            },
            relations: ['user'],  // user 관계를 포함하여 조회
        });

        // 3. 찾은 유저들 중, 요청한 유저의 숙련 언어가 해당 유저의 배우고 싶은 언어에 포함된 유저 필터링
        const exchangeableUsers = await Promise.all(
            nativeSpeakers.map(async (nativeSpeaker) => {
                const user = nativeSpeaker.user;
                const userWishLanguageIds = (
                    await this.wishLanguageRepository.find({
                        where: {user: {id: user.id}},
                        relations: ['language'],
                    })
                ).map((wishLanguage) => wishLanguage.language.id);
                // 요청 유저의 숙련 언어가 해당 유저의 배우고 싶은 언어에 포함되면 매칭 가능
                const isExchangeable = requestingUserNativeLanguageIds.some((id) =>
                    userWishLanguageIds.includes(id),
                );
                return isExchangeable ? user : null;
            }),
        );
        // 4. 매칭 가능한 유저 중 랜덤으로 선택
        const filteredUsers = exchangeableUsers.filter((user) => user !== null) as User[];

        return filteredUsers.map(toUserResponse);
    }

    async randomMatch(
        userId: number,
        wishLanguageId: number,): Promise<UserResponse | null> {
        const userList = await this.searchUserForLanguageExchange(userId, wishLanguageId);
        // 랜덤 매칭 로직
        if (userList.length > 0) {
            const randomIndex = Math.floor(Math.random() * userList.length);
            const partner = userList[randomIndex] as User;
            return toUserResponse(partner);
        }
        // 매칭 대상이 없을 경우 null 반환
        return null;
    }

    async creatInvite(req: InviteRequest, userId: number): Promise<Invite> {
        const user = orElseThrow(await this.userRepository.findOne({where: {id: userId}}),()=> new NotFoundException('유저를 찾을 수 없습니다.'));
        const partner = orElseThrow(await this.userRepository.findOne({where: {id: req.partnerId}}), () => new NotFoundException('유저를 찾을 수 없습니다.'));
        //Todo: 이미 있으면 막기
        const saved = await this.inviteRepository.save(
            new Invite(user, partner, InviteStatus.OPEN)
        );
        return saved;
    }
}