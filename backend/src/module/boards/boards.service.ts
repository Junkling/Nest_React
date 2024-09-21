import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Boards} from "./boards.entity";
import {Repository} from "typeorm";
import {orElseThrow} from "../../db/db.utils";
import {PageRequest, toFindOption} from "../../type/pagenation/PageRequest";
import {PageResult} from "../../type/pagenation/PageResult";
import {User} from "../users/user.entity";
import {BoardRequest} from "../../type/board/BoardRequest";
import {BoardResponse, toBoardResponse} from "../../type/board/BoardResponse";

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(Boards) private readonly boardRepository: Repository<Boards>
        ,@InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
    }

    findMany(pageReq: PageRequest): Promise<PageResult<BoardResponse>> {
        console.log(`[findMany] : size = ${pageReq.size}, page = ${pageReq.page}`);
        return pageReq.page <= 0 ? this.findAll() : this.findAllByPage(pageReq);
    }

    private async findAll(): Promise<PageResult<BoardResponse>> {
        console.log(`[findAll] : size = 0`)
        const boards = await this.boardRepository.find({ relations: ['user'] }); // 관계 로드
        const data = boards.map(toBoardResponse); // 엔티티를 응답 타입으로 변환
        const page = 0;
        const totalPages = 0;
        const totalCount = data.length;
        return {data, page, totalPages, totalCount};
    }

    private async findAllByPage(pageReq: PageRequest): Promise<PageResult<BoardResponse>> {
        console.log(`[findAllByPage] : size = ${pageReq.size}, page = ${pageReq.page}`);
        const [boards, count] = await this.boardRepository.findAndCount({
            ...toFindOption(pageReq),
            relations: ['user'],
        });
        const data = boards.map(toBoardResponse); // 엔티티를 응답 타입으로 변환
        const page = pageReq.page;
        const totalCount = count;
        const totalPages = Math.ceil(totalCount / pageReq.size);
        return {data, page, totalPages, totalCount};
    }

    async findOne(id: number): Promise<BoardResponse> {
        const boards = orElseThrow(
            await this.boardRepository.findOne({ where: { id }, relations: ['user'] }), // user 관계 로드 추가
            () => new NotFoundException('해당 게시물을 찾지 못했습니다.')
        );
        return toBoardResponse(boards);
    }



    async create(req: BoardRequest): Promise<BoardResponse> {
        const user = await this.userRepository.findOne({where: {id: req.userId}});
        if(!user){throw Error("유저 정보가 없습니다.")}
        return toBoardResponse(await this.boardRepository.save(new Boards(req.title, req.description, user)));
    }

    async remove(id: number): Promise<void> {
        await this.boardRepository.delete(id);
    }
}