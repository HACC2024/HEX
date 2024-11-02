/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getAuth } from "firebase/auth";
import { ref as dbRef, update, remove, onValue, get } from "firebase/database";
import { database } from "../../../../.firebase/firebase";

interface UserData {
  uid: string;
  email: string;
  role: string;
  status?: string;
  active?: boolean;
  createdAt: string;
  deactivatedAt?: string;
  displayName?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const auth = getAuth();

  // Fetch all users
  useEffect(() => {
    const usersRef = dbRef(database, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.values(data as Record<string, UserData>);
        setUsers(usersList);
      } else {
        setUsers([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const promoteToAdmin = async (user: UserData) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Swal.fire(
        "Error",
        "You must be logged in to perform this action",
        "error"
      );
      return;
    }

    // Verify current user is an admin
    const currentUserRef = dbRef(database, `users/${currentUser.uid}`);
    const snapshot = await get(currentUserRef);
    const currentUserData = snapshot.val();

    if (!currentUserData || currentUserData.role !== "admin") {
      Swal.fire(
        "Error",
        "You do not have permission to perform this action",
        "error"
      );
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Promote ${user.email} to admin?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, promote",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await update(dbRef(database, `users/${user.uid}`), {
          role: "admin",
        });

        Swal.fire("Success", "User promoted to admin successfully", "success");
      } catch (error: any) {
        console.error("Error promoting user:", error);
        Swal.fire("Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deactivateUser = async (user: UserData) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Swal.fire(
        "Error",
        "You must be logged in to perform this action",
        "error"
      );
      return;
    }

    // Verify current user is an admin
    const currentUserRef = dbRef(database, `users/${currentUser.uid}`);
    const snapshot = await get(currentUserRef);
    const currentUserData = snapshot.val();

    if (!currentUserData || currentUserData.role !== "admin") {
      Swal.fire(
        "Error",
        "You do not have permission to perform this action",
        "error"
      );
      return;
    }

    // Prevent deactivating your own account
    if (user.uid === currentUser.uid) {
      Swal.fire("Error", "You cannot deactivate your own account", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Deactivate ${user.email}'s account?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, deactivate",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await update(dbRef(database, `users/${user.uid}`), {
          status: "deactivated",
          active: false,
          deactivatedAt: new Date().toISOString(),
        });

        Swal.fire("Success", "User account deactivated successfully", "success");
      } catch (error: any) {
        console.error("Error deactivating user:", error);
        Swal.fire("Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const reactivateUser = async (user: UserData) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Swal.fire(
        "Error",
        "You must be logged in to perform this action",
        "error"
      );
      return;
    }

    // Verify current user is an admin
    const currentUserRef = dbRef(database, `users/${currentUser.uid}`);
    const snapshot = await get(currentUserRef);
    const currentUserData = snapshot.val();

    if (!currentUserData || currentUserData.role !== "admin") {
      Swal.fire(
        "Error",
        "You do not have permission to perform this action",
        "error"
      );
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Reactivate ${user.email}'s account?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reactivate",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await update(dbRef(database, `users/${user.uid}`), {
          status: "active",
          active: true,
          deactivatedAt: null,
        });

        Swal.fire("Success", "User account reactivated successfully", "success");
      } catch (error: any) {
        console.error("Error reactivating user:", error);
        Swal.fire("Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deleteUserAccount = async (user: UserData) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Swal.fire(
        "Error",
        "You must be logged in to perform this action",
        "error"
      );
      return;
    }

    // Verify current user is an admin
    const currentUserRef = dbRef(database, `users/${currentUser.uid}`);
    const snapshot = await get(currentUserRef);
    const currentUserData = snapshot.val();

    if (!currentUserData || currentUserData.role !== "admin") {
      Swal.fire(
        "Error",
        "You do not have permission to perform this action",
        "error"
      );
      return;
    }

    // Prevent deleting your own account
    if (user.uid === currentUser.uid) {
      Swal.fire("Error", "You cannot delete your own account", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Permanently delete ${user.email}'s account? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete permanently",
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        // Delete from Realtime Database
        await remove(dbRef(database, `users/${user.uid}`));

        Swal.fire(
          "Success",
          "User data has been permanently deleted",
          "success"
        );
      } catch (error: any) {
        console.error("Error deleting user:", error);
        Swal.fire("Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mb-4">
      <div className="card">
        <div className="card-header bg-info">
          <h3 className="card-title mb-0">User Management</h3>
        </div>
        <div className="card-body">
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search users by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Users List */}
          <div className="mt-4">
            <h4 className="mb-3">User Accounts</h4>
            {isLoading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                {filteredUsers.length === 0 ? (
                  <div className="alert alert-info">
                    {searchTerm
                      ? "No users found matching your search."
                      : "No users found."}
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Created At</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.uid}>
                            <td>{user.displayName || "N/A"}</td>
                            <td>{user.email}</td>
                            <td>
                              <span
                                className={`badge ${
                                  user.role === "admin"
                                    ? "bg-primary"
                                    : "bg-secondary"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  user.status === "deactivated"
                                    ? "bg-danger"
                                    : "bg-success"
                                }`}
                              >
                                {user.status || "active"}
                              </span>
                            </td>
                            <td>
                              {new Date(user.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                {user.role !== "admin" && (
                                  <button
                                    onClick={() => promoteToAdmin(user)}
                                    className="btn btn-success btn-sm"
                                    disabled={isLoading}
                                  >
                                    Promote to Admin
                                  </button>
                                )}
                                {user.status !== "deactivated" ? (
                                  <button
                                    onClick={() => deactivateUser(user)}
                                    className="btn btn-warning btn-sm ms-2"
                                    disabled={isLoading}
                                  >
                                    Deactivate
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => reactivateUser(user)}
                                    className="btn btn-info btn-sm ms-2"
                                    disabled={isLoading}
                                  >
                                    Reactivate
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteUserAccount(user)}
                                  className="btn btn-danger btn-sm ms-2"
                                  disabled={isLoading}
                                >
                                  Delete
                                </button>
                              </div>
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

export default UserManagement;