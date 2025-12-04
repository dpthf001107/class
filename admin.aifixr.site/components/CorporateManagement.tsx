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
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Building2,
  Users,
  TrendingUp,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import type { User } from "@/types";

interface CorporateManagementProps {
  user: User;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

interface Company {
  id: string;
  name: string;
  type: "SME" | "Enterprise" | "Public";
  plan: "Basic" | "Pro" | "Enterprise";
  status: "Active" | "Inactive";
  joinDate: string;
  lastLogin: string;
  userCount: number;
}

const mockCompanies: Company[] = [
  {
    id: "1",
    name: "삼성전자(주)",
    type: "Enterprise",
    plan: "Enterprise",
    status: "Active",
    joinDate: "2024.01.15",
    lastLogin: "2024.12.01",
    userCount: 145,
  },
  {
    id: "2",
    name: "LG화학",
    type: "Enterprise",
    plan: "Enterprise",
    status: "Active",
    joinDate: "2024.02.20",
    lastLogin: "2024.11.30",
    userCount: 98,
  },
  {
    id: "3",
    name: "현대자동차",
    type: "Enterprise",
    plan: "Pro",
    status: "Active",
    joinDate: "2024.03.10",
    lastLogin: "2024.11.29",
    userCount: 112,
  },
  {
    id: "4",
    name: "네이버",
    type: "Enterprise",
    plan: "Enterprise",
    status: "Active",
    joinDate: "2024.04.05",
    lastLogin: "2024.12.01",
    userCount: 87,
  },
  {
    id: "5",
    name: "카카오",
    type: "Enterprise",
    plan: "Pro",
    status: "Active",
    joinDate: "2024.05.12",
    lastLogin: "2024.11.28",
    userCount: 76,
  },
  {
    id: "6",
    name: "쿠팡",
    type: "SME",
    plan: "Basic",
    status: "Active",
    joinDate: "2024.06.18",
    lastLogin: "2024.11.27",
    userCount: 34,
  },
  {
    id: "7",
    name: "배달의민족",
    type: "SME",
    plan: "Pro",
    status: "Inactive",
    joinDate: "2024.07.22",
    lastLogin: "2024.10.15",
    userCount: 28,
  },
];

export function CorporateManagement({ user, onNavigate, onLogout }: CorporateManagementProps) {
  const [companies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const isReadOnly = false;

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || company.type === filterType;
    const matchesStatus = filterStatus === "all" || company.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = (companyName: string) => {
    if (isReadOnly) {
      toast.error("권한 없음", {
        description: "삭제 권한이 없습니다.",
      });
      return;
    }
    toast.success("고객사 삭제", {
      description: `${companyName}이(가) 삭제되었습니다.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar currentScreen="corporate" onNavigate={onNavigate} userRole={user.role} />
        <main className="flex-1 p-8">
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-[#0F172A] mb-2">고객사 관리</h1>
              <p className="text-[#8C8C8C]">등록된 고객사 정보 및 현황 관리</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">전체 고객사</p>
                      <p className="text-[#0F172A]">234</p>
                    </div>
                    <Building2 className="w-8 h-8 text-[#5B3BFA]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">활성 고객사</p>
                      <p className="text-[#0F172A]">201</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">총 사용자</p>
                      <p className="text-[#0F172A]">1,842</p>
                    </div>
                    <Users className="w-8 h-8 text-[#00B4FF]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">이번 달 리포트</p>
                      <p className="text-[#0F172A]">88</p>
                    </div>
                    <FileText className="w-8 h-8 text-[#A58DFF]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Actions */}
            <Card className="rounded-[20px] border-none shadow-md mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-1 gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:max-w-xs">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8C8C8C]" />
                      <Input
                        placeholder="고객사 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 rounded-xl"
                      />
                    </div>

                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-40 rounded-xl">
                        <SelectValue placeholder="유형" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체 유형</SelectItem>
                        <SelectItem value="SME">중소기업</SelectItem>
                        <SelectItem value="Enterprise">대기업</SelectItem>
                        <SelectItem value="Public">공공기관</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40 rounded-xl">
                        <SelectValue placeholder="상태" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체 상태</SelectItem>
                        <SelectItem value="Active">활성</SelectItem>
                        <SelectItem value="Inactive">비활성</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {!isReadOnly && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="rounded-xl gradient-aifix hover:gradient-aifix-hover shadow-lg">
                          <Plus className="w-4 h-4 mr-2" />
                          고객사 추가
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-[20px]">
                        <DialogHeader>
                          <DialogTitle>새 고객사 추가</DialogTitle>
                          <DialogDescription>
                            새로운 고객사 정보를 입력하세요.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>고객사명</Label>
                            <Input placeholder="회사명 입력" className="rounded-xl" />
                          </div>
                          <div className="space-y-2">
                            <Label>유형</Label>
                            <Select>
                              <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="선택" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sme">중소기업</SelectItem>
                                <SelectItem value="enterprise">대기업</SelectItem>
                                <SelectItem value="public">공공기관</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>요금제</Label>
                            <Select>
                              <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="선택" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="pro">Pro</SelectItem>
                                <SelectItem value="enterprise">Enterprise</SelectItem>
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

            {/* Companies Table */}
            <Card className="rounded-[20px] border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-[#0F172A]">고객사 목록</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>고객사명</TableHead>
                      <TableHead>유형</TableHead>
                      <TableHead>요금제</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>사용자</TableHead>
                      <TableHead>가입일</TableHead>
                      <TableHead>마지막 접속</TableHead>
                      {!isReadOnly && <TableHead className="text-right">관리</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl gradient-aifix flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <span>{company.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="rounded-lg">
                            {company.type === "SME" && "중소기업"}
                            {company.type === "Enterprise" && "대기업"}
                            {company.type === "Public" && "공공기관"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              company.plan === "Enterprise"
                                ? "bg-[#5B3BFA] hover:bg-[#5B3BFA]"
                                : company.plan === "Pro"
                                ? "bg-[#00B4FF] hover:bg-[#00B4FF]"
                                : "bg-[#A58DFF] hover:bg-[#A58DFF]"
                            }
                          >
                            {company.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              company.status === "Active"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                            }
                          >
                            {company.status === "Active" ? "활성" : "비활성"}
                          </Badge>
                        </TableCell>
                        <TableCell>{company.userCount}명</TableCell>
                        <TableCell>{company.joinDate}</TableCell>
                        <TableCell>{company.lastLogin}</TableCell>
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
                                onClick={() => handleDelete(company.name)}
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
          </div>
        </main>
      </div>
    </div>
  );
}
