import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('users')
export class User{
    @PrimaryGeneratedColumn()
    private id: number;

    @Column()
    private name: string;

    @Column()
    private age: number;

    @Column()
    private introduce!: string;

    constructor(id: number, name: string, age: number) {
        this.id = id;
        this.name = name;
        this.age = age;
    }
}
