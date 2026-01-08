'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import SubHeader from '@/components/custom/SubHeader'
import { toast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { fetchUsersApi } from '@/hooks/orgHooks'
import { showSuccess } from '@/utils/toast'
import { updateUser } from '@/hooks/authHooks'
import useRolesStore from "@/lib/roleStore"
import { useLoaderStore } from '@/lib/loaderStore'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role?: string
  permissions?: { module: string; actions: string[] }[]
}

export default function UsersListPage() {
  const router = useRouter()
  const toastShown = useRef(false)
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { showLoader, hideLoader } = useLoaderStore();
  const roles = useRolesStore((state) => state.simpleRoles);

  const handleSaveChanges = async () => {
    if (!selectedUser?.id) return;
    try {
      showLoader();
      const payload = {
        Role: selectedUser.role,
        custom: false,
        overridePermissions: selectedUser.permissions?.map((perm) => ({
          module: perm.module,
          actions: perm.actions,
        })) || [],
      };
      const res = await updateUser(payload, selectedUser.id);
      if (res && res.status === 200) {
        toast({ title: "User updated successfully" });
        setShowEditModal(false);
      } else {
        toast({ title: "Failed to update user", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast({ title: "Error updating user", variant: "destructive" });
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      showLoader();
      setError(null);
      try {
        const res = await fetchUsersApi();
        const mappedUsers = res.users.map((u: any) => ({
          id: u.memberId,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          permissions: u.permissions?.map((p: any) => ({
            module: p.module,
            actions: p.actions?.filter(Boolean) || [],
          })),
        }));
        setUsers(mappedUsers);
        if (!toastShown.current) {
          showSuccess("Users fetched successfully");
          toastShown.current = true;
        }
      } catch (err) {
        console.error(err);
        toast({ title: "Error fetching users" });
      } finally {
        hideLoader();
      }
    };
    getUsers();
  }, [showLoader, hideLoader]);

  const confirmDelete = () => {
    if (!selectedUser) return
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id))
    setShowDeleteModal(false)
    toast({ title: 'User deleted successfully' })
  }

  return (
    <div className="min-h-screen">
      <SubHeader title="Users" />

      {error && <p className="px-6 text-red-600">{error}</p>}

      <div className="flex gap-6 px-6 pt-6">
        <div className="flex-1">
          <Card>
            <CardContent className="p-0">
              <table className="w-full border-collapse text-sm text-left">
                <thead className="text-primary/80 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 border-b">Name</th>
                    <th className="px-4 py-3 border-b">Email</th>
                    <th className="px-4 py-3 border-b">Phone</th>
                    <th className="px-4 py-3 border-b">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="odd:bg-white even:bg-primary/50">
                      <td className="px-4 py-3 border-b">{user.name}</td>
                      <td className="px-4 py-3 border-b">{user.email}</td>
                      <td className="px-4 py-3 border-b">{user.phone}</td>
                      <td className="px-4 py-3 border-b">
                        {user.role && (
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                              user.role === 'User' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {user.role}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete <strong>{selectedUser?.name}</strong>?</p>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit User: {selectedUser?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <label className="font-semibold block mb-1">Role</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedUser?.role || ""}
                onChange={(e) => setSelectedUser((prev) => prev ? { ...prev, role: e.target.value } : prev)}
              >
                {Array.isArray(roles) && roles.length > 0 ? (
                  roles.map((role) => <option key={role._id} value={role.name}>{role.name}</option>)
                ) : (
                  <option disabled>No roles available</option>
                )}
              </select>
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
