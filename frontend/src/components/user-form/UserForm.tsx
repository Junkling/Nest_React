import React, { useState } from 'react';

interface UserFormProps {
    onAddUser: (name: string, age: number) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onAddUser }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState<number | undefined>(undefined);

    const handleSubmit = () => {
        if (name && age !== undefined) {
            onAddUser(name, age);
            setName('');
            setAge(undefined);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name"
            />
            <input
                type="number"
                value={age}
                onChange={e => setAge(parseInt(e.target.value, 10))}
                placeholder="Age"
            />
            <button onClick={handleSubmit}>Add User</button>
        </div>
    );
};

export default UserForm;
