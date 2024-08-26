import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../users/user.entity";

@Entity('boards')
export class Boards {
    @PrimaryGeneratedColumn()
    readonly id?: number;

    @Column()
    private title: string;

    @Column()
    private description: string;

    @ManyToOne(() => User, (user) => user.boardList)
    readonly user?: User;

    constructor(title: string, description: string, user?: User) {
        this.title = title;
        this.description = description;
        this.user = user;
    }

    getId() {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getDescription(): string {
        return this.description;
    }
    getUser(): User {
        return <User>this.user;
    }

    editBoard(title: string, description: string) {
        this.title = title;
        this.description = description;
        return this;
    }
}