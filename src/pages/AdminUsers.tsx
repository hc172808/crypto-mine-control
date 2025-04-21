
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";

// Mock user data for the admin page
const mockUsers = [
  {
    id: "usr-001",
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    role: "client",
    status: "active",
    createdAt: "2024-03-15T08:30:00Z",
    tasksCompleted: 12,
    totalEarnings: 0.0035
  },
  {
    id: "usr-002",
    name: "Alice Smith",
    username: "alicesmith",
    email: "alice@example.com",
    role: "client",
    status: "active",
    createdAt: "2024-03-10T12:45:00Z",
    tasksCompleted: 28,
    totalEarnings: 0.0087
  },
  {
    id: "usr-003",
    name: "Bob Johnson",
    username: "bobjohnson",
    email: "bob@example.com",
    role: "client",
    status: "inactive",
    createdAt: "2024-02-25T15:20:00Z",
    tasksCompleted: 5,
    totalEarnings: 0.0012
  },
  {
    id: "usr-004",
    name: "Emily Wilson",
    username: "emilywilson",
    email: "emily@example.com",
    role: "client",
    status: "active",
    createdAt: "2024-03-18T09:15:00Z",
    tasksCompleted: 19,
    totalEarnings: 0.0051
  },
  {
    id: "usr-005",
    name: "Michael Brown",
    username: "michaelbrown",
    email: "michael@example.com",
    role: "client",
    status: "suspended",
    createdAt: "2024-02-10T11:30:00Z",
    tasksCompleted: 0,
    totalEarnings: 0
  },
  {
    id: "usr-006",
    name: "Sarah Davis",
    username: "sarahdavis",
    email: "sarah@example.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-05T08:00:00Z",
    tasksCompleted: 45,
    totalEarnings: 0.0125
  }
];

const AdminUsers = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [userStatus, setUserStatus] = useState<"active" | "inactive" | "suspended">("active");
  const [userRole, setUserRole] = useState<"admin" | "client">("client");

  // Filter users based on search term and tab
  const filteredUsers = users.filter(user => 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle user status change
  const handleStatusChange = (userId: string, status: "active" | "inactive" | "suspended") => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, status } : user
      )
    );

    toast({
      title: "User Status Updated",
      description: `User ${userId} status has been updated to ${status}.`
    });
  };

  // Handle user role change
  const handleRoleChange = (userId: string, role: "admin" | "client") => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, role } : user
      )
    );

    toast({
      title: "User Role Updated",
      description: `User ${userId} role has been updated to ${role}.`
    });
  };

  // Handle user edit
  const handleEditUser = () => {
    if (!selectedUser) return;

    setUsers(prev => 
      prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, role: userRole, status: userStatus } 
          : user
      )
    );

    toast({
      title: "User Updated",
      description: `User ${selectedUser.username} has been updated.`
    });

    setEditUserOpen(false);
  };

  // Handle user click for edit
  const handleUserClick = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setUserStatus(user.status as "active" | "inactive" | "suspended");
    setUserRole(user.role as "admin" | "client");
    setEditUserOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">All Users ({users.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({users.filter(u => u.status === "active").length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({users.filter(u => u.status === "inactive").length})</TabsTrigger>
          <TabsTrigger value="suspended">Suspended ({users.filter(u => u.status === "suspended").length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <UserTable 
            users={filteredUsers}
            onUserClick={handleUserClick}
            onStatusChange={handleStatusChange}
            onRoleChange={handleRoleChange}
          />
        </TabsContent>
        
        <TabsContent value="active" className="mt-6">
          <UserTable 
            users={filteredUsers.filter(u => u.status === "active")}
            onUserClick={handleUserClick}
            onStatusChange={handleStatusChange}
            onRoleChange={handleRoleChange}
          />
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-6">
          <UserTable 
            users={filteredUsers.filter(u => u.status === "inactive")}
            onUserClick={handleUserClick}
            onStatusChange={handleStatusChange}
            onRoleChange={handleRoleChange}
          />
        </TabsContent>
        
        <TabsContent value="suspended" className="mt-6">
          <UserTable 
            users={filteredUsers.filter(u => u.status === "suspended")}
            onUserClick={handleUserClick}
            onStatusChange={handleStatusChange}
            onRoleChange={handleRoleChange}
          />
        </TabsContent>
      </Tabs>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Edit User Dialog */}
      <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user's details and permissions.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-muted rounded-full p-3">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-role">User Role</Label>
                <Select
                  value={userRole}
                  onValueChange={(value) => setUserRole(value as "admin" | "client")}
                >
                  <SelectTrigger id="user-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-status">User Status</Label>
                <Select
                  value={userStatus}
                  onValueChange={(value) => setUserStatus(value as "active" | "inactive" | "suspended")}
                >
                  <SelectTrigger id="user-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditUserOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditUser}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// User Table Component
const UserTable = ({ 
  users, 
  onUserClick,
  onStatusChange,
  onRoleChange
}: { 
  users: any[],
  onUserClick: (user: any) => void,
  onStatusChange: (userId: string, status: "active" | "inactive" | "suspended") => void,
  onRoleChange: (userId: string, role: "admin" | "client") => void
}) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        user.status === "active" 
                          ? "outline" 
                          : user.status === "inactive" 
                          ? "secondary" 
                          : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{user.tasksCompleted} tasks</div>
                      <div className="text-xs text-muted-foreground">
                        {user.totalEarnings.toFixed(5)} BTC
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUserClick(user)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminUsers;
