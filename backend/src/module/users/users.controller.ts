import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {UserRequest} from "../../type/user/UserRequest";
import {UserResponse} from "../../type/user/UserResponse";
import {LoginRequest} from "../../type/user/LoginRequest";
import {JwtAuthGuard} from "../../auth/auth.guard";
import {UserLanguageResponse} from "../../type/user/UserLanguageResponse";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {PageRequest} from "../../type/pagenation/PageRequest";
import {PageResult} from "../../type/pagenation/PageResult";
import {UserWithChatRoomResponse} from "../../type/user/UserWithChatRoomResponse";
import {ChatRoomResponse} from "../../type/chat/ChatRoomResponse";


@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService) {
    }

    @Get()
    findAll(@Query() pageReq: PageRequest): Promise<UserLanguageResponse[] | PageResult<UserLanguageResponse>> {
        return this.usersService.findAll(pageReq);
    }

    @Post()
    create(@Body() req: UserRequest): Promise<UserLanguageResponse> {
        return this.usersService.create(req);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.usersService.remove(id);
    }

    @Post('/login')
    login(@Body() req: LoginRequest): Promise<{ token: string, userResponse: UserResponse }> {
        return this.usersService.login(req);
    }
    @Get('/profile')
    @ApiBearerAuth() // Swagger 문서에서 인증 필요 표시
    @UseGuards(JwtAuthGuard)  // JWT 토큰 검증이 필요한 엔드포인트에 적용
    async getProfile(@Req() req: any): Promise<UserWithChatRoomResponse> {
        console.log(`user.id: ${req.user.id}`);

        const [user, chatRoomList] = await Promise.all([
            this.usersService.findOne(req.user.id), // 사용자 정보
            this.usersService.findUserChatRoom(req.user.id), // 채팅방 정보
        ]);

        const result: UserWithChatRoomResponse = {
            ...user, // 사용자 정보
            chatRoomList: chatRoomList // 채팅방 리스트
        };

        return result;
    }

    @Get('chatroom')
    @UseGuards(JwtAuthGuard)  // JWT 토큰 검증이 필요한 엔드포인트에 적용
    @ApiBearerAuth() // Swagger 문서에서 인증 필요 표시
    getChatRoom(@Req() req: any): Promise<ChatRoomResponse[]> {
        return this.usersService.findUserChatRoom(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<UserLanguageResponse> {
        return this.usersService.findOne(id);
    }

    @Patch('match')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth() // Swagger 문서에서 인증 필요 표시
    changeMatchStatus(@Req() req: any): Promise<UserResponse> {
        return this.usersService.changeMatchStatus(req.user.id);
    }
}
