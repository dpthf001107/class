import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Progress } from "./ui/progress";
import {
  Server,
  Activity,
  Cpu,
  HardDrive,
  Plus,
  Edit,
  Trash2,
  Bell,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import type { User } from "@/types";

interface SystemNotificationsProps {
  user: User;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

interface SystemStatus {
  name: string;
  status: "healthy" | "warning" | "error";
  uptime: number;
  cpu: number;
  memory: number;
  disk: number;
}

const mockSystemStatus: SystemStatus[] = [
  {
    name: "API Server",
    status: "healthy",
    uptime: 99.8,
    cpu: 45,
    memory: 62,
    disk: 38,
  },
  {
    name: "Database",
    status: "healthy",
    uptime: 99.9,
    cpu: 28,
    memory: 71,
    disk: 52,
  },
  {
    name: "AI Model Server",
    status: "warning",
    uptime: 98.5,
    cpu: 82,
    memory: 88,
    disk: 41,
  },
  {
    name: "Storage",
    status: "healthy",
    uptime: 99.7,
    cpu: 15,
    memory: 34,
    disk: 67,
  },
];

interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: "high" | "medium" | "low";
  status: "published" | "draft";
}

const mockNotices: Notice[] = [
  {
    id: "1",
    title: "정기 서버 점검 안내",
    content: "2024년 12월 15일 02:00 - 04:00 정기 서버 점검이 진행됩니다.",
    author: "김철수",
    date: "2024.11.25",
    priority: "high",
    status: "published",
  },
  {
    id: "2",
    title: "신규 기능 업데이트 - AI 분석 모델 v3.0",
    content: "새로운 AI 분석 모델이 추가되었습니다. 정확도가 15% 향상되었습니다.",
    author: "이영희",
    date: "2024.11.20",
    priority: "medium",
    status: "published",
  },
  {
    id: "3",
    title: "ESG 지표 업데이트",
    content: "환경 부문 지표 12개가 추가되었습니다.",
    author: "박민수",
    date: "2024.11.15",
    priority: "medium",
    status: "published",
  },
  {
    id: "4",
    title: "보안 정책 변경 안내",
    content: "2단계 인증(2FA)이 필수로 변경됩니다.",
    author: "김철수",
    date: "2024.11.10",
    priority: "high",
    status: "draft",
  },
];

export function SystemNotifications({ user, onNavigate, onLogout }: SystemNotificationsProps) {
  const [systemStatus] = useState<SystemStatus[]>(mockSystemStatus);
  const [notices] = useState<Notice[]>(mockNotices);

  const isReadOnly = user.role !== "Super Admin" && user.role !== "Admin";

  const handleDeleteNotice = (title: string) => {
    if (isReadOnly) {
      toast.error("권한 없음", {
        description: "공지사항 삭제 권한이 없습니다.",
      });
      return;
    }
    toast.success("공지사항 삭제", {
      description: `${title}이(가) 삭제되었습니다.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar currentScreen="system" onNavigate={onNavigate} userRole={user.role} />
        <main className="flex-1 p-8">
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-[#0F172A] mb-2">시스템 & 공지 관리</h1>
              <p className="text-[#8C8C8C]">시스템 상태 모니터링 및 공지사항 관리</p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="system" className="space-y-6">
              <TabsList className="bg-white rounded-xl p-1 shadow-md">
                <TabsTrigger value="system" className="rounded-lg">
                  시스템 상태
                </TabsTrigger>
                <TabsTrigger value="notices" className="rounded-lg">
                  공지사항
                </TabsTrigger>
              </TabsList>

              {/* System Status Tab */}
              <TabsContent value="system" className="space-y-6">
                {/* Overall Status */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="rounded-[20px] border-none shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#8C8C8C] mb-1">전체 상태</p>
                          <p className="text-[#0F172A]">정상</p>
                        </div>
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                      </div>
                      <div className="mt-2">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          99.7% 가동률
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[20px] border-none shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#8C8C8C] mb-1">서버</p>
                          <p className="text-[#0F172A]">4 / 4</p>
                        </div>
                        <Server className="w-8 h-8 text-[#5B3BFA]" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[20px] border-none shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#8C8C8C] mb-1">경고</p>
                          <p className="text-[#0F172A]">1</p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[20px] border-none shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#8C8C8C] mb-1">오류</p>
                          <p className="text-[#0F172A]">0</p>
                        </div>
                        <Activity className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Server Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {systemStatus.map((system, index) => (
                    <Card key={index} className="rounded-[20px] border-none shadow-md">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                system.status === "healthy"
                                  ? "bg-green-100"
                                  : system.status === "warning"
                                  ? "bg-yellow-100"
                                  : "bg-red-100"
                              }`}
                            >
                              <Server
                                className={`w-6 h-6 ${
                                  system.status === "healthy"
                                    ? "text-green-600"
                                    : system.status === "warning"
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              />
                            </div>
                            <div>
                              <CardTitle className="text-[#0F172A]">{system.name}</CardTitle>
                              <p className="text-sm text-[#8C8C8C]">
                                Uptime: {system.uptime}%
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={
                              system.status === "healthy"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : system.status === "warning"
                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                : "bg-red-100 text-red-700 hover:bg-red-100"
                            }
                          >
                            {system.status === "healthy" && "정상"}
                            {system.status === "warning" && "경고"}
                            {system.status === "error" && "오류"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Cpu className="w-4 h-4 text-[#5B3BFA]" />
                              <span className="text-[#0F172A]">CPU</span>
                            </div>
                            <span className="text-[#5B3BFA]">{system.cpu}%</span>
                          </div>
                          <Progress value={system.cpu} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-[#00B4FF]" />
                              <span className="text-[#0F172A]">Memory</span>
                            </div>
                            <span className="text-[#00B4FF]">{system.memory}%</span>
                          </div>
                          <Progress value={system.memory} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <HardDrive className="w-4 h-4 text-[#A58DFF]" />
                              <span className="text-[#0F172A]">Disk</span>
                            </div>
                            <span className="text-[#A58DFF]">{system.disk}%</span>
                          </div>
                          <Progress value={system.disk} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Notices Tab */}
              <TabsContent value="notices" className="space-y-6">
                {/* Notice Actions */}
                <Card className="rounded-[20px] border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[#0F172A] mb-1">공지사항 관리</h3>
                        <p className="text-sm text-[#8C8C8C]">
                          총 {notices.length}개의 공지사항
                        </p>
                      </div>
                      {!isReadOnly && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="rounded-xl gradient-aifix hover:gradient-aifix-hover shadow-lg">
                              <Plus className="w-4 h-4 mr-2" />
                              공지 작성
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-[20px] max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>새 공지사항 작성</DialogTitle>
                              <DialogDescription>
                                시스템 공지사항을 작성하세요.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>제목</Label>
                                <Input placeholder="공지사항 제목" className="rounded-xl" />
                              </div>
                              <div className="space-y-2">
                                <Label>내용</Label>
                                <Textarea
                                  placeholder="공지사항 내용을 입력하세요."
                                  className="rounded-xl min-h-[150px]"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>우선순위</Label>
                                  <Input placeholder="high/medium/low" className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                  <Label>상태</Label>
                                  <Input placeholder="published/draft" className="rounded-xl" />
                                </div>
                              </div>
                              <Button className="w-full rounded-xl gradient-aifix">
                                작성하기
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Notices Table */}
                <Card className="rounded-[20px] border-none shadow-md">
                  <CardHeader>
                    <CardTitle className="text-[#0F172A]">공지사항 목록</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>제목</TableHead>
                          <TableHead>내용</TableHead>
                          <TableHead>작성자</TableHead>
                          <TableHead>작성일</TableHead>
                          <TableHead>우선순위</TableHead>
                          <TableHead>상태</TableHead>
                          {!isReadOnly && <TableHead className="text-right">관리</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {notices.map((notice) => (
                          <TableRow key={notice.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-[#5B3BFA]" />
                                <span>{notice.title}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-md truncate text-sm text-[#8C8C8C]">
                              {notice.content}
                            </TableCell>
                            <TableCell>{notice.author}</TableCell>
                            <TableCell>{notice.date}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  notice.priority === "high"
                                    ? "bg-red-100 text-red-700 hover:bg-red-100"
                                    : notice.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                    : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                }
                              >
                                {notice.priority === "high" && "높음"}
                                {notice.priority === "medium" && "보통"}
                                {notice.priority === "low" && "낮음"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  notice.status === "published"
                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                }
                              >
                                {notice.status === "published" ? "게시됨" : "임시저장"}
                              </Badge>
                            </TableCell>
                            {!isReadOnly && (
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="sm" className="rounded-lg">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteNotice(notice.title)}
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
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
