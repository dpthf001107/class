'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface GenerateResponse {
  id: string;
  image_url: string;
  meta_url: string;
  meta: {
    id: string;
    created_at: string;
    model_id: string;
    prompt: string;
    negative_prompt: string | null;
    width: number;
    height: number;
    steps: number;
    guidance_scale: number;
    seed: number | null;
    device: string;
    image_file: string;
    meta_file: string;
  };
}

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [width, setWidth] = useState(768);
  const [height, setHeight] = useState(768);
  const [steps, setSteps] = useState(4);
  const [seed, setSeed] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/v1/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          negative_prompt: negativePrompt || undefined,
          width,
          height,
          steps,
          seed: seed || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '이미지 생성에 실패했습니다.');
      }

      const data: GenerateResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎨 AI 이미지 생성기
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stable Diffusion XL Turbo로 이미지를 생성하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 입력 폼 */}
          <Card>
            <CardHeader>
              <CardTitle>이미지 생성 설정</CardTitle>
              <CardDescription>
                프롬프트를 입력하고 이미지를 생성하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">프롬프트 (필수) *</Label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="예: a cute robot barista, cinematic lighting"
                    required
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="negative_prompt">네거티브 프롬프트 (선택)</Label>
                  <Textarea
                    id="negative_prompt"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="예: blurry, low quality, distorted"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">너비 (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      min={64}
                      max={1024}
                      step={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">높이 (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      min={64}
                      max={1024}
                      step={8}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="steps">스텝 수</Label>
                    <Input
                      id="steps"
                      type="number"
                      value={steps}
                      onChange={(e) => setSteps(Number(e.target.value))}
                      min={1}
                      max={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seed">시드 (선택)</Label>
                    <Input
                      id="seed"
                      type="number"
                      value={seed || ''}
                      onChange={(e) => setSeed(e.target.value ? Number(e.target.value) : null)}
                      placeholder="랜덤"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="w-full"
                  size="lg"
                >
                  {loading ? '생성 중...' : '🎨 이미지 생성하기'}
                </Button>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 결과 표시 */}
          <Card>
            <CardHeader>
              <CardTitle>생성된 이미지</CardTitle>
              <CardDescription>
                생성된 이미지와 메타데이터를 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">이미지를 생성하고 있습니다...</p>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${result.image_url}`}
                      alt={result.meta.prompt}
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">ID:</span>
                      <span className="font-mono text-xs">{result.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">프롬프트:</span>
                      <span className="text-right max-w-[60%]">{result.meta.prompt}</span>
                    </div>
                    {result.meta.negative_prompt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">네거티브:</span>
                        <span className="text-right max-w-[60%]">{result.meta.negative_prompt}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">크기:</span>
                      <span>{result.meta.width} × {result.meta.height}px</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">스텝:</span>
                      <span>{result.meta.steps}</span>
                    </div>
                    {result.meta.seed && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">시드:</span>
                        <span>{result.meta.seed}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">생성 시간:</span>
                      <span>{new Date(result.meta.created_at).toLocaleString('ko-KR')}</span>
                    </div>
                  </div>
                </div>
              )}

              {!loading && !result && (
                <div className="flex items-center justify-center py-12 text-gray-400">
                  <p>이미지를 생성하면 여기에 표시됩니다</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

