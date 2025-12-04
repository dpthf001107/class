import { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Lock } from 'lucide-react';

interface ReadOnlyTooltipProps {
  children: ReactNode;
}

export function ReadOnlyTooltip({ children }: ReadOnlyTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative inline-block">
            {children}
            <Lock className="absolute top-2 right-2 w-4 h-4 text-[#8C8C8C] pointer-events-none" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-[#0F172A] text-white rounded-xl px-4 py-2">
          <p>읽기 전용 | 중소기업만 데이터를 수정할 수 있습니다</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}