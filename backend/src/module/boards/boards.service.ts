import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Boards} from "./boards.entity";
import {Repository} from "typeorm";
import {orElseThrow} from "../../db/utils";
import {PageRequest, toFindOption} from "../../type/pagenation/PageRequest";
import {PageResult} from "../../type/pagenation/PageResult";

@Injectable()
export class BoardsService {
    constructor(@InjectRepository(Boards) private readonly boardRepository: Repository<Boards>) {
    }

    findMany(pageReq: PageRequest): Promise<PageResult<Boards>> {
        console.log(`[findMany] : size = ${pageReq.size}, page = ${pageReq.page}`);
        return pageReq.page <= 0 ? this.findAll() : this.findAllByPage(pageReq);
    }

    private async findAll(): Promise<PageResult<Boards>> {
        console.log(`[findAll] : size = 0`)
        const data = await this.boardRepository.find();
        const page = 0;
        const totalPages = 0;
        const totalCount = data.length;
        return {data, page, totalPages, totalCount};
    }

    private async findAllByPage(pageReq: PageRequest): Promise<PageResult<Boards>> {
        console.log(`[findAllByPage] : size = ${pageReq.size}, page = ${pageReq.page}`);
        const [data, count] = await this.boardRepository.findAndCount(toFindOption(pageReq));
        const page = pageReq.page;
        const totalCount = count;
        const totalPages = Math.ceil(totalCount / pageReq.size);
        return {data, page, totalPages, totalCount};
    }

    async findOne(id: number): Promise<Boards> {
        return orElseThrow(await this.boardRepository.findOne({where: {id}}), () => new NotFoundException('해당 게시물을 찾지 못했습니다.'));
    }


    async create(req: Omit<Boards, "id">) {
        return this.boardRepository.save(req);
    }

    async remove(id: number): Promise<void> {
        await this.boardRepository.delete(id);
    }
}