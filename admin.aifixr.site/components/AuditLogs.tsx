import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
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
  FileText,
  Search,
  Download,
  AlertCircle,
  CheckCircle2,
  UserCog,
  Database,
} from "lucide-react";
import type { User } from "@/types";

interface AuditLogsProps {
  user: User;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: "success" | "warning" | "error";
  ip: string;
  details: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2024.12.01 14:30:25",
    user: "김철수 (admin@aifix.com)",
    action: "고객사 수정",
    resource: "삼성전자(주)",
    status: "success",
    ip: "192.168.1.100",
    details: "연락처 정보 업데이트",
  },
  {
    id: "2",
    timestamp: "2024.12.01 14:15:12",
    user: "이영희 (admin2@aifix.com)",
    action: "사용자 생성",
    resource: "박민수",
    status: "success",
    ip: "192.168.1.105",
    details: "신규 사용자 계정 생성",
  },
  {
    id: "3",
    timestamp: "2024.12.01 13:45:33",
    user: "박민수 (user@aifix.com)",
    action: "리포트 다운로드",
    resource: "ESG-2024-Q4",
    status: "success",
    ip: "192.168.1.120",
    details: "분기별 ESG 리포트 다운로드",
  },
  {
    id: "4",
    timestamp: "2024.12.01 12:20:18",
    user: "최동욱 (user@aifix.com)",
    action: "로그인 시도",
    resource: "시스템 접근",
    status: "error",
    ip: "192.168.1.88",
    details: "계정 비활성화로 인한 접근 거부",
  },
  {
    id: "5",
    timestamp: "2024.12.01 11:55:42",
    user: "김철수 (admin@aifix.com)",
    action: "요금제 변경",
    resource: "현대자동차",
    status: "success",
    ip: "192.168.1.100",
    details: "Pro → Enterprise 플랜 변경",
  },
  {
    id: "6",
    timestamp: "2024.12.01 11:30:05",
    user: "정수진 (user@aifix.com)",
    action: "데이터 접근 시도",
    resource: "고객사 관리",
    status: "warning",
    ip: "192.168.1.150",
    details: "권한 부족 - 읽기 전용 접근",
  },
  {
    id: "7",
    timestamp: "2024.12.01 10:15:28",
    user: "이영희 (admin2@aifix.com)",
    action: "ESG 지표 수정",
    resource: "ENV-001",
    status: "success",
    ip: "192.168.1.105",
    details: "온실가스 배출량 계산식 업데이트",
  },
  {
    id: "8",
    timestamp: "2024.12.01 09:40:51",
    user: "김철수 (admin@aifix.com)",
    action: "시스템 설정 변경",
    resource: "알림 설정",
    status: "success",
    ip: "192.168.1.100",
    details: "이메일 알림 활성화",
  },
];

interface DataChange {
  id: string;
  timestamp: string;
  table: string;
  operation: "INSERT" | "UPDATE" | "DELETE";
  user: string;
  recordId: string;
  changes: string;
}

const mockDataChanges: DataChange[] = [
  {
    id: "1",
    timestamp: "2024.12.01 14:30:25",
    table: "companies",
    operation: "UPDATE",
    user: "김철수",
    recordId: "COMP-001",
    changes: "email: old@samsung.com → new@samsung.com",
  },
  {
    id: "2",
    timestamp: "2024.12.01 14:15:12",
    table: "users",
    operation: "INSERT",
    user: "이영희",
    recordId: "USER-245",
    changes: "신규 사용자: 박민수",
  },
  {
    id: "3",
    timestamp: "2024.12.01 11:55:42",
    table: "subscriptions",
    operation: "UPDATE",
    user: "김철수",
    recordId: "SUB-089",
    changes: "plan: Pro → Enterprise",
  },
  {
    id: "4",
    timestamp: "2024.12.01 10:15:28",
    table: "esg_metrics",
    operation: "UPDATE",
    user: "이영희",
    recordId: "MET-001",
    changes: "formula: 변경됨",
  },
];

export function AuditLogs({ user, onNavigate, onLogout }: AuditLogsProps) {
  const [logs] = useState<AuditLog[]>(mockAuditLogs);
  const [dataChanges] = useState<DataChange[]>(mockDataChanges);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAction, setFilterAction] = useState("all");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    const matchesAction = filterAction === "all" || log.action.includes(filterAction);
    return matchesSearch && matchesStatus && matchesAction;
  });

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar currentScreen="audit" onNavigate={onNavigate} userRole={user.role} />
        <main className="flex-1 p-8">
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-[#0F172A] mb-2">감사 및 로그</h1>
              <p className="text-[#8C8C8C]">시스템 활동 추적 및 컴플라이언스 관리</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">오늘 활동</p>
                      <p className="text-[#0F172A]">2,547</p>
                    </div>
                    <FileText className="w-8 h-8 text-[#5B3BFA]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">정상 작업</p>
                      <p className="text-[#0F172A]">2,489</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">경고</p>
                      <p className="text-[#0F172A]">42</p>
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
                      <p className="text-[#0F172A]">16</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="rounded-[20px] border-none shadow-md mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-1 gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:max-w-xs">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8C8C8C]" />
                      <Input
                        placeholder="로그 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 rounded-xl"
                      />
                    </div>

                    <Select value={filterAction} onValueChange={setFilterAction}>
                      <SelectTrigger className="w-40 rounded-xl">
                        <SelectValue placeholder="작업" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체 작업</SelectItem>
                        <SelectItem value="로그인">로그인</SelectItem>
                        <SelectItem value="생성">생성</SelectItem>
                        <SelectItem value="수정">수정</SelectItem>
                        <SelectItem value="삭제">삭제</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40 rounded-xl">
                        <SelectValue placeholder="상태" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체 상태</SelectItem>
                        <SelectItem value="success">성공</SelectItem>
                        <SelectItem value="warning">경고</SelectItem>
                        <SelectItem value="error">오류</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="rounded-xl gradient-aifix hover:gradient-aifix-hover shadow-lg">
                    <Download className="w-4 h-4 mr-2" />
                    로그 내보내기
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activity Logs */}
            <Card className="rounded-[20px] border-none shadow-md mb-6">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">활동 로그</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>시간</TableHead>
                      <TableHead>사용자</TableHead>
                      <TableHead>작업</TableHead>
                      <TableHead>리소스</TableHead>
                      <TableHead>IP 주소</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>세부사항</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserCog className="w-4 h-4 text-[#5B3BFA]" />
                            <span>{log.user}</span>
                          </div>
                        </TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell className="font-mono text-sm">{log.ip}</TableCell>
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
                        <TableCell className="text-sm text-[#8C8C8C]">{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Data Change History */}
            <Card className="rounded-[20px] border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">데이터 변경 이력</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>시간</TableHead>
                      <TableHead>테이블</TableHead>
                      <TableHead>작업</TableHead>
                      <TableHead>사용자</TableHead>
                      <TableHead>레코드 ID</TableHead>
                      <TableHead>변경사항</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataChanges.map((change) => (
                      <TableRow key={change.id}>
                        <TableCell className="font-mono text-sm">{change.timestamp}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-[#00B4FF]" />
                            <span className="font-mono text-sm">{change.table}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              change.operation === "INSERT"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : change.operation === "UPDATE"
                                ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                : "bg-red-100 text-red-700 hover:bg-red-100"
                            }
                          >
                            {change.operation}
                          </Badge>
                        </TableCell>
                        <TableCell>{change.user}</TableCell>
                        <TableCell className="font-mono text-sm">{change.recordId}</TableCell>
                        <TableCell className="text-sm text-[#8C8C8C]">{change.changes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
