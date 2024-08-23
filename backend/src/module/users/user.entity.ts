import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Boards} from "../boards/boards.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    age: number;

    @Column()
    introduce!: string;

    // @OneToMany(type => Boards, (boards) => boards.user)
    // boardList: Boards[];

    constructor(id: number, name: string, age: number) {
        this.id = id;
        this.name = name;
        this.age = age;
        // this.boardList = [];
    }

}
