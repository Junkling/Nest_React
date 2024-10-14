import {Body, Controller, Delete, Get, Param, Post, Query} from "@nestjs/common";
import {BoardsService} from "./boards.service";
import {PageResult} from "../../type/pagenation/PageResult";
import {PageRequest} from "../../type/pagenation/PageRequest";
import {BoardRequest} from "../../type/board/BoardRequest";
import {BoardResponse} from "../../type/board/BoardResponse";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('boards')
@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) {}

    @Get()
    findAll(
        @Query() pageReq: PageRequest,
    ): Promise<PageResult<BoardResponse>> {
        return this.boardsService.findMany(pageReq);
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<BoardResponse>{
        return this.boardsService.findOne(id);
    }

    @Post()
    createBoard(@Body() req: BoardRequest): Promise<BoardResponse> {
        return this.boardsService.create(req);
    }

    @Delete(':id')
    deleteById(@Param('id') id: number) {
        return this.boardsService.remove(id);
    }

}