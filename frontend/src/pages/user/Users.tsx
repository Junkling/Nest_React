import React, {Component, useEffect, useState} from 'react';
import {User} from "../../types/User";
import UserList from "../../components/user-list/UserList";
import UserForm from "../../components/user-form/UserForm";
import {apiService} from "../../apis/apiService";

const Users = () =>{
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        apiService.fetchUsers()
            .then(setUsers)
            .catch(error => {
                console.error('유저 세팅 오류', error);
            });
    }, []);

    const handleAddUser = (name: string, age: number) => {
        apiService.addUser(name, age)
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