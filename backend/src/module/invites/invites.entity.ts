import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../users/user.entity";
import {InviteStatus} from "../../type/invites/InviteStatus";
import {BaseTimeEntity} from "../common/base.time.entity";

@Entity('invites')
export class Invite extends BaseTimeEntity {
    @PrimaryGeneratedColumn()
    readonly id!: number;

    @Column({default: 'NO_TEXT'})
    content: string;

    @ManyToOne(() => User, (user) => user.inviteSend)
    sender!: User;

    @ManyToOne(() => User, (user) => user.inviteReceipt)
    recipient!: User;

    @Column({
        type: 'enum',
        enum: InviteStatus,
        default: InviteStatus.UNDEFINED,
    })
    status!: InviteStatus;

    constructor(sender: User, recipient: User, content: string, status: InviteStatus) {
        super();  // 부모 클래스(BaseEntity)의 생성자 호출
        this.sender = sender;
        this.content = content;
        this.recipient = recipient;
        this.status = status;
    }
}