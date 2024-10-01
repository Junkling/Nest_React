import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Languages } from "../languages/languages.entity";

@Entity('native_languages')
export class NativeLanguages {
    @PrimaryGeneratedColumn()
    readonly id!: number;

    @ManyToOne(() => User, (user) => user.nativeLanguages)
    user!: User;

    @ManyToOne(() => Languages, (language) => language.nativeLanguages)
    language!: Languages;

    constructor(user: User, language: Languages) {
        this.user = user;
        this.language = language;
    }
}