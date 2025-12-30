import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Send,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import type { User } from "@/types";

interface BillingManagementProps {
  user: User;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

interface Payment {
  id: string;
  company: string;
  plan: string;
  amount: number;
  status: "success" | "pending" | "failed";
  date: string;
  invoiceId: string;
}

const mockPayments: Payment[] = [
  {
    id: "1",
    company: "삼성전자(주)",
    plan: "Enterprise",
    amount: 5000000,
    status: "success",
    date: "2024.12.01",
    invoiceId: "INV-2024-001",
  },
  {
    id: "2",
    company: "LG화학",
    plan: "Enterprise",
    amount: 5000000,
    status: "success",
    date: "2024.11.28",
    invoiceId: "INV-2024-002",
  },
  {
    id: "3",
    company: "현대자동차",
    plan: "Pro",
    amount: 2000000,
    status: "pending",
    date: "2024.11.25",
    invoiceId: "INV-2024-003",
  },
  {
    id: "4",
    company: "네이버",
    plan: "Enterprise",
    amount: 5000000,
    status: "success",
    date: "2024.11.20",
    invoiceId: "INV-2024-004",
  },
  {
    id: "5",
    company: "배달의민족",
    plan: "Pro",
    amount: 2000000,
    status: "failed",
    date: "2024.11.15",
    invoiceId: "INV-2024-005",
  },
];

interface Subscription {
  id: string;
  company: string;
  plan: string;
  price: number;
  startDate: string;
  nextBilling: string;
  status: "active" | "trial" | "expired";
}

const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    company: "삼성전자(주)",
    plan: "Enterprise",
    price: 5000000,
    startDate: "2024.01.15",
    nextBilling: "2025.01.15",
    status: "active",
  },
  {
    id: "2",
    company: "LG화학",
    plan: "Enterprise",
    price: 5000000,
    startDate: "2024.02.20",
    nextBilling: "2025.02.20",
    status: "active",
  },
  {
    id: "3",
    company: "쿠팡",
    plan: "Basic",
    price: 500000,
    startDate: "2024.11.01",
    nextBilling: "2024.12.01",
    status: "trial",
  },
];

export function BillingManagement({ user, onNavigate, onLogout }: BillingManagementProps) {
  const [payments] = useState<Payment[]>(mockPayments);
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);

  const isReadOnly = false;

  const handleSendReminder = (company: string) => {
    if (isReadOnly) {
      toast.error("권한 없음", {
        description: "결제 알림 전송 권한이 없습니다.",
      });
      return;
    }
    toast.success("결제 알림 전송", {
      description: `${company}에 결제 알림을 발송했습니다.`,
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success("인보이스 다운로드", {
      description: `${invoiceId} 다운로드를 시작합니다.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar currentScreen="billing" onNavigate={onNavigate} userRole={user.role} />
        <main className="flex-1 p-8">
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-[#0F172A] mb-2">요금제 및 결제 관리</h1>
              <p className="text-[#8C8C8C]">구독 요금제 및 결제 현황 관리</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">이번 달 수익</p>
                      <p className="text-[#0F172A]">₩42.5M</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-[#5B3BFA]" />
                  </div>
                  <div className="mt-2">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +18%
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">활성 구독</p>
                      <p className="text-[#0F172A]">201</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">체험판</p>
                      <p className="text-[#0F172A]">18</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-[#00B4FF]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[20px] border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#8C8C8C] mb-1">결제 실패</p>
                      <p className="text-[#0F172A]">5</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="payments" className="space-y-6">
              <TabsList className="bg-white rounded-xl p-1 shadow-md">
                <TabsTrigger value="payments" className="rounded-lg">
                  결제 내역
                </TabsTrigger>
                <TabsTrigger value="subscriptions" className="rounded-lg">
                  구독 관리
                </TabsTrigger>
                <TabsTrigger value="plans" className="rounded-lg">
                  요금제
                </TabsTrigger>
              </TabsList>

              {/* Payments Tab */}
              <TabsContent value="payments">
                <Card className="rounded-[20px] border-none shadow-md">
                  <CardHeader>
                    <CardTitle className="text-[#0F172A]">결제 내역</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>고객사</TableHead>
                          <TableHead>요금제</TableHead>
                          <TableHead>금액</TableHead>
                          <TableHead>결제일</TableHead>
                          <TableHead>인보이스</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead className="text-right">작업</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.company}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  payment.plan === "Enterprise"
                                    ? "bg-[#5B3BFA] hover:bg-[#5B3BFA]"
                                    : payment.plan === "Pro"
                                    ? "bg-[#00B4FF] hover:bg-[#00B4FF]"
                                    : "bg-[#A58DFF] hover:bg-[#A58DFF]"
                                }
                              >
                                {payment.plan}
                              </Badge>
                            </TableCell>
                            <TableCell>₩{payment.amount.toLocaleString()}</TableCell>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell className="font-mono text-sm">
                              {payment.invoiceId}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  payment.status === "success"
                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                    : payment.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                    : "bg-red-100 text-red-700 hover:bg-red-100"
                                }
                              >
                                {payment.status === "success" && "성공"}
                                {payment.status === "pending" && "대기중"}
                                {payment.status === "failed" && "실패"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-lg"
                                  onClick={() => handleDownloadInvoice(payment.invoiceId)}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                                {payment.status === "failed" && !isReadOnly && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-lg"
                                    onClick={() => handleSendReminder(payment.company)}
                                  >
                                    <Send className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Subscriptions Tab */}
              <TabsContent value="subscriptions">
                <Card className="rounded-[20px] border-none shadow-md">
                  <CardHeader>
                    <CardTitle className="text-[#0F172A]">구독 현황</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>고객사</TableHead>
                          <TableHead>요금제</TableHead>
                          <TableHead>월 금액</TableHead>
                          <TableHead>시작일</TableHead>
                          <TableHead>다음 결제</TableHead>
                          <TableHead>상태</TableHead>
                          {!isReadOnly && <TableHead className="text-right">관리</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscriptions.map((sub) => (
                          <TableRow key={sub.id}>
                            <TableCell>{sub.company}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  sub.plan === "Enterprise"
                                    ? "bg-[#5B3BFA] hover:bg-[#5B3BFA]"
                                    : sub.plan === "Pro"
                                    ? "bg-[#00B4FF] hover:bg-[#00B4FF]"
                                    : "bg-[#A58DFF] hover:bg-[#A58DFF]"
                                }
                              >
                                {sub.plan}
                              </Badge>
                            </TableCell>
                            <TableCell>₩{sub.price.toLocaleString()}</TableCell>
                            <TableCell>{sub.startDate}</TableCell>
                            <TableCell>{sub.nextBilling}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  sub.status === "active"
                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                    : sub.status === "trial"
                                    ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                }
                              >
                                {sub.status === "active" && "활성"}
                                {sub.status === "trial" && "체험판"}
                                {sub.status === "expired" && "만료"}
                              </Badge>
                            </TableCell>
                            {!isReadOnly && (
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm" className="rounded-lg">
                                  요금제 변경
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Plans Tab */}
              <TabsContent value="plans">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Basic Plan */}
                  <Card className="rounded-[20px] border-none shadow-md hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <Badge className="w-fit bg-[#A58DFF] hover:bg-[#A58DFF]">Basic</Badge>
                      <CardTitle className="text-[#0F172A] mt-4">₩500,000</CardTitle>
                      <p className="text-sm text-[#8C8C8C]">/ 월</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">사용자 10명</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">기본 ESG 평가</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">월 5개 리포트</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">이메일 지원</span>
                        </li>
                      </ul>
                      <div className="mt-6 text-center text-sm text-[#8C8C8C]">
                        현재 68개 고객사
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pro Plan */}
                  <Card className="rounded-[20px] border-2 border-[#00B4FF] shadow-xl">
                    <CardHeader>
                      <Badge className="w-fit bg-[#00B4FF] hover:bg-[#00B4FF]">Pro</Badge>
                      <CardTitle className="text-[#0F172A] mt-4">₩2,000,000</CardTitle>
                      <p className="text-sm text-[#8C8C8C]">/ 월</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">사용자 50명</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">고급 ESG 분석</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">무제한 리포트</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">우선 지원</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">API 접근</span>
                        </li>
                      </ul>
                      <div className="mt-6 text-center text-sm text-[#8C8C8C]">
                        현재 98개 고객사
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enterprise Plan */}
                  <Card className="rounded-[20px] border-none shadow-md hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <Badge className="w-fit bg-[#5B3BFA] hover:bg-[#5B3BFA]">Enterprise</Badge>
                      <CardTitle className="text-[#0F172A] mt-4">₩5,000,000</CardTitle>
                      <p className="text-sm text-[#8C8C8C]">/ 월</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">무제한 사용자</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">AI 기반 맞춤 분석</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">전담 컨설턴트</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">24/7 지원</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">맞춤 기능 개발</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-sm">온프레미스 옵션</span>
                        </li>
                      </ul>
                      <div className="mt-6 text-center text-sm text-[#8C8C8C]">
                        현재 68개 고객사
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
