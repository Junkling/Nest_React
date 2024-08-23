import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {UsersService} from "./users.service";
import {UserRequest} from "../../type/user/UserRequest";
import {UserResponse} from "../../type/user/UserResponse";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }
    @Get()
    findAll(): Promise<UserResponse[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<UserResponse> {
        return this.usersService.findOne(id);
    }

    @Post()
    create(@Body() user: UserRequest): Promise<UserResponse> {
        return this.usersService.create(user);
    }
    @Delete(':id')
    remove(@Param('id') id: number): Promise<void> {
        return this.usersService.remove(id);
    }
}
