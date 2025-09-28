"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Share, Download, ThumbsUp, ThumbsDown, MoveHorizontal as MoreHorizontal, BookOpen, Repeat } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChatMessage } from '@/types';
import { toast } from '@/hooks/use-toast';

interface MessageActionsProps {
  message: ChatMessage;
  onCopy: () => void;
  onShare: () => void;
  onExport: () => void;
}

export function MessageActions({ message, onCopy, onShare, onExport }: MessageActionsProps) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      onCopy();
      toast({
        title: "Copied to clipboard",
        description: "Message content has been copied",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy message to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    // TODO: Send feedback to backend
    toast({
      title: "Feedback recorded",
      description: `Thank you for your ${type === 'up' ? 'positive' : 'negative'} feedback`,
    });
  };

  const handleRegenerateResponse = () => {
    // TODO: Implement regenerate functionality
    toast({
      title: "Regenerating response",
      description: "Creating a new response to your query",
    });
  };

  const handleExplainConcepts = () => {
    // TODO: Implement educational explanations
    toast({
      title: "Educational mode",
      description: "Opening oceanographic concept explanations",
    });
  };

  if (!isAssistant && message.role !== 'user') {
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 px-2 text-gray-500 hover:text-gray-700"
        >
          <Copy className="w-3 h-3" />
        </Button>
        
        {isAssistant && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFeedback('up')}
              className={`h-8 px-2 ${feedback === 'up' ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
            >
              <ThumbsUp className="w-3 h-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFeedback('down')}
              className={`h-8 px-2 ${feedback === 'down' ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
            >
              <ThumbsDown className="w-3 h-3" />
            </Button>
          </>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-gray-500 hover:text-gray-700"
          >
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onShare}>
            <Share className="w-4 h-4 mr-2" />
            Share message
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export data
          </DropdownMenuItem>
          
          {isAssistant && (
            <>
              <DropdownMenuItem onClick={handleRegenerateResponse}>
                <Repeat className="w-4 h-4 mr-2" />
                Regenerate response
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={handleExplainConcepts}>
                <BookOpen className="w-4 h-4 mr-2" />
                Explain concepts
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}