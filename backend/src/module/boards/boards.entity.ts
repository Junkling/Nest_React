import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../users/user.entity";

@Entity('boards')
export class Boards {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToOne(type => User, (user) => user.id)
    user: User | null;

    constructor(title: string, description: string, user: User | null) {
        this.title = title;
        this.description = description;
        this.user = user;
    }

}