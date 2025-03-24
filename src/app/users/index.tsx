// ./src/app/users/index.tsx
'use client';

import { useEffect, useState } from 'react';
import { User } from '@/db/schema';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  },);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) {
        console.error('Failed to fetch users:', res.status);
        return;
      }
      const data: User[] = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewUserId('');
    setNewUserEmail('');
    setNewUserPassword('');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newUserId,
          email: newUserEmail,
          password: newUserPassword,
        }),
      });

      if (res.ok) {
        console.log('User created successfully');
        closeModal();
        fetchUsers();
      } else {
        const errorData = await res.json();
        console.error('Failed to create user:', errorData);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      <button onClick={openModal}>Create New User</button>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '400px',
            }}
          >
            <h2>Create User</h2>
            <form onSubmit={handleCreateUser}>
              <div>
                <label htmlFor="id">ID:</label>
                <input
                  type="text"
                  id="id"
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', margin: '5px 0', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', margin: '5px 0', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', margin: '5px 0', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={closeModal} style={{ marginRight: '10px', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.email} ({user.password})
          </li>
        ))}
      </ul>
    </div>
  );
}