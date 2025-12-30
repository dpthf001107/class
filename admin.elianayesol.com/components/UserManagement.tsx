import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  UserCog,
  Shield,
  Activity,
  Key,
} from "lucide-react";
import { toast } from "sonner";
import type { User, UserRole } from "@/types";

interface UserManagementProps {
  user: User;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
  status: "Active" | "Disabled";
  lastLogin: string;
}

const mockUsers: SystemUser[] = [
  {
    id: "1",
    name: "김철수",
    email: "kim@samsung.com",
    company: "삼성전자(주)",
    role: "Super Admin",
    status: "Active",
    lastLogin: "2024.12.01 14:30",
  },
  {
    id: "2",
    name: "이영희",
    email: "lee@lg.com",
    company: "LG화학",
    role: "Admin",
    status: "Active",
    lastLogin: "2024.11.30 16:20",
  },
];

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  status: "success" | "warning" | "error";
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: "1",
    user: "김철수",
    action: "고객사 '삼성전자(주)' 정보 수정",
    timestamp: "2024.12.01 14:30",
    status: "success",
  },
  {
    id: "2",
    user: "이영희",
    action: "사용자 권한 변경",
    timestamp: "2024.11.30 16:20",
    status: "success",
  },
];

export function UserManagement({ user, onNavigate, onLogout }: UserManagementProps) {
  const [users] = useState<SystemUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const isReadOnly = false;
  const canManageUsers = true;

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleResetPassword = (userName: string) => {
    if (!canManageUsers) {
      toast.error("권한 없음", {
        description: "비밀번호 재설정 권한이 없습니다.",
      });
      return;
    }
    toast.success("비밀번호 재설정", {
      description: `${userName}님의 비밀번호 재설정 이메일을 발송했습니다.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar currentScreen="users" onNavigate={onNavigate} userRole={user.role} />
        <main className="flex-1 p-8">
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-[#0F172A] mb-2">사용자 및 권한 관리</h1>
              <p className="text-[#8C8C8C]">시스템 사용자 계정 및 접근 권한 관리</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">전체 사용자</p>
                      <p className="text-[#0F172A]">1,842</p>
                    </div>
                    <UserCog className="w-8 h-8 text-[#5B3BFA]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">활성 사용자</p>
                      <p className="text-[#0F172A]">1,736</p>
                    </div>
                    <Activity className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">관리자</p>
                      <p className="text-[#0F172A]">24</p>
                    </div>
                    <Shield className="w-8 h-8 text-[#00B4FF]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">비활성</p>
                      <p className="text-[#0F172A]">106</p>
                    </div>
                    <UserCog className="w-8 h-8 text-[#8C8C8C]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="users" className="space-y-6">
              <TabsList className="bg-white rounded-xl p-1 shadow-md">
                <TabsTrigger value="users" className="rounded-lg">
                  사용자 목록
                </TabsTrigger>
                <TabsTrigger value="roles" className="rounded-lg">
                  역할 & 권한
                </TabsTrigger>
                <TabsTrigger value="activity" className="rounded-lg">
                  활동 로그
                </TabsTrigger>
              </TabsList>

              {/* Users List Tab */}
              <TabsContent value="users" className="space-y-6">
                {/* Filters */}
                <Card className="rounded-[20px] border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                      <div className="flex flex-1 gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:max-w-xs">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8C8C8C]" />
                          <Input
                            placeholder="사용자 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 rounded-xl"
                          />
                        </div>

                        <Select value={filterRole} onValueChange={setFilterRole}>
                          <SelectTrigger className="w-48 rounded-xl">
                            <SelectValue placeholder="역할" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">전체 역할</SelectItem>
                            <SelectItem value="Super Admin">Super Admin</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {canManageUsers && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="rounded-xl gradient-aifix hover:gradient-aifix-hover shadow-lg">
                              <Plus className="w-4 h-4 mr-2" />
                              사용자 추가
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-[20px]">
                            <DialogHeader>
                              <DialogTitle>새 사용자 추가</DialogTitle>
                              <DialogDescription>
                                새로운 사용자 정보를 입력하세요.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>이름</Label>
                                <Input placeholder="이름 입력" className="rounded-xl" />
                              </div>
                              <div className="space-y-2">
                                <Label>이메일</Label>
                                <Input
                                  type="email"
                                  placeholder="email@company.com"
                                  className="rounded-xl"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>고객사</Label>
                                <Select>
                                  <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="선택" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="samsung">삼성전자(주)</SelectItem>
                                    <SelectItem value="lg">LG화학</SelectItem>
                                    <SelectItem value="hyundai">현대자동차</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>역할</Label>
                                <Select>
                                  <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="선택" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button className="w-full rounded-xl gradient-aifix">
                                추가하기
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Users Table */}
                <Card className="rounded-[20px] border-none shadow-md">
                  <CardHeader>
                    <CardTitle className="text-[#0F172A]">사용자 목록</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>이름</TableHead>
                          <TableHead>이메일</TableHead>
                          <TableHead>고객사</TableHead>
                          <TableHead>역할</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead>마지막 로그인</TableHead>
                          {canManageUsers && <TableHead className="text-right">관리</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{u.company}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  u.role === "Super Admin"
                                    ? "bg-[#5B3BFA] hover:bg-[#5B3BFA]"
                                    : "bg-[#00B4FF] hover:bg-[#00B4FF]"
                                }
                              >
                                {u.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  u.status === "Active"
                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                }
                              >
                                {u.status === "Active" ? "활성" : "비활성"}
                              </Badge>
                            </TableCell>
                            <TableCell>{u.lastLogin}</TableCell>
                            {canManageUsers && (
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="sm" className="rounded-lg">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-lg"
                                    onClick={() => handleResetPassword(u.name)}
                                  >
                                    <Key className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Roles & Permissions Tab */}
              <TabsContent value="roles">
                <Card className="rounded-[20px] border-none shadow-md">
                  <CardHeader>
                    <CardTitle className="text-[#0F172A]">역할별 권한 설정</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {["Super Admin", "Admin"].map((role) => (
                        <div
                          key={role}
                          className="p-6 bg-[#F6F8FB] rounded-xl hover:bg-[#E9F5FF] transition-colors"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Shield className="w-6 h-6 text-[#5B3BFA]" />
                              <h3 className="text-[#0F172A]">{role}</h3>
                            </div>
                            {canManageUsers && (
                              <Button variant="outline" size="sm" className="rounded-xl">
                                <Edit className="w-4 h-4 mr-2" />
                                권한 수정
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {role === "Super Admin" && (
                              <>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                  전체 접근
                                </Badge>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                  생성/수정/삭제
                                </Badge>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                  시스템 관리
                                </Badge>
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                  감사 로그
                                </Badge>
                              </>
                            )}
                            {role === "Admin" && (
                              <>
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                  고객사 관리
                                </Badge>
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                  사용자 관리
                                </Badge>
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                  요금제 관리
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Log Tab */}
              <TabsContent value="activity">
                <Card className="rounded-[20px] border-none shadow-md">
                  <CardHeader>
                    <CardTitle className="text-[#0F172A]">사용자 활동 로그</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>사용자</TableHead>
                          <TableHead>작업</TableHead>
                          <TableHead>시간</TableHead>
                          <TableHead>상태</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockActivityLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>{log.user}</TableCell>
                            <TableCell>{log.action}</TableCell>
                            <TableCell>{log.timestamp}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  log.status === "success"
                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                    : log.status === "warning"
                                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                    : "bg-red-100 text-red-700 hover:bg-red-100"
                                }
                              >
                                {log.status === "success" && "성공"}
                                {log.status === "warning" && "경고"}
                                {log.status === "error" && "오류"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
