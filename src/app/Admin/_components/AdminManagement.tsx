/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  createUserWithEmailAndPassword,
  getAuth,
} from 'firebase/auth';
import { 
  ref as dbRef, 
  set, 
  update,
  get,
  onValue, 
} from 'firebase/database';
import { auth, database } from '../../../../.firebase/firebase';

interface UserData {
  uid: string;
  email: string;
  role: string;
  createdAt: string;
  displayName?: string;
}

const AdminManagement: React.FC = () => {
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [adminUsers, setAdminUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing admin users
  useEffect(() => {
    const usersRef = dbRef(database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Filter users to only include admins
        const adminsList = Object.values(data as Record<string, UserData>)
          .filter(user => user.role === 'admin');
        setAdminUsers(adminsList);
      } else {
        setAdminUsers([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate inputs
      if (!newAdminEmail || !newAdminPassword) {
        throw new Error('Please fill in all required fields');
      }

      if (newAdminPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Check if email already exists
      const usersRef = dbRef(database, 'users');
      const usersSnapshot = await get(usersRef);
      const existingUsers = usersSnapshot.val() || {};
      
      const emailExists = Object.values(existingUsers).some(
        (user: any) => user.email === newAdminEmail
      );

      if (emailExists) {
        throw new Error('A user with this email already exists');
      }

      // Create the user in Firebase Auth
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(
        auth,
        newAdminEmail,
        newAdminPassword
      );

      // Store user data in Realtime Database with admin role
      await set(dbRef(database, `users/${user.uid}`), {
        uid: user.uid,
        email: user.email,
        displayName: newAdminName || null,
        role: 'admin',
        createdAt: new Date().toISOString(),
      });

      Swal.fire('Success', 'New admin user created successfully', 'success');
      
      // Clear form
      setNewAdminEmail('');
      setNewAdminPassword('');
      setNewAdminName('');
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const removeAdminRole = async (user: UserData) => {
    const currentUser = auth.currentUser;
  
    if (!currentUser) {
      Swal.fire('Error', 'You must be logged in to perform this action', 'error');
      return;
    }
  
    // Check if trying to remove own admin privileges
    if (user.uid === currentUser.uid) {
      Swal.fire({
        title: 'Not Allowed',
        text: 'You cannot remove your own admin privileges',
        icon: 'warning',
      });
      return;
    }
  
    // Verify current user is still an admin
    const currentUserRef = dbRef(database, `users/${currentUser.uid}`);
    const snapshot = await get(currentUserRef);
    const currentUserData = snapshot.val();
  
    if (!currentUserData || currentUserData.role !== 'admin') {
      Swal.fire('Error', 'You do not have permission to perform this action', 'error');
      return;
    }
  
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Remove admin privileges from ${user.email}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove',
    });
  
    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        // Update user role to 'user' instead of deleting the record
        await update(dbRef(database, `users/${user.uid}`), {
          role: 'user',
          updatedAt: new Date().toISOString()
        });
  
        Swal.fire('Success', 'Admin privileges removed successfully', 'success');
      } catch (error: any) {
        console.error('Error removing admin privileges:', error);
        Swal.fire('Error', error.message, 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mb-4">
      <div className="card">
        <div className="card-header bg-dark text-info">
          <h3 className="card-title mb-0">Admin Management</h3>
        </div>
        <div className="card-body">
          {/* Create New Admin Form */}
          <form onSubmit={createNewAdmin} className="mb-4">
            <div className="mb-3">
              <label className="form-label">
                Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                className="form-control"
                placeholder="Enter name"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="form-control"
                placeholder="Enter email"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                className="form-control"
                placeholder="Enter password"
                minLength={6}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create New Admin'}
            </button>
          </form>
          <span className="text-danger">Note: For enhanced security, you will be LOGGED OUT after creating a new admin.</span>


          {/* Admin Users List */}
          <div className="mt-4">
            <h4 className="mb-3">Current Admin Users</h4>
            {isLoading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                {adminUsers.length === 0 ? (
                  <div className="alert alert-info">No admin users found.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Created At</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminUsers.map((user) => (
                          <tr key={user.uid}>
                            <td>{user.displayName || 'N/A'}</td>
                            <td>{user.email}</td>
                            <td>
                              {new Date(user.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>
                            <td>
                              <button
                                onClick={() => removeAdminRole(user)}
                                className="btn btn-danger btn-sm"
                                disabled={isLoading}
                              >
                                Remove Admin
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;