import {Body, Controller, Get, Param, Post, Req, UseGuards} from "@nestjs/common";
import {InviteService} from "./Invite.service";
import {UserResponse} from "../../type/user/UserResponse";
import {JwtAuthGuard} from "../../auth/auth.guard";
import {InviteRequest} from "../../type/invites/InviteRequest";
import {Invite} from "./invites.entity";

@Controller('invites')
export class InviteController {

    constructor(
        private readonly inviteService: InviteService,
    ) {
    }

    @Get(":wishLanguageId")
    @UseGuards(JwtAuthGuard)  // JWT 토큰 검증이 필요한 엔드포인트에 적용
    matchUser(@Req() req: any, @Param("wishLanguageId") wishLanguageId: number): Promise<UserResponse[]> {
        if (!wishLanguageId || !req.user.id) {
            console.log(`wishLanguageId: ${wishLanguageId}`);
            console.log(`user.id: ${req.user.id}`);
            throw new Error("파라미터가 비정상입니다.");
        }
        //Todo : 이미 요청 보낸 유저는 제외하는 로직 추가해야 함
        return this.inviteService.searchUserForLanguageExchange(req.user.id, req.params.wishLanguageId);
    }
    //Todo: 랜덤 유저 하나 가져오기 api도 추가해야함

    @Post()
    @UseGuards(JwtAuthGuard)  // JWT 토큰 검증이 필요한 엔드포인트에 적용
    sendInviteRequest(@Body() inviteRequest: InviteRequest, @Req() req: any): Promise<Invite> {
        return this.inviteService.creatInvite(inviteRequest, req.user.id);
    }
}