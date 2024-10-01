import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Languages } from "../languages/languages.entity";

@Entity('wish_languages')
export class WishLanguages {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.wishLanguages)
    user!: User;

    @ManyToOne(() => Languages, (language) => language.wishLanguages)
    language!: Languages;

    constructor(user: User, language:Languages) {
        this.user = user;
        this.language = language;
    }
}