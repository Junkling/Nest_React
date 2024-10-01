import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../users/user.entity";
import {InviteStatus} from "../../type/invites/InviteStatus";

@Entity('invites')
export class Invite {
    @PrimaryGeneratedColumn()
    readonly id!: number;

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

    constructor(sender: User, recipient: User, status: InviteStatus) {
        this.sender = sender;
        this.recipient = recipient;
        this.status = status;
    }
}