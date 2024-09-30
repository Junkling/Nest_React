import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {WishLanguages} from "./wish-languages.entity";
import {NativeLanguages} from "./native-languages.entity";

@Entity('languages')
export class Languages {

    @PrimaryGeneratedColumn()
    readonly id!: number;

    @Column()
    code: string;

    @Column()
    name: string;

    @OneToMany(() => WishLanguages, (wishLanguages) => wishLanguages.language)
    wishLanguages!: WishLanguages[];

    @OneToMany(() => NativeLanguages, (nativeLanguages) => nativeLanguages.language)
    nativeLanguages!: NativeLanguages[];


    constructor(code: string, name: string) {
        this.code = code;
        this.name = name;
    }
}