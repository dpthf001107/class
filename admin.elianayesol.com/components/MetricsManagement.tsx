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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Cpu,
  FileText,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import type { User } from "@/types";

interface MetricsManagementProps {
  user: User;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

interface Metric {
  id: string;
  code: string;
  name: string;
  category: "Environmental" | "Social" | "Governance";
  unit: string;
  status: "active" | "draft";
}

const mockMetrics: Metric[] = [
  {
    id: "1",
    code: "ENV-001",
    name: "온실가스 배출량 (Scope 1)",
    category: "Environmental",
    unit: "tCO2eq",
    status: "active",
  },
  {
    id: "2",
    code: "ENV-002",
    name: "에너지 사용량",
    category: "Environmental",
    unit: "MWh",
    status: "active",
  },
  {
    id: "3",
    code: "SOC-001",
    name: "임직원 다양성 지표",
    category: "Social",
    unit: "%",
    status: "active",
  },
  {
    id: "4",
    code: "GOV-001",
    name: "이사회 독립성",
    category: "Governance",
    unit: "%",
    status: "active",
  },
  {
    id: "5",
    code: "ENV-003",
    name: "물 사용량",
    category: "Environmental",
    unit: "m³",
    status: "draft",
  },
];

interface AIModel {
  id: string;
  name: string;
  version: string;
  status: "deployed" | "testing" | "development";
  accuracy: number;
  lastUpdate: string;
}

const mockModels: AIModel[] = [
  {
    id: "1",
    name: "ESG 리스크 분석 모델",
    version: "v2.1.0",
    status: "deployed",
    accuracy: 94.5,
    lastUpdate: "2024.11.15",
  },
  {
    id: "2",
    name: "탄소배출 예측 모델",
    version: "v1.8.2",
    status: "deployed",
    accuracy: 91.2,
    lastUpdate: "2024.10.20",
  },
  {
    id: "3",
    name: "지속가능성 스코어링",
    version: "v3.0.0-beta",
    status: "testing",
    accuracy: 88.7,
    lastUpdate: "2024.11.28",
  },
  {
    id: "4",
    name: "규제 준수 분석",
    version: "v1.0.0-alpha",
    status: "development",
    accuracy: 76.3,
    lastUpdate: "2024.11.30",
  },
];

export function MetricsManagement({ user, onNavigate, onLogout }: MetricsManagementProps) {
  const [metrics] = useState<Metric[]>(mockMetrics);
  const [models] = useState<AIModel[]>(mockModels);
  const [searchTerm, setSearchTerm] = useState("");

  const isReadOnly = false;

  const filteredMetrics = metrics.filter((metric) =>
    metric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    metric.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteMetric = (metricName: string) => {
    if (isReadOnly) {
      toast.error("권한 없음", {
        description: "지표 삭제 권한이 없습니다.",
      });
      return;
    }
    toast.success("지표 삭제", {
      description: `${metricName}이(가) 삭제되었습니다.`,
    });
  };

  const handleDeployModel = (modelName: string) => {
    if (isReadOnly) {
      toast.error("권한 없음", {
        description: "모델 배포 권한이 없습니다.",
      });
      return;
    }
    toast.success("모델 배포", {
      description: `${modelName}을(를) 배포했습니다.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar currentScreen="metrics" onNavigate={onNavigate} userRole={user.role} />
        <main className="flex-1 p-8">
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-[#0F172A] mb-2">지표 & AI 모델 관리</h1>
              <p className="text-[#8C8C8C]">ESG 평가 지표 및 AI 분석 모델 관리</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">등록 지표</p>
                      <p className="text-[#0F172A]">124</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-[#5B3BFA]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">AI 모델</p>
                      <p className="text-[#0F172A]">12</p>
                    </div>
                    <Cpu className="w-8 h-8 text-[#00B4FF]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">활성 모델</p>
                      <p className="text-[#0F172A]">8</p>
                    </div>
                    <Activity className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">평균 정확도</p>
                      <p className="text-[#0F172A]">92.8%</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-[#A58DFF]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="metrics" className="space-y-6">
              <TabsList className="bg-white rounded-xl p-1 shadow-md">
                <TabsTrigger value="metrics" className="rounded-lg">
                  ESG 지표
                </TabsTrigger>
                <TabsTrigger value="models" className="rounded-lg">
                  AI 모델
                </TabsTrigger>
                <TabsTrigger value="templates" className="rounded-lg">
                  리포트 템플릿
                </TabsTrigger>
              </TabsList>

              {/* Metrics Tab */}
              <TabsContent value="metrics" className="space-y-6">
                {/* Search and Actions */}
                <Card className="rounded-[20px] border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                      <div className="relative flex-1 md:max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8C8C8C]" />
                        <Input
                          placeholder="지표 검색..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 rounded-xl"
                        />
                      </div>

                      {!isReadOnly && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="rounded-xl gradient-aifix hover:gradient-aifix-hover shadow-lg">
                              <Plus className="w-4 h-4 mr-2" />
                              지표 추가
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-[20px]">
                            <DialogHeader>
                              <DialogTitle>새 ESG 지표 추가</DialogTitle>
                              <DialogDescription>
                                새로운 ESG 평가 지표를 등록하세요.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>지표 코드</Label>
                                <Input placeholder="예: ENV-004" className="rounded-xl" />
                              </div>
                              <div className="space-y-2">
                                <Label>지표명</Label>
                                <Input placeholder="지표명 입력" className="rounded-xl" />
                              </div>
                              <div className="space-y-2">
                                <Label>카테고리</Label>
                                <Input placeholder="Environmental/Social/Governance" className="rounded-xl" />
                              </div>
                              <div className="space-y-2">
                                <Label>단위</Label>
                                <Input placeholder="예: tCO2eq, %, m³" className="rounded-xl" />
                              </div>
                              <div className="space-y-2">
                                <Label>설명</Label>
                                <Textarea placeholder="지표에 대한 설명" className="rounded-xl" />
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

                {/* Metrics Table */}
                <Card className="rounded-[20px] border-none shadow-md">
                  <CardHeader>
                    <CardTitle className="text-[#0F172A]">ESG 지표 목록</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>코드</TableHead>
                          <TableHead>지표명</TableHead>
                          <TableHead>카테고리</TableHead>
                          <TableHead>단위</TableHead>
                          <TableHead>상태</TableHead>
                          {!isReadOnly && <TableHead className="text-right">관리</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMetrics.map((metric) => (
                          <TableRow key={metric.id}>
                            <TableCell className="font-mono text-sm">{metric.code}</TableCell>
                            <TableCell>{metric.name}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  metric.category === "Environmental"
                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                    : metric.category === "Social"
                                    ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                    : "bg-purple-100 text-purple-700 hover:bg-purple-100"
                                }
                              >
                                {metric.category === "Environmental" && "환경"}
                                {metric.category === "Social" && "사회"}
                                {metric.category === "Governance" && "지배구조"}
                              </Badge>
                            </TableCell>
                            <TableCell>{metric.unit}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  metric.status === "active"
                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                }
                              >
                                {metric.status === "active" ? "활성" : "임시"}
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
                                    onClick={() => handleDeleteMetric(metric.name)}
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

              {/* AI Models Tab */}
              <TabsContent value="models">
                <Card className="rounded-[20px] border-none shadow-md">
                  <CardHeader>
                    <CardTitle className="text-[#0F172A]">AI 분석 모델</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>모델명</TableHead>
                          <TableHead>버전</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead>정확도</TableHead>
                          <TableHead>마지막 업데이트</TableHead>
                          {!isReadOnly && <TableHead className="text-right">관리</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {models.map((model) => (
                          <TableRow key={model.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] flex items-center justify-center">
                                  <Cpu className="w-5 h-5 text-white" />
                                </div>
                                <span>{model.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{model.version}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  model.status === "deployed"
                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                    : model.status === "testing"
                                    ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                }
                              >
                                {model.status === "deployed" && "배포됨"}
                                {model.status === "testing" && "테스트중"}
                                {model.status === "development" && "개발중"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full gradient-aifix"
                                    style={{ width: `${model.accuracy}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm">{model.accuracy}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{model.lastUpdate}</TableCell>
                            {!isReadOnly && (
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {model.status === "testing" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="rounded-lg"
                                      onClick={() => handleDeployModel(model.name)}
                                    >
                                      배포
                                    </Button>
                                  )}
                                  <Button variant="ghost" size="sm" className="rounded-lg">
                                    <Edit className="w-4 h-4" />
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

              {/* Templates Tab */}
              <TabsContent value="templates">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {["기본 ESG 리포트", "상세 분석 리포트", "경영진 요약 리포트", "규제 준수 리포트"].map(
                    (template, index) => (
                      <Card
                        key={index}
                        className="rounded-[20px] border-none shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                      >
                        <CardHeader>
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B3BFA] to-[#00B4FF] flex items-center justify-center mb-4">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <CardTitle className="text-[#0F172A]">{template}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-[#8C8C8C] mb-4">
                            표준화된 ESG 리포트 템플릿
                          </p>
                          {!isReadOnly && (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="rounded-lg flex-1">
                                미리보기
                              </Button>
                              <Button variant="ghost" size="sm" className="rounded-lg">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
