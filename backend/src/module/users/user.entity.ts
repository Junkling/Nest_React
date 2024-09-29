import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Boards} from "../boards/boards.entity";
import {IsInt, IsNotEmpty, Min} from "class-validator";
import {Languages} from "../languages/languages.entity";
import {WishLanguages} from "../languages/wish-languages.entity";
import {NativeLanguages} from "../languages/native-languages.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    readonly id!: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column()
    @IsInt()
    @Min(0, {message: 'Age must be a positive number'})
    age: number;

    @Column()
    introduce?: string;

    @OneToMany(() => Boards, (boards) => boards.user)
    readonly boardList!: Boards[];  // 배열 초기화를 제거

    @OneToMany(() => NativeLanguages, (nativeLanguages) => nativeLanguages.user)
    readonly nativeLanguages!: NativeLanguages[]; // 숙련 언어 리스트

    @OneToMany(() => WishLanguages, (wishLanguage) => wishLanguage.user)
    readonly wishLanguages!: WishLanguages[]; // 학습하고자 하는 언어 리스트

    @Column()
    matchOpenStatus: boolean;

    constructor(username: string, password: string, name: string, age: number, introduce?: string) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.age = age;
        this.introduce = introduce;
        this.matchOpenStatus = true;
    }

    getId() {
        return this.id;
    }

    getUsername() {
        return this.username;
    }

    getPassword() {
        return this.password;
    }

    getName() {
        return this.name;
    }

    getAge() {
        return this.age;
    }

    getIntroduce() {
        return this.introduce;
    }

    getBoardList() {
        return this.boardList;
    }

    editUser(name: string, age: number, introduce?: string) {
        this.name = name;
        this.age = age;
        this.introduce = introduce;
        return this;
    }

    changeOpenStatus() {
        this.matchOpenStatus = !this.matchOpenStatus;
    }

}
