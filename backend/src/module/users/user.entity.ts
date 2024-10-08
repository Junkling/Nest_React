import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Boards} from "../boards/boards.entity";
import {IsInt, Min} from "class-validator";
import {WishLanguages} from "../languages/wish-languages.entity";
import {NativeLanguages} from "../languages/native-languages.entity";
import {Invite} from "../invites/invites.entity";
import {Gender} from "../../type/user/Gender";
import {BaseTimeEntity} from "../common/base.time.entity";
import {UserChatRoom} from "../chat/user-chat-room.entity";

@Entity('users')
export class User extends BaseTimeEntity{
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

    @OneToMany(() => Invite, (invite) => invite.sender)
    readonly inviteSend!: Invite[];

    @OneToMany(() => Invite, (invite) => invite.recipient)
    readonly inviteReceipt!: Invite[];

    @OneToMany(() => UserChatRoom, userChatRoom => userChatRoom.user)
    readonly userChatRoom!: UserChatRoom[];

    @Column()
    matchOpenStatus: boolean;

    @Column({
        type: 'enum',
        enum: Gender,
        default: Gender.UNKNOWN,
    })
    gender: Gender;

    constructor(username: string, password: string, name: string, age: number, introduce?: string, gender?: Gender) {
        super();
        this.username = username;
        this.password = password;
        this.name = name;
        this.age = age;
        this.introduce = introduce;
        this.matchOpenStatus = true;
        if (!gender) {
            this.gender = Gender.UNKNOWN;
        } else {
            this.gender = gender;
        }
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
