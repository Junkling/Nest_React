import {Body, Controller, Delete, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {UserRequest} from "../../type/user/UserRequest";
import {toUserResponse, UserResponse} from "../../type/user/UserResponse";
import {LoginRequest} from "../../type/user/LoginRequest";
import {JwtAuthGuard} from "../../auth/auth.guard";
import {LanguageService} from "../languages/languages.service";
import {UserLanguageResponse} from "../../type/user/UserLanguageResponse";
import {User} from "./user.entity";

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService) {
    }

    @Get()
    findAll(): Promise<UserResponse[]> {
        return this.usersService.findAll();
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
    @UseGuards(JwtAuthGuard)  // JWT 토큰 검증이 필요한 엔드포인트에 적용
    getProfile(@Req() req: any) {
        return req.user;  // JWT에서 추출된 사용자 정보
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<UserLanguageResponse> {
        return this.usersService.findOne(id);
    }
}
