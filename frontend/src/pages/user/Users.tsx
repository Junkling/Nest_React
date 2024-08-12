import React, {Component, useEffect, useState} from 'react';
import {User} from "../../types/User";
import {addUser, fetchUsers} from "../../apis/apiService";
import UserList from "../../components/user-list/UserList";
import UserForm from "../../components/user-form/UserForm";

const Users = () =>{
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetchUsers()
            .then(setUsers)
            .catch(error => {
                console.error('유저 세팅 오류', error);
            });
    }, []);

    const handleAddUser = (name: string, age: number) => {
        addUser(name, age)
            .then(newUser => setUsers([...users, newUser]))
            .catch(error => {
                console.error('유저 생성 오류', error);
            });
    };

    return (
        <div>
            <h1>Users</h1>
            <UserList users={users} />
            <UserForm onAddUser={handleAddUser} />
        </div>
    );
};

export default Users;