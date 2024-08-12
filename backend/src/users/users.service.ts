import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {orElseThrow} from "../db/utils";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,) {
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        return orElseThrow(await this.userRepository.findOne({where: {id}}), () => new NotFoundException(`해당 리소스를 찾지 못했습니다. ID = ${id}`))
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async create(user: User): Promise<User> {
        return this.userRepository.save(user);
    }
}
