import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {orElseThrow} from "../../db/utils";
import {UserRequest} from "../../type/user/UserRequest";
import {toUserResponse, UserResponse} from "../../type/user/UserResponse";


@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,) {
    }

    async findAll(): Promise<(UserResponse)[]> {
        const userResult = await this.userRepository.find({relations: ['boardList']});
        const result = userResult.map(toUserResponse);
        return result;

    }

    async findOne(id: number): Promise<UserResponse> {
        const user = await orElseThrow(await this.userRepository.findOne({
            where: {id},
            relations: ['boardList']
        }), () => new NotFoundException(`해당 리소스를 찾지 못했습니다. ID = ${id}`));
        return toUserResponse(user);
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async create(req: UserRequest): Promise<UserResponse> {
        const saved = await this.userRepository.save(new User(req.username, req.password, req.name, req.age, req.introduce));
        return toUserResponse(saved);
    }

    async login(req: LoginRequest): Promise<UserResponse> {
        const user = await orElseThrow(this.userRepository.findOne({where: {username: req.username},relations: ['boardList']}), () => new NotFoundException(`해당 리소스를 찾지 못했습니다.`));
        if (user?.getPassword() != req.password) {
            throw new Error('비밀번호가 일치하지 않습니다.');
        }
        return toUserResponse(user);
    }
}
