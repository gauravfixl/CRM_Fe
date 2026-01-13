"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useAuthStore } from "@/lib/useAuthStore";
import Image from "next/image";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [localUser, setLocalUser] = useState(user || {});
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    if (user) setLocalUser(user);
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalUser((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateUser(localUser);
    setEditingSection(null);
    alert("Profile updated successfully!");
  };

  if (!localUser) return <p className="text-center mt-10">No user data found.</p>;

  return (
    <div className="mt-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="bg-white shadow rounded-lg p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={localUser.avatarUrl || "/default-avatar.png"}
              alt="User avatar"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{localUser.firstName} {localUser.lastName}</h2>
            <p className="text-gray-600">{localUser.role || "User"}</p>
            <p className="text-sm text-gray-500">{localUser.city || ""}, {localUser.state || ""}, {localUser.country || ""}</p>
          </div>
        </div>
        <button onClick={() => setEditingSection("personal")} className="text-sm text-gray-500 hover:text-black">✏️ Edit</button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">Personal information</h3>
          <button onClick={() => setEditingSection("personal")} className="text-sm text-gray-500 hover:text-black">✏️ Edit</button>
        </div>

        {editingSection === "personal" ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            {["firstName", "lastName", "email", "phone", "role"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={localUser[field] || ""}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ))}
            <div className="flex space-x-2 pt-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
              <button type="button" onClick={() => setEditingSection(null)} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-y-4">
            {["firstName", "lastName", "email", "phone", "role"].map((field) => (
              <div key={field}>
                <p className="text-sm text-gray-500 capitalize">{field.replace(/([A-Z])/g, ' $1')}</p>
                <p className="font-medium">{localUser[field]}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">Address</h3>
          <button onClick={() => setEditingSection("address")} className="text-sm text-gray-500 hover:text-black">✏️ Edit</button>
        </div>

        {editingSection === "address" ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            {["country", "city", "state"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium capitalize">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={localUser[field] || ""}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ))}
            <div className="flex space-x-2 pt-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
              <button type="button" onClick={() => setEditingSection(null)} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-y-4">
            <div><p className="text-sm text-gray-500">Country</p><p className="font-medium">{localUser.country}</p></div>
            <div><p className="text-sm text-gray-500">City/State</p><p className="font-medium">{localUser.city}, {localUser.state}</p></div>
          </div>
        )}
      </div>
    </div>
  );
}
